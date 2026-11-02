#!/usr/bin/env python3
"""Build the Shopify product import CSV and the preview's product data
from data/products.json (the single source of truth).

Usage:
    python3 trend_store/scripts/build_catalog.py

Outputs:
    trend_store/products.csv        -> Shopify admin > Products > Import
    trend_store/sourcing.csv        -> supplier sheet: Alibaba listings, unit cost, margin
    trend_store/preview/products.js -> data for the static preview page
"""
from __future__ import annotations

import csv
import html
import itertools
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "data" / "products.json"
CSV_OUT = ROOT / "products.csv"
PREVIEW_OUT = ROOT / "preview" / "products.js"
SOURCING_OUT = ROOT / "sourcing.csv"

# Starting stock per variant. Adjust in Shopify after import.
DEFAULT_INVENTORY = 50

COLUMNS = [
    "Handle", "Title", "Body (HTML)", "Vendor", "Product Category", "Type", "Tags", "Published",
    "Option1 Name", "Option1 Value", "Option2 Name", "Option2 Value", "Option3 Name", "Option3 Value",
    "Variant SKU", "Variant Grams", "Variant Inventory Tracker", "Variant Inventory Qty",
    "Variant Inventory Policy", "Variant Fulfillment Service", "Variant Price", "Variant Compare At Price",
    "Variant Requires Shipping", "Variant Taxable", "Variant Barcode",
    "Image Src", "Image Position", "Image Alt Text", "Gift Card",
    "SEO Title", "SEO Description", "Variant Weight Unit", "Cost per item", "Status",
]


def price_range(text: str | None) -> tuple[float, float] | None:
    """Parse '3.20-4.50' / '$12' style supplier prices into (low, high)."""
    if not text:
        return None
    nums = [float(n) for n in re.findall(r"\d+(?:\.\d+)?", text.replace(",", ""))]
    if not nums:
        return None
    return min(nums), max(nums)


def unit_cost(p: dict) -> float | None:
    """Conservative unit cost: the HIGH end of the primary supplier's price
    range (low ends usually need large order quantities). Excludes shipping."""
    for s in p.get("sourcing", []):
        r = price_range(s.get("price_usd"))
        if r:
            return r[1]
    return None


def body_html(p: dict) -> str:
    items = "".join(f"<li>{html.escape(b)}</li>" for b in p["bullets"])
    return f"<p>{html.escape(p['intro'])}</p><ul>{items}</ul>"


def sku(p: dict, values: tuple[str, ...]) -> str:
    base = "".join(w[0] for w in p["handle"].split("-")).upper()
    suffix = "-".join("".join(ch for ch in v.upper() if ch.isalnum())[:4] for v in values)
    return f"TL-{base}" + (f"-{suffix}" if suffix else "")


def variant_rows(p: dict):
    names = list(p["options"].keys())
    if not names:
        yield ("Title",), ("Default Title",)
        return
    for combo in itertools.product(*p["options"].values()):
        yield tuple(names), combo


def build_csv(vendor: str, products: list[dict]) -> int:
    rows = 0
    with CSV_OUT.open("w", newline="", encoding="utf-8") as fh:
        w = csv.DictWriter(fh, fieldnames=COLUMNS)
        w.writeheader()
        for p in products:
            for i, (names, values) in enumerate(variant_rows(p)):
                first = i == 0
                row = {c: "" for c in COLUMNS}
                row.update({
                    "Handle": p["handle"],
                    "Variant SKU": sku(p, values if names != ("Title",) else ()),
                    "Variant Grams": p["grams"],
                    "Variant Inventory Tracker": "shopify",
                    "Variant Inventory Qty": DEFAULT_INVENTORY,
                    "Variant Inventory Policy": "deny",
                    "Variant Fulfillment Service": "manual",
                    "Variant Price": f"{p['price']:.2f}",
                    "Variant Compare At Price": f"{p['compare_at']:.2f}" if p.get("compare_at") else "",
                    "Variant Requires Shipping": "TRUE",
                    "Variant Taxable": "TRUE",
                    "Variant Weight Unit": "g",
                    "Cost per item": f"{unit_cost(p):.2f}" if unit_cost(p) is not None else "",
                })
                for n, (name, value) in enumerate(zip(names, values), start=1):
                    row[f"Option{n} Value"] = value
                    if first:
                        row[f"Option{n} Name"] = name
                if first:
                    row.update({
                        "Title": p["title"],
                        "Body (HTML)": body_html(p),
                        "Vendor": vendor,
                        "Type": p["type"],
                        "Tags": ", ".join(p["tags"]),
                        "Published": "TRUE",
                        "Gift Card": "FALSE",
                        "SEO Title": f"{p['title']} | {vendor}",
                        "SEO Description": p["intro"][:320],
                        "Status": "active",
                    })
                w.writerow(row)
                rows += 1
    return rows


def build_sourcing(products: list[dict]) -> int:
    cols = ["Handle", "Title", "Our Price", "Supplier Rank", "Listing Title", "Supplier",
            "Unit Price (USD)", "MOQ", "Est. Margin at High Unit Price", "Listing Type", "URL", "Specs / Notes"]
    n = 0
    with SOURCING_OUT.open("w", newline="", encoding="utf-8") as fh:
        w = csv.writer(fh)
        w.writerow(cols)
        for p in products:
            for rank, s in enumerate(p.get("sourcing", []), start=1):
                r = price_range(s.get("price_usd"))
                margin = f"{(p['price'] - r[1]) / p['price']:.0%}" if r else ""
                w.writerow([p["handle"], p["title"], f"{p['price']:.2f}", rank, s.get("title", ""),
                            s.get("supplier") or "", s.get("price_usd") or "", s.get("moq") or "", margin,
                            s.get("type", ""), s["url"], s.get("specs") or ""])
                n += 1
    return n


def build_preview(vendor: str, products: list[dict]) -> None:
    data = [
        {
            "handle": p["handle"],
            "title": p["title"],
            "category": p["category"],
            "tags": p["tags"],
            "price": p["price"],
            "compare_at": p.get("compare_at"),
            "emoji": p["emoji"],
            "colors": p["colors"],
            "intro": p["intro"],
            "bullets": p["bullets"],
            "options": p["options"],
        }
        for p in products
    ]
    PREVIEW_OUT.write_text(
        "// Generated by scripts/build_catalog.py from data/products.json. Do not edit by hand.\n"
        f"window.STORE = {json.dumps({'vendor': vendor, 'products': data}, ensure_ascii=False, indent=2)};\n",
        encoding="utf-8",
    )


def main() -> None:
    src = json.loads(SRC.read_text(encoding="utf-8"))
    rows = build_csv(src["vendor"], src["products"])
    build_preview(src["vendor"], src["products"])
    sourced = build_sourcing(src["products"])
    print(f"{len(src['products'])} products, {rows} CSV rows -> {CSV_OUT.relative_to(ROOT.parent)}")
    print(f"preview data -> {PREVIEW_OUT.relative_to(ROOT.parent)}")
    print(f"{sourced} supplier listings -> {SOURCING_OUT.relative_to(ROOT.parent)}")


if __name__ == "__main__":
    main()
