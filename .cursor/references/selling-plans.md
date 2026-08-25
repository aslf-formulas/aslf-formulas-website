# Selling plans on product pages

Horizon does **not** ship a native selling-plan picker. Recurring purchase options only appear on PDPs if the theme renders `product.selling_plan_groups` (or a subscription app injects a widget into the buy box).

## What this theme does

`blocks/_selling-plan-picker.liquid` is a static nested block of `buy-buttons`. It:

- Renders **only** when the product has **recurring** selling plans (`selling_plan.recurring_deliveries`)
- Shows **Subscribe & Save** first, then **One-time**
- Defaults to Subscribe & Save (merchant can uncheck that in the block)
- Writes `input[name="selling_plan"]` inside the product form (required for cart / Shop Pay)
- Skips non-recurring plans such as Preorder
- Does **not** create Shopify selling plans, products, or bundles

On product templates, `snippets/price.liquid` uses the first recurring selling-plan allocation for the main price so Subscribe & Save is visible before JS runs. Collection cards keep the one-time price.

Subi (or any selling-plan app) must already attach plans to the product. The picker only surfaces them.

## Catalog notes (ASLF Formulas, Aug 2026)

Live catalog via `/products.json` has three products, all with Subi monthly 10% plans:

- `hair-growth-boost-serum` ($32) — also has a non-recurring Preorder plan (hidden by the picker)
- `foundation-capsules` ($38)
- `age-defense-moisturizer` ($38)

**Daily Protocol / $96 bundle:** The merchant will create that product in Shopify (Hair Serum + Age Defense + Foundation). Do **not** invent it in Liquid. When a `daily-protocol` (or similar) product exists later, a merchandising text/button block can link to it from PDPs. Until then, only the Subscribe & Save picker on the three existing PDPs.

Subi’s app embed is enabled in `config/settings_data.json` but injects at the theme-app-extension root (`render-subify-widget-{productId}`), not in the Horizon buy box, so live PDPs still looked like one-time add-to-cart. Shop Pay can still mention subscriptions because `payment_button` reads selling plans on the product. Collection “Choose” already sends selling-plan products to the PDP (`quick-add.js`).

## Do not

- Invent a fake Subscribe & Save UI when `selling_plan_groups` is empty
- Create products, selling plans, or bundles via theme code (including Daily Protocol)
- Change Canine or other brands from this repo
