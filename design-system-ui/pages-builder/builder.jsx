// builder.jsx — /admin/pages/edit/[id] visual page builder.
// Topbar + Palette/Layers (left) + Canvas (center) + Inspector (right).

const __BLD_CSS = `
  .bld { height: 100vh; display: grid; grid-template-rows: 56px 1fr; background: var(--bg); overflow: hidden; }

  /* ── TOP BAR ─────────────────────────────────────── */
  .bld-top {
    display: flex; align-items: center; gap: 12px;
    padding: 0 16px;
    border-bottom: 1px solid var(--border);
    background: var(--surface);
  }
  .bld-top .brand {
    display: flex; align-items: center; gap: 8px;
    padding-right: 14px; margin-right: 4px;
    border-right: 1px solid var(--border);
    height: 32px;
  }
  .bld-top .brand .mark {
    width: 24px; height: 24px; border-radius: var(--r-sm);
    background: var(--primary); color: var(--on-primary);
    display: flex; align-items: center; justify-content: center;
    font-family: var(--font-display); font-weight: 700; font-size: 13px;
  }
  .bld-top .crumbs {
    display: flex; align-items: center; gap: 8px;
    color: var(--ink-3); font-size: var(--t-13);
    flex-shrink: 0;
  }
  .bld-top .crumbs a { color: var(--ink-3); cursor: pointer; text-decoration: none; }
  .bld-top .crumbs a:hover { color: var(--ink-1); }
  .bld-top .title-input {
    appearance: none; border: 0; background: transparent;
    font-family: var(--font-display); font-weight: 600;
    font-size: var(--t-15); color: var(--ink-1);
    padding: 4px 8px; border-radius: var(--r-sm);
    width: auto; min-width: 120px; max-width: 280px;
    transition: background 120ms ease;
  }
  .bld-top .title-input:hover { background: var(--bg-sub); }
  .bld-top .title-input:focus { outline: none; background: var(--bg-sub); box-shadow: 0 0 0 1.5px var(--primary); }
  .bld-top .slug-pill {
    display: inline-flex; align-items: center; gap: 6px;
    height: 24px; padding: 0 10px;
    border-radius: var(--r-pill);
    background: var(--bg-sub);
    color: var(--ink-3);
    font-family: var(--font-mono); font-size: 11px;
    letter-spacing: 0.02em;
  }

  .bld-save {
    display: inline-flex; align-items: center; gap: 6px;
    height: 26px; padding: 0 10px;
    border-radius: var(--r-pill);
    background: var(--bg-sub); color: var(--ink-3);
    font-family: var(--font-mono); font-size: 10.5px;
    text-transform: uppercase; letter-spacing: 0.06em;
  }
  .bld-save[data-st="saving"] { color: var(--info); background: var(--info-soft); }
  .bld-save[data-st="saved"]  { color: var(--success); background: var(--success-soft); }
  .bld-save .dot { width: 6px; height: 6px; border-radius: 50%; background: currentColor; }
  .bld-save[data-st="saving"] .dot { animation: bld-pulse 1s ease-in-out infinite; }
  @keyframes bld-pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }

  .bld-device {
    display: inline-flex; padding: 3px; background: var(--bg-sub);
    border-radius: var(--r-md);
  }
  .bld-device button {
    appearance: none; border: 0; background: transparent;
    width: 30px; height: 24px;
    border-radius: 6px;
    color: var(--ink-3); cursor: pointer;
    display: inline-flex; align-items: center; justify-content: center;
  }
  .bld-device button.on { background: var(--surface); color: var(--ink-1); box-shadow: var(--shadow-1); }

  /* ── BODY 3-PANE ────────────────────────────────── */
  .bld-body {
    display: grid;
    grid-template-columns: 280px minmax(0, 1fr) var(--insp-w, 340px);
    min-height: 0;
  }
  .bld[data-insp="bottom"] .bld-body { grid-template-columns: 280px minmax(0, 1fr); }

  /* ── LEFT RAIL ───────────────────────────────────── */
  .bld-left {
    background: var(--bg-sub);
    border-right: 1px solid var(--border);
    display: flex; flex-direction: column;
    min-width: 0;
  }
  .bld-left .lhead {
    display: flex;
    padding: 8px 8px 0;
  }
  .bld-left .lhead button {
    appearance: none; border: 0; background: transparent;
    padding: 8px 10px;
    font-family: inherit; font-size: var(--t-13); font-weight: 500;
    color: var(--ink-3); cursor: pointer;
    border-bottom: 2px solid transparent;
    display: inline-flex; align-items: center; gap: 6px;
  }
  .bld-left .lhead button.on { color: var(--ink-1); border-bottom-color: var(--primary); }
  .bld-left .lhead button .count {
    background: var(--bg); color: var(--ink-4);
    padding: 1px 6px; border-radius: var(--r-pill);
    font-size: 10px; font-family: var(--font-mono);
  }
  .bld-left .lhead button.on .count { background: var(--primary-soft); color: var(--primary-soft-fg); }

  .bld-left .lbody { flex: 1; min-height: 0; overflow-y: auto; padding: 8px 10px 32px; }
  .bld-left .lsearch { padding: 6px 0; }

  /* Palette */
  .pal-group { margin-top: 14px; }
  .pal-group:first-child { margin-top: 6px; }
  .pal-group-lbl {
    font-family: var(--font-mono); font-size: 10px;
    color: var(--ink-4); text-transform: uppercase; letter-spacing: 0.08em;
    padding: 4px 4px 8px;
  }
  .pal-grid {
    display: grid; grid-template-columns: 1fr 1fr; gap: 6px;
  }
  .pal-tile {
    appearance: none; border: 1px solid var(--border);
    background: var(--surface);
    border-radius: var(--r-md);
    padding: 10px 10px 10px 12px;
    cursor: grab;
    display: flex; flex-direction: column; gap: 6px; align-items: flex-start;
    font-family: inherit; color: inherit; text-align: left;
    transition: border-color 120ms ease, transform 80ms ease, box-shadow 120ms ease;
    position: relative;
    user-select: none;
  }
  .pal-tile:hover {
    border-color: var(--primary);
    box-shadow: var(--shadow-2);
    transform: translateY(-1px);
  }
  .pal-tile:active { cursor: grabbing; }
  .pal-tile .ic {
    width: 24px; height: 24px;
    border-radius: var(--r-sm);
    background: var(--primary-soft);
    color: var(--primary-soft-fg);
    display: flex; align-items: center; justify-content: center;
    font-family: var(--font-display);
    font-weight: 700; font-size: 13px;
  }
  .pal-tile .name { font-weight: 500; font-size: var(--t-13); color: var(--ink-1); }
  .pal-tile .desc { color: var(--ink-3); font-size: 11px; line-height: 1.35; }
  .pal-tile .new {
    position: absolute; top: 8px; right: 8px;
    font-family: var(--font-mono); font-size: 9px;
    background: var(--success); color: white;
    padding: 1px 5px; border-radius: var(--r-pill);
    text-transform: uppercase; letter-spacing: 0.06em;
  }

  /* Layers */
  .layer-row {
    display: flex; align-items: center; gap: 4px;
    padding: 4px 6px;
    border-radius: var(--r-sm);
    cursor: pointer;
    color: var(--ink-2);
    font-size: 12.5px;
    user-select: none;
  }
  .layer-row:hover { background: var(--surface); color: var(--ink-1); }
  .layer-row.on { background: var(--surface); color: var(--ink-1); box-shadow: var(--shadow-1); }
  .layer-row .ic { color: var(--ink-4); flex-shrink: 0; }
  .layer-row.on .ic { color: var(--primary); }
  .layer-row .name { flex: 1; min-width: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .layer-row .grip { opacity: 0; color: var(--ink-4); cursor: grab; }
  .layer-row:hover .grip { opacity: 1; }

  /* ── CANVAS ──────────────────────────────────────── */
  .bld-canvas-wrap {
    background:
      radial-gradient(circle at 50% 0%, var(--surface-sub) 0%, var(--bg) 65%);
    overflow: auto;
    position: relative;
    display: flex; flex-direction: column; align-items: center;
    padding: 32px 32px 64px;
  }
  .bld-canvas-wrap .ruler {
    width: 100%; max-width: 1200px;
    display: flex; align-items: center; gap: 12px;
    margin-bottom: 16px;
    font-family: var(--font-mono); font-size: 10.5px;
    color: var(--ink-4); text-transform: uppercase; letter-spacing: 0.08em;
  }
  .bld-canvas-wrap .ruler > * { flex-shrink: 0; }
  .bld-canvas-wrap .ruler hr {
    flex: 1; border: 0; border-top: 1px dashed var(--border-strong);
  }

  /* Device frame */
  .canvas-frame {
    --w: 1200px;
    width: var(--w); max-width: 100%;
    background: var(--surface);
    border-radius: var(--r-lg);
    box-shadow: var(--shadow-3);
    overflow: hidden;
    border: 1px solid var(--border);
    transition: width 220ms cubic-bezier(.3,.7,.4,1);
  }
  .canvas-frame[data-device="tablet"]  { --w: 820px; }
  .canvas-frame[data-device="mobile"]  { --w: 400px; }

  /* Block wrapper — selection + hover chrome */
  .blk {
    position: relative;
    outline: 1px dashed transparent;
    outline-offset: -1px;
    transition: outline-color 120ms ease;
  }
  .blk:hover { outline-color: var(--primary-soft-fg); }
  .blk.sel { outline: 2px solid var(--primary); outline-offset: -2px; }
  .blk.sel > .blk-chrome { display: flex; }

  .blk-chrome {
    display: none;
    position: absolute;
    top: -28px; right: -2px;
    background: var(--ink-1);
    color: var(--bg);
    height: 26px; padding: 0 4px;
    border-radius: var(--r-sm);
    align-items: center; gap: 2px;
    z-index: 4;
    box-shadow: var(--shadow-2);
  }
  .blk-chrome .lbl {
    font-family: var(--font-mono); font-size: 10px;
    text-transform: uppercase; letter-spacing: 0.06em;
    padding: 0 8px;
    color: var(--bg);
  }
  .blk-chrome button {
    appearance: none; border: 0; background: transparent;
    width: 22px; height: 22px;
    border-radius: 4px;
    color: var(--ink-5); cursor: pointer;
    display: inline-flex; align-items: center; justify-content: center;
  }
  .blk-chrome button:hover { background: rgba(255,255,255,.1); color: white; }
  .blk-chrome .ai { color: var(--warning); }

  /* Drop zone between blocks */
  .drop {
    height: 8px;
    margin: 0;
    position: relative;
  }
  .drop::after {
    content: '';
    position: absolute; left: 8px; right: 8px; top: 50%;
    transform: translateY(-50%);
    height: 0;
    background: var(--primary);
    border-radius: 2px;
    transition: height 120ms ease;
  }
  .drop:hover::after { height: 3px; }

  /* ── BLOCK RENDERERS ─────────────────────────────── */
  .b-hero {
    padding: 56px 48px;
    background: linear-gradient(135deg, var(--primary-soft) 0%, var(--surface-sub) 100%);
    position: relative;
  }
  .b-hero::after {
    content: ''; position: absolute; inset: 0;
    background-image: repeating-linear-gradient(45deg, transparent 0 11px, oklch(0 0 0 / 0.025) 11px 12px);
    pointer-events: none;
  }
  .b-hero .eyebrow {
    font-family: var(--font-mono); font-size: 11px;
    color: var(--primary-soft-fg); text-transform: uppercase; letter-spacing: 0.08em;
    position: relative;
  }
  .b-hero h1 { font-size: 44px; margin-top: 10px; letter-spacing: -0.025em; position: relative; line-height: 1.05; }
  .b-hero p { color: var(--ink-2); margin-top: 12px; max-width: 60ch; font-size: var(--t-16); position: relative; line-height: 1.55; }
  .b-hero .ctas { display: flex; gap: 10px; margin-top: 20px; position: relative; }
  .b-hero .ctas .btn {
    display: inline-flex; align-items: center; gap: 6px;
    height: 40px; padding: 0 16px; border-radius: var(--r-md);
    font: 500 14px var(--font-body); cursor: default;
    border: 0;
  }
  .b-hero .ctas .btn.primary { background: var(--primary); color: var(--on-primary); }
  .b-hero .ctas .btn.secondary { background: var(--surface); color: var(--ink-1); border: 1px solid var(--border-strong); }

  .b-container { padding: 32px 48px; background: var(--surface); }
  .b-heading h2 { font-size: 32px; letter-spacing: -0.02em; }
  .b-heading h3 { font-size: 24px; letter-spacing: -0.015em; }
  .b-heading.h1 h2 { font-size: 44px; }
  .b-text p { font-size: var(--t-15); line-height: 1.65; color: var(--ink-2); }
  .b-image {
    aspect-ratio: 16/9;
    background: linear-gradient(135deg, var(--primary-soft) 0%, var(--bg-sub) 100%);
    border-radius: var(--r-sm);
    position: relative; overflow: hidden;
    display: flex; align-items: center; justify-content: center;
    color: var(--primary-soft-fg);
    font-family: var(--font-mono); font-size: 11px;
    text-transform: uppercase; letter-spacing: 0.08em;
  }
  .b-image::after {
    content: ''; position: absolute; inset: 0;
    background-image: repeating-linear-gradient(45deg, transparent 0 11px, oklch(0 0 0 / 0.025) 11px 12px);
  }
  .b-image span { position: relative; z-index: 1; }
  .b-video {
    aspect-ratio: 16/9;
    background: var(--ink-1);
    border-radius: var(--r-sm);
    display: flex; align-items: center; justify-content: center;
    color: white; position: relative;
  }
  .b-video .play {
    width: 52px; height: 52px; border-radius: 50%;
    background: rgba(255,255,255,.15);
    display: flex; align-items: center; justify-content: center;
  }
  .b-button .btn {
    display: inline-flex; align-items: center; gap: 6px;
    height: 40px; padding: 0 18px;
    background: var(--primary); color: var(--on-primary);
    border-radius: var(--r-md);
    font: 500 14px var(--font-body); cursor: default; border: 0;
  }
  .b-divider hr { border: 0; border-top: 1px solid var(--border); margin: 8px 0; }
  .b-quote blockquote {
    border-left: 4px solid var(--primary);
    background: var(--surface-sub);
    padding: 16px 20px;
    border-radius: 0 var(--r-md) var(--r-md) 0;
    font-family: 'Instrument Serif', Georgia, serif;
    font-style: italic;
    font-size: 22px;
    color: var(--ink-1); line-height: 1.4;
  }
  .b-quote .author {
    font-family: var(--font-body); font-style: normal; font-size: 12px;
    color: var(--ink-3); margin-top: 8px;
    display: flex; align-items: center; gap: 6px;
  }
  .b-callout {
    display: flex; gap: 12px;
    padding: 14px 16px;
    border-radius: var(--r-md);
    background: var(--info-soft); color: var(--info);
  }
  .b-callout[data-tone="success"] { background: var(--success-soft); color: var(--success); }
  .b-callout[data-tone="warning"] { background: var(--warning-soft); color: oklch(0.45 0.13 70); }
  .b-callout[data-tone="danger"]  { background: var(--danger-soft);  color: var(--danger); }
  .b-callout .body { flex: 1; }
  .b-callout .body b { font-size: var(--t-14); display: block; margin-bottom: 4px; color: inherit; }
  .b-callout .body span { font-size: var(--t-13); opacity: 0.85; color: inherit; }
  .b-code pre {
    background: var(--ink-1); color: var(--bg);
    padding: 14px 16px; border-radius: var(--r-md);
    font-family: var(--font-mono); font-size: 12.5px;
    line-height: 1.55; overflow: auto;
    margin: 0;
  }
  .b-columns { display: grid; gap: 24px; padding: 0; }
  .b-columns.r-1-1 { grid-template-columns: 1fr 1fr; }
  .b-columns.r-1-2 { grid-template-columns: 1fr 2fr; }
  .b-grid {
    display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px;
  }
  .b-grid .card {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: var(--r-md); padding: 16px;
    display: flex; flex-direction: column; gap: 8px;
  }
  .b-grid .card .ic-tile {
    width: 32px; height: 32px; border-radius: var(--r-sm);
    background: var(--primary-soft); color: var(--primary-soft-fg);
    display: flex; align-items: center; justify-content: center;
  }
  .b-grid .card h4 { font-size: var(--t-15); font-family: var(--font-display); font-weight: 600; letter-spacing: -0.005em; }
  .b-grid .card p { color: var(--ink-3); font-size: 12.5px; line-height: 1.5; }
  .b-spacer { height: 32px; }
  .b-html, .b-embed {
    padding: 14px 16px;
    background: var(--surface-sub);
    border: 1px dashed var(--border-strong);
    border-radius: var(--r-md);
    color: var(--ink-3);
    font-family: var(--font-mono); font-size: 11.5px;
    text-align: center;
  }

  /* Inner container content padding (we control inner spacing here) */
  .blk + .blk { margin-top: 16px; }
  .b-container > .blk-inner { display: flex; flex-direction: column; gap: 16px; }

  /* ── RIGHT INSPECTOR ─────────────────────────────── */
  .bld-right {
    background: var(--surface);
    border-left: 1px solid var(--border);
    display: flex; flex-direction: column;
    min-width: 0;
  }
  .bld[data-insp="bottom"] .bld-right {
    position: fixed; bottom: 0; left: 280px; right: 0; top: auto;
    border-left: 0; border-top: 1px solid var(--border);
    height: 280px;
    z-index: 5;
    box-shadow: var(--shadow-3);
  }
  .insp-hd {
    display: flex; padding: 8px 12px 0;
    border-bottom: 1px solid var(--border);
  }
  .insp-hd button {
    appearance: none; border: 0; background: transparent;
    padding: 9px 12px;
    font-family: inherit; font-size: var(--t-13); font-weight: 500;
    color: var(--ink-3); cursor: pointer;
    border-bottom: 2px solid transparent;
    margin-bottom: -1px;
  }
  .insp-hd button.on { color: var(--ink-1); border-bottom-color: var(--primary); }
  .insp-bd { flex: 1; min-height: 0; overflow-y: auto; padding: 16px; display: flex; flex-direction: column; gap: 16px; }
  .insp-empty {
    padding: 64px 16px; text-align: center;
    color: var(--ink-4); font-size: var(--t-13);
  }
  .insp-empty .glyph {
    width: 44px; height: 44px; margin: 0 auto 12px;
    background: var(--bg-sub); border-radius: var(--r-md);
    display: flex; align-items: center; justify-content: center;
    color: var(--ink-3);
  }
  .insp-sec { display: flex; flex-direction: column; gap: 10px; }
  .insp-sec .lbl {
    font-family: var(--font-mono); font-size: 10px;
    color: var(--ink-4); text-transform: uppercase; letter-spacing: 0.08em;
  }

  .seg {
    display: flex; padding: 2px;
    background: var(--bg-sub); border-radius: var(--r-sm);
  }
  .seg button {
    appearance: none; border: 0; background: transparent;
    flex: 1; height: 26px; border-radius: calc(var(--r-sm) - 1px);
    font: 500 12px var(--font-body); color: var(--ink-3); cursor: pointer;
  }
  .seg button.on { background: var(--surface); color: var(--ink-1); box-shadow: var(--shadow-1); }

  .insp-meta-grid {
    display: grid; grid-template-columns: 1fr 1fr; gap: 10px;
  }

  /* Color picker row */
  .color-row {
    display: flex; gap: 6px;
    align-items: center;
  }
  .color-row .swatch {
    width: 22px; height: 22px;
    border-radius: var(--r-sm);
    border: 1px solid var(--border-strong);
    cursor: pointer;
  }
  .color-row .swatch[data-on="1"] { box-shadow: 0 0 0 2px var(--primary); }
`;

