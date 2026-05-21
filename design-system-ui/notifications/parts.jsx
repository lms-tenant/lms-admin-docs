// parts.jsx — small reusable pieces for the notifications page.

const __PARTS_CSS = `
  /* Channel icons */
  .nf-chans {
    display: inline-flex; gap: 4px;
  }
  .nf-chan-ic {
    width: 24px; height: 24px;
    border-radius: var(--r-sm);
    background: var(--bg-sub);
    color: var(--ink-2);
    display: inline-flex; align-items: center; justify-content: center;
  }
  .nf-chan-ic[data-on="0"] { opacity: 0.35; }

  /* Open-rate bar */
  .nf-rate {
    display: inline-flex; align-items: center; gap: 8px;
    font-variant-numeric: tabular-nums;
    font-family: var(--font-mono); font-size: 12px;
    color: var(--ink-2);
    min-width: 86px;
  }
  .nf-rate .bar {
    flex: 1;
    height: 6px;
    background: var(--bg-sub);
    border-radius: var(--r-pill);
    overflow: hidden;
  }
  .nf-rate .bar > i {
    display: block; height: 100%;
    background: var(--primary);
    border-radius: var(--r-pill);
  }
  .nf-rate.success .bar > i { background: var(--success); }

  /* Status pill — extends the design system Badge tone vocab with status-specific accent */
  .nf-st {
    display: inline-flex; align-items: center; gap: 6px;
    height: 22px; padding: 0 8px;
    border-radius: var(--r-pill);
    font-size: 11.5px; font-weight: 500;
    line-height: 1; letter-spacing: 0.01em;
    border: 1px solid transparent;
  }
  .nf-st .dot { width: 6px; height: 6px; border-radius: 50%; background: currentColor; }
  .nf-st[data-st="sent"]      { color: var(--success); background: var(--success-soft); }
  .nf-st[data-st="scheduled"] { color: var(--info);    background: var(--info-soft); }
  .nf-st[data-st="draft"]     { color: var(--ink-2);   background: var(--bg-sub); border-color: var(--border); }
  .nf-st[data-st="failed"]    { color: var(--danger);  background: var(--danger-soft); }

  /* Audience cell */
  .aud-cell {
    display: flex; flex-direction: column; gap: 2px;
    min-width: 0;
  }
  .aud-cell .label {
    display: flex; align-items: center; gap: 6px;
    font-size: var(--t-13); color: var(--ink-1);
    overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
  }
  .aud-cell .label .ic { color: var(--ink-3); flex-shrink: 0; }
  .aud-cell .sub { color: var(--ink-4); font-size: 11px; }

  /* IN-APP preview card */
  .nf-prev-inapp {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--r-md);
    padding: 14px 14px 12px;
    display: flex; gap: 12px;
    box-shadow: var(--shadow-2);
    max-width: 360px;
  }
  .nf-prev-inapp .ic-wrap {
    width: 34px; height: 34px;
    border-radius: var(--r-sm);
    background: var(--primary-soft);
    color: var(--primary-soft-fg);
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }
  .nf-prev-inapp .body { flex: 1; min-width: 0; }
  .nf-prev-inapp .body .t {
    font-weight: 600; font-size: var(--t-14); color: var(--ink-1);
    line-height: 1.3;
  }
  .nf-prev-inapp .body .m {
    color: var(--ink-2); font-size: var(--t-13);
    margin-top: 4px; line-height: 1.45;
  }
  .nf-prev-inapp .body .meta {
    margin-top: 8px;
    font-family: var(--font-mono); font-size: 10.5px;
    color: var(--ink-4); text-transform: uppercase; letter-spacing: 0.06em;
  }
  .nf-prev-inapp .body .cta {
    display: inline-flex; align-items: center; gap: 6px;
    margin-top: 10px;
    height: 28px; padding: 0 12px;
    border-radius: var(--r-sm);
    background: var(--primary); color: var(--on-primary);
    font-size: var(--t-13); font-weight: 500;
  }

  /* EMAIL preview */
  .nf-prev-email {
    border: 1px solid var(--border);
    border-radius: var(--r-md);
    overflow: hidden;
    background: var(--surface);
    box-shadow: var(--shadow-2);
    max-width: 420px;
  }
  .nf-prev-email .subj {
    padding: 10px 14px;
    background: var(--surface-sub);
    border-bottom: 1px solid var(--border);
    display: flex; gap: 8px; align-items: center;
    font-size: 12px;
  }
  .nf-prev-email .subj .lbl {
    font-family: var(--font-mono); font-size: 10px;
    color: var(--ink-4); text-transform: uppercase; letter-spacing: 0.08em;
  }
  .nf-prev-email .subj .v { color: var(--ink-1); font-weight: 500; flex: 1; min-width: 0; }
  .nf-prev-email .from {
    padding: 10px 14px;
    border-bottom: 1px solid var(--border);
    display: flex; gap: 10px; align-items: center;
  }
  .nf-prev-email .from .mark {
    width: 28px; height: 28px; border-radius: var(--r-sm);
    background: var(--primary); color: var(--on-primary);
    display: flex; align-items: center; justify-content: center;
    font-family: var(--font-display); font-weight: 700; font-size: 13px;
  }
  .nf-prev-email .from .info { display: flex; flex-direction: column; }
  .nf-prev-email .from .info b { font-size: var(--t-13); }
  .nf-prev-email .from .info span { font-size: 11px; color: var(--ink-3); }
  .nf-prev-email .body { padding: 18px 18px 22px; }
  .nf-prev-email .body h3 {
    font-family: var(--font-display); font-weight: 500;
    font-size: var(--t-18); letter-spacing: -0.01em;
    line-height: 1.25; margin-bottom: 10px;
  }
  .nf-prev-email .body p {
    color: var(--ink-2); font-size: var(--t-14); line-height: 1.55;
    margin-bottom: 14px;
  }
  .nf-prev-email .body .cta {
    display: inline-flex; align-items: center; gap: 6px;
    height: 36px; padding: 0 16px;
    background: var(--primary); color: var(--on-primary);
    border-radius: var(--r-md);
    font-size: var(--t-13); font-weight: 500;
  }
  .nf-prev-email .ft {
    padding: 12px 14px;
    border-top: 1px solid var(--border);
    text-align: center;
    color: var(--ink-4);
    font-family: var(--font-mono); font-size: 10px;
    letter-spacing: 0.04em;
  }

  /* Audience chip — selected entities in compose */
  .aud-chip {
    display: inline-flex; align-items: center; gap: 6px;
    height: 26px; padding: 0 4px 0 10px;
    background: var(--primary-soft);
    color: var(--primary-soft-fg);
    border-radius: var(--r-pill);
    font-size: 12px; font-weight: 500;
  }
  .aud-chip .ic { opacity: 0.7; }
  .aud-chip .x {
    width: 18px; height: 18px;
    border-radius: 50%;
    display: inline-flex; align-items: center; justify-content: center;
    cursor: pointer;
    color: currentColor; opacity: 0.6;
  }
  .aud-chip .x:hover { opacity: 1; background: rgba(0,0,0,.05); }
  [data-theme="dark"] .aud-chip .x:hover { background: rgba(255,255,255,.08); }

  /* Variable chip */
  .var-chip {
    appearance: none; border: 1px solid var(--border);
    background: var(--bg-sub);
    border-radius: var(--r-sm);
    padding: 3px 8px;
    font-family: var(--font-mono); font-size: 11px;
    color: var(--ink-2); cursor: pointer;
    font-weight: 500;
  }
  .var-chip:hover {
    background: var(--primary-soft); color: var(--primary-soft-fg);
    border-color: transparent;
  }

  /* Audience type picker grid */
  .aud-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 6px;
  }
  .aud-tile {
    appearance: none; border: 1px solid var(--border);
    background: var(--surface);
    border-radius: var(--r-md);
    padding: 12px 10px;
    cursor: pointer;
    display: flex; flex-direction: column; gap: 6px; align-items: flex-start;
    font-family: inherit; color: inherit; text-align: left;
    transition: border-color 120ms ease, background 120ms ease;
  }
  .aud-tile:hover { border-color: var(--border-strong); background: var(--surface-sub); }
  .aud-tile[data-on="1"] {
    border-color: var(--primary);
    background: var(--primary-soft);
    color: var(--primary-soft-fg);
    box-shadow: 0 0 0 1px var(--primary);
  }
  .aud-tile .ic {
    width: 24px; height: 24px; border-radius: var(--r-sm);
    background: var(--bg-sub); color: var(--ink-2);
    display: flex; align-items: center; justify-content: center;
  }
  .aud-tile[data-on="1"] .ic { background: var(--surface); color: var(--primary); }
  .aud-tile .name { font-weight: 500; font-size: var(--t-13); }

  /* Selection list (for course/cohort/role/segment/saved) */
  .sel-list {
    border: 1px solid var(--border);
    border-radius: var(--r-md);
    background: var(--surface);
    overflow: hidden;
    max-height: 280px;
    overflow-y: auto;
  }
  .sel-row {
    display: flex; align-items: center; gap: 10px;
    padding: 8px 12px;
    border-bottom: 1px solid var(--border);
    cursor: pointer;
    transition: background 100ms ease;
  }
  .sel-row:last-child { border-bottom: 0; }
  .sel-row:hover { background: var(--surface-sub); }
  .sel-row .name { flex: 1; min-width: 0; font-size: var(--t-13); }
  .sel-row .meta {
    color: var(--ink-3); font-family: var(--font-mono); font-size: 10.5px;
    text-transform: uppercase; letter-spacing: 0.06em;
  }
  .sel-row[data-on="1"] { background: var(--primary-soft); }
  .sel-row[data-on="1"] .name { color: var(--primary-soft-fg); font-weight: 500; }
`;

