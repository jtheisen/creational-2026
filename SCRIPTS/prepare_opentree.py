#!/usr/bin/env python3
"""Reproduce the connected OTT 3.3 navigation sample using Python's standard library."""
import argparse
from collections import Counter
import hashlib
import json
from pathlib import Path
import re
import urllib.request

URL = 'https://files.opentreeoflife.org/ott/ott3.3/ott3.3/taxonomy.tsv'
EXPECTED_SHA256 = '0c798437d90dedd1511e0ba2470323b6ffad54f2919634fe1a132bcc71c7239f'
BRANCH_NAMES = {'Mammalia', 'Aves', 'Rosaceae'}
HIGHER_RANKS = {'domain', 'superkingdom', 'kingdom', 'subkingdom', 'infrakingdom',
                'superphylum', 'phylum', 'subphylum', 'infraphylum', 'superclass',
                'class', 'subclass', 'infraclass', 'superorder', 'order'}
EXCLUDED_FLAGS = {'not_otu', 'environmental', 'environmental_inherited',
                  'viral', 'hidden', 'hidden_inherited', 'was_container'}
UNNAMED = re.compile(r'(^uncultured\b|^unidentified\b|^unclassified\b|\bsp\.?\s|\bsp\.?$|\benvironmental sample\b)', re.I)


