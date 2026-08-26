# Page templates

## About (`templates/page.about.json`)

Two-column About layout using Horizon’s Image with text section pattern (`section` + `group` + `image`), not a CSS overlay on `page.json`.

- **Desktop:** story copy on the left, image on the right (`content_direction: row`).
- **Columns:** two `width: fill` groups so they share space (`flex: 1`) instead of the image block’s `width: 100%` stretching the row.
- **Mobile:** stacks in DOM order — text, then image (`vertical_on_mobile: true`).
- **Copy:** keep the Shopify page body via the `page-content` block (`{{ page.content }}`). Do not hardcode or rewrite brand story in the template.
- **Title:** `<h1>{{ closest.page.title }}</h1>` so the live page title is unchanged.

### Image source

Inspected before adding a photo:

- `assets/` — SVG icons only, no lifestyle/founder/product photos
- Homepage `shopify://shop_images/...` — product packshots (serum, dual-active formula, moisturizer), not suitable next to the founder story
- Hero — video files, not a still photo

Because there is no suitable photo in the theme, the image block is an empty `image_picker`. Horizon’s image block already renders the `detailed-apparel-1` placeholder SVG when no file is selected. Merchants pick a photo in the theme editor. Do not generate a fake photo of a real person.

### Assigning the template

`page.about.json` is an alternate page template. Creating the file does **not** change `/pages/about` until the page uses it:

1. Shopify admin → **Online Store → Pages → About**
2. Theme template → **about**
3. Theme editor → About page → select an image in the Image block

Other CMS pages (policies, etc.) keep `templates/page.json` (single column).

## Product PDPs (`templates/product.json`)

Usage copy for the three live SKUs is rewritten in the existing product description block. See [product-pdp-copy.md](product-pdp-copy.md). Do not add new product pages, a Daily Protocol bundle, or subscribe work as part of that copy fix.
