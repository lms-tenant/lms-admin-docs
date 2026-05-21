// compose.jsx — Compose drawer that slides over the history page.

const __COMPOSE_CSS = `
  /* Drawer chrome */
  .nf-drawer-bg {
    position: fixed; inset: 0; z-index: 90;
    background: var(--overlay);
    animation: nf-fadeIn 160ms ease-out;
  }
  @keyframes nf-fadeIn { from { opacity: 0; } to { opacity: 1; } }
  .nf-drawer {
    position: fixed; top: 0; right: 0; bottom: 0;
    width: 760px; max-width: 100vw;
    background: var(--bg);
    box-shadow: var(--shadow-4);
    z-index: 91;
    display: flex; flex-direction: column;
    animation: nf-slideIn 220ms cubic-bezier(.3,.7,.4,1);
    overflow: hidden;
  }
  @keyframes nf-slideIn {
    from { transform: translateX(20px); opacity: 0; }
    to   { transform: translateX(0); opacity: 1; }
  }
  .nf-drawer-hd {
    flex-shrink: 0;
    padding: 16px 22px;
    background: var(--surface);
    border-bottom: 1px solid var(--border);
    display: flex; align-items: center; gap: 12px;
  }
  .nf-drawer-hd h2 { font-size: var(--t-18); font-family: var(--font-display); font-weight: 600; letter-spacing: -0.01em; }
  .nf-drawer-hd .sub { color: var(--ink-3); font-size: var(--t-13); }
  .nf-drawer-body {
    flex: 1; min-height: 0; overflow-y: auto;
    padding: 20px 22px 32px;
    display: flex; flex-direction: column; gap: 18px;
  }
  .nf-drawer-ft {
    flex-shrink: 0;
    padding: 14px 22px;
    background: var(--surface);
    border-top: 1px solid var(--border);
    display: flex; align-items: center; gap: 10px;
  }

  /* Section card inside drawer */
  .cmp-sec {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--r-lg);
    overflow: hidden;
  }
  .cmp-sec-hd {
    padding: 14px 18px;
    border-bottom: 1px solid var(--border);
    display: flex; align-items: center; gap: 14px;
    background: var(--surface);
  }
  .cmp-sec-hd .num {
    font-family: var(--font-mono); font-size: 10.5px;
    color: var(--ink-4); text-transform: uppercase; letter-spacing: 0.08em;
    width: 32px;
  }
  .cmp-sec-hd h4 { font-size: var(--t-15); font-family: var(--font-display); font-weight: 600; letter-spacing: -0.005em; }
  .cmp-sec-hd .badge {
    font-family: var(--font-mono); font-size: 10.5px;
    background: var(--bg-sub); color: var(--ink-3);
    padding: 2px 8px; border-radius: var(--r-pill);
    text-transform: uppercase; letter-spacing: 0.06em;
  }
  .cmp-sec-bd {
    padding: 18px;
    display: flex; flex-direction: column; gap: 14px;
  }

  /* Reach summary tile */
  .cmp-reach {
    display: flex; align-items: center; gap: 14px;
    padding: 12px 14px;
    background: var(--surface-sub);
    border-radius: var(--r-md);
    border: 1px solid var(--border);
  }
  .cmp-reach .num-big {
    font-family: var(--font-display);
    font-weight: 500; font-size: var(--t-32);
    letter-spacing: -0.02em; line-height: 1;
    color: var(--ink-1);
  }
  .cmp-reach .lbl {
    font-family: var(--font-mono); font-size: 10.5px;
    color: var(--ink-3); text-transform: uppercase; letter-spacing: 0.06em;
  }

  /* Variables chips row */
  .var-row {
    display: flex; flex-wrap: wrap; gap: 4px; align-items: center;
    font-size: 11.5px; color: var(--ink-3);
  }
  .var-row .lbl {
    font-family: var(--font-mono); font-size: 10px;
    text-transform: uppercase; letter-spacing: 0.06em; color: var(--ink-4);
    margin-right: 4px;
  }

  /* Schedule date/time row */
  .sch-grid {
    display: grid; grid-template-columns: 1fr 1fr 1.2fr;
    gap: 10px;
  }

  /* Preview tabs */
  .prev-tabs {
    display: flex; padding: 3px;
    background: var(--bg-sub);
    border-radius: var(--r-sm);
    width: fit-content;
  }
  .prev-tabs button {
    appearance: none; border: 0; background: transparent;
    padding: 5px 12px; height: 26px;
    border-radius: calc(var(--r-sm) - 1px);
    font: 500 12px var(--font-body);
    color: var(--ink-3); cursor: pointer;
  }
  .prev-tabs button.on { background: var(--surface); color: var(--ink-1); box-shadow: var(--shadow-1); }

  /* Channel toggle row */
  .ch-row {
    display: flex; align-items: center; gap: 14px;
    padding: 12px 14px;
    border: 1px solid var(--border);
    border-radius: var(--r-md);
    background: var(--surface);
  }
  .ch-row + .ch-row { margin-top: 8px; }
  .ch-row[data-on="0"] { opacity: 0.55; }
  .ch-row .ic-tile {
    width: 32px; height: 32px;
    border-radius: var(--r-sm);
    background: var(--primary-soft);
    color: var(--primary-soft-fg);
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }
  .ch-row .info { flex: 1; min-width: 0; }
  .ch-row .name { font-weight: 500; font-size: var(--t-14); }
  .ch-row .desc { color: var(--ink-3); font-size: var(--t-12); }
`;

