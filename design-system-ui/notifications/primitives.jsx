// primitives.jsx — reusable UI primitives for the SkillsRamp design system.
// Every component reads tokens via CSS vars, so density / radius / brand / theme
// changes apply globally without per-component knobs.

const __SR_STYLES = `
  /* ── ICON ───────────────────────────────────────────────── */
  .sr-ic { display: inline-block; vertical-align: middle; flex-shrink: 0; }

  /* ── BUTTON ─────────────────────────────────────────────── */
  .sr-btn {
    --_h: var(--ctl-h);
    appearance: none;
    display: inline-flex; align-items: center; justify-content: center;
    gap: 8px;
    height: var(--_h);
    padding: 0 calc(var(--d-x) + 2px);
    border-radius: var(--r-md);
    border: 1px solid transparent;
    background: transparent;
    color: var(--ink-1);
    font-family: var(--font-body);
    font-size: var(--t-14);
    font-weight: 500;
    letter-spacing: -0.005em;
    line-height: 1;
    cursor: pointer;
    transition: background 120ms ease, color 120ms ease, border-color 120ms ease,
                box-shadow 120ms ease, transform 80ms ease;
    white-space: nowrap;
    user-select: none;
  }
  .sr-btn:focus-visible {
    outline: 2px solid var(--primary-ring);
    outline-offset: 2px;
  }
  .sr-btn:active { transform: translateY(0.5px); }
  .sr-btn[disabled], .sr-btn[aria-disabled="true"] {
    opacity: 0.5; cursor: not-allowed; pointer-events: none;
  }
  .sr-btn[data-size="sm"] { --_h: var(--ctl-h-sm); font-size: var(--t-13); padding: 0 calc(var(--d-x) - 2px); gap: 6px; }
  .sr-btn[data-size="lg"] { --_h: var(--ctl-h-lg); font-size: var(--t-15); padding: 0 calc(var(--d-x) + 6px); }
  .sr-btn[data-icon-only="1"] { width: var(--_h); padding: 0; }

  /* Primary */
  .sr-btn[data-variant="primary"] {
    background: var(--primary);
    color: var(--on-primary);
    box-shadow: var(--shadow-1), inset 0 1px 0 0 oklch(1 0 0 / 0.18);
  }
  .sr-btn[data-variant="primary"]:hover { background: var(--primary-hover); }

  /* Secondary — bordered surface */
  .sr-btn[data-variant="secondary"] {
    background: var(--surface);
    border-color: var(--border-strong);
    color: var(--ink-1);
    box-shadow: var(--shadow-1);
  }
  .sr-btn[data-variant="secondary"]:hover {
    background: var(--surface-sub); border-color: var(--ink-4);
  }

  /* Tertiary — ghost */
  .sr-btn[data-variant="tertiary"] {
    color: var(--ink-2); background: transparent;
  }
  .sr-btn[data-variant="tertiary"]:hover {
    background: var(--bg-sub); color: var(--ink-1);
  }

  /* Destructive */
  .sr-btn[data-variant="danger"] {
    background: var(--danger); color: white;
    box-shadow: var(--shadow-1), inset 0 1px 0 0 oklch(1 0 0 / 0.18);
  }
  .sr-btn[data-variant="danger"]:hover { filter: brightness(0.94); }

  /* Soft — subtle filled */
  .sr-btn[data-variant="soft"] {
    background: var(--primary-soft); color: var(--primary-soft-fg);
  }
  .sr-btn[data-variant="soft"]:hover { filter: brightness(0.97); }

  /* Link */
  .sr-btn[data-variant="link"] {
    color: var(--primary-soft-fg); padding-left: 4px; padding-right: 4px;
    border-radius: 4px;
  }
  .sr-btn[data-variant="link"]:hover { color: var(--primary); text-decoration: underline; text-underline-offset: 3px; }

  .sr-btn .sr-spin {
    width: 14px; height: 14px;
    border: 2px solid currentColor; border-right-color: transparent;
    border-radius: 50%;
    animation: sr-spin 0.7s linear infinite;
  }
  @keyframes sr-spin { to { transform: rotate(360deg); } }

  /* ── INPUT / SELECT / TEXTAREA ──────────────────────────── */
  .sr-field {
    appearance: none;
    width: 100%;
    height: var(--ctl-h);
    padding: 0 var(--d-x);
    border: 1px solid var(--border-input);
    border-radius: var(--r-md);
    background: var(--surface);
    color: var(--ink-1);
    font-family: var(--font-body);
    font-size: var(--t-14);
    line-height: 1.2;
    transition: border-color 120ms ease, box-shadow 120ms ease, background 120ms ease;
  }
  .sr-field::placeholder { color: var(--ink-4); }
  .sr-field:hover { border-color: var(--ink-4); }
  .sr-field:focus-visible, .sr-field:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 3px var(--primary-ring);
  }
  .sr-field[disabled] {
    background: var(--bg-sub); color: var(--ink-4); cursor: not-allowed;
  }
  .sr-field[data-invalid="1"] {
    border-color: var(--danger);
    box-shadow: 0 0 0 3px oklch(0.6 0.17 25 / 0.18);
  }
  .sr-field[data-size="sm"] { height: var(--ctl-h-sm); font-size: var(--t-13); padding: 0 calc(var(--d-x) - 2px); }
  .sr-field[data-size="lg"] { height: var(--ctl-h-lg); font-size: var(--t-15); }

  textarea.sr-field {
    height: auto; min-height: calc(var(--ctl-h) * 2.4); padding: calc(var(--d-y) - 2px) var(--d-x);
    line-height: var(--d-row); resize: vertical;
  }
  select.sr-field {
    padding-right: 36px;
    background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'><path fill='%23666' d='M0 0h10L5 6z'/></svg>");
    background-repeat: no-repeat;
    background-position: right 14px center;
  }

  /* Field group — label + input + hint */
  .sr-fg { display: flex; flex-direction: column; gap: 6px; }
  .sr-fg-lbl {
    font-size: var(--t-13);
    font-weight: 500;
    color: var(--ink-2);
    display: flex; align-items: center; justify-content: space-between;
    gap: 8px;
  }
  .sr-fg-lbl em {
    font-style: normal;
    font-family: var(--font-mono);
    font-size: 11px;
    color: var(--ink-4);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  .sr-fg-hint { font-size: var(--t-12); color: var(--ink-3); line-height: 1.5; }
  .sr-fg-err  { font-size: var(--t-12); color: var(--danger); line-height: 1.5; display: flex; gap: 6px; align-items: center; }

  /* Input with leading icon */
  .sr-input-wrap { position: relative; display: flex; align-items: center; }
  .sr-input-wrap .sr-ic { position: absolute; left: calc(var(--d-x) - 2px); color: var(--ink-3); pointer-events: none; }
  .sr-input-wrap > .sr-field { padding-left: calc(var(--d-x) + 20px); }
  .sr-input-wrap[data-trail="1"] > .sr-field { padding-right: calc(var(--d-x) + 20px); }
  .sr-input-wrap[data-trail="1"] .sr-ic.trail { right: calc(var(--d-x) - 2px); left: auto; }

  /* ── CHECKBOX / RADIO ───────────────────────────────────── */
  .sr-check, .sr-radio {
    appearance: none; width: 18px; height: 18px;
    border: 1.5px solid var(--border-strong);
    background: var(--surface);
    cursor: pointer;
    display: inline-flex; align-items: center; justify-content: center;
    transition: background 120ms ease, border-color 120ms ease, box-shadow 120ms ease;
    flex-shrink: 0;
  }
  .sr-check { border-radius: var(--r-sm); }
  .sr-radio { border-radius: 50%; }
  .sr-check:hover, .sr-radio:hover { border-color: var(--ink-4); }
  .sr-check:focus-visible, .sr-radio:focus-visible {
    outline: none; box-shadow: 0 0 0 3px var(--primary-ring);
  }
  .sr-check:checked, .sr-radio:checked {
    background: var(--primary); border-color: var(--primary);
  }
  .sr-check:checked::after {
    content: ""; width: 10px; height: 10px;
    background: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 14 14'><path d='M3 7.2 5.8 10 11 4.2' fill='none' stroke='white' stroke-width='2.4' stroke-linecap='round' stroke-linejoin='round'/></svg>") center/contain no-repeat;
  }
  .sr-radio:checked::after {
    content: ""; width: 8px; height: 8px; border-radius: 50%; background: white;
  }

  .sr-cb-row { display: inline-flex; align-items: flex-start; gap: 10px; cursor: pointer; }
  .sr-cb-row > div { display: flex; flex-direction: column; gap: 2px; }
  .sr-cb-row .sr-cb-ttl { font-size: var(--t-14); color: var(--ink-1); line-height: 1.3; font-weight: 500; }
  .sr-cb-row .sr-cb-sub { font-size: var(--t-12); color: var(--ink-3); }

  /* ── SWITCH ─────────────────────────────────────────────── */
  .sr-switch {
    appearance: none; position: relative;
    width: 36px; height: 22px;
    background: var(--border-strong);
    border-radius: var(--r-pill);
    cursor: pointer;
    transition: background 160ms ease;
    flex-shrink: 0;
  }
  .sr-switch::after {
    content: ""; position: absolute; top: 2px; left: 2px;
    width: 18px; height: 18px; border-radius: 50%;
    background: white;
    box-shadow: var(--shadow-1);
    transition: transform 160ms cubic-bezier(.3,.7,.4,1);
  }
  .sr-switch:checked { background: var(--primary); }
  .sr-switch:checked::after { transform: translateX(14px); }
  .sr-switch:focus-visible { outline: none; box-shadow: 0 0 0 3px var(--primary-ring); }

  /* ── BADGE ──────────────────────────────────────────────── */
  .sr-badge {
    display: inline-flex; align-items: center; gap: 6px;
    height: 22px; padding: 0 8px;
    border-radius: var(--r-pill);
    font-size: 11.5px;
    font-weight: 500;
    line-height: 1;
    letter-spacing: 0.01em;
    background: var(--bg-sub);
    color: var(--ink-2);
    border: 1px solid var(--border);
    white-space: nowrap;
  }
  .sr-badge[data-tone="primary"] { background: var(--primary-soft); color: var(--primary-soft-fg); border-color: transparent; }
  .sr-badge[data-tone="success"] { background: var(--success-soft); color: var(--success); border-color: transparent; }
  .sr-badge[data-tone="warning"] { background: var(--warning-soft); color: oklch(0.45 0.13 70); border-color: transparent; }
  .sr-badge[data-tone="danger"]  { background: var(--danger-soft); color: var(--danger); border-color: transparent; }
  .sr-badge[data-tone="info"]    { background: var(--info-soft); color: var(--info); border-color: transparent; }
  .sr-badge[data-tone="neutral"] { background: var(--bg-sub); color: var(--ink-2); }
  [data-theme="dark"] .sr-badge[data-tone="warning"] { color: oklch(0.85 0.12 75); }
  [data-theme="dark"] .sr-badge[data-tone="danger"]  { color: oklch(0.78 0.14 25); }
  [data-theme="dark"] .sr-badge[data-tone="success"] { color: oklch(0.78 0.12 155); }
  [data-theme="dark"] .sr-badge[data-tone="info"]    { color: oklch(0.78 0.12 245); }

  .sr-dot {
    width: 6px; height: 6px; border-radius: 50%; background: currentColor; flex-shrink: 0;
  }

  /* ── CARD ───────────────────────────────────────────────── */
  .sr-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--r-lg);
    padding: calc(var(--d-y) * 1.6) calc(var(--d-x) * 1.4);
  }
  .sr-card[data-flush="1"] { padding: 0; overflow: hidden; }
  .sr-card[data-elev="2"]  { box-shadow: var(--shadow-2); }
  .sr-card[data-elev="3"]  { box-shadow: var(--shadow-3); }

  /* ── AVATAR ─────────────────────────────────────────────── */
  .sr-avatar {
    display: inline-flex; align-items: center; justify-content: center;
    width: 32px; height: 32px;
    border-radius: var(--r-pill);
    background: var(--primary-soft);
    color: var(--primary-soft-fg);
    font-size: 12px; font-weight: 600;
    letter-spacing: 0.02em;
    flex-shrink: 0;
    font-family: var(--font-body);
  }
  .sr-avatar[data-size="sm"] { width: 24px; height: 24px; font-size: 10.5px; }
  .sr-avatar[data-size="lg"] { width: 44px; height: 44px; font-size: 15px; }

  /* ── TABLE ──────────────────────────────────────────────── */
  .sr-table { width: 100%; border-collapse: separate; border-spacing: 0; font-size: var(--t-14); }
  .sr-table th, .sr-table td {
    text-align: left; padding: calc(var(--d-y) + 2px) var(--d-x);
    border-bottom: 1px solid var(--border);
    vertical-align: middle;
  }
  .sr-table th {
    font-family: var(--font-mono);
    font-size: 11px;
    font-weight: 500;
    color: var(--ink-3);
    text-transform: uppercase;
    letter-spacing: 0.06em;
    background: var(--bg-sub);
    border-bottom: 1px solid var(--border-strong);
    white-space: nowrap;
  }
  .sr-table tbody tr:hover td { background: var(--bg-sub); }
  .sr-table td.num { font-variant-numeric: tabular-nums; text-align: right; }
  .sr-table td.actions { text-align: right; }
  .sr-table-wrap {
    border: 1px solid var(--border);
    border-radius: var(--r-lg);
    background: var(--surface);
    overflow: hidden;
  }
  .sr-table tbody tr:last-child td { border-bottom: 0; }

  /* ── ALERT / CALLOUT ────────────────────────────────────── */
  .sr-alert {
    display: flex; gap: 12px;
    padding: calc(var(--d-y) + 2px) var(--d-x);
    border: 1px solid var(--border);
    border-radius: var(--r-md);
    background: var(--surface-sub);
    color: var(--ink-1);
    font-size: var(--t-14);
  }
  .sr-alert[data-tone="info"]    { background: var(--info-soft); border-color: transparent; }
  .sr-alert[data-tone="success"] { background: var(--success-soft); border-color: transparent; }
  .sr-alert[data-tone="warning"] { background: var(--warning-soft); border-color: transparent; }
  .sr-alert[data-tone="danger"]  { background: var(--danger-soft); border-color: transparent; }
  .sr-alert .sr-ic { color: currentColor; margin-top: 1px; }
  .sr-alert-body { display: flex; flex-direction: column; gap: 2px; flex: 1; min-width: 0; }
  .sr-alert-ttl  { font-weight: 600; font-size: var(--t-14); line-height: 1.3; }
  .sr-alert-msg  { font-size: var(--t-13); color: inherit; opacity: 0.85; line-height: 1.5; }

  /* ── SKELETON ───────────────────────────────────────────── */
  .sr-skel {
    background: linear-gradient(90deg, var(--bg-sub) 0%, var(--border) 50%, var(--bg-sub) 100%);
    background-size: 200% 100%;
    animation: sr-skel-shimmer 1.4s ease-in-out infinite;
    border-radius: var(--r-sm);
  }
  @keyframes sr-skel-shimmer {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }

  /* ── MODAL ──────────────────────────────────────────────── */
  .sr-modal-stage {
    position: relative;
    background: var(--overlay);
    border-radius: var(--r-lg);
    padding: 32px;
    display: flex; align-items: center; justify-content: center;
    min-height: 360px;
  }
  .sr-modal {
    width: 100%; max-width: 460px;
    background: var(--surface);
    border-radius: calc(var(--r) * 1.4);
    box-shadow: var(--shadow-4);
    overflow: hidden;
  }
  .sr-modal-hd {
    padding: 20px 22px 6px;
    display: flex; flex-direction: column; gap: 4px;
  }
  .sr-modal-hd h3 { font-size: var(--t-20); }
  .sr-modal-hd p { color: var(--ink-3); font-size: var(--t-14); }
  .sr-modal-bd { padding: 16px 22px 6px; display: flex; flex-direction: column; gap: 12px; }
  .sr-modal-ft {
    padding: 16px 22px 20px;
    display: flex; gap: 8px; justify-content: flex-end;
    border-top: 1px solid var(--border); margin-top: 8px;
  }

  /* ── KBD ────────────────────────────────────────────────── */
  .sr-kbd {
    font-family: var(--font-mono);
    font-size: 10.5px;
    padding: 2px 6px;
    border: 1px solid var(--border-strong);
    border-bottom-width: 2px;
    border-radius: 4px;
    background: var(--surface);
    color: var(--ink-2);
    line-height: 1;
    display: inline-block;
  }
`;