const { useState: _useState, useMemo: _useMemo } = React;

// Block icon resolver — palette uses these too.
function BlockIcon({ type, size = 14 }) {
  const map = {
    heading:   <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: size }}>H</span>,
    text:      <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: size }}>T</span>,
    image:     <Icon name="upload" size={size} />,
    video:     <Icon name="play" size={size} />,
    button:    <Icon name="arrowRight" size={size} />,
    divider:   <Icon name="minus" size={size} />,
    quote:     <span style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: size + 2, lineHeight: 1 }}>"</span>,
    callout:   <Icon name="alert" size={size} />,
    code:      <Icon name="code" size={size} />,
    html:      <span style={{ fontFamily: 'var(--font-mono)', fontSize: size - 3, fontWeight: 700 }}>{'</>'}</span>,
    container: <Icon name="folder" size={size} />,
    columns:   <Icon name="layers" size={size} />,
    hero:      <Icon name="spark" size={size} />,
    spacer:    <Icon name="minus" size={size} />,
    grid:      <Icon name="layers" size={size} />,
    embed:     <Icon name="external" size={size} />,
  };
  return map[type] || <Icon name="folder" size={size} />;
}

// Walk the tree to find a block by id
function findBlock(tree, id) {
  for (const b of tree) {
    if (b.id === id) return b;
    if (b.children) {
      const c = findBlock(b.children, id);
      if (c) return c;
    }
  }
  return null;
}

