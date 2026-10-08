# Iteration 2 Contract

## Location and Navigation

- A stable taxon ID in the URL defines the current taxon. The current taxon supplies the title, details, ancestors, and neighborhood.
- Clicking a taxon navigates directly, adding a browser history entry. Back, forward, and deep links restore the taxon.
- Upward and root navigation are always reachable. There is no separate selected taxon that requires an Explore action.
- Comparison views share location and navigation.

## Fixed Viewport

- Use the browser viewport as an application workspace. Remove the marketing header, hero, reading guide, and website footer.
- No page or panel scrolling. Fit a bounded local neighborhood to available dimensions.
- Use explicit pagination and depth controls for neighborhoods larger than the viewport. Indicate omissions and provide access to all retained child groups.
- Maintain usable controls at mobile widths and short viewport heights; do not conceal unreachable content with overflow clipping.

## Data

- Replace the curated demo as the active dataset with records derived from a verified named OpenTree release.
- Keep authoritative source IDs, raw names/ranks, original parent references, and transparent selected-parent semantics if exclusions compress paths.
- Describe selection rules and source/subset totals. No fabricated common names, descriptions, rank paths, or species counts.
- Validate uniqueness, connected parent chains, absence of cycles, and counts against generated metadata.
- Retain the original demo only as a historical test fixture, not a silent fallback to authoritative data.

## Evidence

- Test direct navigation/history, deep links, ancestors, leaf states, invalid locations, sibling paging, rank irregularities, and resize behavior.
- Run build/type checks/domain tests.
- Independently inspect and run browser flows at desktop/mobile and short heights. Check no scrolling and reachability, not just absence of scrollbars.
- Publish source provenance, acquisition facts, exact retained counts, pipeline reproduction instructions, and known limits.
