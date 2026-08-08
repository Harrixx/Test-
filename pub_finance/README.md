# Pub Finance

A small Flask web app for running a pub's day-to-day finances:

- **Incomings & outgoings** — record sales and expenses with the correct VAT
  rate (standard 20%, reduced 5%, zero-rated, exempt); net, VAT and gross are
  computed automatically.
- **Bank statements** — import a CSV export from your bank and reconcile each
  line against a recorded transaction (manually, or with one-click auto-match
  by amount and date).
- **VAT return** — a standard UK 9-box VAT return (Box 1–9) calculated per
  calendar quarter from your recorded transactions, including the net amount
  owed to or reclaimable from HMRC.
- **Dashboard** — current-quarter income, outgoings, net position, VAT due,
  and unmatched bank lines at a glance.

## Setup

```bash
cd pub_finance
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
python run.py
```

Then open http://localhost:5000. A local SQLite database (`pub_finance.db`)
is created automatically on first run.

## Bank statement CSV format

Export a CSV from your bank with these columns (header names are
case-insensitive):

```
date,description,amount
2026-05-11,Card settlement,120.00
2026-05-12,Ale delivery,-96.00
```

`amount` is positive for money in, negative for money out. A sample file is
included at `sample_bank_statement.csv`.

## VAT return

The VAT return follows the standard UK 9-box layout:

- Box 1: VAT due on sales (output tax) — from income transactions
- Box 2: VAT due on EU acquisitions — not applicable to a domestic pub, kept at 0
- Box 3: total VAT due (Box 1 + Box 2)
- Box 4: VAT reclaimed on purchases (input tax) — from expense transactions
- Box 5: net VAT to pay to (or reclaim from) HMRC (Box 3 − Box 4)
- Box 6/7: total sales / purchases excluding VAT
- Box 8/9: EC supplies/acquisitions — 0 (no EU trade)

This is a planning and record-keeping tool, not an MTD-compliant bridging
product — always check the figures against HMRC guidance (or your accountant)
before filing.

## Tests

```bash
pip install pytest
pytest
```

## Notes / limitations

- This environment could not reach PyPI or the Ubuntu package mirrors, so
  Flask/Flask-SQLAlchemy could not be installed and the app has only been
  verified with `python -m py_compile` (syntax) and manual code review —
  install the dependencies and run `pytest` / `python run.py` to confirm it
  behaves as expected end-to-end before relying on it.
- Auto-match is a simple heuristic (same in/out direction, amount within a
  penny, dates within 5 days) — always spot-check matches, especially around
  card settlement delays.
- Single-user, local SQLite storage — there's no login/auth layer, so don't
  expose it directly to the internet without adding one.
