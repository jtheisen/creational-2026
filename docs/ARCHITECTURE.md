# Architecture

## Workspace Boundaries

- This workspace runs in a Docker sandbox. Development and preview servers bind to `0.0.0.0` so Docker port forwarding can expose them to the host.

- New writable application code belongs in the workspace root.
- `refsrc/creational-reference/` is an immutable prototype snapshot used only for analysis and comparison.
- Do not copy prototype defects or undocumented behavior into the target application by default.
- No production coexistence, compatibility bridge, or old/new routing layer is required.

## Exploration Architecture

- Iteration 2 uses a fixed viewport with explicit branch pagination and a size-bounded descendant window. Page and panel scrolling are not navigation mechanisms.
- The URL taxon ID is the single browsing location. Node, ancestor, parent, and root actions navigate directly; comparison views share this state.
- Preserve original source ranks and parent links in this iteration. A future major-rank-only display must state when it skips intermediate source records.

- Use React, TypeScript, and Vite for the initial interactive experiments.
- Use pnpm for JavaScript package management.
- Use Tailwind CSS for styling.
- Keep the first architecture browser-only, with statically prepared taxonomy data.
- Add a backend only when measured product or data constraints require one.
- Use a small, inspectable taxonomy fixture before integrating the complete source dataset.
- Preserve fixture provenance and make its selection rules reviewable.
- Keep alternative browsing and rank-visualization concepts available as separate routes or views for direct comparison.
- Store early fixtures as checked-in, human-readable JSON with source IDs, names, ranks, and parent relationships.

## Data Contracts

- Iteration 2 uses the official OTT 3.3 taxonomy TSV and records its URL, checksum, source count, and subset rules. This historical release matches the prototype's source reference.
- Do not assume the prototype's native-endian binary files are the target contract.
- Define stable identity, hierarchy, naming, and rank semantics before selecting a production serialization format.

## Initial Experiment Structure

- `src/data/taxonomy.json` contains a 64,909-taxon connected subset of OTT 3.3 with stable source IDs and exact source parent links. `src/data/opentree-metadata.json` records provenance, source/subset counts, rank counts, and selection limitations.
- `SCRIPTS/prepare_opentree.py` downloads and extracts the subset reproducibly. The complete source TSV is a local preparation artifact, not part of the browser bundle.
- `src/domain/taxonomy.ts` owns ancestry, descendant selection, and rank-lane layout. Domain tests check fixture identity, parent relationships, rank ordering, and layout invariants.
- `src/views/types.ts` defines the shared view inputs and selection callback.
- `src/views/registry.ts` lists comparison views. Add a view component and registry entry to introduce a variation.
- The application shell owns URL taxon location, depth, branch page, and viewport capacity. Views use the same source-derived graph and direct navigation callback.
- Branch widths describe the visible retained hierarchy. Retained child/descendant counts describe the subset; `sourceChildCount` reports direct children in the complete source and exposes subset boundaries.

## Quality Direction

- Test taxonomy transformations independently from presentation.
- Use Vitest and React Testing Library for component behavior.
- Use Playwright for stable experiment flows, not every temporary visual idea.
- Write new tests from approved target behaviors; do not copy prototype tests.
- Validate performance with representative data before scaling to the complete selected subset.

## Known Prototype Gaps

- Hard-coded local input and output paths.
- Disconnected or inconsistent pipeline inputs and dependencies.
- Missing runtime data assets and meaningful automated tests.
- Browser main-thread reconstruction of the complete tree.
- Array-index identity and host-dependent binary serialization.