// ── Block renderer (recursive) ─────────────────────────
function RenderBlock({ block, selectedId, onSelect }) {
  const isSel = selectedId === block.id;
  const cls = 'blk' + (isSel ? ' sel' : '');
  const onClick = (e) => { e.stopPropagation(); onSelect(block.id); };

  let inner = null;
  switch (block.type) {
    case 'hero':
      inner = (
        <div className="b-hero">
          <div className="eyebrow">{block.props.eyebrow}</div>
          <h1>{block.props.title}</h1>
          <p>{block.props.subtitle}</p>
          <div className="ctas">
            <button className="btn primary">{block.props.cta1} <Icon name="arrowRight" size={14} /></button>
            <button className="btn secondary">{block.props.cta2}</button>
          </div>
        </div>
      );
      break;
    case 'container':
      inner = (
        <div className="b-container">
          <div className="blk-inner">
            {(block.children || []).map(c => (
              <RenderBlock key={c.id} block={c} selectedId={selectedId} onSelect={onSelect} />
            ))}
          </div>
        </div>
      );
      break;
    case 'heading':
      inner = (
        <div className={'b-heading ' + (block.props.level || 'h2')}>
          <h2>{block.props.text}</h2>
        </div>
      );
      break;
    case 'text':
      inner = <div className="b-text"><p>{block.props.text}</p></div>;
      break;
    case 'image':
      inner = <div className="b-image"><span>image · 16:9</span></div>;
      break;
    case 'video':
      inner = <div className="b-video"><div className="play"><Icon name="play" size={20} /></div></div>;
      break;
    case 'button':
      inner = <div className="b-button"><button className="btn">{block.props.label} <Icon name="arrowRight" size={14} /></button></div>;
      break;
    case 'divider':
      inner = <div className="b-divider"><hr /></div>;
      break;
    case 'quote':
      inner = (
        <div className="b-quote">
          <blockquote>
            {block.props.text}
            <div className="author">— {block.props.author}, <span style={{ color: 'var(--ink-4)' }}>{block.props.role}</span></div>
          </blockquote>
        </div>
      );
      break;
    case 'callout':
      inner = (
        <div className="b-callout" data-tone={block.props.tone}>
          <Icon name="info" size={18} style={{ marginTop: 1 }} />
          <div className="body">
            <b>{block.props.title}</b>
            <span>{block.props.body}</span>
          </div>
        </div>
      );
      break;
    case 'code':
      inner = <div className="b-code"><pre>{`function hello() {\n  return "World";\n}`}</pre></div>;
      break;
    case 'columns':
      inner = (
        <div className={'b-columns r-' + (block.props.ratio || '1-1').replace(':', '-')}>
          {(block.children || []).map(c => (
            <RenderBlock key={c.id} block={c} selectedId={selectedId} onSelect={onSelect} />
          ))}
        </div>
      );
      break;
    case 'grid':
      inner = (
        <div className="b-grid">
          {[1,2,3].map(i => (
            <div className="card" key={i}>
              <div className="ic-tile"><Icon name="book" size={15} /></div>
              <h4>Featured course {i}</h4>
              <p>Short description of the course or section. Lorem ipsum dolor sit amet, consectetur.</p>
            </div>
          ))}
        </div>
      );
      break;
    case 'spacer':
      inner = <div className="b-spacer" />;
      break;
    case 'html':
      inner = <div className="b-html">&lt;raw html · {(block.props.preview || 'snippet')}&gt;</div>;
      break;
    case 'embed':
      inner = <div className="b-embed">&lt;iframe · external embed&gt;</div>;
      break;
    default:
      inner = <div className="b-html">Unknown block: {block.type}</div>;
  }

  return (
    <div className={cls} onClick={onClick}>
      <div className="blk-chrome">
        <span className="lbl">{block.name || block.type}</span>
        <button title="Move"><Icon name="grip" size={12} /></button>
        <button title="Duplicate"><Icon name="copy" size={12} /></button>
        <button className="ai" title="AI rewrite"><Icon name="spark" size={12} /></button>
        <button title="Delete"><Icon name="trash" size={12} /></button>
      </div>
      {inner}
    </div>
  );
}

