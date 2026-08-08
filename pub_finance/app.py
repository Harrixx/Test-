import csv
import io
from datetime import date, datetime

from flask import Flask, redirect, render_template, request, url_for

from models import (
    EXPENSE_CATEGORIES,
    INCOME_CATEGORIES,
    VAT_RATES,
    BankStatementLine,
    Transaction,
    db,
)
from vat import build_vat_return, quarter_bounds


def create_app(db_uri="sqlite:///pub_finance.db"):
    app = Flask(__name__)
    app.config["SQLALCHEMY_DATABASE_URI"] = db_uri
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    db.init_app(app)
    with app.app_context():
        db.create_all()

    register_routes(app)
    return app


def parse_date(value, default=None):
    if not value:
        return default
    return datetime.strptime(value, "%Y-%m-%d").date()


def register_routes(app):
    @app.route("/")
    def dashboard():
        today = date.today()
        q = (today.month - 1) // 3 + 1
        start, end = quarter_bounds(today.year, q)
        txs = (
            Transaction.query.filter(Transaction.date >= start, Transaction.date <= end)
            .all()
        )
        vat_return = build_vat_return(txs, start, end)

        total_income = round(sum(t.gross_amount for t in txs if t.type == "income"), 2)
        total_expense = round(sum(t.gross_amount for t in txs if t.type == "expense"), 2)

        unmatched_count = BankStatementLine.query.filter_by(transaction_id=None).count()

        recent = Transaction.query.order_by(Transaction.date.desc(), Transaction.id.desc()).limit(10).all()

        return render_template(
            "dashboard.html",
            vat_return=vat_return,
            total_income=total_income,
            total_expense=total_expense,
            net_position=round(total_income - total_expense, 2),
            unmatched_count=unmatched_count,
            recent=recent,
            period_label=f"Q{q} {today.year} ({start} to {end})",
        )

    # ---------------- Transactions (incomings / outgoings) ----------------

    @app.route("/transactions")
    def transactions():
        type_filter = request.args.get("type", "")
        start = parse_date(request.args.get("start"))
        end = parse_date(request.args.get("end"))

        query = Transaction.query
        if type_filter in ("income", "expense"):
            query = query.filter_by(type=type_filter)
        if start:
            query = query.filter(Transaction.date >= start)
        if end:
            query = query.filter(Transaction.date <= end)

        txs = query.order_by(Transaction.date.desc(), Transaction.id.desc()).all()
        return render_template(
            "transactions.html",
            transactions=txs,
            type_filter=type_filter,
            start=start,
            end=end,
        )

    @app.route("/transactions/new", methods=["GET", "POST"])
    def new_transaction():
        if request.method == "POST":
            t_type = request.form["type"]
            rate_key = request.form["vat_rate"]
            tx = Transaction(
                date=parse_date(request.form["date"], date.today()),
                type=t_type,
                category=request.form["category"],
                description=request.form.get("description", ""),
                net_amount=float(request.form["net_amount"]),
                vat_rate=VAT_RATES.get(rate_key, 0.0),
            )
            tx.recompute()
            db.session.add(tx)
            db.session.commit()
            return redirect(url_for("transactions"))

        return render_template(
            "transaction_form.html",
            income_categories=INCOME_CATEGORIES,
            expense_categories=EXPENSE_CATEGORIES,
            vat_rates=VAT_RATES,
            today=date.today().isoformat(),
        )

    @app.route("/transactions/<int:tx_id>/delete", methods=["POST"])
    def delete_transaction(tx_id):
        tx = Transaction.query.get_or_404(tx_id)
        db.session.delete(tx)
        db.session.commit()
        return redirect(url_for("transactions"))

    # ---------------- Bank statements ----------------

    @app.route("/bank", methods=["GET", "POST"])
    def bank_statement():
        if request.method == "POST":
            file = request.files.get("statement_file")
            if file and file.filename:
                batch = f"{file.filename} @ {datetime.utcnow().isoformat(timespec='seconds')}"
                stream = io.StringIO(file.stream.read().decode("utf-8-sig"))
                reader = csv.DictReader(stream)
                for row in reader:
                    line = BankStatementLine(
                        date=parse_date(row.get("date") or row.get("Date")),
                        description=(row.get("description") or row.get("Description") or "").strip(),
                        amount=float(row.get("amount") or row.get("Amount") or 0),
                        batch=batch,
                    )
                    db.session.add(line)
                db.session.commit()
            return redirect(url_for("bank_statement"))

        lines = BankStatementLine.query.order_by(
            BankStatementLine.date.desc(), BankStatementLine.id.desc()
        ).all()
        unmatched_tx = (
            Transaction.query.filter(~Transaction.statement_line.has())
            .order_by(Transaction.date.desc())
            .all()
        )
        return render_template("bank.html", lines=lines, unmatched_tx=unmatched_tx)

    @app.route("/bank/<int:line_id>/match", methods=["POST"])
    def match_line(line_id):
        line = BankStatementLine.query.get_or_404(line_id)
        tx_id = request.form.get("transaction_id") or None
        line.transaction_id = int(tx_id) if tx_id else None
        db.session.commit()
        return redirect(url_for("bank_statement"))

    @app.route("/bank/<int:line_id>/delete", methods=["POST"])
    def delete_line(line_id):
        line = BankStatementLine.query.get_or_404(line_id)
        db.session.delete(line)
        db.session.commit()
        return redirect(url_for("bank_statement"))

    @app.route("/bank/auto-match", methods=["POST"])
    def auto_match():
        unmatched_lines = BankStatementLine.query.filter_by(transaction_id=None).all()
        unmatched_tx = Transaction.query.filter(~Transaction.statement_line.has()).all()

        for line in unmatched_lines:
            expected = line.amount if line.amount >= 0 else -line.amount
            expected_type = "income" if line.amount >= 0 else "expense"
            for tx in unmatched_tx:
                if (
                    tx.type == expected_type
                    and abs(tx.gross_amount - expected) < 0.01
                    and abs((tx.date - line.date).days) <= 5
                ):
                    line.transaction_id = tx.id
                    unmatched_tx.remove(tx)
                    break
        db.session.commit()
        return redirect(url_for("bank_statement"))

    # ---------------- VAT return ----------------

    @app.route("/vat")
    def vat_view():
        today = date.today()
        year = int(request.args.get("year", today.year))
        quarter = int(request.args.get("quarter", (today.month - 1) // 3 + 1))
        start, end = quarter_bounds(year, quarter)

        txs = Transaction.query.filter(
            Transaction.date >= start, Transaction.date <= end
        ).all()
        vat_return = build_vat_return(txs, start, end)

        return render_template(
            "vat.html",
            vat_return=vat_return,
            year=year,
            quarter=quarter,
        )

    return app
