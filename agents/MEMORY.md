# Agent Memory

## Workspace Detection

- A newly extracted Rosetta plugin workspace can correctly lack Git metadata and project context files. Confirm whether the workspace is new before treating their absence as a setup failure.
- Select the workspace layout before cloning reference repositories. In a Single Repo Workspace, place read-only reference repositories below `refsrc/`.

## Repository Retrieval

- A failed clone can leave nested Git object directories even when no files appear in a file-only listing. Inspect all entry types before cleanup.
- Use fail-fast shell behavior for ordered recovery commands. Without it, a failed cleanup can allow extraction to continue into an invalid layout.
- When Git transport fails but the hosting API and archive endpoint are healthy, verify an archive and record its exact revision as a read-only snapshot.

## Local Tooling

- In this Docker sandbox, bind application servers to `0.0.0.0`; container loopback does not expose the server through Docker port forwarding.

- Check package-manager availability before installation. Corepack's default version can point to an incomplete cache; pin the project package-manager version rather than rely on the environment default.
- Restrict Tailwind source discovery to application files in workspaces containing agent documentation. Markdown bracket expressions can otherwise be interpreted as arbitrary CSS utilities and produce build warnings.

## Taxonomy Exploration

- A small hand-curated fixture verifies components but cannot validate large-tree navigation. Report zero imported source records when that is the case, and use source-derived data for browsing experiments.
- The reference's core interaction is taxon-as-location with direct node navigation and local descendant windows. A separate inspect-then-explore action and a scrolling editorial page diverge from that interaction.
- No-scroll checks must also inspect readable card names at short viewport heights. Overflow can be hidden while stacked labels clip; compact layouts should suppress secondary labels and retain full accessible names/tooltips.
- Loaded-leaf widths must count terminal records across the full loaded subtree, not depth-truncated frontier records. Subset boundaries still count as one loaded leaf; omitted source children do not contribute.
