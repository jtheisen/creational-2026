import { useState } from "react";
import { provenance, taxa } from "./domain/taxonomy";
export function TaxonDetails({ onClose }: { onClose: () => void }) {
  const [page, setPage] = useState(0);
  const sections = [
    <><p>{String(provenance.source)}</p><dl><dt>Release</dt><dd>{String(provenance.release ?? "Editorial fixture; no source release")}</dd><dt>Loaded taxa</dt><dd>{taxa.length.toLocaleString()}</dd><dt>Source taxa</dt><dd>{typeof provenance.sourceTaxonCount === "number" ? provenance.sourceTaxonCount.toLocaleString() : "No source dataset integrated"}</dd></dl><p className="muted">Counts in this browser refer to the loaded subset.</p></>,
    <><h3>Selection</h3><p>{String(provenance.selection)}</p><p>Every displayed parent–child link is retained from the source. No intermediate ancestors are removed.</p></>,
    <><h3>Source limits</h3><p>{String(provenance.limitations ?? "This is an illustrative fixture, not source data.")}</p><p className="muted">The end of a loaded branch does not always mean the end of the source branch.</p></>,
    <><h3>Stable source identities</h3><p>{String(provenance.ids)}</p>{typeof provenance.sourceUrl === "string" && <a href={provenance.sourceUrl} target="_blank" rel="noreferrer">Download source release ↗</a>}<p className="muted">Source checksum and selection rules are stored with the dataset for reproduction.</p></>,
  ];
  return <div className="source-backdrop" onClick={onClose}><section className="source-dialog" role="dialog" aria-modal="true" aria-labelledby="source-title" onClick={(event) => event.stopPropagation()} onKeyDown={(event) => {
    if (event.key !== "Tab") return;
    const buttons = Array.from(event.currentTarget.querySelectorAll<HTMLElement>('button:not(:disabled),a'));
    const first = buttons[0], last = buttons[buttons.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  }}>
    <div className="dialog-heading"><h2 id="source-title">What is loaded?</h2><button onClick={onClose} autoFocus aria-label="Close source details">×</button></div>
    <div className="source-page">{sections[page]}</div>
    <div className="page-controls"><button disabled={page === 0} onClick={() => setPage(page - 1)} aria-label="Previous source information">←</button><span>{page + 1} / {sections.length}</span><button disabled={page === sections.length - 1} onClick={() => setPage(page + 1)} aria-label="Next source information">→</button></div>
  </section></div>;
}
