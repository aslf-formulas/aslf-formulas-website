# Product PDP usage copy

How-to-use copy for the three live SKUs is clarified on `templates/product.json` via the existing product description block. Do not invent alternate product pages, a 3-SKU Daily Protocol bundle, subscribe flows, review counts, COA files, or new products.

Product body HTML still lives in Shopify admin. The theme rewrites usage at render time in `snippets/product-pdp-copy.liquid` so a theme PR can ship unambiguous instructions without waiting on a CMS edit.

## Handles (live)

| Handle | Product |
| --- | --- |
| `hair-growth-boost-serum` | Hair Growth Boost Serum |
| `foundation-capsules` | ASLF Foundation Capsules |
| `age-defense-moisturizer` | Age Defense Moisturizer |

## Copy rules

### Hair Growth Boost Serum

One leave-on rule. Remove “or wash out after a few hours.”

```
How to use
Apply to clean, dry scalp. Massage for 1 minute. Leave on overnight. Do not rinse.
A thickening shampoo is coming as Step 1. This serum is the daily leave-on (Step 2).
```

Keep existing Densidyl/Baicapil formula copy. If Densidyl stats appear (“25.9%” / “11.43%”), attribute them as ALGAKTIV® Densidyl™ **supplier data**, not an ASLF finished-product trial.

### Foundation Capsules

No serving exists in the current product description (ingredient milligrams are not a serving). Do **not** invent “take 2 daily” or a milligram schedule.

`60 Vegan Capsules` is already in the admin copy, so the count may stay there. Do **not** derive a days-of-supply (that would require inventing a 2/day serving).

```
How to use
This is the daily cellular stack.
Take as directed on the label.
```

The serving line is merchant-editable on the Description block (`serving_text`). Blank uses the default above.

### Age Defense Moisturizer

Keep existing formula copy. Replace the how-to-use block only:

```
How to use
Apply 2 pumps AM and PM on face and neck. In the morning, follow with SPF.
```

## Implementation notes

- Switch the PDP description block to type `product-description` (already allowed by `_product-details`). Do not add a second how-to-use text block or the old admin instructions will still show.
- Match strings in `product-pdp-copy.liquid` are the live admin HTML. If a merchant later updates the product body to the new copy, the old strings disappear and the snippet no-ops (no double rewrite).
- This repo has no `schemas/` build step; the serving setting lives in `blocks/product-description.liquid` schema.
- Do not merge `feature/subscribe-page-email-signup` / PR #10 as part of this change.
