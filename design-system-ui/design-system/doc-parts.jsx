// doc-parts.jsx — chrome for the spec-sheet document layout.
// Distinct from primitives.jsx because these aren't reusable UI atoms — they're
// the editorial scaffolding (cover block, section anchors, monospace metadata
// stamps, swatch grids, type specimens). Splitting keeps both files readable.

const __DOC_STYLES = `
  /* ── PAGE SHELL ─────────────────────────────────────────── */
  .doc {
    display: grid;
    grid-template-columns: 232px minmax(0, 1fr);
    min-height: 100vh;
  }
  .doc-side {
    position: sticky; top: 0; height: 100vh;
    border-right: 1px solid var(--border);
    background: var(--bg-sub);
    padding: 28px 22px;
    overflow-y: auto;
    display: flex; flex-direction: column;
    gap: 28px;
  }
  .doc-side h6 {
    font-family: var(--font-mono);
    font-size: 10.5px;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--ink-4);
    margin-bottom: 8px;
  }
  .doc-side nav { display: flex; flex-direction: column; gap: 2px; }
  .doc-side a {
    display: flex; align-items: baseline; gap: 10px;
    padding: 7px 8px;
    border-radius: var(--r-sm);
    color: var(--ink-2);
    text-decoration: none;
    font-size: var(--t-13);
    line-height: 1.35;
    cursor: pointer;
    transition: background 120ms ease, color 120ms ease;
  }
  .doc-side a span.idx {
    font-family: var(--font-mono);
    font-size: 10.5px;
    color: var(--ink-4);
    letter-spacing: 0.05em;
    min-width: 22px;
  }
  .doc-side a:hover { background: var(--bg); color: var(--ink-1); }
  .doc-side a.on { background: var(--surface); color: var(--ink-1); box-shadow: var(--shadow-1); }
  .doc-side a.on span.idx { color: var(--primary-soft-fg); }

  .doc-main { min-width: 0; padding: 0 56px 96px; }

  /* ── COVER ──────────────────────────────────────────────── */
  .doc-cover {
    padding: 88px 0 64px;
    border-bottom: 1px solid var(--border);
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    align-items: end;
    gap: 64px;
  }
  .doc-cover h1 {
    font-size: clamp(56px, 8vw, 116px);
    line-height: 0.92;
    letter-spacing: -0.035em;
    font-weight: 500;
    color: var(--ink-1);
  }
  .doc-cover h1 em {
    font-family: "Instrument Serif", Georgia, serif;
    font-style: italic;
    font-weight: 400;
    color: var(--primary-soft-fg);
    letter-spacing: -0.02em;
  }
  .doc-cover .sub {
    margin-top: 24px;
    font-size: var(--t-18);
    color: var(--ink-3);
    line-height: 1.45;
    max-width: 56ch;
  }
  .doc-cover .meta {
    display: grid;
    grid-template-columns: max-content max-content;
    row-gap: 8px;
    column-gap: 28px;
    font-family: var(--font-mono);
    font-size: 11px;
    color: var(--ink-3);
    text-transform: uppercase;
    letter-spacing: 0.06em;
    line-height: 1.3;
    border-left: 1px solid var(--border);
    padding-left: 24px;
    align-content: end;
  }
  .doc-cover .meta dt { color: var(--ink-4); }
  .doc-cover .meta dd { color: var(--ink-1); margin: 0; }

  /* ── SECTION ────────────────────────────────────────────── */
  .doc-sec { padding: 80px 0 24px; scroll-margin-top: 24px; }
  .doc-sec:first-child { padding-top: 64px; }
  .doc-sec-hd {
    display: grid;
    grid-template-columns: 88px minmax(0, 1fr);
    gap: 24px;
    align-items: baseline;
    padding-bottom: 28px;
    border-bottom: 1px solid var(--border);
    margin-bottom: 40px;
  }
  .doc-sec-hd .num {
    font-family: var(--font-mono);
    font-size: 11px;
    color: var(--ink-4);
    text-transform: uppercase;
    letter-spacing: 0.1em;
    padding-top: 12px;
  }
  .doc-sec-hd h2 {
    font-size: clamp(36px, 4vw, 56px);
    letter-spacing: -0.025em;
    line-height: 1;
  }
  .doc-sec-hd .lede {
    margin-top: 14px;
    color: var(--ink-3);
    font-size: var(--t-16);
    max-width: 64ch;
    line-height: 1.55;
  }

  .doc-sub {
    display: grid;
    grid-template-columns: 88px minmax(0, 1fr);
    gap: 24px;
    padding: 32px 0 20px;
  }
  .doc-sub > .lbl {
    font-family: var(--font-mono);
    font-size: 11px;
    color: var(--ink-4);
    text-transform: uppercase;
    letter-spacing: 0.08em;
    padding-top: 4px;
  }
  .doc-sub > .body { display: flex; flex-direction: column; gap: 16px; }
  .doc-sub h3 { font-size: var(--t-24); letter-spacing: -0.015em; }
  .doc-sub .caption { color: var(--ink-3); font-size: var(--t-14); max-width: 60ch; line-height: 1.55; }

  /* ── DEMO PLATES (the boxed examples) ───────────────────── */
  .demo {
    border: 1px solid var(--border);
    border-radius: var(--r-lg);
    background: var(--surface);
    padding: 28px;
    display: flex; flex-wrap: wrap; gap: 14px;
    align-items: center;
  }
  .demo[data-bg="sub"] { background: var(--bg-sub); }
  .demo[data-grid="1"] {
    display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 16px; align-items: stretch;
  }
  .demo[data-stack="1"] { flex-direction: column; align-items: stretch; }
  .demo-row {
    display: flex; align-items: center; gap: 12px; flex-wrap: wrap;
  }
  .demo-cap {
    font-family: var(--font-mono);
    font-size: 10.5px;
    color: var(--ink-4);
    text-transform: uppercase;
    letter-spacing: 0.08em;
    margin-bottom: 10px;
  }
  .demo-cap span { color: var(--ink-2); }
  .demo-strip {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 0;
    border: 1px solid var(--border);
    border-radius: var(--r-lg);
    overflow: hidden;
    background: var(--surface);
  }
  .demo-strip > * {
    padding: 22px;
    border-right: 1px solid var(--border);
    border-bottom: 1px solid var(--border);
    display: flex; flex-direction: column; gap: 10px;
    background: var(--surface);
  }
  .demo-strip > *:last-child { border-right: 0; }

  /* ── COLOR SWATCHES ─────────────────────────────────────── */
  .swatch-row {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
    gap: 0;
    border-radius: var(--r-lg);
    overflow: hidden;
    border: 1px solid var(--border);
  }
  .sw {
    aspect-ratio: 1.2/1;
    padding: 12px 14px;
    display: flex; flex-direction: column; justify-content: space-between;
    font-family: var(--font-mono);
    font-size: 10.5px;
    line-height: 1.3;
  }
  .sw .top { display: flex; justify-content: space-between; gap: 6px; }
  .sw .top span { opacity: 0.85; }
  .sw .bot { font-size: 10px; opacity: 0.75; }

  /* ── TYPE SPECIMEN ──────────────────────────────────────── */
  .type-line {
    display: grid;
    grid-template-columns: 88px minmax(0, 1fr) auto;
    gap: 24px;
    align-items: baseline;
    padding: 18px 0;
    border-bottom: 1px solid var(--border);
  }
  .type-line:last-child { border-bottom: 0; }
  .type-line .lbl {
    font-family: var(--font-mono);
    font-size: 10.5px;
    color: var(--ink-4);
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }
  .type-line .spec {
    font-family: var(--font-mono);
    font-size: 10.5px;
    color: var(--ink-3);
    text-align: right;
    white-space: nowrap;
  }
  .type-line .sample { color: var(--ink-1); overflow: hidden; }

  /* ── TOKEN ROW ──────────────────────────────────────────── */
  .tokens {
    display: grid; grid-template-columns: 1fr;
    border: 1px solid var(--border);
    border-radius: var(--r-lg);
    overflow: hidden;
    background: var(--surface);
  }
  .tokens .row {
    display: grid;
    grid-template-columns: 1fr 1fr auto;
    gap: 16px;
    padding: 14px 20px;
    border-bottom: 1px solid var(--border);
    align-items: center;
    font-size: var(--t-14);
  }
  .tokens .row:last-child { border-bottom: 0; }
  .tokens .row .k { font-family: var(--font-mono); font-size: 12px; color: var(--ink-2); }
  .tokens .row .v { color: var(--ink-3); font-family: var(--font-mono); font-size: 12px; }
  .tokens .row .x { color: var(--ink-3); justify-self: end; }

  /* ── KEYVALUE STAMP ─────────────────────────────────────── */
  .stamp {
    display: inline-flex; align-items: center; gap: 8px;
    font-family: var(--font-mono);
    font-size: 10.5px;
    color: var(--ink-3);
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }
  .stamp::before {
    content: ""; width: 6px; height: 6px; background: var(--primary); border-radius: 50%;
  }

  /* ── SHADOW DEMOS ───────────────────────────────────────── */
  .shadow-tile {
    background: var(--surface);
    border-radius: var(--r-lg);
    aspect-ratio: 1.6/1;
    display: flex; align-items: center; justify-content: center;
    color: var(--ink-3);
    font-family: var(--font-mono);
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }

  /* ── SPACING / RADIUS BARS ──────────────────────────────── */
  .spacing-bar {
    display: flex; align-items: center; gap: 18px;
    padding: 8px 0;
  }
  .spacing-bar .name {
    font-family: var(--font-mono);
    font-size: 11px;
    color: var(--ink-3);
    width: 64px;
  }
  .spacing-bar .size {
    font-family: var(--font-mono);
    font-size: 11px;
    color: var(--ink-4);
    width: 40px;
    text-align: right;
  }
  .spacing-bar .bar {
    height: 14px;
    background: var(--primary-soft);
    border-left: 2px solid var(--primary);
    border-right: 2px solid var(--primary);
  }
  .radius-tile {
    width: 100%;
    aspect-ratio: 1.2/1;
    background: var(--primary-soft);
    border: 1px solid var(--primary);
    display: flex; align-items: center; justify-content: center;
    font-family: var(--font-mono);
    font-size: 11px;
    color: var(--primary-soft-fg);
  }

  /* ── MOCK SHELL (for example screen) ────────────────────── */
  .shell {
    border: 1px solid var(--border);
    border-radius: var(--r-lg);
    overflow: hidden;
    background: var(--surface);
    display: grid;
    grid-template-columns: var(--rail-w, 220px) minmax(0, 1fr);
    min-height: 540px;
  }
  .shell[data-sidebar="rail"] { --rail-w: 64px; }
  .shell[data-sidebar="collapsed"] { --rail-w: 0; }
  .shell-side {
    background: var(--bg-sub);
    border-right: 1px solid var(--border);
    padding: 16px 12px;
    display: flex; flex-direction: column; gap: 4px;
    font-size: var(--t-14);
    overflow: hidden;
  }
  .shell[data-sidebar="collapsed"] .shell-side { display: none; }
  .shell-brand {
    display: flex; align-items: center; gap: 8px;
    padding: 6px 8px 14px;
    margin-bottom: 8px;
    border-bottom: 1px solid var(--border);
  }
  .shell-brand .mark {
    width: 24px; height: 24px;
    background: var(--primary);
    border-radius: var(--r-sm);
    display: flex; align-items: center; justify-content: center;
    color: var(--on-primary); font-weight: 700; font-size: 13px;
    font-family: var(--font-display);
  }
  .shell-brand b { font-family: var(--font-display); font-weight: 600; font-size: var(--t-14); }
  .shell[data-sidebar="rail"] .shell-brand b,
  .shell[data-sidebar="rail"] .shell-nav span { display: none; }
  .shell[data-sidebar="rail"] .shell-nav a { justify-content: center; padding: 8px; }
  .shell[data-sidebar="rail"] .shell-side { padding: 16px 8px; align-items: center; }
  .shell-nav { display: flex; flex-direction: column; gap: 1px; }
  .shell-section-lbl {
    font-family: var(--font-mono);
    font-size: 10px;
    color: var(--ink-4);
    text-transform: uppercase;
    letter-spacing: 0.08em;
    padding: 14px 8px 6px;
  }
  .shell-nav a {
    display: flex; align-items: center; gap: 10px;
    padding: 7px 8px;
    border-radius: var(--r-sm);
    color: var(--ink-2);
    text-decoration: none;
    cursor: pointer;
  }
  .shell-nav a:hover { background: var(--surface-sub); color: var(--ink-1); }
  .shell-nav a.on {
    background: var(--surface); color: var(--ink-1);
    box-shadow: var(--shadow-1);
  }
  .shell-nav a.on .sr-ic { color: var(--primary); }

  .shell-main { display: flex; flex-direction: column; min-width: 0; }
  .shell-topbar {
    display: flex; align-items: center; gap: 12px;
    padding: 12px 20px;
    border-bottom: 1px solid var(--border);
    background: var(--surface);
  }
  .shell-topbar .crumb {
    font-family: var(--font-mono);
    font-size: 11px;
    color: var(--ink-4);
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }
  .shell-topbar .crumb b { color: var(--ink-2); font-weight: 500; }
  .shell-body { padding: 24px; display: flex; flex-direction: column; gap: 20px; overflow: hidden; }

  /* ── EMPTY STATE ────────────────────────────────────────── */
  .es {
    text-align: center;
    padding: 56px 24px;
    border: 1px dashed var(--border-strong);
    border-radius: var(--r-lg);
    background: var(--surface-sub);
    display: flex; flex-direction: column; align-items: center; gap: 14px;
  }
  .es-glyph {
    width: 56px; height: 56px;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--r-md);
    display: flex; align-items: center; justify-content: center;
    color: var(--ink-3);
    box-shadow: var(--shadow-1);
  }
  .es h4 { font-size: var(--t-18); font-family: var(--font-display); font-weight: 500; }
  .es p { color: var(--ink-3); font-size: var(--t-14); max-width: 44ch; line-height: 1.55; }
  .es-actions { display: flex; gap: 8px; }

  /* ── STAT CARD ──────────────────────────────────────────── */
  .stat {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--r-lg);
    padding: 18px 20px;
    display: flex; flex-direction: column; gap: 10px;
  }
  .stat .lbl {
    font-family: var(--font-mono);
    font-size: 10.5px;
    color: var(--ink-3);
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }
  .stat .val {
    font-family: var(--font-display);
    font-weight: 500;
    font-size: 36px;
    line-height: 1;
    letter-spacing: -0.02em;
    color: var(--ink-1);
    display: flex; align-items: baseline; gap: 8px;
  }
  .stat .val small {
    font-family: var(--font-mono);
    font-size: 11px;
    font-weight: 500;
    color: var(--success);
    display: inline-flex; align-items: center; gap: 2px;
    background: var(--success-soft);
    padding: 2px 6px;
    border-radius: var(--r-sm);
  }
  .stat .val small.down { color: var(--danger); background: var(--danger-soft); }

  /* ── COURSE CARD ────────────────────────────────────────── */
  .course-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--r-lg);
    overflow: hidden;
    display: flex; flex-direction: column;
    transition: border-color 160ms ease, transform 160ms ease, box-shadow 160ms ease;
  }
  .course-card:hover {
    border-color: var(--border-strong);
    transform: translateY(-1px);
    box-shadow: var(--shadow-2);
  }
  .course-thumb {
    aspect-ratio: 16/9;
    background:
      linear-gradient(135deg, var(--primary-soft) 0%, var(--bg-sub) 100%);
    position: relative;
    overflow: hidden;
  }
  .course-thumb::after {
    content: ""; position: absolute; inset: 0;
    background-image: repeating-linear-gradient(
      45deg, transparent 0 11px,
      oklch(0 0 0 / 0.025) 11px 12px
    );
  }
  .course-thumb .placeholder {
    position: absolute; inset: 0;
    display: flex; align-items: center; justify-content: center;
    font-family: var(--font-mono);
    font-size: 10.5px;
    color: var(--primary-soft-fg);
    text-transform: uppercase;
    letter-spacing: 0.08em;
    opacity: 0.6;
  }
  .course-body { padding: 14px 16px 16px; display: flex; flex-direction: column; gap: 8px; }
  .course-body .cat {
    font-family: var(--font-mono);
    font-size: 10.5px;
    color: var(--ink-3);
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }
  .course-body h4 {
    font-family: var(--font-display);
    font-weight: 500;
    font-size: var(--t-16);
    letter-spacing: -0.005em;
    line-height: 1.25;
  }
  .course-body .row {
    display: flex; align-items: center; justify-content: space-between;
    color: var(--ink-3); font-size: var(--t-12);
    margin-top: 4px;
  }
  .progress {
    height: 4px; background: var(--bg-sub); border-radius: var(--r-pill); overflow: hidden;
  }
  .progress > i { display: block; height: 100%; background: var(--primary); }
`;

