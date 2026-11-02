# Trendloop: a Shopify store for trending products

A ready-to-upload Shopify store: an Online Store 2.0 theme plus a catalog of 18
trending products (45 variants) as a Shopify import CSV.

![Preview](preview/screenshot.png)

## What's in here

| Path | What it is |
| --- | --- |
| `theme/` | Shopify OS 2.0 theme (Liquid). Upload it as-is. |
| `products.csv` | Product import file: 18 products, 45 variants, prices, compare-at prices, SKUs, tags, SEO fields. |
| `data/products.json` | Source of truth for the catalog. Edit this, then rebuild. |
| `scripts/build_catalog.py` | Regenerates `products.csv` and `preview/products.js` from the JSON. |
| `preview/index.html` | Static design preview with a simulated cart. Open it in a browser; no store needed. |

### Theme features

- **Homepage:** rotating announcement bar, gradient hero (or your own image), scrolling
  "trending" ticker, featured collections, round category tiles, trust badges, newsletter signup.
- **Product page:** media gallery with thumbnails (images, video, 3D), variant pills that
  cross out sold-out combinations, quantity stepper, Shop Pay/Apple Pay dynamic checkout,
  perks list, collapsible tabs, app blocks, and related-product recommendations.
- **Cart drawer:** add to cart without leaving the page, edit quantities in the drawer, and a
  free-shipping progress bar ("You're $12.01 away from free shipping").
- **Product cards:** sale % badge, "Trending" badge (any product tagged `trending`), second
  image on hover, one-click quick add.
- **Collections and search:** storefront filters (works with Shopify's Search & Discovery app),
  sorting, active-filter pills, pagination.
- Customer accounts, contact page, blog, password ("opening soon") page, gift card page.
- Every section and setting can be edited in the theme editor (colors, fonts, layout, cart type,
  social links).
- Passes Shopify Theme Check (all 85 checks, 0 offenses).

## Launch checklist

### 1. Upload the theme

**Option A: zip upload (no tools needed)**

```bash
cd trend_store/theme && zip -r ../trendloop-theme.zip . && cd -
```

In Shopify admin, go to **Online Store → Themes → Add theme → Upload zip file** and pick
`trendloop-theme.zip`. Then click **Customize** to preview it, and **Publish** when you're ready.

**Option B: Shopify CLI**

```bash
npm install -g @shopify/cli
shopify theme dev  --path trend_store/theme --store your-store.myshopify.com   # live local preview
shopify theme push --path trend_store/theme --store your-store.myshopify.com --unpublished
```

### 2. Import the products

Go to **Products → Import**, choose `products.csv`, and confirm. Every variant starts with
50 units in stock; change that in `scripts/build_catalog.py` (`DEFAULT_INVENTORY`) or in the admin.

> **Add your own product photos.** The CSV has no images, because you need photos you have the
> rights to, usually from your supplier. Until you add them, the theme shows tidy placeholders.

### 3. Create the collections

The homepage looks for these collection handles. Create each one in **Products → Collections**
as an *automated* collection, so products are added by tag automatically:

| Title | Handle | Condition |
| --- | --- | --- |
| Trending | `trending` | Product tag is equal to `trending` |
| Beauty | `beauty` | Product tag is equal to `beauty` |
| Home | `home` | Product tag is equal to `home` |
| Tech | `tech` | Product tag is equal to `tech` |
| Fitness | `fitness` | Product tag is equal to `fitness` |
| Pets | `pets` | Product tag is equal to `pets` |
| Kitchen | `kitchen` | Product tag is equal to `kitchen` |
| Under $30 | `under-30` | Product price is less than `30` |

### 4. Menus

In **Online Store → Navigation**:
- **Main menu** (`main-menu`): Trending, Beauty, Home, Tech, Fitness, Pets.
- **Footer** (`footer`): Shipping policy, Refund policy, Contact (create a page that uses the
  `page.contact` template).

### 5. Store settings

- **Shipping:** add a free-shipping rate for orders of $50 or more, to match the banner and cart bar.
  The theme only *displays* the threshold. Change it in **Theme settings → Cart**.
- **Payments:** turn on Shopify Payments / Shop Pay.
- **Policies:** generate refund, privacy, terms and shipping policies in **Settings → Policies**.
  They appear in the footer automatically.
- **Domain**, plus a logo and favicon in the theme editor.

### 6. Before you go live: check these

- **Product names and claims are starting points.** Names like "GlowSkin" are original placeholders.
  Make sure every spec in the descriptions (light wavelengths, battery life, 1080p, weights) matches
  what your supplier actually ships, and don't make medical claims (for example, for the LED mask
  or posture corrector).
- **Prices** include compare-at prices to show savings. Only use a compare-at price that reflects a
  real former or market price; many regions regulate "was/now" pricing.
- **Customer quotes:** the "What customers are saying" section is **disabled** by default and
  contains placeholder text. Only turn it on once you have real reviews (or use a reviews app
  such as Judge.me, which adds its own app blocks to the product page).

## Sourcing the products

These are categories that have stayed popular in social commerce: LED beauty devices, sunset
lamps, portable blenders, pillow slides, magnetic car mounts, mini projectors, heatless curlers,
smart bottles, weighted knit blankets, pet enrichment toys, and similar.

To fulfil orders without holding stock, connect a dropshipping app (for example DSers, CJdropshipping,
Spocket or Zendrop), find the matching item, and link it to the imported product. Before listing,
check landed cost (item plus shipping) against the price: the default prices assume roughly a
2.5–3× markup.

## Editing the catalog

```bash
# edit trend_store/data/products.json, then:
python3 trend_store/scripts/build_catalog.py
```

Each product has a title, type, tags (which drive collections and the Trending badge), price,
compare-at price, weight, description bullets, and up to three options (for example Size × Color).
The script generates every variant combination with unique SKUs.

## Preview

Open `preview/index.html` in a browser. It uses the theme's real stylesheet and the generated
catalog data, so it matches what the theme looks like with products loaded. It uses emoji
artwork in place of product photos, and the cart is simulated in the browser.
