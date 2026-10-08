# First Experiment Contract

## Application

- Runs locally as a browser-only application using the workspace's selected stack.
- Shows named taxa, their ranks, ancestry, and parent-child relationships.
- Allows users to inspect and focus a taxon, return to ancestors, and reset browsing.
- Bounds visible descendants with a depth control.
- Provides rank lanes and tree views for comparison, retaining browsing state when changing views.
- Handles taxa without children with an explicit terminal state.
- Supports keyboard operation and narrow screens without losing access to controls.

## Experiment Boundary

- A registry defines each variation's identity, label, and view component.
- Views consume shared taxonomy data and navigation callbacks.
- Adding a variation must not require duplicating fixture loading or ancestry logic.
- A stable view identifier is represented in the URL.

## Fixture

- Checked-in human-readable records with stable fixture IDs, names, ranks, and parent IDs.
- Every parent reference resolves; identities are unique; hierarchy is acyclic.
- Source and selection limitations are visible. Hand-curated IDs must not be presented as OpenTree IDs.
- Sample branch sizes do not imply biological abundance or total species counts.

## Acceptance Evidence

- Successful dependency installation, TypeScript check, production build, and domain tests.
- Independent inspection and browser checks of navigation, view switching, depth, terminal nodes, keyboard input, and responsive layout.
- Documentation explains run commands and how to add a variation.

These are first-pass implementation decisions under the user's instruction to proceed without further inquiries. Final product design remains open.