// ── ICON ────────────────────────────────────────────────────
// Lightweight feather-style icon set — only what the doc needs, no library.
const SR_ICONS = {
  search: <path d="M11 19a8 8 0 1 1 5.3-2L21 21M17 11a6 6 0 1 1-12 0 6 6 0 0 1 12 0Z" />,
  check: <path d="m5 12 5 5L20 7" />,
  x: <path d="M6 6l12 12M6 18 18 6" />,
  chevronDown: <path d="m6 9 6 6 6-6" />,
  chevronRight: <path d="m9 6 6 6-6 6" />,
  arrowRight: <path d="M5 12h14M13 6l6 6-6 6" />,
  plus: <path d="M12 5v14M5 12h14" />,
  minus: <path d="M5 12h14" />,
  filter: <path d="M3 6h18M6 12h12M10 18h4" />,
  more: <g><circle cx="6" cy="12" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="18" cy="12" r="1.5"/></g>,
  alert: <path d="M12 9v4M12 17h.01M10.3 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />,
  info: <g><circle cx="12" cy="12" r="9"/><path d="M12 8h.01M11 12h1v4h1"/></g>,
  success: <g><circle cx="12" cy="12" r="9"/><path d="m8 12 3 3 5-6"/></g>,
  trash: <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6M10 11v6M14 11v6" />,
  user: <g><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></g>,
  book:  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z" />,
  home:  <path d="M3 11 12 3l9 8v10a1 1 0 0 1-1 1h-5v-7H10v7H5a1 1 0 0 1-1-1z" />,
  users: <g><circle cx="9" cy="8" r="4"/><path d="M2 21a7 7 0 0 1 14 0M17 11a3 3 0 1 0 0-6M22 21a6 6 0 0 0-4-5.6"/></g>,
  settings: <g><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1A1.7 1.7 0 0 0 9 19.4a1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1A1.7 1.7 0 0 0 4.6 9a1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9A1.7 1.7 0 0 0 10 3.1V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z"/></g>,
  bell: <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10.3 21a1.94 1.94 0 0 0 3.4 0" />,
  layers: <path d="m12 2 10 5-10 5L2 7zM2 17l10 5 10-5M2 12l10 5 10-5"/>,
  chart: <path d="M3 3v18h18M7 16l4-4 3 3 5-6"/>,
  edit: <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4z"/>,
  download: <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>,
  upload: <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/>,
  sun:   <g><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M5 5l1.5 1.5M17.5 17.5 19 19M2 12h2M20 12h2M5 19l1.5-1.5M17.5 6.5 19 5"/></g>,
  moon:  <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />,
  inbox: <path d="M22 12h-6l-2 3h-4l-2-3H2M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11Z" />,
  folder: <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>,
  spark: <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6 7.7 7.7M16.3 16.3l2.1 2.1M5.6 18.4 7.7 16.3M16.3 7.7l2.1-2.1"/>,
  arrowUp: <path d="M12 19V5M5 12l7-7 7 7"/>,
  arrowDown: <path d="M12 5v14M5 12l7 7 7-7"/>,
  chevronLeft: <path d="m15 6-6 6 6 6" />,
  chevronUp: <path d="m6 15 6-6 6 6" />,
  play: <path d="M6 4v16l14-8z"/>,
  music: <g><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></g>,
  file: <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6"/>,
  clipboard: <g><rect x="8" y="2" width="8" height="4" rx="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/></g>,
  quiz: <g><circle cx="12" cy="12" r="9"/><path d="M9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3M12 17h.01"/></g>,
  calendar: <g><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></g>,
  link: <g><path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.5 1.5"/><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.5-1.5"/></g>,
  cube: <path d="m12 2-9 5v10l9 5 9-5V7zM3 7l9 5 9-5M12 12v10"/>,
  code: <path d="m16 18 6-6-6-6M8 6l-6 6 6 6"/>,
  grip: <g><circle cx="9" cy="5" r="1"/><circle cx="9" cy="12" r="1"/><circle cx="9" cy="19" r="1"/><circle cx="15" cy="5" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="15" cy="19" r="1"/></g>,
  eye: <g><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></g>,
  copy: <g><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></g>,
  globe: <g><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/></g>,
  save: <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2zM17 21v-8H7v8M7 3v5h8"/>,
  archive: <g><rect x="3" y="3" width="18" height="5" rx="1"/><path d="M5 8v11a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8M10 12h4"/></g>,
  refresh: <path d="M3 12a9 9 0 0 1 15-6.7L21 8M21 3v5h-5M21 12a9 9 0 0 1-15 6.7L3 16M3 21v-5h5"/>,
  flag: <g><path d="M4 22V4M4 4a8 8 0 0 1 11 0 8 8 0 0 0 5 0v9a8 8 0 0 1-5 0 8 8 0 0 0-11 0"/></g>,
  lock: <g><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></g>,
  send: <path d="m22 2-11 11M22 2 15 22l-4-9-9-4z"/>,
  external: <path d="M14 3h7v7M21 3l-9 9M19 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h6"/>,
  trending: <path d="m22 7-9 9-4-4-7 7M16 7h6v6"/>,
  zap: <path d="M13 2 3 14h9l-1 8 10-12h-9z"/>,
  graduation: <path d="M22 10 12 4 2 10l10 6 10-6zM6 12v5a8 8 0 0 0 12 0v-5M22 10v6"/>,
};

