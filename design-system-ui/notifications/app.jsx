// app.jsx — main Admin · Notifications page. Top bar + stats + tabs + table +
// state for the two drawers.

const __APP_CSS = `
  .app {
    height: 100vh;
    display: grid;
    grid-template-rows: 56px 1fr;
    background: var(--bg);
  }

  /* TOP BAR */
  .topbar {
    display: flex; align-items: center; gap: 14px;
    padding: 0 24px;
    border-bottom: 1px solid var(--border);
    background: var(--surface);
    flex-shrink: 0;
  }
  .topbar .brand {
    display: flex; align-items: center; gap: 8px;
    padding-right: 14px; margin-right: 4px;
    border-right: 1px solid var(--border);
    height: 32px;
  }
  .topbar .brand .mark {
    width: 24px; height: 24px; border-radius: var(--r-sm);
    background: var(--primary); color: var(--on-primary);
    display: flex; align-items: center; justify-content: center;
    font-family: var(--font-display); font-weight: 700; font-size: 13px;
  }
  .topbar .brand b { font-family: var(--font-display); font-weight: 600; font-size: var(--t-14); }
  .topbar .crumbs {
    color: var(--ink-3); font-size: var(--t-13);
    display: flex; align-items: center; gap: 8px;
  }
  .topbar .crumbs b { color: var(--ink-1); font-weight: 500; }
  .topbar .lang { display: inline-flex; padding: 3px; border-radius: var(--r-md); background: var(--bg-sub); }
  .topbar .lang button {
    appearance: none; border: 0; background: transparent;
    width: 28px; height: 22px; border-radius: 6px;
    font-family: var(--font-mono); font-size: 10.5px; font-weight: 500;
    color: var(--ink-3); cursor: pointer; letter-spacing: 0.05em;
    text-transform: uppercase;
  }
  .topbar .lang button.on { background: var(--surface); color: var(--ink-1); box-shadow: var(--shadow-1); }

  /* PAGE */
  .page {
    overflow-y: auto;
    padding: 28px 28px 80px;
    max-width: 1440px; margin: 0 auto; width: 100%;
  }
  .page-hd {
    display: flex; align-items: flex-end; justify-content: space-between;
    gap: 16px; margin-bottom: 24px;
  }
  .page-hd .eyebrow {
    font-family: var(--font-mono); font-size: 11px;
    color: var(--ink-3); text-transform: uppercase; letter-spacing: 0.08em;
    display: inline-flex; align-items: center; gap: 8px;
  }
  .page-hd .eyebrow::before { content:''; width:6px; height:6px; background: var(--primary); border-radius:50%; }
  .page-hd h1 {
    font-size: var(--t-32); margin-top: 8px;
    letter-spacing: -0.02em; font-weight: 500;
    font-family: var(--font-display);
  }
  .page-hd p { color: var(--ink-3); margin-top: 6px; font-size: var(--t-14); max-width: 64ch; }

  /* STATS */
  .stats-row {
    display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px;
    margin-bottom: 20px;
  }
  .stat {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--r-lg);
    padding: 16px 18px;
    display: flex; flex-direction: column; gap: 6px;
  }
  .stat .k {
    font-family: var(--font-mono); font-size: 10.5px;
    color: var(--ink-3); text-transform: uppercase; letter-spacing: 0.06em;
  }
  .stat .v {
    font-family: var(--font-display); font-weight: 500;
    font-size: 30px; line-height: 1; letter-spacing: -0.02em;
    color: var(--ink-1);
    display: flex; align-items: baseline; gap: 8px;
  }
  .stat .v small {
    font-family: var(--font-mono); font-size: 11px;
    background: var(--success-soft); color: var(--success);
    padding: 2px 6px; border-radius: var(--r-sm); font-weight: 500;
  }
  .stat .v small.down { background: var(--danger-soft); color: var(--danger); }

  /* TABS */
  .tabs {
    display: flex; gap: 0;
    border-bottom: 1px solid var(--border);
    margin-bottom: 16px;
  }
  .tabs button {
    appearance: none; border: 0; background: transparent;
    padding: 12px 16px;
    font-family: inherit; font-size: var(--t-14);
    color: var(--ink-3); cursor: pointer;
    border-bottom: 2px solid transparent;
    margin-bottom: -1px;
    display: inline-flex; align-items: center; gap: 8px;
  }
  .tabs button:hover { color: var(--ink-1); }
  .tabs button.on { color: var(--ink-1); border-bottom-color: var(--primary); font-weight: 500; }
  .tabs button .count {
    font-family: var(--font-mono); font-size: 10.5px;
    color: var(--ink-4); background: var(--bg-sub);
    padding: 2px 7px; border-radius: var(--r-pill);
  }
  .tabs button.on .count { color: var(--primary-soft-fg); background: var(--primary-soft); }

  /* TOOLBAR */
  .toolbar {
    display: flex; align-items: center; gap: 8px;
    margin-bottom: 12px;
  }
  .toolbar > .search { flex: 1; max-width: 480px; }

  /* TABLE WRAP */
  .tbl-wrap {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--r-lg);
    overflow: hidden;
  }
  .tbl {
    width: 100%;
    border-collapse: separate; border-spacing: 0;
    font-size: var(--t-14);
  }
  .tbl th, .tbl td {
    text-align: left; padding: 12px 16px;
    border-bottom: 1px solid var(--border);
    vertical-align: middle;
  }
  .tbl th {
    font-family: var(--font-mono); font-size: 10.5px;
    color: var(--ink-3); text-transform: uppercase; letter-spacing: 0.06em;
    font-weight: 500;
    background: var(--bg-sub);
    border-bottom: 1px solid var(--border-strong);
    white-space: nowrap;
  }
  .tbl tbody tr { cursor: pointer; transition: background 100ms ease; }
  .tbl tbody tr:hover td { background: var(--bg-sub); }
  .tbl tbody tr:last-child td { border-bottom: 0; }
  .tbl .title-cell {
    min-width: 0; max-width: 380px;
  }
  .tbl .title-cell .t {
    color: var(--ink-1); font-weight: 500;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .tbl .title-cell .b {
    color: var(--ink-3); font-size: var(--t-12);
    margin-top: 2px;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .tbl td.num { font-variant-numeric: tabular-nums; font-family: var(--font-mono); font-size: var(--t-13); }
  .tbl td.actions { text-align: right; }
  .tbl .when {
    font-family: var(--font-mono); font-size: 11.5px;
    color: var(--ink-3);
    white-space: nowrap;
  }

  /* FOOTER OF TABLE */
  .tbl-ft {
    display: flex; align-items: center; gap: 12px;
    padding: 12px 16px;
    border-top: 1px solid var(--border);
    color: var(--ink-3); font-size: var(--t-13);
  }

  /* TEMPLATES VIEW */
  .tpl-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 12px;
  }
  .tpl-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--r-lg);
    padding: 16px;
    display: flex; flex-direction: column; gap: 8px;
    cursor: pointer;
    transition: border-color 120ms ease, transform 80ms ease, box-shadow 120ms ease;
  }
  .tpl-card:hover {
    border-color: var(--primary);
    transform: translateY(-1px);
    box-shadow: var(--shadow-2);
  }
  .tpl-card .top {
    display: flex; align-items: center; gap: 8px;
    color: var(--ink-3);
    font-family: var(--font-mono); font-size: 10.5px;
    text-transform: uppercase; letter-spacing: 0.06em;
  }
  .tpl-card h4 {
    font-size: var(--t-15); font-family: var(--font-display); font-weight: 600;
  }
  .tpl-card .desc { color: var(--ink-3); font-size: var(--t-13); line-height: 1.45; }
  .tpl-card .vars {
    display: flex; flex-wrap: wrap; gap: 4px;
    margin-top: 4px;
  }
  .tpl-card .ft {
    display: flex; align-items: center; justify-content: space-between;
    margin-top: 6px; padding-top: 10px;
    border-top: 1px solid var(--border);
    font-size: 11.5px; color: var(--ink-4);
    font-family: var(--font-mono); letter-spacing: 0.04em;
  }

  /* AUDIENCES VIEW */
  .audiences-grid {
    display: grid; gap: 10px;
  }
  .aud-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--r-lg);
    padding: 14px 18px;
    display: flex; align-items: center; gap: 16px;
  }
  .aud-card .info { flex: 1; min-width: 0; }
  .aud-card .info .name { font-weight: 600; font-size: var(--t-15); }
  .aud-card .info .desc { color: var(--ink-3); font-size: var(--t-13); margin-top: 2px; }
  .aud-card .info .meta {
    margin-top: 6px; display: flex; gap: 12px;
    font-family: var(--font-mono); font-size: 10.5px;
    color: var(--ink-4); text-transform: uppercase; letter-spacing: 0.06em;
  }
  .aud-card .count {
    font-family: var(--font-display); font-weight: 500;
    font-size: var(--t-24); letter-spacing: -0.015em;
    color: var(--ink-1);
  }
`;