// ── PIECES ──────────────────────────────────────────────────

function SectionHeader({ num, title, lede, id }) {
  return (
    <header className="doc-sec-hd" id={id}>
      <div className="num">§ {num}</div>
      <div>
        <h2>{title}</h2>
        {lede && <p className="lede">{lede}</p>}
      </div>
    </header>
  );
}

function SubSection({ label, children }) {
  return (
    <div className="doc-sub">
      <div className="lbl">{label}</div>
      <div className="body">{children}</div>
    </div>
  );
}

function Demo({ children, bg, grid, stack, style }) {
  return (
    <div className="demo"
         data-bg={bg ? "sub" : undefined}
         data-grid={grid ? "1" : undefined}
         data-stack={stack ? "1" : undefined}
         style={style}>
      {children}
    </div>
  );
}

function DemoCap({ children, value }) {
  return (
    <div className="demo-cap">
      {children}
      {value && <> · <span>{value}</span></>}
    </div>
  );
}

function Swatch({ name, value, fg, scale, css }) {
  return (
    <div className="sw" style={{ background: value, color: fg || "white" }}>
      <div className="top"><span>{name}</span><span>{scale}</span></div>
      <div className="bot">{css}</div>
    </div>
  );
}

function TypeLine({ label, spec, sample, sampleStyle }) {
  return (
    <div className="type-line">
      <div className="lbl">{label}</div>
      <div className="sample" style={sampleStyle}>{sample}</div>
      <div className="spec">{spec}</div>
    </div>
  );
}

function Tokens({ rows }) {
  return (
    <div className="tokens">
      {rows.map((r, i) => (
        <div className="row" key={i}>
          <div className="k">{r.k}</div>
          <div className="v">{r.v}</div>
          <div className="x">{r.x}</div>
        </div>
      ))}
    </div>
  );
}

function Stamp({ children }) { return <div className="stamp">{children}</div>; }

(function () {
  const s = document.createElement("style");
  s.id = "sr-doc-parts";
  s.textContent = __DOC_STYLES;
  document.head.appendChild(s);
})();

Object.assign(window, {
  SectionHeader, SubSection, Demo, DemoCap, Swatch, TypeLine, Tokens, Stamp,
});
