# Selling plans on product pages

Horizon does **not** ship a native selling-plan picker. Recurring purchase options only appear on PDPs if the theme renders `product.selling_plan_groups` (or a subscription app injects a widget into the buy box).

## What this theme does

`blocks/_selling-plan-picker.liquid` is a static nested block of `buy-buttons`. It:

- Renders **only** when the product has **recurring** selling plans (`selling_plan.recurring_deliveries`)
- Shows **Subscribe & Save** vs **One-time**
- Writes `input[name="selling_plan"]` inside the product form (required for cart / Shop Pay)
- Skips non-recurring plans such as Preorder
- Does **not** create Shopify selling plans, products, or bundles

Subi (or any selling-plan app) must already attach plans to the product. The picker only surfaces them.

## Catalog notes (ASLF Formulas, Aug 2026)

Live catalog via `/products.json` has three products, all with Subi monthly 10% plans:

- `hair-growth-boost-serum` ($32) — also has a non-recurring Preorder plan (hidden by the picker)
- `foundation-capsules` ($38)
- `age-defense-moisturizer` ($38)

No bundle / $96 kit product exists. Do not invent one in Liquid. If a bundle product is added later, a merchandising text/button block on the PDP can link to it.

Subi’s app embed is enabled in `config/settings_data.json` but injects at the theme-app-extension root, not in the Horizon buy box, so PDPs still looked like one-time add-to-cart. Shop Pay can still mention subscriptions because `payment_button` reads selling plans on the product.

## Do not

- Invent a fake Subscribe & Save UI when `selling_plan_groups` is empty
- Create products, selling plans, or bundles via theme code
- Change Canine or other brands from this repo
