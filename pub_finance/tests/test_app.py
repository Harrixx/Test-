import io
from datetime import date

import pytest

from app import create_app
from models import Transaction, db
from vat import build_vat_return, quarter_bounds


@pytest.fixture
def app():
    app = create_app(db_uri="sqlite:///:memory:")
    app.config.update(TESTING=True)
    yield app


@pytest.fixture
def client(app):
    return app.test_client()


def test_dashboard_loads(client):
    resp = client.get("/")
    assert resp.status_code == 200
    assert b"Dashboard" in resp.data


def test_add_income_transaction_computes_vat(app, client):
    resp = client.post(
        "/transactions/new",
        data={
            "date": "2026-05-10",
            "type": "income",
            "category": "bar_sales",
            "vat_rate": "standard",
            "net_amount": "100",
            "description": "Friday night takings",
        },
        follow_redirects=True,
    )
    assert resp.status_code == 200

    with app.app_context():
        tx = Transaction.query.one()
        assert tx.net_amount == 100.0
        assert tx.vat_rate == 20.0
        assert tx.vat_amount == 20.0
        assert tx.gross_amount == 120.0


def test_add_zero_rated_expense(app, client):
    client.post(
        "/transactions/new",
        data={
            "date": "2026-05-10",
            "type": "expense",
            "category": "stock_food",
            "vat_rate": "zero",
            "net_amount": "50",
            "description": "Bread and milk",
        },
        follow_redirects=True,
    )
    with app.app_context():
        tx = Transaction.query.one()
        assert tx.vat_amount == 0.0
        assert tx.gross_amount == 50.0


def test_bank_csv_import_and_auto_match(app, client):
    client.post(
        "/transactions/new",
        data={
            "date": "2026-05-10",
            "type": "income",
            "category": "bar_sales",
            "vat_rate": "standard",
            "net_amount": "100",
            "description": "Friday takings",
        },
        follow_redirects=True,
    )

    csv_content = "date,description,amount\n2026-05-11,Card settlement,120.00\n"
    data = {
        "statement_file": (io.BytesIO(csv_content.encode("utf-8")), "statement.csv"),
    }
    resp = client.post("/bank", data=data, content_type="multipart/form-data", follow_redirects=True)
    assert resp.status_code == 200

    resp = client.post("/bank/auto-match", follow_redirects=True)
    assert resp.status_code == 200
    assert b"matched" in resp.data


def test_vat_return_calculation():
    class FakeTx:
        def __init__(self, type, net_amount, vat_amount):
            self.type = type
            self.net_amount = net_amount
            self.vat_amount = vat_amount

    txs = [
        FakeTx("income", 1000.0, 200.0),
        FakeTx("expense", 300.0, 60.0),
    ]
    start, end = quarter_bounds(2026, 2)
    result = build_vat_return(txs, start, end)

    assert result.box1_vat_due_sales == 200.0
    assert result.box4_vat_reclaimed == 60.0
    assert result.box3_total_vat_due == 200.0
    assert result.box5_net_vat == 140.0
    assert result.box6_total_sales_ex_vat == 1000.0
    assert result.box7_total_purchases_ex_vat == 300.0


def test_quarter_bounds():
    assert quarter_bounds(2026, 1) == (date(2026, 1, 1), date(2026, 3, 31))
    assert quarter_bounds(2026, 4) == (date(2026, 10, 1), date(2026, 12, 31))
