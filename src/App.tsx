import { TaxonDetails } from "./TaxonDetails";
import { useEffect, useRef, useState } from "react";
import { ancestors, branchWindow, byId, children, DEFAULT_FOCUS, descendantCount, provenance, ROOT_ID, taxa, loadTaxonomy, loadedLeafCount } from "./domain/taxonomy";
import { experiments } from "./views/registry";
function readLocation() {
  const params = new URLSearchParams(window.location.search);
  const requested = params.get("taxon") ?? params.get("focus") ?? DEFAULT_FOCUS;
  const view = params.get("view");
  const depth = Number(params.get("depth") ?? 3);
  const page = Number(params.get("page") ?? 0);
  return { focusId: byId.has(requested) ? requested : DEFAULT_FOCUS,
    viewId: experiments.some((entry) => entry.id === view) ? view! : "ranks",
    depth: Number.isFinite(depth) ? Math.min(5, Math.max(1, Math.round(depth))) : 3,
    widthMode: params.get("width") === "visible" ? "visible" as const : "leaves" as const,
    page: Number.isFinite(page) ? Math.max(0, Math.floor(page)) : 0 };
}
function locationFor(state: ReturnType<typeof readLocation>) {
  return `${window.location.pathname}?${new URLSearchParams({ taxon: state.focusId, view: state.viewId, depth: String(state.depth), page: String(state.page), width: state.widthMode })}`;
}
export default function App() {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => { let active = true; loadTaxonomy().then(() => { if (active) setReady(true); }).catch((reason: unknown) => { if (active) setError(String(reason)); }); return () => { active = false; }; }, []);
  if (!ready) return <div className="loading-screen"><h1>creational</h1><p role="status">{error ? "The source dataset could not be loaded." : "Loading OpenTree taxonomy…"}</p>{error && <button onClick={() => window.location.reload()}>Retry</button>}</div>;
  return <Explorer />;
}
function Explorer() {
  const [state, setState] = useState(readLocation);
  const [showSource, setShowSource] = useState(false);
  const [size, setSize] = useState({ width: 800, height: 400 });
  const mapRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    window.history.replaceState(null, "", locationFor(readLocation()));
    const onPop = () => setState(readLocation());
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);
  useEffect(() => {
    const observer = new ResizeObserver(([entry]) => setSize({ width: entry.contentRect.width, height: entry.contentRect.height }));
    if (mapRef.current) observer.observe(mapRef.current);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (!showSource) return;
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") setShowSource(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [showSource]);
  function update(next: Partial<typeof state>) {
    const updated = { ...state, ...next };
    setState(updated);
    window.history.pushState(null, "", locationFor(updated));
  }
  function navigate(id: string) { if (id !== state.focusId) update({ focusId: id, page: 0 }); }
  const focus = byId.get(state.focusId)!;
  const path = ancestors(focus.id);
  const effectiveDepth = Math.min(state.depth, Math.max(1, Math.floor(size.height / 80) - 1));
  const capacity = Math.max(1, Math.floor(size.width / (size.width < 550 ? 145 : 185)));
  const viewport = branchWindow(focus.id, effectiveDepth, state.page, capacity, state.widthMode);
  const experiment = experiments.find((entry) => entry.id === state.viewId) ?? experiments[0];
  const View = experiment.Component;
  const sourceLabel = provenance.release ? `OpenTree ${String(provenance.release)}` : "Illustrative fixture";
  return <div className="app-shell">
    <header className="app-header"><button className="brand" onClick={() => navigate(ROOT_ID)}>✳ creational</button><span className="edition">TAXONOMY LAB / 03</span><button className="source-button" onClick={() => setShowSource(true)}>{sourceLabel} · {taxa.length.toLocaleString()} taxa ⓘ</button></header>
    <main className="explorer">
      <section className="focus-heading" aria-label="Current taxon"><div><p className="eyebrow">YOU ARE AT · {focus.rank}</p><h1>{focus.name}</h1></div><div className="focus-facts"><strong>{children(focus.id).length.toLocaleString()}<span>loaded children</span></strong><strong>{descendantCount(focus.id).toLocaleString()}<span>loaded descendants</span></strong><strong>{loadedLeafCount(focus.id).toLocaleString()}<span>loaded leaves</span></strong></div></section>
      <nav className="ancestry" aria-label="Taxonomic ancestry"><button disabled={!focus.parentId} onClick={() => focus.parentId && navigate(focus.parentId)}>↑ Up</button><button onClick={() => navigate(ROOT_ID)}>Root</button><span className="path-separator">/</span>
        <label className="ancestor-picker"><span className="sr-only">Go to ancestor</span><select aria-label="Go to ancestor" value={focus.id} onChange={(event) => navigate(event.target.value)}>{path.map((taxon, i) => <option key={taxon.id} value={taxon.id}>{`${i === 0 ? "" : "↳ "}${taxon.name} · ${taxon.rank}`}</option>)}</select></label>
        <div className="ancestor-trail">{path.slice(-3).map((taxon) => <button key={taxon.id} onClick={() => navigate(taxon.id)} aria-current={taxon.id === focus.id ? "page" : undefined}>{taxon.name}</button>)}</div>
      </nav>
      <div className="view-toolbar"><div className="view-tabs" aria-label="Visualization">{experiments.map((entry) => <button key={entry.id} onClick={() => update({ viewId: entry.id })} aria-pressed={entry.id === state.viewId}>{entry.name}</button>)}</div><label className="width-control">Width <select aria-label="Block width" value={state.widthMode} onChange={(event) => update({ widthMode: event.target.value === "visible" ? "visible" : "leaves" })}><option value="leaves">Loaded leaves</option><option value="visible">Visible branches</option></select></label><label className="depth-control">Depth <select value={state.depth} onChange={(event) => update({ depth: Number(event.target.value), page: 0 })}>{[1,2,3,4,5].map((depth) => <option key={depth} value={depth}>{depth}</option>)}</select></label></div>
      <div className="map-context"><p className="map-caption">{experiment.description}</p><label className="shown-picker"><select aria-label="Go to shown taxon" value="" onChange={(event) => navigate(event.target.value)}><option value="" disabled>Go to shown taxon…</option>{viewport.visible.filter((entry) => entry.depth > 0).map(({ taxon }) => <option key={taxon.id} value={taxon.id}>{taxon.name} · {taxon.rank} · {loadedLeafCount(taxon.id).toLocaleString()} loaded leaves</option>)}</select></label></div>
      <div className="map-viewport" ref={mapRef}><View focus={focus} window={viewport} depth={effectiveDepth} onNavigate={navigate} />{!children(focus.id).length && <p className="terminal-note">{focus.sourceChildCount ? `Subset boundary: ${focus.sourceChildCount.toLocaleString()} source children are not loaded. Go up to explore relatives.` : "No children in the source release. Go up to explore relatives."}</p>}</div>
      <div className="paging"><div className="page-controls"><button disabled={viewport.page === 0} onClick={() => update({ page: viewport.page - 1 })} aria-label="Previous branches">←</button><label className="page-jump">Page <input key={`${focus.id}-${viewport.page}-${viewport.pages}`} type="number" min={1} max={viewport.pages} defaultValue={viewport.page + 1} aria-label="Go to branch page" onKeyDown={(event) => { if (event.key === "Enter") event.currentTarget.blur(); }} onBlur={(event) => { const value = Number(event.currentTarget.value); if (Number.isFinite(value) && value >= 1 && value <= viewport.pages && Math.floor(value) - 1 !== viewport.page) update({ page: Math.floor(value) - 1 }); else event.currentTarget.value = String(viewport.page + 1); }} /> / {viewport.pages.toLocaleString()}</label><button disabled={viewport.page + 1 >= viewport.pages} onClick={() => update({ page: viewport.page + 1 })} aria-label="Next branches">→</button></div><span className="window-status">{viewport.start + 1}–{viewport.end} of {viewport.columns.toLocaleString()} branches · {effectiveDepth} levels{effectiveDepth < state.depth ? " (fits screen)" : ""}</span></div>
      <p className="workspace-note">{focus.sourceChildCount !== undefined && focus.sourceChildCount > children(focus.id).length ? `${(focus.sourceChildCount - children(focus.id).length).toLocaleString()} direct source children excluded by subset rules. ` : ""}Larger loaded branches first. Click a taxon to go there. {state.widthMode === "leaves" ? "Width uses full loaded-subtree leaves, normalized on this page." : "Width uses equal visible frontier branches on this page."} Loaded leaves include subset boundaries, not biodiversity.</p>
    </main>{showSource && <TaxonDetails onClose={() => setShowSource(false)} />}
  </div>;
}