function Icon({ name, size = 16, strokeWidth = 1.7, style, ...rest }) {
  return (
    <svg className="sr-ic" width={size} height={size} viewBox="0 0 24 24"
         fill="none" stroke="currentColor" strokeWidth={strokeWidth}
         strokeLinecap="round" strokeLinejoin="round" style={style} {...rest}>
      {SR_ICONS[name] || null}
    </svg>
  );
}

// ── BUTTON ───────────────────────────────────────────────────
function Button({
  variant = "primary", size = "md", icon, trailing, iconOnly,
  loading, disabled, children, type = "button", ...rest
}) {
  return (
    <button type={type} className="sr-btn"
            data-variant={variant} data-size={size}
            data-icon-only={iconOnly ? "1" : undefined}
            disabled={disabled || loading}
            aria-busy={loading || undefined}
            {...rest}>
      {loading ? <span className="sr-spin" /> : icon && <Icon name={icon} size={size === "sm" ? 14 : size === "lg" ? 18 : 16} />}
      {!iconOnly && children}
      {trailing && !iconOnly && <Icon name={trailing} size={size === "sm" ? 14 : 16} />}
    </button>
  );
}

// ── INPUT / FIELD GROUP ──────────────────────────────────────
function FieldGroup({ label, hint, error, optional, required, children, ...rest }) {
  return (
    <div className="sr-fg" {...rest}>
      {label && (
        <label className="sr-fg-lbl">
          <span>{label}{required && <span style={{ color: 'var(--danger)', marginLeft: 4 }}>*</span>}</span>
          {optional && <em>optional</em>}
        </label>
      )}
      {children}
      {error ? (
        <div className="sr-fg-err"><Icon name="alert" size={12} /> {error}</div>
      ) : hint ? (
        <div className="sr-fg-hint">{hint}</div>
      ) : null}
    </div>
  );
}

