# Footer menu heading

## Symptom

The live footer on aslf-formulas.com showed a heading **Our Company** that looked clickable (`<summary>` on the menu accordion) but was only a title. The merchant wants that heading gone while keeping the links (Shipping Policy, Your Privacy Choices, etc.).

## Cause

`blocks/menu.liquid` used `heading | default: menu.title` for visible heading text, and only added `menu__heading--empty` when **both** `heading` and `menu.title` were blank.

The footer menu handle is `footer`. Shopify names that navigation **Our Company**, so a blank block heading still rendered the menu title as a fake link.

## Fix

- If the menu **block** heading setting is blank, treat it as an empty heading: add `menu__heading--empty` and do **not** render `menu.title` as visible heading text.
- Keep `aria-label="{{ menu.title }}"` on the `<nav>` when the heading is blank so the list still has an accessible name.
- Keep the menu and its links. Do not change `blocks/_header-menu.liquid`.
- Footer group JSON (`sections/footer-group.json`, block `menu_footer`) must have `"heading": ""` so the empty-heading path runs. If the theme editor writes `"heading": "Our Company"` back, clear it again.

This is global for Horizon `menu` blocks: blank heading = no heading. Accordion CSS still shows an empty summary (toggle only) on mobile when `show_as_accordion` is true; the footer menu has accordion off, so the summary stays hidden and the links remain visible.
