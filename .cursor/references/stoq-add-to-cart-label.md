# STOQ / Restock Rocket add-to-cart label

STOQ (Restock Rocket) is configured with:

- `preorder_add_to_cart_button_selector: "add-to-cart-component button"`
- `preorder_button_child_selector: "span"`

It replaces the **first child `span`** of that button with `Sold Out: Preorder`. Do not invent a custom Pre-order ATC, do not change STOQ config in the theme, and do not hide `.restock-rocket-preorder-description` (the “Shipping: In 2 weeks” note).

## Markup contract

`snippets/add-to-cart-button.liquid` (main PDP + quick-add):

1. Leading `<span class="add-to-cart-text">` with the theme label
2. Optional `<span class="svg-wrapper add-to-cart-icon">` **after** the label
3. `<span class="add-to-cart__added">` checkmark

Sticky bar in `sections/product-information.liquid` uses the same span order and wraps the button in `<add-to-cart-component>` so STOQ’s button selector matches. Click handling stays on `sticky-add-to-cart` via `on:click="sticky-add-to-cart/handleAddToCartClick"`. Nested `*-component` hosts steal `ref` registration; sticky JS queries `.sticky-add-to-cart__button` instead.

## CSS

`.add-to-cart-button.restock-rocket-updated` / `.restock-rocket-preorder-button` hide `.add-to-cart-icon` so the cart icon does not sit beside the preorder label. Quick-add keeps the icon visually first with `order: -1` because the label span must lead in the DOM.

## Out of scope

- Do not revive cancelled PRs #10 (Subscribe & Save) or #11 (PDP usage copy)
- Do not create a shampoo + serum bundle
- Do not rewrite Thickening Shampoo PDP body copy
