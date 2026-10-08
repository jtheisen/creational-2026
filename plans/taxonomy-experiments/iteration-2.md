# Iteration 2: Taxon Browser

- [x] Inspect prototype navigation and identify actual data and pipeline: reference navigates via taxon ID, filters a local descendant/rank window, and expects generated assets absent from the snapshot.
- [x] Implement taxon-as-location navigation and a fixed viewport with a meaningful source-derived dataset. Build passes; source data is a separate emitted JSON asset; six domain tests pass.
- [x] Independently validate navigation, dataset provenance, and no-scroll layout. All retained records match source; navigation and six viewport sizes pass with no scroll or inaccessible controls.
- [x] Document source facts, limits, and iteration behavior; deliver runnable app on `0.0.0.0:5173`, verified through Docker network HTTP 200.

## User Direction

Always browse a specific taxon identified by the browser location. Use a fixed application viewport without scrolling. Make navigation meaningful beyond the entire tiny fixture. Inspect the reference again and explain what is actually based on the source dataset.

## Source Evidence

- Previous UI: 41 hand-curated taxa, zero imported OpenTree records.
- Retrieved official OTT 3.3: 4,528,126 rows, 416,869,933 bytes; source SHA256 recorded in `src/data/opentree-metadata.json`.
- Active subset: 64,909 original records with exact source parent links. Includes named higher groups across life and filtered Mammalia, Aves, and Rosaceae branches plus intermediate ancestors.
- Raw ranks retained, including 17,391 `no rank` records. No fabricated names, descriptions, or ancestry.
- Full source and excluded rows are not shipped as browser data. Outside selected detailed branches, a retained terminal record may be a subset boundary.
- Exact source direct-child counts identify 3,504 records with omitted children, including 1,502 retained-empty boundaries. Data extraction is byte-reproducible.

## Final Validation

- Production build/type checking and six domain tests pass with no build warnings.
- Independent review and screenshots: `agents/TEMP/iteration-2-review/report.md`.
- Tested direct navigation, history, parent/ancestor/root, wide branches and page jumps, comparison views, depth, invalid URLs, resizing, and every source dialog page.
- Source JSON is a separate 11.44 MB asset; application JavaScript is about 235 KB.
- Raw source hierarchy is preserved. Major-rank-only collapsing remains a future view variation.
