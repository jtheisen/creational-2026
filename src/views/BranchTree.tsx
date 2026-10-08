import { byId } from "../domain/taxonomy";
import type { ViewProps } from "./types";
export function BranchTree({ window: viewport, depth, onNavigate }: ViewProps) {
  const columns = Array.from({ length: viewport.end - viewport.start }, (_, i) => i + viewport.start);
  return <div className="lineage-map" style={{ gridTemplateColumns: `repeat(${columns.length}, minmax(0, 1fr))` }} aria-label="Branch paths">
    {columns.map((column) => <div className="lineage" key={column} style={{ gridTemplateRows: `repeat(${depth + 1}, minmax(0, 1fr))` }}>
      {viewport.spans.filter((span) => span.start <= column && span.end > column).map(({ taxon, depth: level }) => <button className="lineage-node" key={taxon.id} style={{ gridRow: level + 1 }} onClick={() => onNavigate(taxon.id)} title={`${taxon.name} · parent: ${taxon.parentId ? byId.get(taxon.parentId)?.name : "none"}`}>
        <span className="taxon-rank">{taxon.rank}</span><strong>{taxon.name}</strong><span className="taxon-hint">{level === 0 ? "Current taxon" : "↓ direct child"}</span>
      </button>)}
    </div>)}
  </div>;
}
