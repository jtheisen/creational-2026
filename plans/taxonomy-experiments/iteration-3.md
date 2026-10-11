# Iteration 3: Loaded Leaf Widths

- [x] Inspect existing branch layout, pagination, and navigation contracts.
- [x] Add cached loaded-leaf counts and a URL-backed width mode; preserve visible-window mode. Build/type checks and ten domain tests pass.
- [x] Independently verify geometry, thin-block navigation, history, and no-scroll layouts. Counts match independent recursion for all 64,909 nodes; 216 conservation checks pass. Browser mode/history/thin navigation and short-height remediation pass.
- [x] Update behavior documentation and deliver the runnable iteration, verified through Docker network HTTP 200. No commit requested or created.

## Contract

New default width weights are the total terminal taxa in each block's loaded subtree, including descendants beyond the current displayed depth. A terminal record in the loaded subset counts as one even if source children were excluded. Current visible-frontier equal-column widths remain selectable. Keep taxon location, depth, and page unchanged on mode switching.

Pagination still chooses the visible frontier columns. In loaded-leaf mode, normalize their full-subtree leaf weights within that page; clipped ancestor blocks span only the frontier columns on that page. Preserve ratios among blocks without minimum-width inflation. Document the page normalization explicitly.

Very thin blocks must have accessible names and a practical alternative navigation control. No page or panel scrolling.

## Initial Evidence

- Loaded terminals: 50,777 across the dataset; Mammalia 20,760.
- Both branch spans and branch paths use the selected weighting. Thin cells retain proportional geometry and full accessible names; the shown-taxon selector provides navigation.
- Browser checks pass 24 combinations of six viewport sizes, both views, and both modes. Extreme source ratios render below a pixel without minimum-width inflation; Chromium quantizes subpixel geometry.
- Switching modes and history preserve the current taxon, requested depth, and page. Source pipeline and records are unchanged.
