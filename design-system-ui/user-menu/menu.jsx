// menu.jsx — Navbar wrapper + 4 dropdown variants (Current baseline + 3 directions).

const __MENU_CSS = `
  /* Common base — every variant shares these primitives */
  .um {
    position: absolute;
    top: 100%; right: 0;
    margin-top: 8px;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--r-md);
    box-shadow: var(--shadow-menu);
    font-family: var(--font-body);
    color: var(--ink-1);
    overflow: hidden;
    z-index: 10;
  }
  .um-row {
    display: flex; align-items: center;
    gap: 12px;
    padding: 9px 14px;
    font-size: var(--t-14);
    color: var(--ink-1);
    cursor: pointer;
    user-select: none;
    transition: background 120ms ease, color 120ms ease;
  }
  .um-row:hover { background: var(--bg-sub); }
  .um-row > .ic {
    width: 18px; height: 18px;
    color: var(--ink-3);
    flex-shrink: 0;
  }
  .um-row:hover > .ic { color: var(--ink-1); }
  .um-row > .lbl { flex: 1; min-width: 0; }
  .um-row > .meta {
    color: var(--ink-4);
    font-family: var(--font-mono);
    font-size: 10.5px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  .um-row[data-tone="danger"] { color: var(--danger); }
  .um-row[data-tone="danger"]:hover { background: var(--danger-soft); }
  .um-row[data-tone="danger"] > .ic { color: var(--danger); }

  .um-divider {
    height: 1px; background: var(--border);
    margin: 4px 0;
  }
  .um-section-lbl {
    padding: 12px 14px 6px;
    font-family: var(--font-mono);
    font-size: 10.5px;
    color: var(--ink-4);
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }
  .um-kbd {
    font-family: var(--font-mono);
    font-size: 10px;
    padding: 2px 6px;
    border-radius: 4px;
    background: var(--bg-sub);
    color: var(--ink-3);
    border: 1px solid var(--border);
  }

  /* Avatar pieces */
  .um-avatar {
    border-radius: 50%;
    background: var(--primary-soft);
    color: var(--primary-soft-fg);
    display: flex; align-items: center; justify-content: center;
    font-weight: 600;
    flex-shrink: 0;
    font-family: var(--font-body);
  }
  .um-avatar[data-size="md"] { width: 36px; height: 36px; font-size: 13px; }
  .um-avatar[data-size="lg"] { width: 48px; height: 48px; font-size: 16px; }

  /* Role pill */
  .um-pill {
    display: inline-flex; align-items: center; gap: 4px;
    height: 18px; padding: 0 7px;
    border-radius: var(--r-pill);
    background: var(--primary-soft);
    color: var(--primary-soft-fg);
    font-family: var(--font-mono);
    font-size: 9.5px;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    font-weight: 600;
  }
  .um-pill[data-tone="warn"] {
    background: var(--warning-soft);
    color: oklch(0.45 0.13 70);
  }
  [class*="theme-dark"] .um-pill[data-tone="warn"] { color: oklch(0.85 0.13 75); }

  /* Switch (mini) */
  .um-switch {
    appearance: none;
    position: relative;
    width: 32px; height: 18px;
    background: var(--border-strong);
    border-radius: var(--r-pill);
    transition: background 160ms ease;
    cursor: pointer;
    flex-shrink: 0;
    margin: 0;
  }
  .um-switch::after {
    content: ''; position: absolute;
    top: 2px; left: 2px;
    width: 14px; height: 14px; border-radius: 50%;
    background: white;
    box-shadow: 0 1px 2px rgba(0,0,0,.2);
    transition: transform 160ms cubic-bezier(.3,.7,.4,1);
  }
  .um-switch:checked { background: var(--primary); }
  .um-switch:checked::after { transform: translateX(14px); }

  /* ── CURRENT (replica of today's menu) ───────────────── */
  .um-current { width: 220px; }
  .um-current .um-row { font-size: var(--t-14); padding: 8px 14px; line-height: 1.35; }
  .um-current .um-row > .ic { width: 16px; height: 16px; }
  .um-current .um-row .lbl { white-space: normal; }

  /* ── A · REFINED ─────────────────────────────────────── */
  .um-A { width: 264px; }
  .um-A .ident {
    padding: 14px 14px 12px;
    display: flex; align-items: center; gap: 10px;
    border-bottom: 1px solid var(--border);
    background: var(--surface-sub);
  }
  .um-A .ident .info { min-width: 0; }
  .um-A .ident .info .name {
    font-size: var(--t-14); font-weight: 600;
    color: var(--ink-1);
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    line-height: 1.2;
  }
  .um-A .ident .info .role-row {
    display: flex; align-items: center; gap: 6px;
    margin-top: 4px;
  }
  .um-A .ident .info .email {
    font-size: 11.5px; color: var(--ink-3);
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .um-A .group { padding: 4px 0; }
  .um-A .um-row .switch-wrap { display: flex; align-items: center; }

  /* ── B · IDENTITY-LED ────────────────────────────────── */
  .um-B { width: 304px; }
  .um-B .hero {
    padding: 18px 18px 14px;
    background: linear-gradient(180deg, var(--primary-soft) 0%, transparent 100%);
    border-bottom: 1px solid var(--border);
    display: flex; flex-direction: column; gap: 8px;
  }
  .um-B .hero .top { display: flex; align-items: flex-start; gap: 12px; }
  .um-B .hero .info { flex: 1; min-width: 0; }
  .um-B .hero .info .name {
    font-family: var(--font-display);
    font-weight: 600; font-size: var(--t-16);
    letter-spacing: -0.01em;
    line-height: 1.2;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .um-B .hero .info .email {
    color: var(--ink-3); font-size: 11.5px;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .um-B .hero .info .where {
    margin-top: 6px;
    font-family: var(--font-mono); font-size: 10.5px;
    color: var(--ink-3);
    text-transform: uppercase; letter-spacing: 0.05em;
    display: flex; align-items: center; gap: 6px;
  }
  .um-B .hero .info .where b {
    color: var(--ink-2); font-weight: 600;
  }
  .um-B .hero .quick {
    display: grid; grid-template-columns: repeat(3, 1fr);
    gap: 6px;
    margin-top: 6px;
  }
  .um-B .hero .quick .q {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--r-sm);
    padding: 6px 8px;
    text-align: left;
  }
  .um-B .hero .quick .q .v {
    font-family: var(--font-display);
    font-size: 16px; font-weight: 600;
    color: var(--ink-1);
    letter-spacing: -0.01em;
  }
  .um-B .hero .quick .q .k {
    font-family: var(--font-mono);
    font-size: 9px;
    color: var(--ink-3);
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }
  .um-B .group { padding: 2px 0 6px; }
  .um-B .group + .group { border-top: 1px solid var(--border); padding-top: 4px; }

  /* ── C · TENANT-AWARE (SuperAdmin) ──────────────────── */
  .um-C { width: 320px; }
  .um-C .tenant-switch {
    padding: 10px 14px;
    display: flex; align-items: center; gap: 10px;
    background: var(--surface);
    border-bottom: 1px solid var(--border);
    cursor: pointer;
  }
  .um-C .tenant-switch:hover { background: var(--bg-sub); }
  .um-C .tenant-switch .mark {
    width: 28px; height: 28px; border-radius: var(--r-sm);
    background: var(--primary); color: var(--on-primary);
    display: flex; align-items: center; justify-content: center;
    font-family: var(--font-display); font-weight: 700; font-size: 13px;
    flex-shrink: 0;
  }
  .um-C .tenant-switch .info { flex: 1; min-width: 0; }
  .um-C .tenant-switch .info .eyebrow {
    font-family: var(--font-mono); font-size: 9.5px;
    color: var(--ink-4); text-transform: uppercase; letter-spacing: 0.08em;
  }
  .um-C .tenant-switch .info .t-name {
    font-weight: 600; font-size: var(--t-13);
    color: var(--ink-1);
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .um-C .tenant-switch .chev { color: var(--ink-4); flex-shrink: 0; }
  .um-C .ident {
    padding: 12px 14px;
    display: flex; align-items: center; gap: 10px;
    border-bottom: 1px solid var(--border);
  }
  .um-C .ident .info { min-width: 0; flex: 1; }
  .um-C .ident .info .name { font-size: var(--t-14); font-weight: 600; line-height: 1.2; }
  .um-C .ident .info .email { font-size: 11.5px; color: var(--ink-3); }
  .um-C .group { padding: 4px 0; }
  .um-C .group + .group { border-top: 1px solid var(--border); }
  .um-C .seg-row {
    padding: 8px 14px;
    display: grid; grid-template-columns: 60px 1fr;
    align-items: center; gap: 10px;
    font-size: 11.5px;
  }
  .um-C .seg-row .k {
    color: var(--ink-3);
    font-family: var(--font-mono);
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }
  .um-C .seg {
    display: flex; padding: 2px;
    background: var(--bg-sub);
    border-radius: var(--r-sm);
  }
  .um-C .seg button {
    appearance: none; border: 0; background: transparent;
    flex: 1; height: 22px;
    border-radius: calc(var(--r-sm) - 1px);
    font-family: var(--font-body); font-size: 11px;
    color: var(--ink-3);
    cursor: pointer;
  }
  .um-C .seg button.on {
    background: var(--surface);
    color: var(--ink-1);
    box-shadow: 0 1px 2px rgba(0,0,0,.08);
  }
`;

