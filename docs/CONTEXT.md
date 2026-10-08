# Project Context

## Purpose

- Build a public, production-quality web application that helps people understand biological taxonomy visually.
- Recreate the useful ideas in the prototype as a properly defined and delivered product, not as a direct code rewrite.

## Users and Value

- Primary users are curious non-specialists and students.
- Users must be able to explore taxonomic relationships without specialist data-engineering knowledge.

## Initial Product Scope

- Browse the biological taxonomy hierarchy.
- Navigate between taxa and through ancestry and descendants.
- Show explanatory taxon and relationship details.
- Treat prototype diagnostics such as “rank puddles” as engineering/reference material, not as a primary user capability.

## Current Exploration Focus

- Iteration 2 uses a specific taxon as the browser location. Clicking another taxon navigates directly to it; browser back and forward restore the location.
- Use an application viewport without page or panel scrolling. Show a bounded local neighborhood and explicit controls for additional branches.
- Replace the hand-curated demonstration with source-derived records so browsing has meaningful scale. Show release, selection rules, and source/subset counts honestly.

- First optimize the interactive browsing experience.
- Find a useful subset of the source taxonomy instead of displaying the complete tree.
- Exclude unnamed taxa from the displayed subset; refine the remaining selection rules through concrete examples.
- Explore how taxonomic ranks affect hierarchy selection, layout, and visual encoding.
- Use the prototype as a semi-viable basis for rank visualization experiments, while correcting its known defects.
- Expect to compare multiple alternatives before committing to a product design.
- The first pass is authorized without further questions. Use a small illustrative fixture and keep views easy to replace or compare; review the result before selecting a final design.

## Deferred Concerns

- Search is outside the current exploration scope.
- Taxonomy refresh and update policy are deferred.
- Explanations of uncertainty and disputed classification are deferred.
- A formal accessibility target is deferred.
- User accounts are not required; browsing is public and anonymous.

## Data Authority

- Use a named OpenTree release as the authoritative taxonomy source.
- The source must be downloadable and the derived product data must be reproducible.

## Delivery Expectations

- Near-term work is exploratory and must produce concrete, reviewable alternatives and evidence.
- The eventual public product must meet the Universal Starter Definition of Done used by this workspace.

## Recreation Strategy

- Build a clean replacement rather than migrate the prototype incrementally.
- Preserve only validated domain ideas and useful interaction concepts.
- Treat prototype defects and unfinished ideas as evidence and experiment prompts, never implicit requirements.
