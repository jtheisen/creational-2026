import datasetUrl from "../data/taxonomy.json?url";
export const ranks = ["domain", "kingdom", "phylum", "class", "order", "family", "genus", "species"] as const;
export type Rank = string;
export interface Taxon {
  id: string;
  sourceId?: string;
  sourceChildCount?: number;
  name: string;
  commonName?: string;
  rank: Rank;
  parentId: string | null;
  description?: string;
}
export interface TaxonomyData { nodes: Taxon[]; provenance: Record<string, unknown>; }
export let taxa: Taxon[] = [];
export let provenance: Record<string, unknown> = {};
export const byId = new Map<string, Taxon>();
const childIndex = new Map<string, Taxon[]>();
export let ROOT_ID = "";
export let DEFAULT_FOCUS = "";
export function initializeTaxonomy(data: TaxonomyData) {
  taxa = data.nodes;
  provenance = data.provenance;
  byId.clear(); childIndex.clear(); countIndex.clear();
  for (const taxon of taxa) byId.set(taxon.id, taxon);
  for (const taxon of taxa) {
    if (!taxon.parentId) continue;
    const siblings = childIndex.get(taxon.parentId) ?? [];
    siblings.push(taxon);
    childIndex.set(taxon.parentId, siblings);
  }
  ROOT_ID = taxa.find((t) => t.parentId === null)!.id;
  DEFAULT_FOCUS = typeof provenance.defaultFocusId === "string" && byId.has(provenance.defaultFocusId)
    ? provenance.defaultFocusId : ROOT_ID;
  countBranch(ROOT_ID);
  for (const siblings of childIndex.values()) siblings.sort((a, b) => descendantCount(b.id) - descendantCount(a.id) || a.name.localeCompare(b.name));
}
let loading: Promise<void> | undefined;
export function loadTaxonomy() {
  if (!loading) loading = fetch(datasetUrl).then(async (response) => {
    if (!response.ok) throw new Error(`Dataset request failed (${response.status})`);
    initializeTaxonomy(await response.json() as TaxonomyData);
  }).catch((error: unknown) => { loading = undefined; throw error; });
  return loading;
}
export function children(id: string): Taxon[] { return childIndex.get(id) ?? []; }
export function ancestors(id: string): Taxon[] {
  const result: Taxon[] = [];
  let node = byId.get(id);
  while (node) {
    result.push(node);
    node = node.parentId ? byId.get(node.parentId) : undefined;
  }
  return result.reverse();
}
export function descendants(id: string): Taxon[] {
  const result: Taxon[] = [];
  const stack = [...children(id)].reverse();
  while (stack.length) {
    const node = stack.pop()!;
    result.push(node);
    stack.push(...[...children(node.id)].reverse());
  }
  return result;
}
const countIndex = new Map<string, number>();
function countBranch(id: string): number {
  const cached = countIndex.get(id);
  if (cached !== undefined) return cached;
  const count = children(id).reduce((n, child) => n + 1 + countBranch(child.id), 0);
  countIndex.set(id, count);
  return count;
}
export function descendantCount(id: string) { return countIndex.get(id) ?? 0; }
export interface BranchSpan { taxon: Taxon; start: number; end: number; depth: number; }
export function branchSpans(id: string, maxDepth: number) {
  const spans: BranchSpan[] = [];
  let column = 0;
  function walk(taxon: Taxon, depth: number) {
    const entry = { taxon, start: column, end: column + 1, depth };
    spans.push(entry);
    const next = depth < maxDepth ? children(taxon.id) : [];
    if (next.length) next.forEach((child) => walk(child, depth + 1));
    else column++;
    entry.end = column;
  }
  const root = byId.get(id);
  if (root) walk(root, 0);
  return { spans, columns: column };
}
export function branchWindow(id: string, depth: number, page: number, capacity: number) {
  const layout = branchSpans(id, depth);
  const size = Math.max(1, Math.floor(capacity));
  const pages = Math.max(1, Math.ceil(layout.columns / size));
  const currentPage = Math.max(0, Math.min(pages - 1, page));
  const start = currentPage * size;
  const end = Math.min(layout.columns, start + size);
  return { ...layout, pages, page: currentPage, start, end,
    visible: layout.spans.filter((span) => span.end > start && span.start < end) };
}
export function branchColor(id: string, focusId: string) {
  const path = ancestors(id);
  const focusIndex = path.findIndex((t) => t.id === focusId);
  const branch = path[focusIndex + 1] ?? path[focusIndex];
  return Math.max(0, children(focusId).findIndex((t) => t.id === branch?.id)) % 4;
}
