from datetime import date

from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

VAT_RATES = {
    "standard": 20.0,
    "reduced": 5.0,
    "zero": 0.0,
    "exempt": 0.0,
}

TRANSACTION_TYPES = ("income", "expense")

INCOME_CATEGORIES = ("bar_sales", "food_sales", "events", "machines", "other_income")
EXPENSE_CATEGORIES = (
    "stock_drink",
    "stock_food",
    "wages",
    "rent",
    "utilities",
    "rates",
    "insurance",
    "repairs",
    "marketing",
    "other_expense",
)


class Transaction(db.Model):
    __tablename__ = "transactions"

    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.Date, nullable=False, default=date.today)
    type = db.Column(db.String(10), nullable=False)  # income | expense
    category = db.Column(db.String(30), nullable=False)
    description = db.Column(db.String(255), nullable=False, default="")
    net_amount = db.Column(db.Float, nullable=False)
    vat_rate = db.Column(db.Float, nullable=False, default=0.0)
    vat_amount = db.Column(db.Float, nullable=False, default=0.0)
    gross_amount = db.Column(db.Float, nullable=False, default=0.0)
    created_at = db.Column(db.DateTime, server_default=db.func.now())

    statement_line = db.relationship(
        "BankStatementLine", back_populates="transaction", uselist=False
    )

    def recompute(self):
        self.vat_amount = round(self.net_amount * (self.vat_rate / 100.0), 2)
        self.gross_amount = round(self.net_amount + self.vat_amount, 2)


class BankStatementLine(db.Model):
    __tablename__ = "bank_statement_lines"

    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.Date, nullable=False)
    description = db.Column(db.String(255), nullable=False, default="")
    amount = db.Column(db.Float, nullable=False)  # positive = in, negative = out
    batch = db.Column(db.String(120), nullable=False, default="")
    imported_at = db.Column(db.DateTime, server_default=db.func.now())

    transaction_id = db.Column(db.Integer, db.ForeignKey("transactions.id"), nullable=True)
    transaction = db.relationship("Transaction", back_populates="statement_line")

    @property
    def matched(self):
        return self.transaction_id is not None