const { useState, useMemo } = React;

// Tiny wrapper for indeterminate-state checkboxes (Checkbox is a function
// component so it can't accept refs directly).
function IndeterminateCheckbox({ indeterminate, ...rest }) {
  const ref = React.useRef(null);
  React.useEffect(() => { if (ref.current) ref.current.indeterminate = !!indeterminate; }, [indeterminate]);
  return <input ref={ref} type="checkbox" className="sr-check" {...rest} />;
}

function App() {
  const [tweaks, setTweak] = useTweaks(window.__TWEAK_DEFAULTS);
  const [lang, setLang] = useState(tweaks.lang || 'es');
  const t = useT(lang);

  const [tab, setTab] = useState('sent');
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterChannel, setFilterChannel] = useState('all');
  const [showCompose, setShowCompose] = useState(false);
  const [detail, setDetail] = useState(null);
  const [checked, setChecked] = useState(new Set());

  React.useEffect(() => {
    const root = document.documentElement;
    root.dataset.density = tweaks.density;
    root.dataset.theme = tweaks.dark ? 'dark' : 'light';
  }, [tweaks]);
  React.useEffect(() => { setTweak('lang', lang); /* eslint-disable */ }, [lang]);

  // Filter notifications by tab + search
  const counts = useMemo(() => ({
    sent:      NOTIFICATIONS.filter(n => n.status === 'sent').length,
    scheduled: NOTIFICATIONS.filter(n => n.status === 'scheduled').length,
    drafts:    NOTIFICATIONS.filter(n => n.status === 'draft').length,
    templates: TEMPLATES.length,
    audiences: SAVED_AUDIENCES.length,
  }), []);

  const rows = useMemo(() => {
    let r = NOTIFICATIONS;
    if (tab === 'sent') r = r.filter(n => n.status === 'sent' || n.status === 'failed');
    else if (tab === 'scheduled') r = r.filter(n => n.status === 'scheduled');
    else if (tab === 'drafts')    r = r.filter(n => n.status === 'draft');

    if (search) {
      const q = search.toLowerCase();
      r = r.filter(n =>
        n.title.toLowerCase().includes(q) ||
        n.body.toLowerCase().includes(q) ||
        n.audience.label.toLowerCase().includes(q) ||
        (n.sentBy.name && n.sentBy.name.toLowerCase().includes(q))
      );
    }
    if (filterStatus !== 'all') r = r.filter(n => n.status === filterStatus);
    if (filterChannel !== 'all') r = r.filter(n => n.channels.includes(filterChannel));
    return r;
  }, [tab, search, filterStatus, filterChannel]);

  const tabs = [
    { id: 'sent',      label: t('tab.sent'),      count: counts.sent },
    { id: 'scheduled', label: t('tab.scheduled'), count: counts.scheduled },
    { id: 'drafts',    label: t('tab.drafts'),    count: counts.drafts },
    { id: 'templates', label: t('tab.templates'), count: counts.templates },
    { id: 'audiences', label: t('tab.audiences'), count: counts.audiences },
  ];

  const allChecked = checked.size === rows.length && rows.length > 0;
  const someChecked = checked.size > 0 && !allChecked;

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <div className="mark">S</div>
          <b>{t('app.brand')}</b>
        </div>
        <div className="crumbs">
          {t('page.crumb.parent')} · <b>{t('page.crumb')}</b>
        </div>
        <div style={{ flex: 1 }} />
        <div className="lang">
          <button className={lang === 'en' ? 'on' : ''} onClick={() => setLang('en')}>EN</button>
          <button className={lang === 'es' ? 'on' : ''} onClick={() => setLang('es')}>ES</button>
        </div>
        <Avatar name="Marcus Lee" size="sm" />
      </header>

      <main className="page scrolls">
        <div className="page-hd">
          <div>
            <div className="eyebrow">Inbox · Outbox</div>
            <h1>{t('page.title')}</h1>
            <p>{t('page.subtitle')}</p>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <Button variant="secondary" icon="layers">Plantillas</Button>
            <Button variant="primary" icon="plus" onClick={() => setShowCompose(true)}>
              {t('btn.compose')}
            </Button>
          </div>
        </div>

        {/* STATS */}
        <div className="stats-row">
          <div className="stat">
            <div className="k">{t('stats.sent')}</div>
            <div className="v">14 <small><Icon name="arrowUp" size={10} />22%</small></div>
            <div style={{ color: 'var(--ink-3)', fontSize: 'var(--t-12)' }}>vs. previous 30 days</div>
          </div>
          <div className="stat">
            <div className="k">{t('stats.delivered')}</div>
            <div className="v">98.4% <small><Icon name="arrowUp" size={10} />0.6%</small></div>
            <div style={{ color: 'var(--ink-3)', fontSize: 'var(--t-12)' }}>across all channels</div>
          </div>
          <div className="stat">
            <div className="k">{t('stats.opens')}</div>
            <div className="v">67.2% <small className="down"><Icon name="arrowDown" size={10} />1.8%</small></div>
            <div style={{ color: 'var(--ink-3)', fontSize: 'var(--t-12)' }}>email + in-app weighted</div>
          </div>
          <div className="stat">
            <div className="k">{t('stats.clicks')}</div>
            <div className="v">23.1% <small><Icon name="arrowUp" size={10} />3.4%</small></div>
            <div style={{ color: 'var(--ink-3)', fontSize: 'var(--t-12)' }}>of opened messages</div>
          </div>
        </div>

        {/* TABS */}
        <nav className="tabs">
          {tabs.map(tb => (
            <button key={tb.id} className={tab === tb.id ? 'on' : ''} onClick={() => setTab(tb.id)}>
              {tb.label}
              <span className="count">{tb.count}</span>
            </button>
          ))}
        </nav>

        {/* CONTENT BY TAB */}
        {(tab === 'sent' || tab === 'scheduled' || tab === 'drafts') && (
          <>
            <div className="toolbar">
              <div className="search">
                <Input leadingIcon="search" placeholder={t('tbl.search')}
                       value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
              <Button variant="secondary" size="md" trailing="chevronDown">
                <Icon name="filter" size={14} /> {t('tbl.filters')}
              </Button>
              <Button variant="secondary" size="md" trailing="chevronDown">
                Channel: all
              </Button>
              <div style={{ flex: 1 }} />
              {checked.size > 0 ? (
                <>
                  <Badge>{checked.size} seleccionada{checked.size === 1 ? '' : 's'}</Badge>
                  <Button size="md" variant="secondary" icon="copy">Duplicar</Button>
                  <Button size="md" variant="secondary" icon="archive">Archivar</Button>
                  <Button size="md" variant="secondary" icon="trash">Eliminar</Button>
                </>
              ) : (
                <>
                  <Badge>{rows.length} de {NOTIFICATIONS.length}</Badge>
                  <Button size="md" variant="secondary" icon="download">CSV</Button>
                </>
              )}
            </div>

            <div className="tbl-wrap">
              <table className="tbl">
                <thead>
                  <tr>
                    <th style={{ width: 36 }}>
                      <IndeterminateCheckbox checked={allChecked} indeterminate={someChecked}
                                onChange={(e) => setChecked(e.target.checked ? new Set(rows.map(r => r.id)) : new Set())} />
                    </th>
                    <th>{t('tbl.title')}</th>
                    <th>{t('tbl.audience')}</th>
                    <th>{t('tbl.channels')}</th>
                    <th className="num">{t('tbl.recipients')}</th>
                    <th>{t('tbl.opens')}</th>
                    <th>{t('tbl.sent')}</th>
                    <th>{t('tbl.by')}</th>
                    <th>{t('tbl.status')}</th>
                    <th style={{ width: 40 }} />
                  </tr>
                </thead>
                <tbody>
                  {rows.length === 0 && (
                    <tr><td colSpan={10}>
                      <div style={{ textAlign: 'center', padding: '64px 24px', color: 'var(--ink-3)' }}>
                        <div style={{ width: 48, height: 48, borderRadius: 'var(--r-md)', background: 'var(--bg-sub)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ink-4)', marginBottom: 12 }}>
                          <Icon name="bell" size={20} />
                        </div>
                        <div style={{ color: 'var(--ink-1)', fontWeight: 500, fontSize: 'var(--t-15)' }}>
                          {tab === 'scheduled' ? 'No hay notificaciones programadas' :
                           tab === 'drafts'    ? 'No hay borradores'                   :
                                                  'Sin resultados'}
                        </div>
                        <div style={{ marginTop: 4, fontSize: 'var(--t-13)' }}>
                          {tab === 'scheduled' ? 'Componé una notificación y programala para una fecha futura.' :
                           tab === 'drafts'    ? 'Los borradores aparecerán acá cuando guardes uno sin enviar.' :
                                                  'Probá quitar filtros o ajustar la búsqueda.'}
                        </div>
                      </div>
                    </td></tr>
                  )}
                  {rows.map(n => {
                    const totalOpens = n.openInApp + n.openEmail;
                    const openPct = n.recipients ? Math.round((totalOpens / (n.recipients * n.channels.length)) * 100) : 0;
                    return (
                      <tr key={n.id} onClick={() => setDetail(n)}>
                        <td onClick={(e) => e.stopPropagation()}>
                          <Checkbox checked={checked.has(n.id)}
                                    onChange={(e) => {
                                      const next = new Set(checked);
                                      if (e.target.checked) next.add(n.id); else next.delete(n.id);
                                      setChecked(next);
                                    }} />
                        </td>
                        <td className="title-cell">
                          <div className="t">{n.title}</div>
                          <div className="b">{n.body || '(sin contenido)'}</div>
                        </td>
                        <td><AudienceCell audience={n.audience} /></td>
                        <td><ChannelIcons channels={n.channels} /></td>
                        <td className="num">{n.recipients ? n.recipients.toLocaleString() : '—'}</td>
                        <td>
                          {n.status === 'sent' ? <OpenRateBar value={openPct} /> :
                           n.status === 'failed' ? <span style={{ color: 'var(--danger)', fontFamily: 'var(--font-mono)', fontSize: 12 }}>0%</span> :
                           <span style={{ color: 'var(--ink-4)', fontFamily: 'var(--font-mono)', fontSize: 12 }}>—</span>}
                        </td>
                        <td className="when">{n.label}</td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <Avatar name={n.sentBy.name} size="sm" />
                            <span style={{ fontSize: 'var(--t-13)' }}>{n.sentBy.name}</span>
                          </div>
                        </td>
                        <td><StatusPill status={n.status} t={t} /></td>
                        <td className="actions" onClick={(e) => e.stopPropagation()}>
                          <Button size="sm" variant="tertiary" icon="more" iconOnly aria-label="Row actions" />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {rows.length > 0 && (
                <div className="tbl-ft">
                  <span style={{ fontFamily: 'var(--font-mono)' }}>
                    1–{rows.length} de {rows.length}
                  </span>
                  <div style={{ flex: 1 }} />
                  <Button size="sm" variant="secondary" disabled>Prev</Button>
                  <Button size="sm" variant="secondary" disabled>Next</Button>
                </div>
              )}
            </div>
          </>
        )}

        {tab === 'templates' && (
          <div>
            <div className="toolbar">
              <div className="search">
                <Input leadingIcon="search" placeholder="Buscar plantillas…" />
              </div>
              <div style={{ flex: 1 }} />
              <Button variant="secondary" icon="plus">Nueva plantilla</Button>
            </div>
            <div className="tpl-grid">
              {TEMPLATES.map(tp => (
                <div key={tp.id} className="tpl-card" onClick={() => setShowCompose(true)}>
                  <div className="top">
                    <Icon name="layers" size={12} />
                    Plantilla · {tp.channels.join(' + ')}
                  </div>
                  <h4>{tp.name}</h4>
                  <div className="desc">{tp.desc}</div>
                  <div style={{ background: 'var(--surface-sub)', border: '1px solid var(--border)', borderRadius: 'var(--r-sm)', padding: '8px 10px', fontSize: 11.5, color: 'var(--ink-2)' }}>
                    {tp.title}
                  </div>
                  <div className="vars">
                    {tp.variables.map(v => (
                      <span key={v} className="var-chip" style={{ pointerEvents: 'none' }}>{'{{' + v + '}}'}</span>
                    ))}
                  </div>
                  <div className="ft">
                    Usada {tp.used} veces
                    <Button size="sm" variant="link" trailing="arrowRight">Usar</Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'audiences' && (
          <div>
            <div className="toolbar">
              <div className="search">
                <Input leadingIcon="search" placeholder="Buscar audiencias…" />
              </div>
              <div style={{ flex: 1 }} />
              <Button variant="secondary" icon="plus">Nueva audiencia</Button>
            </div>
            <div className="audiences-grid">
              {SAVED_AUDIENCES.map(a => (
                <div key={a.id} className="aud-card">
                  <div style={{ width: 40, height: 40, borderRadius: 'var(--r-md)', background: 'var(--primary-soft)', color: 'var(--primary-soft-fg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon name="folder" size={18} />
                  </div>
                  <div className="info">
                    <div className="name">{a.name}</div>
                    <div className="desc">{a.desc}</div>
                    <div className="meta">
                      <span>Última usada · hace 3 días</span>
                      <span>14 envíos totales</span>
                    </div>
                  </div>
                  <div className="count">{a.count.toLocaleString()}</div>
                  <Button size="sm" variant="secondary" onClick={() => setShowCompose(true)}>Usar</Button>
                </div>
              ))}
              {SEGMENTS.map(s => (
                <div key={s.id} className="aud-card">
                  <div style={{ width: 40, height: 40, borderRadius: 'var(--r-md)', background: 'var(--info-soft)', color: 'var(--info)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon name="spark" size={18} />
                  </div>
                  <div className="info">
                    <div className="name">{s.name} <Badge tone="info" style={{ marginLeft: 6 }}>auto</Badge></div>
                    <div className="desc">Segmento generado automáticamente · se recalcula cada hora</div>
                  </div>
                  <div className="count">{s.count.toLocaleString()}</div>
                  <Button size="sm" variant="secondary" onClick={() => setShowCompose(true)}>Usar</Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* DRAWERS */}
      {showCompose && (
        <ComposeDrawer onClose={() => setShowCompose(false)} t={t} />
      )}
      {detail && (
        <DetailDrawer notif={detail} onClose={() => setDetail(null)}
                      onDuplicate={() => { setDetail(null); setShowCompose(true); }} t={t} />
      )}

      {/* TWEAKS */}
      <TweaksPanel title="Notifications tweaks">
        <TweakSection label="Flow">
          <TweakButton label="Open compose drawer" onClick={() => setShowCompose(true)} />
          <TweakButton label="Open most recent detail" onClick={() => setDetail(NOTIFICATIONS[0])} secondary />
        </TweakSection>
        <TweakSection label="Display">
          <TweakRadio label="Density" value={tweaks.density}
                      options={['compact', 'comfortable', 'spacious']}
                      onChange={(v) => setTweak('density', v)} />
          <TweakToggle label="Dark mode" value={tweaks.dark}
                       onChange={(v) => setTweak('dark', v)} />
        </TweakSection>
      </TweaksPanel>
    </div>
  );
}

(function () {
  const s = document.createElement('style');
  s.id = 'nf-app';
  s.textContent = __APP_CSS;
  document.head.appendChild(s);
})();

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