function Input({ leadingIcon, trailingIcon, invalid, size = "md", ...rest }) {
  const field = (
    <input className="sr-field"
           data-size={size !== "md" ? size : undefined}
           data-invalid={invalid ? "1" : undefined}
           {...rest} />
  );
  if (!leadingIcon && !trailingIcon) return field;
  return (
    <div className="sr-input-wrap" data-trail={trailingIcon ? "1" : undefined}>
      {leadingIcon && <Icon name={leadingIcon} size={15} />}
      {field}
      {trailingIcon && <Icon name={trailingIcon} size={15} className="sr-ic trail" />}
    </div>
  );
}

function Textarea({ size = "md", invalid, ...rest }) {
  return <textarea className="sr-field" data-size={size !== "md" ? size : undefined}
                   data-invalid={invalid ? "1" : undefined} {...rest} />;
}

function Select({ size = "md", invalid, children, ...rest }) {
  return (
    <select className="sr-field" data-size={size !== "md" ? size : undefined}
            data-invalid={invalid ? "1" : undefined} {...rest}>
      {children}
    </select>
  );
}

// ── CHECKBOX / RADIO / SWITCH ────────────────────────────────
function Checkbox({ label, sublabel, ...rest }) {
  if (!label) return <input type="checkbox" className="sr-check" {...rest} />;
  return (
    <label className="sr-cb-row">
      <input type="checkbox" className="sr-check" {...rest} />
      <div>
        <span className="sr-cb-ttl">{label}</span>
        {sublabel && <span className="sr-cb-sub">{sublabel}</span>}
      </div>
    </label>
  );
}
function Radio({ label, sublabel, ...rest }) {
  if (!label) return <input type="radio" className="sr-radio" {...rest} />;
  return (
    <label className="sr-cb-row">
      <input type="radio" className="sr-radio" {...rest} />
      <div>
        <span className="sr-cb-ttl">{label}</span>
        {sublabel && <span className="sr-cb-sub">{sublabel}</span>}
      </div>
    </label>
  );
}
function Switch(props) { return <input type="checkbox" role="switch" className="sr-switch" {...props} />; }