// Reusable inline-icon set scoped to this file (kept tiny so primitives.jsx's
// Icon import isn't a hard dep for the dropdown).
function MIcon({ name, size = 16 }) {
  const paths = {
    grid:    <path d="M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z" />,
    user:    <g><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></g>,
    receipt: <path d="M5 3h14v18l-3-2-3 2-3-2-3 2-2-2zM8 9h8M8 13h8M8 17h5" />,
    edit:    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4z" />,
    moon:    <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />,
    logout:  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />,
    bell:    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10.3 21a1.94 1.94 0 0 0 3.4 0" />,
    chev:    <path d="m6 9 6 6 6-6" />,
    keyboard:<path d="M2 6h20v12H2zM6 10h.01M10 10h.01M14 10h.01M18 10h.01M6 14h12" />,
    help:    <g><circle cx="12" cy="12" r="9" /><path d="M9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3M12 17h.01" /></g>,
    swap:    <path d="M7 16V4M3 8l4-4 4 4M17 8v12M21 16l-4 4-4-4" />,
    cog:     <g><circle cx="12" cy="12" r="3" /><path d="M19 12a7 7 0 0 0-.1-1.2l2-1.5-2-3.5-2.3.8a7 7 0 0 0-2-1.2L14 3h-4l-.6 2.4a7 7 0 0 0-2 1.2L5 5.8 3 9.3l2 1.5A7 7 0 0 0 5 12c0 .4 0 .8.1 1.2l-2 1.5 2 3.5 2.3-.8a7 7 0 0 0 2 1.2L10 21h4l.6-2.4a7 7 0 0 0 2-1.2l2.3.8 2-3.5-2-1.5c.1-.4.1-.8.1-1.2Z" /></g>,
    layers:  <path d="m12 2 10 5-10 5L2 7zM2 17l10 5 10-5M2 12l10 5 10-5" />,
    check:   <path d="m5 12 5 5L20 7" />,
  };
  return (
    <svg className="ic" width={size} height={size} viewBox="0 0 24 24"
         fill="none" stroke="currentColor" strokeWidth="1.7"
         strokeLinecap="round" strokeLinejoin="round">
      {paths[name] || null}
    </svg>
  );
}

