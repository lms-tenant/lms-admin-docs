// detail.jsx — Drawer that opens when a notification row is clicked.
// Shows message, per-channel delivery, and per-recipient status.

const __DETAIL_CSS = `
  .det-meta {
    display: grid; grid-template-columns: 1fr 1fr; gap: 14px;
  }
  .det-meta .cell {
    background: var(--surface-sub);
    border: 1px solid var(--border);
    border-radius: var(--r-md);
    padding: 10px 12px;
  }
  .det-meta .cell .k {
    font-family: var(--font-mono); font-size: 10.5px;
    color: var(--ink-3); text-transform: uppercase; letter-spacing: 0.06em;
  }
  .det-meta .cell .v {
    margin-top: 4px; font-size: var(--t-14); color: var(--ink-1);
    display: flex; align-items: center; gap: 8px;
  }

  /* Channel breakdown cards */
  .det-chans {
    display: grid; grid-template-columns: 1fr 1fr; gap: 12px;
  }
  .det-ch {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--r-md);
    padding: 14px 16px;
  }
  .det-ch .hd {
    display: flex; align-items: center; gap: 10px;
    margin-bottom: 10px;
  }
  .det-ch .hd .ic {
    width: 28px; height: 28px;
    border-radius: var(--r-sm);
    background: var(--primary-soft);
    color: var(--primary-soft-fg);
    display: flex; align-items: center; justify-content: center;
  }
  .det-ch .hd .name {
    font-family: var(--font-display); font-weight: 600;
    font-size: var(--t-14); letter-spacing: -0.005em;
  }
  .det-ch .stats {
    display: grid; grid-template-columns: 1fr 1fr; gap: 8px;
    margin-top: 8px;
  }
  .det-ch .stat {
    background: var(--bg-sub);
    padding: 10px 12px;
    border-radius: var(--r-sm);
  }
  .det-ch .stat .k {
    font-family: var(--font-mono); font-size: 9.5px;
    color: var(--ink-3); text-transform: uppercase; letter-spacing: 0.06em;
  }
  .det-ch .stat .v {
    margin-top: 2px;
    font-family: var(--font-display); font-weight: 500;
    font-size: var(--t-20); color: var(--ink-1);
    letter-spacing: -0.015em; line-height: 1.1;
  }
  .det-ch .stat .v small {
    font-family: var(--font-mono); font-size: 10.5px;
    color: var(--ink-3); font-weight: 500; letter-spacing: 0;
    margin-left: 4px;
  }

  /* Recipient table */
  .rec-tbl {
    width: 100%; border-collapse: collapse;
    font-size: var(--t-13);
  }
  .rec-tbl th, .rec-tbl td {
    padding: 8px 12px;
    border-bottom: 1px solid var(--border);
    text-align: left;
  }
  .rec-tbl th {
    font-family: var(--font-mono); font-size: 10px;
    color: var(--ink-3); text-transform: uppercase; letter-spacing: 0.06em;
    background: var(--bg-sub);
    font-weight: 500;
  }
  .rec-tbl tbody tr:hover td { background: var(--surface-sub); }
  .rec-tbl tbody tr:last-child td { border-bottom: 0; }
  .rec-st {
    display: inline-flex; align-items: center; gap: 4px;
    font-size: 11px;
    font-family: var(--font-mono);
    text-transform: uppercase; letter-spacing: 0.04em;
  }
  .rec-st[data-st="opened"]    { color: var(--success); }
  .rec-st[data-st="delivered"] { color: var(--ink-3); }
  .rec-st[data-st="failed"]    { color: var(--danger); }
  .rec-st[data-st="bounced"]   { color: var(--danger); }
  .rec-st .dot { width: 5px; height: 5px; border-radius: 50%; background: currentColor; }

  /* Filter pills above recipient table */
  .rec-filters {
    display: flex; gap: 6px; flex-wrap: wrap;
  }
  .rec-filter {
    appearance: none; border: 1px solid var(--border);
    background: var(--surface);
    border-radius: var(--r-pill);
    padding: 4px 12px;
    font-family: inherit; font-size: 12px;
    color: var(--ink-2); cursor: pointer;
  }
  .rec-filter[data-on="1"] {
    background: var(--ink-1); color: var(--bg);
    border-color: var(--ink-1);
  }

  /* Failure callout */
  .det-error {
    display: flex; gap: 12px;
    padding: 12px 14px;
    background: var(--danger-soft);
    color: var(--danger);
    border-radius: var(--r-md);
    font-size: var(--t-13);
  }
`;

