import { beforeAll, describe, expect, it } from "vitest";
import sourceFixture from "../data/taxonomy.json";
import { ancestors, initializeTaxonomy, branchSpans, branchWindow, byId, children, DEFAULT_FOCUS, descendantCount, provenance, ROOT_ID, taxa } from "./taxonomy";
beforeAll(() => initializeTaxonomy(sourceFixture));
describe("source-derived connected taxonomy", () => {
  it("has real stable identities and complete original parent paths", () => {
    expect(provenance.release).toBe("ott3.3");
    expect(taxa.length).toBe(provenance.retainedTaxonCount);
    expect(byId.size).toBe(taxa.length);
    expect(taxa.filter((t) => t.parentId === null).map((t) => t.id)).toEqual([ROOT_ID]);
    for (const taxon of taxa) {
      expect(taxon.id).toBe(`ott${taxon.sourceId}`);
      expect(taxon.name.trim()).not.toBe("");
      if (taxon.parentId) expect(byId.has(taxon.parentId)).toBe(true);
    }
    expect(descendantCount(ROOT_ID)).toBe(taxa.length - 1);
  });
  it("returns actual source ancestry including noncanonical intermediate ranks", () => {
    const human = taxa.find((taxon) => taxon.name === "Homo sapiens")!;
    const path = ancestors(human.id);
    expect(path[0].id).toBe(ROOT_ID);
    expect(path.at(-1)?.id).toBe(human.id);
    expect(path.some((taxon) => taxon.id === DEFAULT_FOCUS)).toBe(true);
    expect(path.some((taxon) => taxon.rank === "no rank")).toBe(true);
    path.slice(1).forEach((taxon, i) => expect(taxon.parentId).toBe(path[i].id));
  });
});
describe("bounded local branch window", () => {
  it("pages every wide sibling group without losing or duplicating children", () => {
    const rubus = taxa.find((taxon) => taxon.name === "Rubus")!;
    const expected = children(rubus.id).map((t) => t.id);
    expect(expected.length).toBeGreaterThan(1000);
    const seen: string[] = [];
    const first = branchWindow(rubus.id, 1, 0, 4);
    for (let page = 0; page < first.pages; page++) {
      const window = branchWindow(rubus.id, 1, page, 4);
      expect(window.end - window.start).toBeLessThanOrEqual(4);
      expect(window.visible.find((entry) => entry.depth === 0)?.taxon.id).toBe(rubus.id);
      seen.push(...window.visible.filter((entry) => entry.depth === 1).map((entry) => entry.taxon.id));
    }
    expect(seen).toEqual(expected);
  });
  it("preserves parent spans and source depth without rank-based invented edges", () => {
    const { spans } = branchSpans(DEFAULT_FOCUS, 3);
    for (const entry of spans) {
      expect(entry.end).toBeGreaterThan(entry.start);
      expect(entry.depth).toBeLessThanOrEqual(3);
      if (!entry.depth) continue;
      const parent = spans.find((span) => span.taxon.id === entry.taxon.parentId)!;
      expect(parent).toBeDefined();
      expect(entry.depth).toBe(parent.depth + 1);
      expect(entry.start).toBeGreaterThanOrEqual(parent.start);
      expect(entry.end).toBeLessThanOrEqual(parent.end);
    }
  });
  it("clamps stale pages after the screen or depth changes", () => {
    const window = branchWindow(DEFAULT_FOCUS, 1, 100000, 3);
    expect(window.page).toBe(window.pages - 1);
    expect(window.visible.length).toBeGreaterThan(0);
    expect(branchWindow(DEFAULT_FOCUS, 1, -5, 0).page).toBe(0);
  });
  it("keeps a retained boundary nonzero without claiming it is a biological leaf", () => {
    const terminal = taxa.find((taxon) => children(taxon.id).length === 0)!;
    const window = branchWindow(terminal.id, 5, 0, 5);
    expect(window.columns).toBe(1);
    expect(window.visible.map((entry) => entry.taxon.id)).toEqual([terminal.id]);
  });
});
