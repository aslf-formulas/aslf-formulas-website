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

## Gaps

Homepage `product_list_fa6P9H` uses `columns_gap: 0`, `rows_gap: 0`, `gap: 0` so the four cards stay flush on desktop (4 columns, no gutters). Mobile stays 2 columns with `column-gap: 0`.

Do **not** set `rows_gap` above 0 in `templates/index.json` — that setting applies on desktop too. Instead, `sections/product-list.liquid` adds `.product-list--flush-rows` when `layout_type` is `grid` and `rows_gap` is 0, then sets `row-gap: var(--gap-lg)` (~16px) on `.resource-list--grid` below 750px so prices are not flush against the next row of images.

Keep `padding-block-end: 80` under the grid and `product_card_gap: 4` (image-to-title inside a card). Cart and 404 product lists keep their own `rows_gap` and do not get this mobile override.

## Collections/all

Do not hardcode products on `templates/collection.json`. `/collections/all` is Shopify catalog membership. A published product is picked up there without a theme change.

## Out of scope

- Do not revive cancelled usage-copy or Subscribe & Save PDP PRs
- Do not create a shampoo + serum bundle
- Do not rewrite how-to copy or strip PDP richness on `templates/product.json`
- Do not add invented packshots to the three-image row (`section_phAEnd`); that row uses `shopify://shop_images/...` files, not product handles

STOQ preorder ATC label markup (first child `span`) is documented in [stoq-add-to-cart-label.md](stoq-add-to-cart-label.md).