// ── NAVBAR (context for the dropdown, present in every artboard) ──
function NavBar({ active = 'home', dropdown }) {
  return (
    <div className="navbar">
      <div className="brand-mark">A</div>
      <div className="nav-links">
        <a className={active === 'home' ? 'on' : ''}>Home</a>
        <a>Cursos</a>
        <a>Estadísticas</a>
        <a>Tienda</a>
        <a>Consultorías</a>
        <a>Mi actividad</a>
      </div>
      <div className="grow" />
      <button className="icon-btn" aria-label="Cart">
        <MIcon name="receipt" size={18} />
      </button>
      <button className="icon-btn" aria-label="Notifications">
        <MIcon name="bell" size={18} />
        <span className="badge-dot" />
      </button>
      <div className="anchor">
        <div className="me">
          <span className="avatar">SA</span>
          <span className="name">Super Admin</span>
          <MIcon name="chev" size={14} />
        </div>
        {dropdown}
      </div>
    </div>
  );
}

// ── BASELINE: replica of the existing dropdown ─────────────
function MenuCurrent() {
  const rows = [
    { ic: 'grid',    label: 'Dashboard' },
    { ic: 'user',    label: 'Navegar como Estudiante' },
    { ic: 'receipt', label: 'Compras' },
    { ic: 'edit',    label: 'Editar perfil' },
    { ic: 'moon',    label: 'Modo Oscuro' },
  ];
  return (
    <div className="um um-current">
      {rows.map(r => (
        <div className="um-row" key={r.label}>
          <span className="ic"><MIcon name={r.ic} size={16} /></span>
          <span className="lbl">{r.label}</span>
        </div>
      ))}
      <div className="um-divider" />
      <div className="um-row">
        <span className="ic"><MIcon name="logout" size={16} /></span>
        <span className="lbl">Cerrar Sesión</span>
      </div>
    </div>
  );
}

