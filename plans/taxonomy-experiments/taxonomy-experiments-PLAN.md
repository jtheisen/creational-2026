# First Taxonomy Experiment

User instruction: make a first attempt without further inquiries; make variations easy to add.

## Scope

Build a runnable browser-only React/TypeScript/Vite application using pnpm and Tailwind. Reuse the reference's rank-row and branch-span concepts, with new domain code. Keep the reference snapshot unchanged. Use a small, named, clearly illustrative taxonomy fixture; do not claim OpenTree provenance without verified source data.

## Structure

Separate fixture data, validated hierarchy helpers, shared browsing state, and experiment views. Register views in one small registry. Preserve selection and focus when changing views. Provide ancestry navigation, selected-taxon details, depth control, and reset. Begin with rank lanes and a simple tree comparison.

## Verification

Check fixture identity, parent relations, ancestry, descendants, and selection boundaries. Run type checking, a production build, domain tests, and browser interaction checks. Review responsive layout, keyboard controls, terminal taxa, navigation, and switching experiments.

## Execution Ledger

- [x] Load saved context and inspect the reference visualization.
- [x] Define first-pass scope and extension boundary under the user's authorization.
- [x] Implement the application and comparison views; local dev server runs and domain tests pass.
- [x] Independently review and validate the runnable result; Chromium interaction, scroll reachability, conditional hints, and keyboard scrolling pass.
- [x] Update workspace documentation and deliver run instructions in `README.md`.

## Evidence

- Frozen-lockfile installation, type checking, production build, and five domain tests pass.
- Chromium checks cover selection, view switching, navigation, browser history, depth, terminal species, keyboard controls, provenance, responsive layout, and access to overflowing branches.
- Review artifacts and screenshots are stored in `agents/TEMP/taxonomy-experiments/`.
- Development server: `http://127.0.0.1:5173/`.
- Run and extension instructions: `README.md`.

## First-Pass Decisions

- The fixture is illustrative and hand-curated until an OpenTree release is selected.
- Experiment views share taxonomy identity and navigation, rather than each owning a separate data pipeline.
- Variations remain in one application; no plugin framework or backend is needed.
- Final design selection remains open for user feedback after the first attempt.