def rows(path):
    with path.open(encoding='utf-8') as source:
        next(source)
        for line in source:
            columns = [part.strip() for part in line.split('|')]
            yield int(columns[0]), int(columns[1]) if columns[1] else None, columns[2], columns[3], columns[6]


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--source', type=Path, required=True, help='OTT taxonomy TSV; downloaded if absent')
    parser.add_argument('--output', type=Path, default=Path(__file__).resolve().parents[1] / 'src/data/taxonomy.json')
    args = parser.parse_args()
    args.source.parent.mkdir(parents=True, exist_ok=True)
    if not args.source.exists():
        with urllib.request.urlopen(URL) as response, args.source.open('wb') as output:
            while chunk := response.read(1024 * 1024):
                output.write(chunk)
    digest = hashlib.sha256()
    with args.source.open('rb') as source:
        while chunk := source.read(1024 * 1024):
            digest.update(chunk)
    if digest.hexdigest() != EXPECTED_SHA256:
        raise ValueError('Source SHA256 differs from the verified OTT 3.3 release; output not written.')
    parents, excluded, higher, branch_roots = {}, set(), set(), {}
    source_ranks = Counter()
    source_children = Counter()
    for uid, parent, name, rank, flags in rows(args.source):
        parents[uid] = parent
        source_ranks[rank] += 1
        if parent is not None:
            source_children[parent] += 1
        if not name or UNNAMED.search(name) or EXCLUDED_FLAGS.intersection(flags.split(',')):
            excluded.add(uid)
        if rank in HIGHER_RANKS:
            higher.add(uid)
        if name in BRANCH_NAMES and rank in {'class', 'family'}:
            branch_roots[name] = uid
    if len(parents) != sum(source_ranks.values()):
        raise ValueError('Duplicate source identities')
    if set(branch_roots) != BRANCH_NAMES:
        raise ValueError(f'Missing or ambiguous requested branches: {branch_roots}')
    branch_ids = set(branch_roots.values())
    # Memoized ancestry classification: the source need not be parent-first.
    classifications = {uid: uid for uid in branch_ids}
    def branch_of(uid):
        path = []
        current = uid
        while current is not None and current not in classifications:
            path.append(current)
            current = parents[current]
        result = classifications.get(current)
        for item in path:
            classifications[item] = result
        return result
    selected = set(higher)
    selected.update(uid for uid in parents if branch_of(uid) is not None)
    selected.difference_update(excluded)
    initial_count = len(selected)
    # Preserve every source parent relationship. Drop targets with an excluded
    # ancestor, rather than inventing a link over that ancestor.
    clean = {None: True}
    def clean_path(uid):
        path = []
        current = uid
        while current not in clean and current not in excluded:
            path.append(current)
            current = parents[current]
        result = current not in excluded and clean.get(current, False)
        for item in path:
            clean[item] = result
        return result
    selected = {uid for uid in selected if clean_path(uid)}
    targets = set(selected)
    for uid in targets:
        current = parents[uid]
        while current is not None and current not in selected:
            selected.add(current)
            current = parents[current]
    nodes, ranks, branches = [], Counter(), Counter()
    for uid, parent, name, rank, flags in rows(args.source):
        if uid not in selected:
            continue
        node = {'id': f'ott{uid}', 'sourceId': str(uid), 'name': name, 'rank': rank,
                'parentId': f'ott{parent}' if parent is not None else None,
                'sourceParentId': str(parent) if parent is not None else None,
                'sourceChildCount': source_children[uid]}
        if flags:
            node['flags'] = flags.split(',')
        nodes.append(node)
        ranks[rank] += 1
        branch = branch_of(uid)
        if branch:
            branches[next(name for name, root in branch_roots.items() if root == branch)] += 1
    roots = [node['id'] for node in nodes if node['parentId'] is None]
    if len(roots) != 1:
        raise ValueError(f'Expected one connected source root, found {roots}')
    node_ids = {node['id'] for node in nodes}
    assert all(node['parentId'] is None or node['parentId'] in node_ids for node in nodes)
    retained_children = Counter(node['parentId'] for node in nodes)
    boundary_count = sum(node['sourceChildCount'] > retained_children[node['id']] for node in nodes)
    boundary_leaves = sum(node['sourceChildCount'] > 0 and retained_children[node['id']] == 0 for node in nodes)
    provenance = {
        'kind': 'source-derived connected subset', 'source': 'Open Tree of Life Taxonomy (OTT)',
        'release': 'ott3.3', 'sourceUrl': URL, 'sourceSha256': digest.hexdigest(),
        'sourceBytes': args.source.stat().st_size, 'sourceTaxonCount': len(parents),
        'retainedTaxonCount': len(nodes), 'rootId': roots[0],
        'taxaWithOmittedChildren': boundary_count, 'subsetBoundaryLeafCount': boundary_leaves,
        'defaultFocusId': f"ott{branch_roots['Mammalia']}",
        'ids': 'Stable OpenTree taxonomy identifiers prefixed with ott; sourceId is the original uid.',
        'selection': 'Named higher taxa from domain through order across life; named Mammalia, Aves and Rosaceae branches at all ranks; every original intermediate ancestor retained. This is a subset, not the complete taxonomy.',
        'higherRanks': sorted(HIGHER_RANKS), 'branchRoots': {name: f'ott{uid}' for name, uid in branch_roots.items()},
        'branchCounts': dict(branches), 'retainedRankCounts': dict(sorted(ranks.items())),
        'sourceRankCounts': dict(sorted(source_ranks.items())),
        'excludedSourceTaxonCount': len(excluded), 'excludedFlags': sorted(EXCLUDED_FLAGS),
        'unnamedNamePattern': UNNAMED.pattern,
        'selectedTargetsDroppedForExcludedAncestor': initial_count - len(targets),
        'ancestorOnlyTaxonCount': len(selected - targets),
        'parentSemantics': 'Every retained parent is the exact source parent; no skipped ancestors, synthetic nodes or invented links. Targets with excluded ancestors are omitted.',
        'limitations': 'No common names, descriptions or synonyms added. Extinct taxa retained. Apparent terminal taxa outside the three selected branches may have omitted descendants. OTT 3.3 is a historical 2021 release, not a current classification.'
    }
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps({'provenance': provenance, 'nodes': nodes}, ensure_ascii=False, separators=(',', ':')) + '\n', encoding='utf-8')
    metadata = args.output.with_name('opentree-metadata.json')
    metadata.write_text(json.dumps(provenance, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print(json.dumps({'output': str(args.output), 'outputBytes': args.output.stat().st_size, **provenance}, indent=2))


if __name__ == '__main__':
    main()