// ── PALETTE (left rail · Add tab) ─────────────────────
function Palette({ onAdd }) {
  const [q, setQ] = _useState('');
  const filtered = _useMemo(
    () => BLOCKS.filter(b => b.label.toLowerCase().includes(q.toLowerCase())),
    [q]
  );
  const byGroup = _useMemo(() => {
    const map = {};
    for (const b of filtered) (map[b.group] = map[b.group] || []).push(b);
    return map;
  }, [filtered]);
  return (
    <>
      <div className="lsearch">
        <Input size="sm" leadingIcon="search" placeholder="Buscar componentes" value={q} onChange={(e) => setQ(e.target.value)} />
      </div>
      {BLOCK_GROUPS.filter(g => byGroup[g]).map(g => (
        <div className="pal-group" key={g}>
          <div className="pal-group-lbl">{g}</div>
          <div className="pal-grid">
            {byGroup[g].map(b => (
              <button key={b.id} className="pal-tile" onClick={() => onAdd(b)}>
                <div className="ic"><BlockIcon type={b.id} size={14} /></div>
                <div>
                  <div className="name">{b.label}</div>
                  <div className="desc">{b.desc}</div>
                </div>
                {b.isNew && <span className="new">New</span>}
              </button>
            ))}
          </div>
        </div>
      ))}
    </>
  );
}

