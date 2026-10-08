# Creational

A taxonomy browser experiment using a reproducible, connected subset of OpenTree Taxonomy 3.3. The active data contains real source IDs, names, ranks and exact parent links; no generated descriptions or common names.

## Run

Use Node.js 20.19+ or 22.12+ and Corepack.

```sh
corepack pnpm install
corepack pnpm dev
corepack pnpm test
corepack pnpm build
```

Vite binds to `0.0.0.0`. The browser is always at a specific taxon, encoded in `?taxon=ott244265`. View, depth and branch page are also in the URL. Browser back/forward and deep links restore that location. Every taxon card navigates directly; use Up, Root or the ancestor selector to leave a branch.

The workspace fits the viewport without document or panel scrolling. It chooses a bounded number of branch columns and ancestry levels for the available space. Previous/next controls expose every branch. Changing screen size may reduce the effective depth, shown beside the pager. Rank labels come directly from OTT; vertical position represents actual parent–child depth. Intermediate and unranked nodes are preserved rather than assigned invented canonical ranks. Width represents the local branch layout, not population or biodiversity.

## Add a variation

1. Add a React component to `src/views/` accepting `ViewProps` from `types.ts`.
2. Register it in `src/views/registry.ts` with a unique URL ID, name and explanation.
3. Use the shared `window` layout and `onNavigate` contract. The common shell owns URL state, ancestry, depth, pagination, viewport capacity and source details.

`src/data/taxonomy.json` stores source provenance and the derived nodes. Its metadata records selection rules, source totals and checksum. Source information is available from the top-right button. This subset includes higher taxa across life and much fuller Mammalia, Aves and Rosaceae branches. Retained-empty branches elsewhere can have omitted descendants; the browser shows subset boundaries, not biological leaf claims. OTT3.3 is a historical release, and extinct taxa are included.

The prototype remains in `refsrc/creational-reference/` as read-only reference. See source pipeline documentation for reproducible download and extraction.