// ── Channel icons inline ──
function ChannelIcons({ channels = [], all = ['in-app', 'email'] }) {
  return (
    <span className="nf-chans">
      {all.map(c => (
        <span key={c} className="nf-chan-ic" data-on={channels.includes(c) ? '1' : '0'} title={c}>
          <Icon name={c === 'email' ? 'inbox' : 'bell'} size={14} />
        </span>
      ))}
    </span>
  );
}

// ── Open-rate bar ──
function OpenRateBar({ value, sub }) {
  const v = Math.max(0, Math.min(100, value || 0));
  return (
    <span className={'nf-rate' + (v >= 50 ? ' success' : '')}>
      <span>{v}%</span>
      <span className="bar"><i style={{ width: v + '%' }} /></span>
      {sub && <span style={{ color: 'var(--ink-4)', fontSize: 10 }}>{sub}</span>}
    </span>
  );
}

// ── Status pill ──
function StatusPill({ status, t }) {
  const label = { sent: t('st.sent'), scheduled: t('st.scheduled'), draft: t('st.draft'), failed: t('st.failed') }[status] || status;
  return (
    <span className="nf-st" data-st={status}><span className="dot" />{label}</span>
  );
}

// ── Audience cell ──
const AUD_ICON = {
  all: 'users', course: 'book', cohort: 'layers',
  role: 'flag', individual: 'user', segment: 'spark', saved: 'folder',
};
function AudienceCell({ audience }) {
  return (
    <div className="aud-cell">
      <span className="label">
        <span className="ic"><Icon name={AUD_ICON[audience.kind] || 'users'} size={13} /></span>
        {audience.label}
      </span>
      {audience.sub && <span className="sub">{audience.sub}</span>}
    </div>
  );
}