// ── LAYERS (left rail · Layers tab) ───────────────────
function LayerTree({ tree, level = 0, selectedId, onSelect }) {
  return tree.map(b => (
    <div key={b.id}>
      <div className={'layer-row' + (selectedId === b.id ? ' on' : '')}
           style={{ paddingLeft: 6 + level * 12 }}
           onClick={() => onSelect(b.id)}>
        <Icon name="grip" size={12} className="sr-ic grip" />
        <span className="ic"><BlockIcon type={b.type} size={11} /></span>
        <span className="name">{b.name || b.type}</span>
      </div>
      {b.children && b.children.length > 0 && (
        <LayerTree tree={b.children} level={level + 1} selectedId={selectedId} onSelect={onSelect} />
      )}
    </div>
  ));
}

// ── INSPECTOR (right) ─────────────────────────────────
function Inspector({ block, page, t, onPageChange }) {
  const [tab, setTab] = _useState(block ? 'block' : 'page');
  React.useEffect(() => { if (block) setTab('block'); }, [block && block.id]);
  return (
    <>
      <div className="insp-hd">
        <button className={tab === 'block' ? 'on' : ''} onClick={() => setTab('block')} disabled={!block}>{t('insp.tab.block')}</button>
        <button className={tab === 'style' ? 'on' : ''} onClick={() => setTab('style')} disabled={!block}>{t('insp.tab.style')}</button>
        <button className={tab === 'page' ? 'on' : ''} onClick={() => setTab('page')}>{t('insp.tab.page')}</button>
        <button className={tab === 'seo' ? 'on' : ''} onClick={() => setTab('seo')}>{t('insp.tab.seo')}</button>
      </div>
      <div className="insp-bd scrolls">
        {tab === 'block' && (
          block ? <BlockInspector block={block} /> : (
            <div className="insp-empty">
              <div className="glyph"><Icon name="filter" size={18} /></div>
              Seleccioná un bloque del lienzo o de la lista de capas para editarlo.
            </div>
          )
        )}
        {tab === 'style' && (block ? <StyleInspector block={block} /> : <div className="insp-empty">Sin selección</div>)}
        {tab === 'page' && <PageInspector page={page} onChange={onPageChange} />}
        {tab === 'seo'  && <SeoInspector page={page} />}
      </div>
    </>
  );
}