// ── BADGE ────────────────────────────────────────────────────
function Badge({ tone = "neutral", dot, children, ...rest }) {
  return (
    <span className="sr-badge" data-tone={tone} {...rest}>
      {dot && <i className="sr-dot" />}
      {children}
    </span>
  );
}

// ── CARD ─────────────────────────────────────────────────────
function Card({ flush, elev, style, children, ...rest }) {
  return (
    <div className="sr-card" data-flush={flush ? "1" : undefined}
         data-elev={elev || undefined} style={style} {...rest}>
      {children}
    </div>
  );
}

// ── AVATAR ───────────────────────────────────────────────────
function Avatar({ name, size = "md", color, style }) {
  const initials = (name || "?").split(/\s+/).slice(0, 2).map(s => s[0]).join("").toUpperCase();
  return (
    <span className="sr-avatar" data-size={size !== "md" ? size : undefined}
          style={{ background: color, color: color ? "white" : undefined, ...style }}>
      {initials}
    </span>
  );
}

// ── ALERT ────────────────────────────────────────────────────
function Alert({ tone = "info", title, children, icon }) {
  const defaultIcon = { info: "info", success: "success", warning: "alert", danger: "alert" }[tone] || "info";
  return (
    <div className="sr-alert" data-tone={tone}>
      <Icon name={icon || defaultIcon} size={18} />
      <div className="sr-alert-body">
        {title && <div className="sr-alert-ttl">{title}</div>}
        {children && <div className="sr-alert-msg">{children}</div>}
      </div>
    </div>
  );
}

// ── SKELETON ─────────────────────────────────────────────────
function Skeleton({ w = "100%", h = 14, r, style }) {
  return <div className="sr-skel" style={{ width: w, height: h, borderRadius: r, ...style }} />;
}

// ── KBD ──────────────────────────────────────────────────────
function Kbd({ children }) { return <span className="sr-kbd">{children}</span>; }

// ── STAMP ────────────────────────────────────────────────────
// Monospace eyebrow with a primary-colored dot — used widely in the doc
// + builder for section labels and metadata.
function Stamp({ children }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 8,
      fontFamily: 'var(--font-mono)', fontSize: 10.5,
      color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '0.08em',
    }}>
      <span style={{ width: 6, height: 6, background: 'var(--primary)', borderRadius: '50%' }} />
      {children}
    </span>
  );
}

// Inject styles + expose
(function () {
  const s = document.createElement("style");
  s.id = "sr-primitives";
  s.textContent = __SR_STYLES;
  document.head.appendChild(s);
})();

Object.assign(window, {
  Icon, Button, FieldGroup, Input, Textarea, Select,
  Checkbox, Radio, Switch, Badge, Card, Avatar, Alert, Skeleton, Kbd, Stamp,
  SR_ICONS,
});