// ── In-app preview ──
function InAppPreview({ title, body, cta }) {
  return (
    <div className="nf-prev-inapp">
      <div className="ic-wrap"><Icon name="bell" size={16} /></div>
      <div className="body">
        <div className="t">{interpolate(title) || 'Sin título'}</div>
        <div className="m">{interpolate(body) || 'El cuerpo de la notificación aparece aquí.'}</div>
        {cta && cta.label && (
          <a className="cta">
            {cta.label}
            <Icon name="arrowRight" size={12} />
          </a>
        )}
        <div className="meta">Acme University · ahora</div>
      </div>
    </div>
  );
}

// ── Email preview ──
function EmailPreview({ title, body, cta, subject, tenant = 'Acme University' }) {
  return (
    <div className="nf-prev-email">
      <div className="subj">
        <span className="lbl">Asunto</span>
        <span className="v">{interpolate(subject || title) || '(sin asunto)'}</span>
      </div>
      <div className="from">
        <div className="mark">A</div>
        <div className="info">
          <b>{tenant}</b>
          <span>noreply@learn.acme.edu</span>
        </div>
      </div>
      <div className="body">
        <h3>{interpolate(title) || 'Sin título'}</h3>
        <p>{interpolate(body) || 'El cuerpo del email aparece aquí. Los markdown y las variables se aplican antes del envío.'}</p>
        {cta && cta.label && (
          <a className="cta">
            {cta.label}
            <Icon name="arrowRight" size={12} />
          </a>
        )}
      </div>
      <div className="ft">{tenant} · learn.acme.edu · You can unsubscribe</div>
    </div>
  );
}

// ── Audience chip (selected pill) ──
function AudienceChip({ kind, label, sub, onRemove }) {
  return (
    <span className="aud-chip">
      <span className="ic"><Icon name={AUD_ICON[kind] || 'users'} size={11} /></span>
      {label}
      {sub && <span style={{ opacity: 0.7, marginLeft: 4 }}>· {sub}</span>}
      {onRemove && (
        <span className="x" onClick={onRemove}>
          <Icon name="x" size={11} />
        </span>
      )}
    </span>
  );
}

// ── Audience type tile ──
function AudienceTile({ kind, label, on, onClick }) {
  return (
    <button className="aud-tile" data-on={on ? '1' : '0'} onClick={onClick}>
      <span className="ic"><Icon name={AUD_ICON[kind]} size={14} /></span>
      <span className="name">{label}</span>
    </button>
  );
}

(function () {
  const s = document.createElement('style');
  s.id = 'nf-parts';
  s.textContent = __PARTS_CSS;
  document.head.appendChild(s);
})();

Object.assign(window, {
  ChannelIcons, OpenRateBar, StatusPill, AudienceCell,
  InAppPreview, EmailPreview, AudienceChip, AudienceTile, AUD_ICON,
});