function BlockInspector({ block }) {
  const props = block.props || {};
  const fields = [];
  if (props.eyebrow !== undefined)  fields.push(['Eyebrow',  <Input defaultValue={props.eyebrow} />]);
  if (props.title !== undefined)    fields.push(['Title',    <Textarea defaultValue={props.title} style={{ minHeight: 56 }} />]);
  if (props.subtitle !== undefined) fields.push(['Subtitle', <Textarea defaultValue={props.subtitle} style={{ minHeight: 72 }} />]);
  if (props.text !== undefined)     fields.push([block.type === 'heading' ? 'Heading text' : 'Text', <Textarea defaultValue={props.text} style={{ minHeight: 56 }} />]);
  if (props.cta1 !== undefined)     fields.push(['Primary CTA', <Input defaultValue={props.cta1} />]);
  if (props.cta2 !== undefined)     fields.push(['Secondary CTA', <Input defaultValue={props.cta2} />]);
  if (props.label !== undefined)    fields.push(['Button label', <Input defaultValue={props.label} />]);
  if (props.body !== undefined)     fields.push(['Body', <Textarea defaultValue={props.body} style={{ minHeight: 56 }} />]);
  if (props.author !== undefined)   fields.push(['Author', <Input defaultValue={props.author} />]);
  if (props.role !== undefined)     fields.push(['Role',   <Input defaultValue={props.role} />]);
  if (props.src !== undefined)      fields.push(['Source URL', <Input defaultValue={props.src} placeholder="https://…" leadingIcon="link" />]);
  if (props.alt !== undefined)      fields.push(['Alt text', <Input defaultValue={props.alt} />]);
  if (props.level !== undefined)    fields.push(['Level', (
    <div className="seg">
      {['h1','h2','h3','h4'].map(l => <button key={l} className={l === props.level ? 'on' : ''}>{l.toUpperCase()}</button>)}
    </div>
  )]);
  if (props.ratio !== undefined)    fields.push(['Ratio', (
    <div className="seg">
      {['1:1','1:2','2:1'].map(r => <button key={r} className={r === props.ratio ? 'on' : ''}>{r}</button>)}
    </div>
  )]);
  if (props.columns !== undefined)  fields.push(['Columns', (
    <div className="seg">
      {[2,3,4].map(n => <button key={n} className={n === props.columns ? 'on' : ''}>{n}</button>)}
    </div>
  )]);
  if (props.tone !== undefined)     fields.push(['Tone', (
    <div className="seg">
      {['info','success','warning','danger'].map(t => <button key={t} className={t === props.tone ? 'on' : ''}>{t}</button>)}
    </div>
  )]);
  if (props.padding !== undefined)  fields.push(['Padding', <Input type="number" defaultValue={props.padding} />]);
  if (props.gap !== undefined)      fields.push(['Gap',     <Input type="number" defaultValue={props.gap} />]);
  if (props.bg !== undefined)       fields.push(['Background', (
    <div className="seg">
      {['surface','soft','none'].map(b => <button key={b} className={b === props.bg ? 'on' : ''}>{b}</button>)}
    </div>
  )]);

  return (
    <>
      <div className="insp-sec">
        <span className="lbl">Identity</span>
        <FieldGroup label="Block name">
          <Input defaultValue={block.name || block.type} />
        </FieldGroup>
        <FieldGroup label="Type">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 10px', background: 'var(--bg-sub)', borderRadius: 'var(--r-sm)', fontFamily: 'var(--font-mono)', fontSize: 12 }}>
            <BlockIcon type={block.type} size={12} />
            {block.type}
          </div>
        </FieldGroup>
      </div>

      {fields.length > 0 && (
        <div className="insp-sec">
          <span className="lbl">Properties</span>
          {fields.map(([label, ctl], i) => (
            <FieldGroup key={i} label={label}>{ctl}</FieldGroup>
          ))}
        </div>
      )}

      <div className="insp-sec">
        <span className="lbl">Actions</span>
        <div style={{ display: 'flex', gap: 6 }}>
          <Button size="sm" variant="secondary" icon="copy" style={{ flex: 1 }}>Duplicate</Button>
          <Button size="sm" variant="soft" icon="spark" style={{ flex: 1 }}>AI rewrite</Button>
        </div>
        <Button size="sm" variant="tertiary" icon="trash" style={{ color: 'var(--danger)' }}>Delete block</Button>
      </div>
    </>
  );
}

function StyleInspector({ block }) {
  return (
    <>
      <div className="insp-sec">
        <span className="lbl">Typography</span>
        <FieldGroup label="Font family">
          <Select><option>Inherit (tenant default)</option><option>Display only</option><option>Body only</option></Select>
        </FieldGroup>
        <div className="insp-meta-grid">
          <FieldGroup label="Size"><Input type="number" defaultValue="16" /></FieldGroup>
          <FieldGroup label="Weight">
            <Select><option>400</option><option>500</option><option>600</option><option>700</option></Select>
          </FieldGroup>
          <FieldGroup label="Line height"><Input type="number" step="0.05" defaultValue="1.55" /></FieldGroup>
          <FieldGroup label="Letter spacing"><Input defaultValue="-0.005em" /></FieldGroup>
        </div>
      </div>
      <div className="insp-sec">
        <span className="lbl">Color</span>
        <FieldGroup label="Text">
          <div className="color-row">
            {['var(--ink-1)','var(--ink-2)','var(--ink-3)','var(--primary)','var(--success)','var(--danger)'].map(c => (
              <span key={c} className="swatch" style={{ background: c }} data-on={c === 'var(--ink-1)' ? '1' : '0'} />
            ))}
            <Input size="sm" defaultValue="#1F1B16" style={{ flex: 1 }} />
          </div>
        </FieldGroup>
        <FieldGroup label="Background">
          <div className="color-row">
            {['transparent','var(--bg-sub)','var(--surface)','var(--primary-soft)','var(--primary)','var(--ink-1)'].map(c => (
              <span key={c} className="swatch" style={{ background: c }} data-on={c === 'transparent' ? '1' : '0'} />
            ))}
            <Input size="sm" defaultValue="transparent" style={{ flex: 1 }} />
          </div>
        </FieldGroup>
      </div>
      <div className="insp-sec">
        <span className="lbl">Spacing</span>
        <div className="insp-meta-grid">
          <FieldGroup label="Padding Y"><Input type="number" defaultValue="0" /></FieldGroup>
          <FieldGroup label="Padding X"><Input type="number" defaultValue="0" /></FieldGroup>
          <FieldGroup label="Margin top"><Input type="number" defaultValue="0" /></FieldGroup>
          <FieldGroup label="Margin bottom"><Input type="number" defaultValue="16" /></FieldGroup>
        </div>
      </div>
      <div className="insp-sec">
        <span className="lbl">Alignment</span>
        <div className="seg">
          {['left','center','right','justify'].map(a => <button key={a} className={a === 'left' ? 'on' : ''}>{a}</button>)}
        </div>
      </div>
    </>
  );
}

