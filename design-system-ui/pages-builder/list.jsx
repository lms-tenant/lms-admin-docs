// list.jsx — /admin/pages index view. Table-led with rich per-row metadata.

const __LIST_CSS = `
  .pl-app {
    height: 100vh;
    display: grid;
    grid-template-rows: 56px 1fr;
    background: var(--bg);
  }

  /* TOP BAR */
  .pl-top {
    display: flex; align-items: center; gap: 14px;
    padding: 0 24px;
    border-bottom: 1px solid var(--border);
    background: var(--surface);
    flex-shrink: 0;
  }
  .pl-top .brand {
    display: flex; align-items: center; gap: 8px;
    padding-right: 14px; margin-right: 4px;
    border-right: 1px solid var(--border);
    height: 32px;
  }
  .pl-top .brand .mark {
    width: 24px; height: 24px; border-radius: var(--r-sm);
    background: var(--primary); color: var(--on-primary);
    display: flex; align-items: center; justify-content: center;
    font-family: var(--font-display); font-weight: 700; font-size: 13px;
  }
  .pl-top .brand b { font-family: var(--font-display); font-weight: 600; font-size: var(--t-14); }
  .pl-top .crumbs { color: var(--ink-3); font-size: var(--t-13); display: flex; align-items: center; gap: 8px; }
  .pl-top .crumbs b { color: var(--ink-1); font-weight: 500; }

  .pl-lang { display: inline-flex; padding: 3px; border-radius: var(--r-md); background: var(--bg-sub); }
  .pl-lang button {
    appearance: none; border: 0; background: transparent;
    width: 28px; height: 22px; border-radius: 6px;
    font-family: var(--font-mono); font-size: 10.5px; font-weight: 500;
    color: var(--ink-3); cursor: pointer; letter-spacing: 0.05em;
    text-transform: uppercase;
  }
  .pl-lang button.on { background: var(--surface); color: var(--ink-1); box-shadow: var(--shadow-1); }

  /* PAGE */
  .pl-body {
    overflow-y: auto;
    padding: 28px 28px 80px;
    max-width: 1440px; margin: 0 auto; width: 100%;
  }
  .pl-hd {
    display: flex; align-items: flex-end; justify-content: space-between;
    gap: 16px; margin-bottom: 24px;
  }
  .pl-hd .eyebrow {
    font-family: var(--font-mono); font-size: 11px;
    color: var(--ink-3); text-transform: uppercase; letter-spacing: 0.08em;
    display: inline-flex; align-items: center; gap: 8px;
  }
  .pl-hd .eyebrow::before { content:''; width:6px; height:6px; background: var(--primary); border-radius:50%; }
  .pl-hd h1 {
    font-size: var(--t-32); margin-top: 8px; font-family: var(--font-display);
    letter-spacing: -0.02em; font-weight: 500;
  }
  .pl-hd p { color: var(--ink-3); margin-top: 6px; font-size: var(--t-14); max-width: 70ch; }

  /* STATS */
  .pl-stats {
    display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px;
    margin-bottom: 20px;
  }
  .pl-stat {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--r-lg);
    padding: 16px 18px;
    display: flex; flex-direction: column; gap: 6px;
  }
  .pl-stat .k {
    font-family: var(--font-mono); font-size: 10.5px;
    color: var(--ink-3); text-transform: uppercase; letter-spacing: 0.06em;
  }
  .pl-stat .v {
    font-family: var(--font-display); font-weight: 500;
    font-size: 30px; line-height: 1; letter-spacing: -0.02em;
    color: var(--ink-1);
    display: flex; align-items: baseline; gap: 8px;
  }
  .pl-stat .v small {
    font-family: var(--font-mono); font-size: 11px;
    padding: 2px 6px; border-radius: var(--r-sm); font-weight: 500;
    background: var(--success-soft); color: var(--success);
  }
  .pl-stat .v small.down { background: var(--danger-soft); color: var(--danger); }

  /* TABS */
  .pl-tabs {
    display: flex;
    border-bottom: 1px solid var(--border);
    margin-bottom: 16px;
  }
  .pl-tabs button {
    appearance: none; border: 0; background: transparent;
    padding: 12px 16px;
    font-family: inherit; font-size: var(--t-14);
    color: var(--ink-3); cursor: pointer;
    border-bottom: 2px solid transparent;
    margin-bottom: -1px;
    display: inline-flex; align-items: center; gap: 8px;
  }
  .pl-tabs button:hover { color: var(--ink-1); }
  .pl-tabs button.on { color: var(--ink-1); border-bottom-color: var(--primary); font-weight: 500; }
  .pl-tabs button .count {
    font-family: var(--font-mono); font-size: 10.5px;
    color: var(--ink-4); background: var(--bg-sub);
    padding: 2px 7px; border-radius: var(--r-pill);
  }
  .pl-tabs button.on .count { color: var(--primary-soft-fg); background: var(--primary-soft); }

  /* TOOLBAR */
  .pl-toolbar {
    display: flex; align-items: center; gap: 8px;
    margin-bottom: 12px;
  }
  .pl-toolbar > .search { flex: 1; max-width: 480px; }
  .pl-view-toggle { display: inline-flex; padding: 3px; background: var(--bg-sub); border-radius: var(--r-md); }
  .pl-view-toggle button {
    appearance: none; border: 0; background: transparent;
    width: 28px; height: 22px; border-radius: 6px;
    color: var(--ink-3); cursor: pointer;
    display: inline-flex; align-items: center; justify-content: center;
  }
  .pl-view-toggle button.on { background: var(--surface); color: var(--ink-1); box-shadow: var(--shadow-1); }

  /* TABLE */
  .pl-tbl-wrap {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--r-lg);
    overflow: hidden;
  }
  .pl-tbl {
    width: 100%;
    border-collapse: separate; border-spacing: 0;
    font-size: var(--t-14);
  }
  .pl-tbl th, .pl-tbl td {
    text-align: left; padding: 12px 16px;
    border-bottom: 1px solid var(--border);
    vertical-align: middle;
  }
  .pl-tbl th {
    font-family: var(--font-mono); font-size: 10.5px;
    color: var(--ink-3); text-transform: uppercase; letter-spacing: 0.06em;
    font-weight: 500;
    background: var(--bg-sub);
    border-bottom: 1px solid var(--border-strong);
    white-space: nowrap;
  }
  .pl-tbl tbody tr { cursor: pointer; transition: background 100ms ease; }
  .pl-tbl tbody tr:hover td { background: var(--bg-sub); }
  .pl-tbl tbody tr:last-child td { border-bottom: 0; }
  .pl-tbl .title-cell .t {
    color: var(--ink-1); font-weight: 500;
    display: flex; align-items: center; gap: 8px;
  }
  .pl-tbl .title-cell .s {
    color: var(--ink-3); font-size: 11.5px;
    font-family: var(--font-mono);
    margin-top: 2px;
  }
  .pl-tbl .pl-st {
    display: inline-flex; align-items: center; gap: 6px;
    height: 22px; padding: 0 8px;
    border-radius: var(--r-pill);
    font-size: 11.5px; font-weight: 500;
    line-height: 1;
  }
  .pl-st .dot { width: 6px; height: 6px; border-radius: 50%; background: currentColor; }
  .pl-st[data-st="published"] { color: var(--success); background: var(--success-soft); }
  .pl-st[data-st="draft"]     { color: var(--ink-2); background: var(--bg-sub); }
  .pl-st[data-st="scheduled"] { color: var(--info); background: var(--info-soft); }
  .pl-st[data-st="archived"]  { color: var(--ink-3); background: var(--bg-sub); }

  .pl-tbl .num { font-variant-numeric: tabular-nums; font-family: var(--font-mono); font-size: var(--t-13); color: var(--ink-2); }
  .pl-tbl .when { font-family: var(--font-mono); font-size: 11.5px; color: var(--ink-3); white-space: nowrap; }

  /* Tiny SEO bar */
  .seo-bar {
    display: inline-flex; align-items: center; gap: 8px;
    font-variant-numeric: tabular-nums; font-family: var(--font-mono); font-size: 11.5px;
  }
  .seo-bar .ring {
    --val: 0;
    width: 22px; height: 22px;
    background:
      conic-gradient(currentColor calc(var(--val) * 1%), var(--bg-sub) 0);
    border-radius: 50%;
    display: inline-flex; align-items: center; justify-content: center;
    position: relative;
  }
  .seo-bar .ring::after {
    content: ''; position: absolute; inset: 3px;
    background: var(--surface); border-radius: 50%;
  }
  .seo-bar .ring > span { position: relative; z-index: 1; font-size: 9px; font-weight: 600; color: var(--ink-2); font-family: var(--font-mono); }
  .seo-bar.high  { color: var(--success); }
  .seo-bar.mid   { color: var(--warning); }
  .seo-bar.low   { color: var(--danger); }

  /* Sparkline (traffic) */
  .spark {
    display: inline-flex; align-items: center; gap: 8px;
    font-family: var(--font-mono); font-size: var(--t-13); color: var(--ink-2);
  }
  .spark svg { display: block; }

  /* Empty state */
  .pl-empty {
    text-align: center;
    padding: 80px 24px;
  }
  .pl-empty .glyph {
    width: 56px; height: 56px;
    margin: 0 auto 16px;
    background: var(--primary-soft);
    color: var(--primary-soft-fg);
    border-radius: var(--r-lg);
    display: flex; align-items: center; justify-content: center;
  }
  .pl-empty h3 { font-size: var(--t-20); font-family: var(--font-display); font-weight: 500; }
  .pl-empty p { color: var(--ink-3); margin-top: 6px; max-width: 44ch; margin-inline: auto; }
  .pl-empty .actions { margin-top: 14px; display: inline-flex; gap: 8px; }
`;