function DetailDrawer({ notif, onClose, onDuplicate, t }) {
  const [recFilter, setRecFilter] = React.useState('all');
  if (!notif) return null;
  const total = notif.recipients;
  const delPct = total ? Math.round((notif.delivered / total) * 100) : 0;
  const inAppPct = total && notif.channels.includes('in-app') ? Math.round((notif.openInApp / total) * 100) : 0;
  const emailPct = total && notif.channels.includes('email') ? Math.round((notif.openEmail / total) * 100) : 0;
  const clickPct = total ? Math.round((notif.clicks / total) * 100) : 0;

  // Filtered recipient mock
  const filtered = RECIPIENTS.filter(r => {
    if (recFilter === 'all') return true;
    if (recFilter === 'opened') return r.inApp === 'opened' || r.email_s === 'opened';
    if (recFilter === 'clicked') return r.clicked;
    if (recFilter === 'failed') return r.email_s === 'failed' || r.email_s === 'bounced';
    return true;
  });

  const sentTime = notif.sentAt ? new Date(notif.sentAt).toLocaleString('es-AR', { dateStyle: 'medium', timeStyle: 'short' }) : '—';

  return (
    <>
      <div className="nf-drawer-bg" onClick={onClose} />
      <div className="nf-drawer" style={{ width: 640 }}>
        <header className="nf-drawer-hd">
          <StatusPill status={notif.status} t={t} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <h2 style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{notif.title}</h2>
            <div className="sub">
              {notif.label} · {t('tbl.by')} <b style={{ color: 'var(--ink-2)' }}>{notif.sentBy.name}</b>
            </div>
          </div>
          <Button size="sm" variant="secondary" icon="copy" onClick={onDuplicate}>{t('btn.duplicate')}</Button>
          {notif.status === 'sent' && <Button size="sm" variant="secondary" icon="refresh">{t('btn.resend')}</Button>}
          <Button size="sm" variant="tertiary" icon="x" iconOnly aria-label={t('btn.close')} onClick={onClose} />
        </header>

        <div className="nf-drawer-body scrolls">
          {/* Failure callout */}
          {notif.status === 'failed' && notif.error && (
            <div className="det-error">
              <Icon name="alert" size={16} />
              <div>
                <div style={{ fontWeight: 600 }}>{t('det.failedDetail')}</div>
                <div style={{ marginTop: 2, opacity: 0.85 }}>{notif.error}</div>
              </div>
            </div>
          )}

          {/* Meta cells */}
          <div className="det-meta">
            <div className="cell">
              <div className="k">{t('cmp.sec.audience')}</div>
              <div className="v">
                <Icon name={AUD_ICON[notif.audience.kind]} size={14} style={{ color: 'var(--ink-3)' }} />
                {notif.audience.label}
              </div>
              <div style={{ color: 'var(--ink-4)', fontSize: 11.5, marginTop: 2 }}>{notif.audience.sub}</div>
            </div>
            <div className="cell">
              <div className="k">{notif.status === 'scheduled' ? 'Programado para' : t('tbl.sent')}</div>
              <div className="v">
                <Icon name="calendar" size={14} style={{ color: 'var(--ink-3)' }} />
                {sentTime}
              </div>
            </div>
            <div className="cell">
              <div className="k">{t('det.recipients')}</div>
              <div className="v" style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--t-20)', fontWeight: 500, letterSpacing: '-0.015em' }}>
                {notif.recipients.toLocaleString()}
              </div>
            </div>
            <div className="cell">
              <div className="k">{t('det.channels')}</div>
              <div className="v">
                <ChannelIcons channels={notif.channels} />
                <span style={{ color: 'var(--ink-3)', fontSize: 'var(--t-13)' }}>{notif.channels.join(' · ')}</span>
              </div>
            </div>
          </div>

          {/* Message */}
          <div className="cmp-sec">
            <header className="cmp-sec-hd">
              <h4>{t('det.message')}</h4>
              <div style={{ flex: 1 }} />
              <span className="badge">interpolated</span>
            </header>
            <div className="cmp-sec-bd" style={{ display: 'flex', flexDirection: 'row', gap: 14, flexWrap: 'wrap' }}>
              {notif.channels.includes('in-app') && (
                <div style={{ flex: 1, minWidth: 280 }}>
                  <Stamp>in-app</Stamp>
                  <div style={{ marginTop: 8 }}>
                    <InAppPreview title={notif.title} body={notif.body} />
                  </div>
                </div>
              )}
              {notif.channels.includes('email') && (
                <div style={{ flex: 1, minWidth: 320 }}>
                  <Stamp>email</Stamp>
                  <div style={{ marginTop: 8 }}>
                    <EmailPreview title={notif.title} body={notif.body} />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Per-channel stats */}
          {notif.status === 'sent' && (
            <div className="cmp-sec">
              <header className="cmp-sec-hd">
                <h4>{t('det.engagement')}</h4>
                <div style={{ flex: 1 }} />
                <span className="badge">{delPct}% delivered</span>
              </header>
              <div className="cmp-sec-bd">
                <div className="det-chans">
                  {notif.channels.includes('in-app') && (
                    <div className="det-ch">
                      <div className="hd">
                        <div className="ic"><Icon name="bell" size={14} /></div>
                        <div className="name">In-app</div>
                      </div>
                      <div className="stats">
                        <div className="stat"><div className="k">Sent</div><div className="v">{notif.recipients.toLocaleString()}</div></div>
                        <div className="stat"><div className="k">Delivered</div><div className="v">{notif.delivered.toLocaleString()}</div></div>
                        <div className="stat" style={{ gridColumn: 'span 2' }}>
                          <div className="k">Opened</div>
                          <div className="v">{notif.openInApp.toLocaleString()} <small>{inAppPct}%</small></div>
                        </div>
                      </div>
                    </div>
                  )}
                  {notif.channels.includes('email') && (
                    <div className="det-ch">
                      <div className="hd">
                        <div className="ic"><Icon name="inbox" size={14} /></div>
                        <div className="name">Email</div>
                      </div>
                      <div className="stats">
                        <div className="stat"><div className="k">Sent</div><div className="v">{notif.recipients.toLocaleString()}</div></div>
                        <div className="stat"><div className="k">Delivered</div><div className="v">{(notif.delivered).toLocaleString()}</div></div>
                        <div className="stat"><div className="k">Opened</div><div className="v">{notif.openEmail.toLocaleString()} <small>{emailPct}%</small></div></div>
                        <div className="stat"><div className="k">Clicked</div><div className="v">{notif.clicks.toLocaleString()} <small>{clickPct}%</small></div></div>
                      </div>
                    </div>
                  )}
                </div>

                {notif.failed > 0 && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--danger)', fontSize: 'var(--t-13)' }}>
                    <Icon name="alert" size={14} />
                    {notif.failed} envíos fallaron · revisar logs por destinatario
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Per-recipient list */}
          {notif.status === 'sent' && (
            <div className="cmp-sec">
              <header className="cmp-sec-hd">
                <h4>{t('det.perRecipient')}</h4>
                <div style={{ flex: 1 }} />
                <Button size="sm" variant="secondary" icon="download">CSV</Button>
              </header>
              <div className="cmp-sec-bd">
                <div className="rec-filters">
                  {[
                    ['all',       'Todos',         notif.recipients],
                    ['opened',    'Abiertos',      notif.openInApp + notif.openEmail],
                    ['clicked',   'Clickearon',    notif.clicks],
                    ['failed',    'Fallaron',      notif.failed],
                  ].map(([id, lbl, count]) => (
                    <button key={id} className="rec-filter" data-on={recFilter === id ? '1' : '0'}
                            onClick={() => setRecFilter(id)}>
                      {lbl} <span style={{ opacity: 0.55, marginLeft: 4 }}>{count.toLocaleString()}</span>
                    </button>
                  ))}
                </div>

                <table className="rec-tbl">
                  <thead>
                    <tr>
                      <th>Destinatario</th>
                      {notif.channels.includes('in-app') && <th>In-app</th>}
                      {notif.channels.includes('email')  && <th>Email</th>}
                      <th>Click</th>
                      <th>Dispositivo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.slice(0, 8).map(r => (
                      <tr key={r.email}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <Avatar name={r.name} size="sm" />
                            <div>
                              <div style={{ color: 'var(--ink-1)' }}>{r.name}</div>
                              <div style={{ color: 'var(--ink-4)', fontSize: 11 }}>{r.email}</div>
                            </div>
                          </div>
                        </td>
                        {notif.channels.includes('in-app') && (
                          <td>
                            <span className="rec-st" data-st={r.inApp}><span className="dot" />{r.inApp}</span>
                          </td>
                        )}
                        {notif.channels.includes('email') && (
                          <td>
                            <span className="rec-st" data-st={r.email_s}><span className="dot" />{r.email_s}</span>
                          </td>
                        )}
                        <td style={{ color: r.clicked ? 'var(--success)' : 'var(--ink-4)', fontFamily: 'var(--font-mono)', fontSize: 11 }}>
                          {r.clicked ? '✓ clicked' : '—'}
                        </td>
                        <td style={{ color: 'var(--ink-3)', fontFamily: 'var(--font-mono)', fontSize: 11 }}>{r.device}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filtered.length > 8 && (
                  <div style={{ color: 'var(--ink-3)', fontSize: 'var(--t-12)', textAlign: 'center' }}>
                    Mostrando 8 de {filtered.length.toLocaleString()} — exportá CSV para ver todos
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <footer className="nf-drawer-ft">
          {notif.status === 'scheduled' && <Button variant="tertiary" icon="x">Cancelar envío</Button>}
          {notif.status === 'draft' && <Button variant="tertiary" icon="trash">{t('btn.delete')}</Button>}
          <div style={{ flex: 1 }} />
          <Button variant="secondary" onClick={onClose}>{t('btn.close')}</Button>
          <Button variant="primary" icon="copy" onClick={onDuplicate}>{t('btn.duplicate')}</Button>
        </footer>
      </div>
    </>
  );
}

(function () {
  const s = document.createElement('style');
  s.id = 'det-styles';
  s.textContent = __DETAIL_CSS;
  document.head.appendChild(s);
})();

Object.assign(window, { DetailDrawer });