// ── A · REFINED ─────────────────────────────────────────────
function MenuA() {
  return (
    <div className="um um-A">
      <div className="ident">
        <div className="um-avatar" data-size="md">SA</div>
        <div className="info">
          <div className="name">Super Admin</div>
          <div className="role-row">
            <span className="um-pill">Super admin</span>
            <span className="email">marcus@acme.edu</span>
          </div>
        </div>
      </div>

      <div className="group">
        <div className="um-row">
          <span className="ic"><MIcon name="grid" /></span>
          <span className="lbl">Dashboard</span>
        </div>
        <div className="um-row">
          <span className="ic"><MIcon name="user" /></span>
          <span className="lbl">Cambiar a vista de estudiante</span>
        </div>
        <div className="um-row">
          <span className="ic"><MIcon name="receipt" /></span>
          <span className="lbl">Compras</span>
        </div>
        <div className="um-row">
          <span className="ic"><MIcon name="edit" /></span>
          <span className="lbl">Editar perfil</span>
        </div>
      </div>

      <div className="um-divider" />

      <div className="group">
        <label className="um-row" style={{ cursor: 'pointer' }}>
          <span className="ic"><MIcon name="moon" /></span>
          <span className="lbl">Modo oscuro</span>
          <input type="checkbox" className="um-switch" defaultChecked />
        </label>
      </div>

      <div className="um-divider" />

      <div className="um-row" data-tone="danger">
        <span className="ic"><MIcon name="logout" /></span>
        <span className="lbl">Cerrar sesión</span>
      </div>
    </div>
  );
}

// ── B · IDENTITY-LED ───────────────────────────────────────
function MenuB() {
  return (
    <div className="um um-B">
      <div className="hero">
        <div className="top">
          <div className="um-avatar" data-size="lg">SA</div>
          <div className="info">
            <div className="name">Marcus Lee</div>
            <div className="email">marcus@acme.edu</div>
            <div className="where">
              <span className="um-pill">Super admin</span>
              · <b>Acme University</b>
            </div>
          </div>
        </div>
        <div className="quick">
          <div className="q"><div className="v">12</div><div className="k">cursos</div></div>
          <div className="q"><div className="v">3</div><div className="k">compras</div></div>
          <div className="q"><div className="v">2</div><div className="k">activos</div></div>
        </div>
      </div>

      <div className="group">
        <div className="um-section-lbl">Cuenta</div>
        <div className="um-row">
          <span className="ic"><MIcon name="grid" /></span>
          <span className="lbl">Dashboard</span>
        </div>
        <div className="um-row">
          <span className="ic"><MIcon name="edit" /></span>
          <span className="lbl">Editar perfil</span>
        </div>
        <div className="um-row">
          <span className="ic"><MIcon name="receipt" /></span>
          <span className="lbl">Compras</span>
          <span className="meta">3</span>
        </div>
      </div>

      <div className="group">
        <div className="um-section-lbl">Cambiar de vista</div>
        <div className="um-row">
          <span className="ic"><MIcon name="user" /></span>
          <span className="lbl">Vista de estudiante</span>
          <MIcon name="chev" size={12} />
        </div>
      </div>

      <div className="group">
        <div className="um-section-lbl">Preferencias</div>
        <label className="um-row" style={{ cursor: 'pointer' }}>
          <span className="ic"><MIcon name="moon" /></span>
          <span className="lbl">Modo oscuro</span>
          <input type="checkbox" className="um-switch" defaultChecked />
        </label>
        <div className="um-row">
          <span className="ic"><MIcon name="keyboard" /></span>
          <span className="lbl">Atajos de teclado</span>
          <span className="um-kbd">?</span>
        </div>
      </div>

      <div className="um-divider" />

      <div className="um-row" data-tone="danger">
        <span className="ic"><MIcon name="logout" /></span>
        <span className="lbl">Cerrar sesión</span>
      </div>
    </div>
  );
}

