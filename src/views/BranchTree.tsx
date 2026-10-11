import { byId, loadedLeafCount } from "../domain/taxonomy";
import type { ViewProps } from "./types";
export function BranchTree({ window: viewport, depth, onNavigate }: ViewProps) {
  const columns = Array.from({ length: viewport.end - viewport.start }, (_, i) => i + viewport.start);
  return <div className="lineage-map"  aria-label="Branch paths">
    {columns.map((column) => { const geometry = viewport.geometry({ start: column, end: column + 1 }); return <div className={`lineage ${geometry.width < 0.045 ? "thin-cell" : ""}`} key={column} style={{ left: `${geometry.left * 100}%`, width: `${geometry.width * 100}%`, gridTemplateRows: `repeat(${depth + 1}, minmax(0, 1fr))` }}>
      {viewport.spans.filter((span) => span.start <= column && span.end > column).map(({ taxon, depth: level }) => <button className="lineage-node" key={taxon.id} style={{ gridRow: level + 1 }} onClick={() => onNavigate(taxon.id)} aria-label={`${taxon.name} · ${taxon.rank} · ${loadedLeafCount(taxon.id).toLocaleString()} loaded leaves`} title={`${taxon.name} · ${loadedLeafCount(taxon.id).toLocaleString()} loaded leaves in full subtree · parent: ${taxon.parentId ? byId.get(taxon.parentId)?.name : "none"}`}>
        <span className="taxon-rank">{taxon.rank}</span><strong>{taxon.name}</strong><span className="taxon-hint">{level === 0 ? "Current taxon" : "↓ direct child"}</span>
      </button>)}
    </div>; })}
  </div>;
}
