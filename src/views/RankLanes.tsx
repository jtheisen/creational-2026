import { branchColor, children } from "../domain/taxonomy";
import type { ViewProps } from "./types";
export function RankLanes({ focus, window: viewport, depth, onNavigate }: ViewProps) {
  const columns = Math.max(1, viewport.end - viewport.start);
  return <div className="rank-map" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`, gridTemplateRows: `repeat(${depth + 1}, minmax(0, 1fr))` }} aria-label="Local taxonomy branches">
    {viewport.visible.map(({ taxon, start, end, depth: level }) => <button key={taxon.id}
      className={`taxon-band tone-${branchColor(taxon.id, focus.id)} ${level === 0 ? "current-band" : ""}`}
      style={{ gridColumn: `${Math.max(start, viewport.start) - viewport.start + 1} / ${Math.min(end, viewport.end) - viewport.start + 1}`, gridRow: level + 1 }}
      onClick={() => onNavigate(taxon.id)} title={`${taxon.name} · ${taxon.rank} · ${children(taxon.id).length} direct children`} aria-current={level === 0 ? "page" : undefined}>
      <span className="taxon-rank">{taxon.rank} {start < viewport.start || end > viewport.end ? "· continued" : ""}</span>
      <strong>{taxon.name}</strong><span className="taxon-hint">{children(taxon.id).length ? `${children(taxon.id).length.toLocaleString()} children ↘` : "End of loaded branch"}</span>
    </button>)}
  </div>;
}
