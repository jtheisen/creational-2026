# Taxonomy data

## What existed before iteration 2

The first interface used 41 hand-curated demonstration taxa. Its IDs, descriptions,
common names and parent paths were editorial fixture data, not an OpenTree export.
The reference prototype contains processing code but no taxonomy TSV, Parquet or
runtime binary data in this workspace. Its `data-preparation/process_taxonomy.py`
lines 14–15 cite synthesis v13.4 and OTT 3.3. The synthesis tree and the OTT taxonomy
are different artifacts; this application uses the taxonomy.

## Verified source

- Release: Open Tree of Life Taxonomy **OTT 3.3**, a historical 2021 release.
- Official source: <https://files.opentreeoflife.org/ott/ott3.3/ott3.3/taxonomy.tsv>.
- Source bytes: **416,869,933**.
- Source taxa: **4,528,126**.
- SHA256: `0c798437d90dedd1511e0ba2470323b6ffad54f2919634fe1a132bcc71c7239f`.
- Observed source HTTP Last-Modified: 1 June 2021, 22:26:02 GMT.

The full TSV is a local preparation input, not a shipped browser asset. The
checked-in sample is `src/data/taxonomy.json`; machine-readable metrics and rules
are also in `src/data/opentree-metadata.json`.

## Current source-derived sample

The browser has **64,909 taxa**, including:

| Selected branch | Retained taxa, including branch root |
| --- | ---: |
| Mammalia | 28,126 |
| Aves | 26,062 |
| Rosaceae | 7,420 |

The remaining 3,301 records contain the broad taxonomy scaffold across life and
its intermediate ancestors. The sample contains 32,423 species, 6,061 subspecies,
4,741 genera and 17,391 records whose rank is `no rank`. Other raw source ranks
are retained. These are record counts, not counts of accepted living species.
Extinct taxa are included. No common names, explanatory descriptions or synonyms
are invented or added.

Selection rules:

1. Select the explicit higher ranks from domain through order listed in the metadata.
2. Select all descendants of Mammalia (`ott244265`), Aves (`ott81461`) and Rosaceae
   (`ott208036`), regardless of rank.
3. Exclude blank names, names matching the documented unnamed-name regex, and
   records with any flag in the metadata exclusion list. The regex covers
   uncultured, unidentified, unclassified, `sp.` and environmental-sample names;
   it is a transparent heuristic, not a guarantee that every informal name is absent.
4. Drop selected targets if an ancestor is excluded (5 targets). Retain every
   intermediate ancestor of the remaining targets (261 additional records).

Every retained parent link is the **exact source parent link**. There are no
synthetic ancestors, compressed rank paths or skipped-ancestor links. The one
root is `life` (`ott805080`). Stable IDs have the form `ott<uid>`; `sourceId` and
`sourceParentId` retain the original numeric identifiers as strings.

**This is a connected sample, not the complete taxonomy.** Outside the three
selected branches, an apparent leaf can have descendants omitted by selection.
The three branches are complete only under the documented exclusions. The data
is useful for navigation experiments, not a current or curated consensus classification.
The uncompressed sample JSON is 11,440,364 bytes (about 10.91 MiB).
Each node has `sourceChildCount`, counted from every record in the full TSV.
The interface can therefore distinguish true source leaves from sample boundaries.
There are 3,504 retained taxa with omitted direct children, including 1,502
apparent leaves with children outside the sample. These counts include exclusions.

## Reproduce

Run from the project root:

```sh
python3 SCRIPTS/prepare_opentree.py --source agents/TEMP/opentree/taxonomy.tsv
```

The script downloads the official source if the specified input is absent. It
checks the source SHA256 before writing output. It uses only Python's standard
library. Allow disk space for the 398 MiB source and RAM for source parent maps.
The TSV can be removed after preparation; the retained JSON and metadata are the
browser inputs. Re-running against the same verified input produces the same
bytes. The source path and output path can be set by CLI arguments.