// ── AUDIENCE PICKER (one of 7 kinds) ────────────────────────
function AudiencePicker({ kind, selected, setSelected }) {
  if (kind === 'all') {
    return (
      <div style={{ padding: '14px 16px', background: 'var(--surface-sub)', borderRadius: 'var(--r-md)', border: '1px solid var(--border)', color: 'var(--ink-3)', fontSize: 'var(--t-13)' }}>
        Se enviará a <b style={{ color: 'var(--ink-1)' }}>todos los estudiantes activos</b> del tenant.
      </div>
    );
  }
  if (kind === 'course') {
    return (
      <div className="sel-list scrolls">
        {COURSES.map(c => {
          const on = selected.some(s => s.kind === 'course' && s.id === c.id);
          return (
            <div key={c.id} className="sel-row" data-on={on ? '1' : '0'}
                 onClick={() => setSelected(prev => on
                   ? prev.filter(s => !(s.kind === 'course' && s.id === c.id))
                   : [...prev, { kind: 'course', id: c.id, label: c.name, count: c.students }])}>
              <Icon name="book" size={14} style={{ color: 'var(--ink-3)' }} />
              <span className="name">{c.name}</span>
              <span className="meta">{c.students} students</span>
              {on && <Icon name="check" size={14} style={{ color: 'var(--primary)' }} />}
            </div>
          );
        })}
      </div>
    );
  }
  if (kind === 'cohort') {
    return (
      <div className="sel-list">
        {COHORTS.map(c => {
          const on = selected.some(s => s.kind === 'cohort' && s.id === c.id);
          return (
            <div key={c.id} className="sel-row" data-on={on ? '1' : '0'}
                 onClick={() => setSelected(prev => on
                   ? prev.filter(s => !(s.kind === 'cohort' && s.id === c.id))
                   : [...prev, { kind: 'cohort', id: c.id, label: c.name, count: c.students }])}>
              <Icon name="layers" size={14} style={{ color: 'var(--ink-3)' }} />
              <span className="name">{c.name}</span>
              <Badge tone={c.status === 'active' ? 'primary' : c.status === 'completed' ? 'neutral' : 'info'}>{c.status}</Badge>
              <span className="meta">{c.students}</span>
              {on && <Icon name="check" size={14} style={{ color: 'var(--primary)' }} />}
            </div>
          );
        })}
      </div>
    );
  }
  if (kind === 'role') {
    return (
      <div className="sel-list">
        {ROLES.map(r => {
          const on = selected.some(s => s.kind === 'role' && s.id === r.id);
          return (
            <div key={r.id} className="sel-row" data-on={on ? '1' : '0'}
                 onClick={() => setSelected(prev => on
                   ? prev.filter(s => !(s.kind === 'role' && s.id === r.id))
                   : [...prev, { kind: 'role', id: r.id, label: r.name, count: r.count }])}>
              <Icon name="flag" size={14} style={{ color: 'var(--ink-3)' }} />
              <span className="name">{r.name}</span>
              <span className="meta">{r.count.toLocaleString()}</span>
              {on && <Icon name="check" size={14} style={{ color: 'var(--primary)' }} />}
            </div>
          );
        })}
      </div>
    );
  }
  if (kind === 'segment') {
    return (
      <div className="sel-list scrolls">
        {SEGMENTS.map(s => {
          const on = selected.some(x => x.kind === 'segment' && x.id === s.id);
          return (
            <div key={s.id} className="sel-row" data-on={on ? '1' : '0'}
                 onClick={() => setSelected(prev => on
                   ? prev.filter(x => !(x.kind === 'segment' && x.id === s.id))
                   : [...prev, { kind: 'segment', id: s.id, label: s.name, count: s.count }])}>
              <Icon name="spark" size={14} style={{ color: 'var(--ink-3)' }} />
              <span className="name">{s.name}</span>
              {s.auto && <Badge tone="info">auto</Badge>}
              <span className="meta">{s.count}</span>
              {on && <Icon name="check" size={14} style={{ color: 'var(--primary)' }} />}
            </div>
          );
        })}
      </div>
    );
  }
  if (kind === 'saved') {
    return (
      <div className="sel-list">
        {SAVED_AUDIENCES.map(a => {
          const on = selected.some(s => s.kind === 'saved' && s.id === a.id);
          return (
            <div key={a.id} className="sel-row" data-on={on ? '1' : '0'} style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 4 }}
                 onClick={() => setSelected(prev => on
                   ? prev.filter(s => !(s.kind === 'saved' && s.id === a.id))
                   : [...prev, { kind: 'saved', id: a.id, label: a.name, count: a.count }])}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%' }}>
                <Icon name="folder" size={14} style={{ color: 'var(--ink-3)' }} />
                <span className="name">{a.name}</span>
                <span className="meta">{a.count}</span>
                {on && <Icon name="check" size={14} style={{ color: 'var(--primary)' }} />}
              </div>
              <div style={{ paddingLeft: 24, color: 'var(--ink-4)', fontSize: 11.5 }}>{a.desc}</div>
            </div>
          );
        })}
      </div>
    );
  }
  if (kind === 'individual') {
    const [q, setQ] = React.useState('');
    const filtered = PEOPLE.filter(p => p.name.toLowerCase().includes(q.toLowerCase()) || p.email.toLowerCase().includes(q.toLowerCase()));
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <Input leadingIcon="search" placeholder="Buscar por nombre o email…" value={q} onChange={(e) => setQ(e.target.value)} />
        <div className="sel-list scrolls">
          {filtered.map(p => {
            const on = selected.some(s => s.kind === 'individual' && s.id === p.id);
            return (
              <div key={p.id} className="sel-row" data-on={on ? '1' : '0'}
                   onClick={() => setSelected(prev => on
                     ? prev.filter(s => !(s.kind === 'individual' && s.id === p.id))
                     : [...prev, { kind: 'individual', id: p.id, label: p.name, sub: p.email, count: 1 }])}>
                <Avatar name={p.name} size="sm" />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 'var(--t-13)' }}>{p.name}</div>
                  <div style={{ color: 'var(--ink-4)', fontSize: 11 }}>{p.email}</div>
                </div>
                <Badge>{p.role}</Badge>
                {on && <Icon name="check" size={14} style={{ color: 'var(--primary)' }} />}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
  return null;
}

// ── COMPOSE DRAWER ──────────────────────────────────────────
function ComposeDrawer({ onClose, t }) {
  const [audKind, setAudKind] = React.useState(null);
  const [selected, setSelected] = React.useState([]);
  const [title, setTitle] = React.useState('');
  const [body, setBody] = React.useState('');
  const [subject, setSubject] = React.useState('');
  const [ctaLabel, setCtaLabel] = React.useState('');
  const [ctaUrl, setCtaUrl] = React.useState('');
  const [showCta, setShowCta] = React.useState(false);
  const [chInApp, setChInApp] = React.useState(true);
  const [chEmail, setChEmail] = React.useState(true);
  const [when, setWhen] = React.useState('now');
  const [date, setDate] = React.useState('2026-05-22');
  const [time, setTime] = React.useState('09:00');
  const [tz, setTz] = React.useState('Tenant time · UTC-03');
  const [saveTpl, setSaveTpl] = React.useState(false);
  const [previewTab, setPreviewTab] = React.useState('inapp');

  const titleRef = React.useRef(null);
  const bodyRef = React.useRef(null);
  // Refs declared in case we add focus management later; not currently used
  // for DOM access since Input/Textarea are function components.

  // Estimated reach derived from selected audience tiles
  const reach = React.useMemo(() => {
    if (audKind === 'all') return 1284;
    return selected.reduce((sum, s) => sum + (s.count || 0), 0);
  }, [audKind, selected]);

  const insertVar = (which, token) => {
    if (which === 'title') setTitle(t => t + ' ' + token);
    else setBody(b => b + ' ' + token);
  };

  const audienceTiles = [
    { k: 'all',        l: t('aud.all') },
    { k: 'course',     l: t('aud.course') },
    { k: 'cohort',     l: t('aud.cohort') },
    { k: 'role',       l: t('aud.role') },
    { k: 'individual', l: t('aud.individual') },
    { k: 'segment',    l: t('aud.segment') },
    { k: 'saved',      l: t('aud.saved') },
  ];

  return (
    <>
      <div className="nf-drawer-bg" onClick={onClose} />
      <div className="nf-drawer">
        <header className="nf-drawer-hd">
          <div style={{ width: 36, height: 36, borderRadius: 'var(--r-sm)', background: 'var(--primary-soft)', color: 'var(--primary-soft-fg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="bell" size={18} />
          </div>
          <div style={{ flex: 1 }}>
            <h2>{t('cmp.title')}</h2>
            <div className="sub">{t('cmp.subtitle')}</div>
          </div>
          <Button size="sm" variant="tertiary" icon="x" iconOnly aria-label={t('btn.close')} onClick={onClose} />
        </header>

        <div className="nf-drawer-body scrolls">

          {/* AUDIENCE */}
          <section className="cmp-sec">
            <header className="cmp-sec-hd">
              <span className="num">01</span>
              <h4>{t('cmp.sec.audience')}</h4>
              <div style={{ flex: 1 }} />
              {reach > 0 && <span className="badge">{reach.toLocaleString()} {t('det.recipients').toLowerCase()}</span>}
            </header>
            <div className="cmp-sec-bd">
              <div className="aud-grid">
                {audienceTiles.map(at => (
                  <AudienceTile key={at.k} kind={at.k} label={at.l}
                                on={audKind === at.k}
                                onClick={() => { setAudKind(at.k); if (at.k === 'all') setSelected([{ kind: 'all', id: 'all', label: t('aud.all'), count: 1284 }]); }} />
                ))}
              </div>

              {audKind && audKind !== 'all' && (
                <AudiencePicker kind={audKind} selected={selected} setSelected={setSelected} />
              )}
              {audKind === 'all' && <AudiencePicker kind="all" selected={selected} setSelected={setSelected} />}

              {selected.length > 0 && audKind !== 'all' && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {selected.map((s, i) => (
                    <AudienceChip key={s.kind + s.id + i} kind={s.kind} label={s.label}
                                  onRemove={() => setSelected(prev => prev.filter((_, j) => j !== i))} />
                  ))}
                </div>
              )}

              {reach > 0 && (
                <div className="cmp-reach">
                  <div>
                    <div className="num-big">{reach.toLocaleString()}</div>
                    <div className="lbl">{t('aud.estimated')}</div>
                  </div>
                  <div style={{ flex: 1 }} />
                  <div style={{ display: 'flex', gap: 18, fontSize: 'var(--t-13)' }}>
                    {chInApp && <div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>in-app</div>
                      <div style={{ fontWeight: 500, marginTop: 2 }}>{reach.toLocaleString()}</div>
                    </div>}
                    {chEmail && <div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>email</div>
                      <div style={{ fontWeight: 500, marginTop: 2 }}>{Math.round(reach * 0.97).toLocaleString()}</div>
                    </div>}
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* CONTENT */}
          <section className="cmp-sec">
            <header className="cmp-sec-hd">
              <span className="num">02</span>
              <h4>{t('cmp.sec.content')}</h4>
              <div style={{ flex: 1 }} />
              <span className="badge">{body.length}/500</span>
            </header>
            <div className="cmp-sec-bd">
              <FieldGroup label={t('fld.title')} required>
                <Input value={title} placeholder={t('fld.title.ph')}
                       onChange={(e) => setTitle(e.target.value)} />
                <div className="var-row" style={{ marginTop: 6 }}>
                  <span className="lbl">{t('fld.variables')}</span>
                  {VARIABLES.slice(0, 4).map(v => (
                    <button key={v.token} className="var-chip" onClick={() => insertVar('title', v.token)}>{v.token}</button>
                  ))}
                </div>
              </FieldGroup>

              <FieldGroup label={t('fld.body')} hint={t('fld.body.hint')}>
                <Textarea value={body} placeholder={t('fld.body.ph')}
                          onChange={(e) => setBody(e.target.value)} style={{ minHeight: 120 }} />
                <div className="var-row" style={{ marginTop: 6 }}>
                  <span className="lbl">{t('fld.variables')}</span>
                  {VARIABLES.map(v => (
                    <button key={v.token} className="var-chip" onClick={() => insertVar('body', v.token)}>{v.token}</button>
                  ))}
                </div>
              </FieldGroup>

              {!showCta ? (
                <Button size="sm" variant="tertiary" icon="plus" onClick={() => setShowCta(true)}>{t('fld.cta')}</Button>
              ) : (
                <div className="cmp-sec" style={{ background: 'var(--surface-sub)' }}>
                  <div className="cmp-sec-bd">
                    <div className="cb-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 12 }}>
                      <FieldGroup label={t('fld.cta.label')}>
                        <Input value={ctaLabel} placeholder="Abrir el curso" onChange={(e) => setCtaLabel(e.target.value)} />
                      </FieldGroup>
                      <FieldGroup label={t('fld.cta.url')}>
                        <Input value={ctaUrl} placeholder="https://learn.acme.edu/c/advanced-react" leadingIcon="link" onChange={(e) => setCtaUrl(e.target.value)} />
                      </FieldGroup>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <Button size="sm" variant="tertiary" icon="trash" onClick={() => { setShowCta(false); setCtaLabel(''); setCtaUrl(''); }}>{t('btn.cancel')}</Button>
                    </div>
                  </div>
                </div>
              )}

              {chEmail && (
                <FieldGroup label={t('fld.subject')} hint={t('fld.subject.hint')}>
                  <Input value={subject} placeholder={interpolate(title) || ' '} onChange={(e) => setSubject(e.target.value)} leadingIcon="inbox" />
                </FieldGroup>
              )}

              <label style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 'var(--t-13)', color: 'var(--ink-2)', cursor: 'pointer' }}>
                <Checkbox checked={saveTpl} onChange={(e) => setSaveTpl(e.target.checked)} />
                {t('btn.template')}
              </label>
            </div>
          </section>

          {/* CHANNELS */}
          <section className="cmp-sec">
            <header className="cmp-sec-hd">
              <span className="num">03</span>
              <h4>{t('cmp.sec.channels')}</h4>
            </header>
            <div className="cmp-sec-bd">
              <div>
                <div className="ch-row" data-on={chInApp ? '1' : '0'}>
                  <div className="ic-tile"><Icon name="bell" size={16} /></div>
                  <div className="info">
                    <div className="name">In-app</div>
                    <div className="desc">Aparece en la campana de SkillsRamp. Entrega instantánea.</div>
                  </div>
                  <Switch checked={chInApp} onChange={(e) => setChInApp(e.target.checked)} />
                </div>
                <div className="ch-row" data-on={chEmail ? '1' : '0'}>
                  <div className="ic-tile"><Icon name="inbox" size={16} /></div>
                  <div className="info">
                    <div className="name">Email</div>
                    <div className="desc">Enviado desde noreply@learn.acme.edu. Soporta CTA y variables.</div>
                  </div>
                  <Switch checked={chEmail} onChange={(e) => setChEmail(e.target.checked)} />
                </div>
              </div>
            </div>
          </section>

          {/* SCHEDULE */}
          <section className="cmp-sec">
            <header className="cmp-sec-hd">
              <span className="num">04</span>
              <h4>{t('cmp.sec.schedule')}</h4>
            </header>
            <div className="cmp-sec-bd">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <Radio name="when" label={t('sch.now')} sublabel="Inicia el envío en cuanto confirmás." checked={when === 'now'} onChange={() => setWhen('now')} />
                <Radio name="when" label={t('sch.later')} sublabel="Elegí fecha y hora exactas." checked={when === 'later'} onChange={() => setWhen('later')} />
              </div>
              {when === 'later' && (
                <div className="sch-grid">
                  <FieldGroup label={t('sch.date')}>
                    <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                  </FieldGroup>
                  <FieldGroup label={t('sch.time')}>
                    <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
                  </FieldGroup>
                  <FieldGroup label={t('sch.tz')}>
                    <Select value={tz} onChange={(e) => setTz(e.target.value)}>
                      <option>Tenant time · UTC-03</option>
                      <option>UTC</option>
                      <option>Per-recipient timezone</option>
                    </Select>
                  </FieldGroup>
                </div>
              )}
            </div>
          </section>

          {/* PREVIEW */}
          <section className="cmp-sec">
            <header className="cmp-sec-hd">
              <span className="num">05</span>
              <h4>{t('cmp.sec.preview')}</h4>
              <div style={{ flex: 1 }} />
              <div className="prev-tabs">
                <button className={previewTab === 'inapp' ? 'on' : ''} onClick={() => setPreviewTab('inapp')} disabled={!chInApp}>
                  {t('prev.tab.inapp')}
                </button>
                <button className={previewTab === 'email' ? 'on' : ''} onClick={() => setPreviewTab('email')} disabled={!chEmail}>
                  {t('prev.tab.email')}
                </button>
              </div>
            </header>
            <div className="cmp-sec-bd" style={{ alignItems: 'flex-start' }}>
              {previewTab === 'inapp' && chInApp && (
                <InAppPreview title={title} body={body} cta={showCta ? { label: ctaLabel, url: ctaUrl } : null} />
              )}
              {previewTab === 'email' && chEmail && (
                <EmailPreview title={title} body={body} subject={subject} cta={showCta ? { label: ctaLabel, url: ctaUrl } : null} />
              )}
            </div>
          </section>
        </div>

        <footer className="nf-drawer-ft">
          <Button variant="tertiary">{t('btn.saveDraft')}</Button>
          <div style={{ flex: 1 }} />
          <Button variant="secondary" icon="eye" onClick={() => alert('Send a test to your inbox')}>Enviar a mí</Button>
          {when === 'now'
            ? <Button variant="primary" icon="send" disabled={!title || reach === 0} onClick={onClose}>{t('btn.sendNow')} · {reach.toLocaleString()}</Button>
            : <Button variant="primary" icon="calendar" disabled={!title || reach === 0} onClick={onClose}>{t('btn.scheduleBtn')} · {date} {time}</Button>}
        </footer>
      </div>
    </>
  );
}

(function () {
  const s = document.createElement('style');
  s.id = 'cmp-styles';
  s.textContent = __COMPOSE_CSS;
  document.head.appendChild(s);
})();

Object.assign(window, { ComposeDrawer });