function PageInspector({ page, onChange }) {
  return (
    <>
      <div className="insp-sec">
        <span className="lbl">Identity</span>
        <FieldGroup label="Title">
          <Input value={page.title} onChange={(e) => onChange({ ...page, title: e.target.value })} />
        </FieldGroup>
        <FieldGroup label="URL (slug)" hint="Path relative to your tenant domain.">
          <Input value={page.slug} onChange={(e) => onChange({ ...page, slug: e.target.value })} leadingIcon="link" />
        </FieldGroup>
        <FieldGroup label="Owner">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 10px', background: 'var(--bg-sub)', borderRadius: 'var(--r-sm)' }}>
            <Avatar name={page.owner} size="sm" />
            <span style={{ fontSize: 'var(--t-13)' }}>{page.owner}</span>
          </div>
        </FieldGroup>
      </div>

      <div className="insp-sec">
        <span className="lbl">Visibility</span>
        <FieldGroup label="Audience">
          <Select>
            <option>Public — anyone on the internet</option>
            <option>Tenant only — signed-in students</option>
            <option>Unlisted — direct link only</option>
          </Select>
        </FieldGroup>
        <FieldGroup label="Language">
          <Select><option>Spanish (es-AR)</option><option>English (en)</option></Select>
        </FieldGroup>
        <label style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 'var(--t-13)' }}>
          <Switch defaultChecked /> Use as homepage
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 'var(--t-13)' }}>
          <Switch defaultChecked /> Include in main navigation
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 'var(--t-13)' }}>
          <Switch /> Password-protect
        </label>
      </div>

      <div className="insp-sec">
        <span className="lbl">History</span>
        <Button size="sm" variant="secondary" icon="archive" style={{ width: '100%', justifyContent: 'flex-start' }}>
          Version history (24 versions)
        </Button>
      </div>
    </>
  );
}

function SeoInspector({ page }) {
  const score = page.seo.score;
  const tone = score >= 90 ? 'success' : score >= 75 ? 'warning' : 'danger';
  return (
    <>
      <div className="insp-sec">
        <span className="lbl">SEO score</span>
        <div style={{
          padding: '14px 16px', borderRadius: 'var(--r-md)',
          background: 'var(--' + tone + '-soft)', color: 'var(--' + tone + ')',
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 600, letterSpacing: '-0.02em' }}>{score}</div>
          <div style={{ flex: 1, fontSize: 'var(--t-13)' }}>
            <div style={{ fontWeight: 600 }}>{score >= 90 ? 'Excellent' : score >= 75 ? 'Needs polish' : 'Needs work'}</div>
            <div style={{ opacity: 0.85 }}>{page.seo.missing.length === 0 ? 'All checks passed' : page.seo.missing.length + ' item' + (page.seo.missing.length === 1 ? '' : 's') + ' missing'}</div>
          </div>
        </div>
      </div>

      <div className="insp-sec">
        <span className="lbl">Search</span>
        <FieldGroup label="SEO title" hint="50–60 characters · used in search results.">
          <Input defaultValue={page.title} />
        </FieldGroup>
        <FieldGroup label="Meta description" hint="120–160 characters · shown beneath the title.">
          <Textarea defaultValue="Cohort-based courses from working practitioners. Live sessions, real feedback, and a portfolio you can show." style={{ minHeight: 56 }} />
        </FieldGroup>
        <FieldGroup label="Canonical URL" hint="Set if this page is a copy of another canonical URL.">
          <Input placeholder="https://…" leadingIcon="link" />
        </FieldGroup>
      </div>

      <div className="insp-sec">
        <span className="lbl">Social (Open Graph)</span>
        <FieldGroup label="OG image" hint="1200×630 recommended.">
          <div style={{
            aspectRatio: '1200/630',
            background: 'linear-gradient(135deg, var(--primary-soft), var(--bg-sub))',
            border: '1px dashed var(--border-strong)',
            borderRadius: 'var(--r-md)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--ink-4)', fontSize: 11, fontFamily: 'var(--font-mono)',
          }}>
            Drop image or click to upload
          </div>
        </FieldGroup>
        <FieldGroup label="OG title">
          <Input defaultValue={page.title} />
        </FieldGroup>
      </div>

      <div className="insp-sec">
        <span className="lbl">Indexing</span>
        <label style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 'var(--t-13)' }}>
          <Switch defaultChecked /> Allow search engines to index
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 'var(--t-13)' }}>
          <Switch defaultChecked /> Include in sitemap.xml
        </label>
      </div>
    </>
  );
}

