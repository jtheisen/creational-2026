# Implementation State

## Taxonomy Experiments

### Iteration 3

- Added default Loaded leaves width mode: block weights count all terminal records beneath each loaded taxon, independently of displayed depth. Dataset total is 50,777 loaded leaves; Mammalia has 20,760.
- Preserved Visible branches sizing under a URL-backed control in both views. Switching keeps taxon, depth, and page; browser history restores width mode.
- Pagination remains frontier-based. Loaded-leaf weights are normalized within each page, with ancestor spans clipped to its columns.
- Thin blocks retain true proportions without minimum widths. Full accessible labels and the shown-taxon selector keep navigation available. Compact-height cards prioritize readable taxon names.
- Build/type checks and ten domain tests pass. Independent review matched every node's cached leaf count, passed 216 conservation checks and 24 viewport/view/mode layouts, then verified eight compact-height cases after a label-clipping fix.
- Source data and preparation pipeline are unchanged. Iteration 3 is validated and delivered.

### Iteration 2

- Current browsing uses a stable OTT taxon ID in the URL and direct node navigation with back/forward, ancestor, parent, and root actions.
- Replaced the editorial page with a fixed application viewport. Branch spans and branch paths share a size-bounded neighborhood and explicit page/depth controls; no page or panel scrolling.
- Replaced 41 curated records with 64,909 verified OTT 3.3 records. Exact source identities, names, ranks, parent links, and source direct-child counts are preserved.
- Data includes broad higher groups across life and filtered Mammalia, Aves, and Rosaceae branches. Subset boundaries and omitted child counts are visible; historical release and selection are explained in a paged source dialog.
- Source extraction is reproducible and independently checked against all 4,528,126 source records. Data preparation and limits are documented in `docs/DATA.md`.
- Dataset is emitted as a separate 11.44 MB JSON asset with loading/error handling, rather than embedded in the application JavaScript.
- Six domain tests cover source graph, real intermediate ancestry, wide pagination, source-depth spans, stale-page handling, and subset boundaries. Independent browser checks cover direct/history navigation, pages, views, depth, source dialog, and six no-scroll viewport sizes.

### Iteration 1 (Superseded)

- First browser-only experiment implemented with a hand-curated, named animal taxonomy fixture.
- Rank lanes and branch tree share domain helpers, browsing state, ancestry navigation, depth, and selected-taxon details.
- View registration provides the extension point for future variations.
- Query parameters preserve browsing state and support browser history.
- Source limitations and the meaning of band widths are explained in the interface.
- Frozen-lockfile installation, type checking, production build, and five domain tests pass.
- Independent Chromium validation passed selection, view switching, ancestry/parent navigation, browser history, terminal species, depth, keyboard interaction, provenance, and narrow-screen layouts. Scrollable layouts expose all sample taxa.
- Local development server runs at `http://127.0.0.1:5173/`.
- OpenTree release selection and reproducible full-data preparation remain deferred.
