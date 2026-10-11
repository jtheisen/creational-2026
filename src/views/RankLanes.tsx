import { branchColor, children, loadedLeafCount } from "../domain/taxonomy";
import type { ViewProps } from "./types";
export function RankLanes({ focus, window: viewport, depth, onNavigate }: ViewProps) {
  return <div className="rank-map"  aria-label="Local taxonomy branches">
    {viewport.visible.map(({ taxon, start, end, depth: level }) => { const geometry = viewport.geometry({ start, end }); return <button key={taxon.id}
      className={`${geometry.width < 0.045 ? "thin-cell" : ""} taxon-band tone-${branchColor(taxon.id, focus.id)} ${level === 0 ? "current-band" : ""}`}
      style={{ left: `${geometry.left * 100}%`, width: `${geometry.width * 100}%`, top: `${level * 100 / (depth + 1)}%`, height: `${100 / (depth + 1)}%` }}
      onClick={() => onNavigate(taxon.id)} title={`${taxon.name} · ${taxon.rank} · ${children(taxon.id).length} direct children · ${loadedLeafCount(taxon.id)} loaded leaves in full subtree${start < viewport.start || end > viewport.end ? " · partial span on this page" : ""}`} aria-label={`${taxon.name} · ${taxon.rank} · ${loadedLeafCount(taxon.id).toLocaleString()} loaded leaves`} aria-current={level === 0 ? "page" : undefined}>
      <span className="taxon-rank">{taxon.rank} {start < viewport.start || end > viewport.end ? "· continued" : ""}</span>
      <strong>{taxon.name}</strong><span className="taxon-hint">{children(taxon.id).length ? `${children(taxon.id).length.toLocaleString()} children ↘` : "End of loaded branch"}</span>
    </button>; })}
  </div>;
}