const { useState: __useState, useMemo: __useMemo } = React;

function Sparkline({ data, color = 'var(--primary)' }) {
  if (!data || data.length === 0) return null;
  const max = Math.max(...data, 1);
  const w = 64, h = 18;
  const step = w / (data.length - 1 || 1);
  const points = data.map((v, i) => `${i * step},${h - (v / max) * h}`).join(' ');
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <polyline fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" points={points} />
    </svg>
  );
}

function SeoIndicator({ score }) {
  const tone = score >= 90 ? 'high' : score >= 75 ? 'mid' : 'low';
  return (
    <span className={'seo-bar ' + tone}>
      <span className="ring" style={{ '--val': score }}><span>{score}</span></span>
      {tone === 'high' ? 'AAA' : tone === 'mid' ? 'OK' : 'Fix'}
    </span>
  );
}

function PageRow({ p, onOpen, checked, onToggle, t }) {
  // Deterministic sparkline from page id so it doesn't reshuffle each render.
  const seed = p.id.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const trend = Array.from({ length: 8 }, (_, i) => 8 + ((seed + i * 13) % 12));
  return (
    <tr onClick={onOpen}>
      <td onClick={(e) => e.stopPropagation()}>
        <Checkbox checked={checked} onChange={onToggle} />
      </td>
      <td className="title-cell">
        <div className="t">
          {p.isHome && <Icon name="home" size={13} style={{ color: 'var(--primary)' }} />}
          {p.title}
        </div>
        <div className="s">{p.slug}</div>
      </td>
      <td><span className="pl-st" data-st={p.status}><span className="dot" />{t('st.' + p.status)}</span></td>
      <td className="num">{p.blocks}</td>
      <td>
        {p.status === 'published'
          ? <span className="spark">
              <Sparkline data={trend} />
              {p.views.toLocaleString()}
            </span>
          : <span style={{ color: 'var(--ink-4)', fontFamily: 'var(--font-mono)', fontSize: 11.5 }}>—</span>}
      </td>
      <td><SeoIndicator score={p.seo.score} /></td>
      <td className="when">{p.updatedLabel}</td>
      <td>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Avatar name={p.owner} size="sm" />
          <span style={{ fontSize: 'var(--t-13)' }}>{p.owner}</span>
        </div>
      </td>
      <td style={{ textAlign: 'right' }} onClick={(e) => e.stopPropagation()}>
        <Button size="sm" variant="tertiary" icon="more" iconOnly aria-label="Actions" />
      </td>
    </tr>
  );
}

