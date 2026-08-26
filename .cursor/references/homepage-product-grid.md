# Homepage featured product grid

## Template and section

- **Template:** `templates/index.json`
- **Section:** `product_list_fa6P9H` (`type`: `product-list`, `sections/product-list.liquid`)

## Product source

The homepage grid uses a hardcoded `product_list` of catalog handles so merchandising order is independent of collection sort. Cards still render Shopify product title, price, and images — do not invent copy, prices, or images in the theme.

Current order (shampoo next to Hair Growth Boost Serum):

1. `hair-growth-boost-serum`
2. `thickening-shampoo`
3. `foundation-capsules`
4. `age-defense-moisturizer`

`collection` remains `all` for the View all button when the collection has more products than `max_products`. Cart (`templates/cart.json`) and 404 (`templates/404.json`) product lists still use a collection only.

If `product_list` is empty, `product-list` falls back to the selected collection.

## Collections/all

Do not hardcode products on `templates/collection.json`. `/collections/all` is Shopify catalog membership. A published product is picked up there without a theme change.

## Out of scope

- Do not revive cancelled usage-copy or Subscribe & Save PDP PRs
- Do not create a shampoo + serum bundle
- Do not rewrite how-to copy or strip PDP richness on `templates/product.json`
- Do not add invented packshots to the three-image row (`section_phAEnd`); that row uses `shopify://shop_images/...` files, not product handles
