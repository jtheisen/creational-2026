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
  byId.clear(); childIndex.clear(); countIndex.clear(); leafIndex.clear();
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
  countBranches(ROOT_ID);
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
const leafIndex = new Map<string, number>();
// Iterative postorder keeps initialization linear and avoids call-stack limits.
function countBranches(rootId: string) {
  const order = [rootId];
  for (let i = 0; i < order.length; i++) {
    for (const child of children(order[i])) order.push(child.id);
  }
  for (let i = order.length - 1; i >= 0; i--) {
    const id = order[i];
    const next = children(id);
    countIndex.set(id, next.reduce((sum, child) => sum + 1 + (countIndex.get(child.id) ?? 0), 0));
    leafIndex.set(id, next.length ? next.reduce((sum, child) => sum + (leafIndex.get(child.id) ?? 0), 0) : 1);
  }
}
export function loadedLeafCount(id: string) { return leafIndex.get(id) ?? 0; }
export type WidthMode = "leaves" | "visible";
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
export function branchWindow(id: string, depth: number, page: number, capacity: number, widthMode: WidthMode = "leaves") {
  const layout = branchSpans(id, depth);
  const size = Math.max(1, Math.floor(capacity));
  const pages = Math.max(1, Math.ceil(layout.columns / size));
  const currentPage = Math.max(0, Math.min(pages - 1, page));
  const start = currentPage * size;
  const end = Math.min(layout.columns, start + size);
  const frontier = layout.spans;
  const weights = Array<number>(layout.columns).fill(1);
  // Every displayed frontier ends traversal, even if its loaded subtree continues.
  for (const span of frontier) {
    if (span.depth === depth || !children(span.taxon.id).length) {
      weights[span.start] = widthMode === "leaves" ? loadedLeafCount(span.taxon.id) : 1;
    }
  }
  const offsets = [0];
  for (let column = start; column < end; column++) offsets.push(offsets.at(-1)! + weights[column]);
  const totalWeight = offsets.at(-1)!;
  function geometry(span: Pick<BranchSpan, "start" | "end">) {
    const left = offsets[Math.max(span.start, start) - start] / totalWeight;
    const right = offsets[Math.min(span.end, end) - start] / totalWeight;
    return { left, width: right - left };
  }
  return { ...layout, pages, page: currentPage, start, end, weights, totalWeight, geometry, widthMode,
    visible: layout.spans.filter((span) => span.end > start && span.start < end) };
}
export function branchColor(id: string, focusId: string) {
  const path = ancestors(id);
  const focusIndex = path.findIndex((t) => t.id === focusId);
  const branch = path[focusIndex + 1] ?? path[focusIndex];
  return Math.max(0, children(focusId).findIndex((t) => t.id === branch?.id)) % 4;
}
