"""UK VAT return (Making Tax Digital, 9-box) calculation."""
from dataclasses import dataclass
from datetime import date


@dataclass
class VatReturn:
    period_start: date
    period_end: date
    box1_vat_due_sales: float  # VAT due on outputs
    box2_vat_due_acquisitions: float  # VAT due on EU acquisitions (0 for a domestic pub)
    box4_vat_reclaimed: float  # VAT reclaimed on inputs
    box6_total_sales_ex_vat: float
    box7_total_purchases_ex_vat: float
    box8_total_ec_supplies: float = 0.0
    box9_total_ec_acquisitions: float = 0.0

    @property
    def box3_total_vat_due(self):
        return round(self.box1_vat_due_sales + self.box2_vat_due_acquisitions, 2)

    @property
    def box5_net_vat(self):
        """Positive = owed to HMRC, negative = reclaimable."""
        return round(self.box3_total_vat_due - self.box4_vat_reclaimed, 2)


def build_vat_return(transactions, period_start, period_end):
    """Build a 9-box VAT return from Transaction rows within [period_start, period_end]."""
    income = [t for t in transactions if t.type == "income"]
    expense = [t for t in transactions if t.type == "expense"]

    box1 = round(sum(t.vat_amount for t in income), 2)
    box4 = round(sum(t.vat_amount for t in expense), 2)
    box6 = round(sum(t.net_amount for t in income), 2)
    box7 = round(sum(t.net_amount for t in expense), 2)

    return VatReturn(
        period_start=period_start,
        period_end=period_end,
        box1_vat_due_sales=box1,
        box2_vat_due_acquisitions=0.0,
        box4_vat_reclaimed=box4,
        box6_total_sales_ex_vat=box6,
        box7_total_purchases_ex_vat=box7,
    )


def quarter_bounds(year, quarter):
    """Return (start, end) dates for calendar quarter 1-4 of `year`."""
    if quarter not in (1, 2, 3, 4):
        raise ValueError("quarter must be 1-4")
    start_month = (quarter - 1) * 3 + 1
    start = date(year, start_month, 1)
    if quarter == 4:
        end = date(year, 12, 31)
    else:
        end_month = start_month + 3
        end = date(year, end_month, 1)
        end = date.fromordinal(end.toordinal() - 1)
    return start, end
