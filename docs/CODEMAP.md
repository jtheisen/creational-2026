# Code Map

- `src/data/`: source-derived OTT 3.3 subset and machine-readable provenance.
- `src/domain/`: shared taxonomy identity, traversal, and layout helpers.
- `src/views/`: rank lanes, branch tree, shared view contract, and experiment registry.
- `src/main.tsx`: application entry point.
- `src/App.tsx`: URL taxon location, ancestry, viewport sizing, pagination, controls, and view selection.
- `src/TaxonDetails.tsx`: paged source-information dialog.
- `SCRIPTS/prepare_opentree.py`: verified source acquisition and reproducible subset preparation.
- `docs/DATA.md`: exact source facts, selection rules, and limits.
- `plans/taxonomy-experiments/`: first-pass scope, contract, and execution ledger.
- `refsrc/creational-reference/`: immutable reference; excluded from the new application build.