// ── MAIN BUILDER ──────────────────────────────────────
function PageBuilder({ page, onBack, t, lang, setLang, tweaks, setTweak }) {
  const [tree, setTree] = _useState(SAMPLE_TREE);
  const [selectedId, setSelectedId] = _useState('b_hero');
  const [device, setDevice] = _useState(tweaks.device || 'desktop');
  const [leftTab, setLeftTab] = _useState('add');
  const [saveState, setSaveState] = _useState('idle');
  const [pageState, setPageState] = _useState({ ...page });

  React.useEffect(() => { setTweak('device', device); /* eslint-disable */ }, [device]);

  // Fake autosave on any state change
  React.useEffect(() => {
    setSaveState('saving');
    const t1 = setTimeout(() => setSaveState('saved'), 700);
    const t2 = setTimeout(() => setSaveState('idle'), 3000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [tree, selectedId, pageState]);

  const selected = selectedId ? findBlock(tree, selectedId) : null;
  const blockCount = (function count(arr) {
    return arr.reduce((n, b) => n + 1 + (b.children ? count(b.children) : 0), 0);
  })(tree);

  // Add a block to top-level (simplified — real implementation would handle drop position)
  const addBlock = (def) => {
    const newBlock = {
      id: 'b_' + Math.random().toString(36).slice(2, 8),
      type: def.id, name: def.label,
      props: defaultProps(def.id),
    };
    setTree(t => [...t, newBlock]);
    setSelectedId(newBlock.id);
  };

  return (
    <div className="bld" data-insp={tweaks.inspectorPos === 'bottom' ? 'bottom' : 'right'}>
      <header className="bld-top">
        <div className="brand">
          <div className="mark">S</div>
        </div>
        <Button size="sm" variant="tertiary" icon="chevronLeft" onClick={onBack}>{t('btn.back')}</Button>
        <div className="crumbs">
          <a onClick={onBack}>{t('crumb.pages')}</a>
          <Icon name="chevronRight" size={12} />
          <input className="title-input" value={pageState.title}
                 onChange={(e) => setPageState(p => ({ ...p, title: e.target.value }))} />
          <span className="slug-pill"><Icon name="link" size={11} />{pageState.slug}</span>
        </div>
        <div style={{ flex: 1 }} />
        <div className="bld-save" data-st={saveState}>
          <span className="dot" />
          {saveState === 'saving' ? 'Guardando…' : saveState === 'saved' ? 'Guardado · ahora' : 'Autoguardado'}
        </div>
        <div className="bld-device">
          {[
            ['desktop', <span>1200</span>],
            ['tablet',  <span>820</span>],
            ['mobile',  <span>400</span>],
          ].map(([k, l]) => (
            <button key={k} className={device === k ? 'on' : ''} onClick={() => setDevice(k)}>
              <Icon name={k === 'desktop' ? 'layers' : k === 'tablet' ? 'book' : 'user'} size={14} />
            </button>
          ))}
        </div>
        <Button size="sm" variant="tertiary" icon="archive" iconOnly aria-label="Versions" />
        <Button size="sm" variant="secondary" icon="eye">{t('btn.preview')}</Button>
        <Button size="sm" variant="primary" icon="send">{pageState.status === 'published' ? t('btn.publishUpdate') : t('btn.publish')}</Button>
      </header>

      <div className="bld-body">
        {/* LEFT */}
        <aside className="bld-left">
          <div className="lhead">
            <button className={leftTab === 'add' ? 'on' : ''} onClick={() => setLeftTab('add')}>
              <Icon name="plus" size={13} /> {t('bld.palette')} <span className="count">{BLOCKS.length}</span>
            </button>
            <button className={leftTab === 'layers' ? 'on' : ''} onClick={() => setLeftTab('layers')}>
              <Icon name="layers" size={13} /> {t('bld.layers')} <span className="count">{blockCount}</span>
            </button>
          </div>
          <div className="lbody scrolls">
            {leftTab === 'add' && <Palette onAdd={addBlock} />}
            {leftTab === 'layers' && <LayerTree tree={tree} selectedId={selectedId} onSelect={setSelectedId} />}
          </div>
        </aside>

        {/* CANVAS */}
        <div className="bld-canvas-wrap scrolls" onClick={() => setSelectedId(null)}>
          <div className="ruler">
            <span>{device}</span>
            <span style={{ color: 'var(--ink-3)' }}>{device === 'desktop' ? 1200 : device === 'tablet' ? 820 : 400}px</span>
            <hr />
            <span style={{ color: 'var(--ink-3)' }}>100%</span>
            <span style={{ color: 'var(--ink-3)' }}>{blockCount} bloques</span>
          </div>
          <div className="canvas-frame" data-device={device} onClick={(e) => e.stopPropagation()}>
            {tree.length === 0 && (
              <div style={{
                padding: '80px 24px', textAlign: 'center',
                color: 'var(--ink-3)',
                background: 'linear-gradient(180deg, var(--primary-soft) 0%, var(--surface) 100%)',
              }}>
                <div style={{
                  width: 56, height: 56, margin: '0 auto 16px',
                  borderRadius: 'var(--r-lg)', background: 'var(--primary)', color: 'var(--on-primary)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Icon name="plus" size={26} />
                </div>
                <h3 style={{ fontSize: 'var(--t-24)', fontFamily: 'var(--font-display)', fontWeight: 500, letterSpacing: '-0.02em' }}>
                  {t('bld.empty.title')}
                </h3>
                <p style={{ marginTop: 8, fontSize: 'var(--t-14)', maxWidth: '44ch', marginInline: 'auto' }}>
                  {t('bld.empty.body')}
                </p>
                <div style={{ marginTop: 16, display: 'inline-flex', gap: 8 }}>
                  <Button variant="primary" icon="spark">{t('bld.empty.ai')}</Button>
                  <Button variant="secondary" icon="layers">Ver plantillas</Button>
                </div>
              </div>
            )}
            {tree.map((b, i) => (
              <React.Fragment key={b.id}>
                <RenderBlock block={b} selectedId={selectedId} onSelect={setSelectedId} />
                {i < tree.length - 1 && <div className="drop" />}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* INSPECTOR */}
        <aside className="bld-right">
          <Inspector block={selected} page={pageState} onPageChange={setPageState} t={t} />
        </aside>
      </div>
    </div>
  );
}

function defaultProps(type) {
  switch (type) {
    case 'heading': return { level: 'h2', text: 'New heading' };
    case 'text':    return { text: 'New paragraph. Replace this with your own content.' };
    case 'hero':    return { eyebrow: 'New section', title: 'Headline here', subtitle: 'Subtitle copy goes here.', cta1: 'Primary action', cta2: 'Learn more', bg: 'soft' };
    case 'button':  return { label: 'Click me', variant: 'primary' };
    case 'image':   return { src: '', alt: '' };
    case 'video':   return { src: '' };
    case 'quote':   return { text: '"Quote text here."', author: 'Author', role: 'Title' };
    case 'callout': return { tone: 'info', title: 'Heads up', body: 'Callout body copy.' };
    case 'container': return { padding: 32, bg: 'surface' };
    case 'columns': return { ratio: '1:1', gap: 24 };
    case 'grid':    return { columns: 3, gap: 16 };
    case 'code':    return { language: 'js', code: '' };
    case 'html':    return { html: '', preview: 'snippet' };
    case 'embed':   return { url: '' };
    case 'spacer':  return { height: 32 };
    case 'divider': return {};
    default: return {};
  }
}

(function () {
  const s = document.createElement('style');
  s.id = 'bld-styles';
  s.textContent = __BLD_CSS;
  document.head.appendChild(s);
})();

Object.assign(window, { PageBuilder });