function PagesList({ onOpen, t, lang, setLang }) {
  const [tab, setTab] = __useState('all');
  const [search, setSearch] = __useState('');
  const [checked, setChecked] = __useState(new Set());
  const [view, setView] = __useState('table');

  const counts = __useMemo(() => ({
    all:       PAGES.length,
    published: PAGES.filter(p => p.status === 'published').length,
    draft:     PAGES.filter(p => p.status === 'draft').length,
    scheduled: PAGES.filter(p => p.status === 'scheduled').length,
    archived:  PAGES.filter(p => p.status === 'archived').length,
  }), []);

  const rows = __useMemo(() => {
    let r = PAGES;
    if (tab !== 'all') r = r.filter(p => p.status === tab);
    if (search) {
      const q = search.toLowerCase();
      r = r.filter(p => p.title.toLowerCase().includes(q) || p.slug.toLowerCase().includes(q));
    }
    return r;
  }, [tab, search]);

  const totalViews = PAGES.filter(p => p.status === 'published').reduce((n, p) => n + p.views, 0);

  return (
    <div className="pl-app">
      <header className="pl-top">
        <div className="brand">
          <div className="mark">S</div>
          <b>{t('app.brand')}</b>
        </div>
        <div className="crumbs">
          {t('crumb.parent')} · <b>{t('crumb.pages')}</b>
        </div>
        <div style={{ flex: 1 }} />
        <div className="pl-lang">
          <button className={lang === 'en' ? 'on' : ''} onClick={() => setLang('en')}>EN</button>
          <button className={lang === 'es' ? 'on' : ''} onClick={() => setLang('es')}>ES</button>
        </div>
        <Avatar name="Marcus Lee" size="sm" />
      </header>

      <main className="pl-body scrolls">
        <div className="pl-hd">
          <div>
            <div className="eyebrow">CMS · public surface</div>
            <h1>{t('page.title')}</h1>
            <p>{t('page.subtitle')}</p>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <Button variant="secondary" icon="upload">{t('btn.import')}</Button>
            <Button variant="secondary" icon="layers">{t('btn.template')}</Button>
            <Button variant="primary" icon="plus" onClick={() => onOpen(PAGES[0])}>{t('btn.new')}</Button>
          </div>
        </div>

        <div className="pl-stats">
          <div className="pl-stat">
            <div className="k">Total pages</div>
            <div className="v">{PAGES.length} <small><Icon name="arrowUp" size={10} />2</small></div>
            <div style={{ color: 'var(--ink-3)', fontSize: 'var(--t-12)' }}>vs. last month</div>
          </div>
          <div className="pl-stat">
            <div className="k">Published</div>
            <div className="v">{counts.published}</div>
            <div style={{ color: 'var(--ink-3)', fontSize: 'var(--t-12)' }}>{counts.scheduled} scheduled · {counts.draft} drafts</div>
          </div>
          <div className="pl-stat">
            <div className="k">Total views · 30d</div>
            <div className="v">{(totalViews/1000).toFixed(1)}k <small><Icon name="arrowUp" size={10} />18%</small></div>
            <div style={{ color: 'var(--ink-3)', fontSize: 'var(--t-12)' }}>across {counts.published} published pages</div>
          </div>
          <div className="pl-stat">
            <div className="k">SEO health</div>
            <div className="v">87 <small className="down"><Icon name="arrowDown" size={10} />3</small></div>
            <div style={{ color: 'var(--ink-3)', fontSize: 'var(--t-12)' }}>avg. score · 4 pages need fixes</div>
          </div>
        </div>

        <nav className="pl-tabs">
          {[
            ['all',       t('tabs.all'),       counts.all],
            ['published', t('tabs.published'), counts.published],
            ['draft',     t('tabs.draft'),     counts.draft],
            ['scheduled', t('tabs.scheduled'), counts.scheduled],
            ['archived',  t('tabs.archived'),  counts.archived],
          ].map(([id, label, c]) => (
            <button key={id} className={tab === id ? 'on' : ''} onClick={() => setTab(id)}>
              {label}
              <span className="count">{c}</span>
            </button>
          ))}
        </nav>

        <div className="pl-toolbar">
          <div className="search">
            <Input leadingIcon="search" placeholder={t('tbl.search')}
                   value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <Button variant="secondary" trailing="chevronDown">
            <Icon name="filter" size={14} /> Owner: all
          </Button>
          <Button variant="secondary" trailing="chevronDown">
            Sort: recently edited
          </Button>
          <div style={{ flex: 1 }} />
          {checked.size > 0 ? (
            <>
              <Badge>{checked.size} seleccionada{checked.size === 1 ? '' : 's'}</Badge>
              <Button size="md" variant="secondary" icon="copy">Duplicar</Button>
              <Button size="md" variant="secondary" icon="archive">Archivar</Button>
            </>
          ) : (
            <>
              <Badge>{rows.length} de {PAGES.length}</Badge>
              <div className="pl-view-toggle">
                <button className={view === 'table' ? 'on' : ''} onClick={() => setView('table')} aria-label="Table view">
                  <Icon name="filter" size={14} />
                </button>
                <button className={view === 'grid' ? 'on' : ''} onClick={() => setView('grid')} aria-label="Grid view">
                  <Icon name="layers" size={14} />
                </button>
              </div>
            </>
          )}
        </div>

        {rows.length === 0 ? (
          <div className="pl-empty">
            <div className="glyph"><Icon name="folder" size={26} /></div>
            <h3>No hay páginas en esta vista</h3>
            <p>Probá quitar filtros o creá una nueva desde una plantilla.</p>
            <div className="actions">
              <Button variant="primary" icon="plus" onClick={() => onOpen(PAGES[0])}>Nueva página</Button>
              <Button variant="secondary" icon="layers">Ver plantillas</Button>
            </div>
          </div>
        ) : (
          <div className="pl-tbl-wrap">
            <table className="pl-tbl">
              <thead>
                <tr>
                  <th style={{ width: 36 }}>
                    <Checkbox checked={checked.size === rows.length && rows.length > 0}
                              onChange={(e) => setChecked(e.target.checked ? new Set(rows.map(r => r.id)) : new Set())} />
                  </th>
                  <th>{t('tbl.title')}</th>
                  <th>{t('tbl.status')}</th>
                  <th>{t('tbl.blocks')}</th>
                  <th>{t('tbl.traffic')}</th>
                  <th>{t('tbl.seo')}</th>
                  <th>{t('tbl.updated')}</th>
                  <th>{t('tbl.owner')}</th>
                  <th style={{ width: 40 }} />
                </tr>
              </thead>
              <tbody>
                {rows.map(p => (
                  <PageRow key={p.id} p={p} t={t}
                           checked={checked.has(p.id)}
                           onToggle={(e) => {
                             const next = new Set(checked);
                             if (e.target.checked) next.add(p.id); else next.delete(p.id);
                             setChecked(next);
                           }}
                           onOpen={() => onOpen(p)} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}

(function () {
  const s = document.createElement('style');
  s.id = 'pl-styles';
  s.textContent = __LIST_CSS;
  document.head.appendChild(s);
})();

Object.assign(window, { PagesList });