// ── C · TENANT-AWARE (SuperAdmin multi-tenant) ────────────
function MenuC() {
  const [theme, setTheme] = React.useState('auto');
  return (
    <div className="um um-C">
      <div className="tenant-switch">
        <div className="mark">A</div>
        <div className="info">
          <div className="eyebrow">Tenant activo</div>
          <div className="t-name">Acme University</div>
        </div>
        <span className="chev"><MIcon name="swap" size={14} /></span>
      </div>

      <div className="ident">
        <div className="um-avatar" data-size="md">SA</div>
        <div className="info">
          <div className="name">Marcus Lee <span className="um-pill" style={{ marginLeft: 4 }}>Super</span></div>
          <div className="email">marcus@acme.edu</div>
        </div>
        <button className="icon-btn" aria-label="Settings" style={{ width: 28, height: 28, color: 'var(--ink-3)' }}>
          <MIcon name="cog" size={15} />
        </button>
      </div>

      <div className="group">
        <div className="um-row">
          <span className="ic"><MIcon name="grid" /></span>
          <span className="lbl">Dashboard</span>
          <span className="um-kbd">G D</span>
        </div>
        <div className="um-row">
          <span className="ic"><MIcon name="user" /></span>
          <span className="lbl">Vista de estudiante</span>
          <span className="um-kbd">⇧ V</span>
        </div>
        <div className="um-row">
          <span className="ic"><MIcon name="receipt" /></span>
          <span className="lbl">Compras</span>
          <span className="meta">3 nuevas</span>
        </div>
        <div className="um-row">
          <span className="ic"><MIcon name="edit" /></span>
          <span className="lbl">Editar perfil</span>
        </div>
      </div>

      <div className="group">
        <div className="seg-row">
          <div className="k">Tema</div>
          <div className="seg">
            {['Auto', 'Claro', 'Oscuro'].map((l, i) => (
              <button key={l} className={['auto','light','dark'][i] === theme ? 'on' : ''}
                      onClick={() => setTheme(['auto','light','dark'][i])}>{l}</button>
            ))}
          </div>
        </div>
      </div>

      <div className="group">
        <div className="um-row">
          <span className="ic"><MIcon name="help" /></span>
          <span className="lbl">Ayuda y documentación</span>
        </div>
        <div className="um-row">
          <span className="ic"><MIcon name="keyboard" /></span>
          <span className="lbl">Atajos de teclado</span>
          <span className="um-kbd">?</span>
        </div>
      </div>

      <div className="um-divider" />

      <div className="um-row" data-tone="danger">
        <span className="ic"><MIcon name="logout" /></span>
        <span className="lbl">Cerrar sesión</span>
      </div>
    </div>
  );
}

// ── ARTBOARD COMPOSER ──────────────────────────────────────
// Renders a navbar with the chosen menu open underneath the avatar.
function MenuStage({ variant, theme = 'light' }) {
  const M = { current: MenuCurrent, A: MenuA, B: MenuB, C: MenuC }[variant] || MenuA;
  return (
    <div className={'stage theme-' + theme}>
      <NavBar dropdown={<M />} />
      <div className="stage-body" />
    </div>
  );
}

// expose
(function () {
  const s = document.createElement('style');
  s.id = 'um-styles';
  s.textContent = __MENU_CSS;
  document.head.appendChild(s);
})();

Object.assign(window, { MenuStage, MenuCurrent, MenuA, MenuB, MenuC, MIcon, NavBar });
