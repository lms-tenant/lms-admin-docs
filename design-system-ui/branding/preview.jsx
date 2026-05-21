// preview.jsx — live brand preview pane.
// Scoped to a `.preview-stage` container so the tenant theme only changes the
// preview surface, not the admin chrome around it.

const __PREVIEW_CSS = `
  /* Wrapper sets tenant tokens via CSS vars — everything inside reads them */
  .preview-stage {
    --p-primary-h: 270;
    --p-primary-c: 0.16;
    --p-primary-l: 0.5;
    --p-primary: oklch(var(--p-primary-l) var(--p-primary-c) var(--p-primary-h));
    --p-primary-hover: oklch(calc(var(--p-primary-l) - 0.05) var(--p-primary-c) var(--p-primary-h));
    --p-primary-soft: oklch(0.96 0.035 var(--p-primary-h));
    --p-primary-soft-fg: oklch(0.32 calc(var(--p-primary-c) * 0.9) var(--p-primary-h));
    --p-on: oklch(0.99 0.005 var(--p-primary-h));

    --p-bg: oklch(0.985 0.003 80);
    --p-surface: #fff;
    --p-surface-sub: oklch(0.97 0.004 80);
    --p-ink-1: oklch(0.18 0.011 80);
    --p-ink-2: oklch(0.34 0.009 80);
    --p-ink-3: oklch(0.52 0.008 80);
    --p-ink-4: oklch(0.66 0.007 80);
    --p-border: oklch(0.92 0.005 80);
    --p-border-strong: oklch(0.85 0.006 80);

    --p-r: 10px;
    --p-r-sm: max(2px, calc(var(--p-r) * 0.45));
    --p-r-md: var(--p-r);
    --p-r-lg: calc(var(--p-r) * 1.6);
    --p-r-pill: 9999px;

    --p-display: "Bricolage Grotesque", system-ui, sans-serif;
    --p-body: "Geist", system-ui, sans-serif;

    background: var(--p-bg);
    color: var(--p-ink-1);
    font-family: var(--p-body);
    border-radius: var(--r-md);
    overflow: hidden;
    border: 1px solid var(--border);
    isolation: isolate;
  }
  .preview-stage[data-dark="1"] {
    --p-bg: oklch(0.14 0.008 80);
    --p-surface: oklch(0.19 0.009 80);
    --p-surface-sub: oklch(0.22 0.009 80);
    --p-ink-1: oklch(0.97 0.005 80);
    --p-ink-2: oklch(0.84 0.006 80);
    --p-ink-3: oklch(0.66 0.007 80);
    --p-ink-4: oklch(0.52 0.007 80);
    --p-border: oklch(0.28 0.008 80);
    --p-border-strong: oklch(0.36 0.008 80);
    --p-primary-soft: oklch(0.28 0.06 var(--p-primary-h));
    --p-primary-soft-fg: oklch(0.88 0.07 var(--p-primary-h));
  }
  .preview-stage h1, .preview-stage h2, .preview-stage h3, .preview-stage h4 {
    font-family: var(--p-display);
    letter-spacing: -0.02em;
    color: var(--p-ink-1);
    margin: 0;
    font-weight: 500;
  }
  .preview-stage p { margin: 0; }

  /* Device frame */
  .preview-stage[data-device="mobile"] {
    max-width: 380px;
    margin: 0 auto;
  }

  /* STUDENT SURFACE */
  .stu-nav {
    background: var(--p-surface);
    border-bottom: 1px solid var(--p-border);
    padding: 12px 20px;
    display: flex; align-items: center; gap: 14px;
  }
  .stu-logo {
    display: flex; align-items: center; gap: 8px;
    color: var(--p-ink-1);
    font-family: var(--p-display); font-weight: 600;
    font-size: 15px; letter-spacing: -0.01em;
  }
  .stu-logo .mark {
    width: 28px; height: 28px; border-radius: var(--p-r-sm);
    background: var(--p-primary); color: var(--p-on);
    display: flex; align-items: center; justify-content: center;
    font-weight: 700; font-size: 14px;
  }
  .stu-logo img { height: 24px; }
  .stu-nav .links {
    display: flex; gap: 18px;
    font-size: 13px; color: var(--p-ink-2);
  }
  .stu-nav .links a { cursor: pointer; }
  .stu-nav .links a.on { color: var(--p-primary); font-weight: 500; position: relative; }
  .stu-nav .links a.on::after {
    content: ''; position: absolute; left: 0; right: 0; bottom: -13px;
    height: 2px; background: var(--p-primary); border-radius: 2px;
  }
  .stu-nav .grow { flex: 1; }
  .stu-nav .search {
    background: var(--p-surface-sub); border: 1px solid var(--p-border);
    border-radius: var(--p-r-md); padding: 6px 10px;
    font-size: 12px; color: var(--p-ink-3);
    min-width: 160px;
    display: flex; align-items: center; gap: 6px;
  }
  .stu-nav .avatar {
    width: 28px; height: 28px; border-radius: 50%;
    background: var(--p-primary-soft); color: var(--p-primary-soft-fg);
    display: flex; align-items: center; justify-content: center;
    font-weight: 600; font-size: 11px;
    font-family: var(--p-body);
  }

  .stu-hero {
    padding: 28px 24px 22px;
    background:
      radial-gradient(circle at 100% 0%, var(--p-primary-soft) 0%, transparent 50%),
      var(--p-surface);
    border-bottom: 1px solid var(--p-border);
  }
  .stu-hero .eyebrow {
    font-family: ui-monospace, monospace;
    font-size: 10px; color: var(--p-primary-soft-fg);
    text-transform: uppercase; letter-spacing: 0.08em;
  }
  .stu-hero h1 { font-size: 32px; margin-top: 6px; line-height: 1.05; }
  .stu-hero p { margin-top: 6px; color: var(--p-ink-3); font-size: 13px; max-width: 60ch; }
  .stu-hero .cta {
    margin-top: 14px;
    display: inline-flex; align-items: center; gap: 8px;
    height: 36px; padding: 0 16px;
    background: var(--p-primary); color: var(--p-on);
    border: 0; border-radius: var(--p-r-md);
    font: 500 13px var(--p-body);
    cursor: pointer;
    box-shadow: 0 1px 2px rgba(0,0,0,.05);
  }

  .stu-grid {
    padding: 18px 24px 24px;
    display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px;
  }
  .preview-stage[data-device="mobile"] .stu-grid { grid-template-columns: 1fr; }
  .stu-card {
    background: var(--p-surface);
    border: 1px solid var(--p-border);
    border-radius: var(--p-r-md);
    overflow: hidden;
  }
  .stu-card .thumb {
    aspect-ratio: 16/9;
    background: linear-gradient(135deg, var(--p-primary-soft) 0%, var(--p-surface-sub) 100%);
    position: relative;
  }
  .stu-card .thumb::after {
    content:''; position:absolute; inset:0;
    background-image: repeating-linear-gradient(45deg, transparent 0 11px, oklch(0 0 0 / 0.025) 11px 12px);
  }
  .stu-card .body { padding: 10px 12px 12px; }
  .stu-card .cat {
    font-family: ui-monospace, monospace;
    font-size: 10px; color: var(--p-ink-3);
    text-transform: uppercase; letter-spacing: 0.06em;
  }
  .stu-card h4 {
    font-family: var(--p-display);
    font-size: 14px; font-weight: 500;
    margin-top: 3px;
  }
  .stu-card .row {
    display: flex; align-items: center; justify-content: space-between;
    margin-top: 6px;
    font-size: 11px; color: var(--p-ink-3);
  }
  .stu-card .prog {
    height: 3px; background: var(--p-surface-sub); border-radius: var(--p-r-pill);
    margin-top: 8px; overflow: hidden;
  }
  .stu-card .prog > i { display: block; height: 100%; background: var(--p-primary); }
  .stu-pill {
    display: inline-flex; align-items: center; gap: 4px;
    padding: 2px 6px; height: 18px;
    border-radius: var(--p-r-pill);
    background: var(--p-primary-soft); color: var(--p-primary-soft-fg);
    font-size: 10px; font-weight: 500;
  }

  /* ADMIN SURFACE */
  .ad {
    display: grid; grid-template-columns: 200px 1fr;
    min-height: 320px;
  }
  .preview-stage[data-device="mobile"] .ad { grid-template-columns: 1fr; }
  .preview-stage[data-device="mobile"] .ad .ad-side { display: none; }
  .ad-side {
    background: var(--p-surface-sub);
    border-right: 1px solid var(--p-border);
    padding: 14px 10px;
    display: flex; flex-direction: column; gap: 1px;
  }
  .ad-brand {
    display: flex; align-items: center; gap: 8px;
    padding: 4px 6px 12px;
    margin-bottom: 6px;
    border-bottom: 1px solid var(--p-border);
  }
  .ad-brand .mark {
    width: 22px; height: 22px; border-radius: var(--p-r-sm);
    background: var(--p-primary); color: var(--p-on);
    display: flex; align-items: center; justify-content: center;
    font-weight: 700; font-size: 12px;
    font-family: var(--p-display);
  }
  .ad-brand img { height: 20px; }
  .ad-brand b { font-family: var(--p-display); font-weight: 600; font-size: 13px; }
  .ad-side a {
    display: flex; align-items: center; gap: 8px;
    padding: 6px 8px;
    border-radius: var(--p-r-sm);
    color: var(--p-ink-2); font-size: 12px;
    cursor: pointer;
  }
  .ad-side a.on {
    background: var(--p-surface);
    color: var(--p-primary);
    box-shadow: 0 1px 2px rgba(0,0,0,.05);
  }
  .ad-side a .ico { width: 14px; height: 14px; flex-shrink: 0; }
  .ad-main { padding: 18px 22px; background: var(--p-bg); }
  .ad-main h2 { font-size: 22px; line-height: 1.1; }
  .ad-main p { margin-top: 4px; color: var(--p-ink-3); font-size: 12px; }
  .ad-stats {
    display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px;
    margin-top: 14px;
  }
  .ad-stat {
    background: var(--p-surface); border: 1px solid var(--p-border);
    border-radius: var(--p-r-md);
    padding: 12px 14px;
  }
  .ad-stat .lbl {
    font-family: ui-monospace, monospace; font-size: 10px;
    color: var(--p-ink-3); text-transform: uppercase; letter-spacing: 0.06em;
  }
  .ad-stat .val {
    font-family: var(--p-display); font-weight: 500;
    font-size: 24px; margin-top: 4px; letter-spacing: -0.02em;
  }
  .ad-actions {
    display: flex; gap: 6px; margin-top: 14px;
  }
  .ad-actions .btn {
    appearance: none; border: 0;
    height: 30px; padding: 0 12px;
    border-radius: var(--p-r-md);
    font: 500 12px var(--p-body);
    cursor: pointer;
    display: inline-flex; align-items: center; gap: 6px;
  }
  .ad-actions .btn.primary { background: var(--p-primary); color: var(--p-on); }
  .ad-actions .btn.secondary { background: var(--p-surface); color: var(--p-ink-1); border: 1px solid var(--p-border-strong); }

  /* EMAIL */
  .em {
    padding: 36px;
    background: var(--p-bg);
    display: flex; flex-direction: column; align-items: center; gap: 16px;
  }
  .em .card {
    background: var(--p-surface);
    border: 1px solid var(--p-border);
    border-radius: var(--p-r-lg);
    width: 100%; max-width: 480px;
    overflow: hidden;
  }
  .em .card .top {
    background: var(--p-primary);
    color: var(--p-on);
    padding: 18px 20px;
    display: flex; align-items: center; gap: 10px;
    font-family: var(--p-display);
    font-weight: 600;
    font-size: 14px;
  }
  .em .card .top .mark {
    width: 26px; height: 26px; border-radius: var(--p-r-sm);
    background: rgba(255,255,255,.18);
    display: flex; align-items: center; justify-content: center;
    font-weight: 700;
  }
  .em .card .top img { height: 22px; filter: brightness(0) invert(1); }
  .em .body { padding: 20px 22px; }
  .em h3 { font-size: 18px; margin-bottom: 8px; }
  .em p { color: var(--p-ink-2); font-size: 13px; line-height: 1.55; margin-bottom: 14px; }
  .em .btn {
    display: inline-flex; align-items: center; gap: 6px;
    background: var(--p-primary); color: var(--p-on);
    border: 0; border-radius: var(--p-r-md);
    padding: 9px 18px; font: 500 13px var(--p-body);
    cursor: pointer;
  }
  .em .ft {
    color: var(--p-ink-4); font-size: 10.5px;
    text-align: center; max-width: 380px;
    font-family: ui-monospace, monospace;
    letter-spacing: 0.04em;
  }

  /* CERTIFICATE */
  .cert {
    padding: 24px;
    background: var(--p-bg);
    display: flex; align-items: center; justify-content: center;
  }
  .cert .paper {
    background: var(--p-surface);
    border: 1px solid var(--p-border);
    box-shadow: 0 4px 24px rgba(0,0,0,.06);
    width: 100%; max-width: 560px;
    aspect-ratio: 1.414;
    padding: 36px 40px;
    display: flex; flex-direction: column; gap: 18px;
    position: relative;
    border-radius: var(--p-r-md);
  }
  .cert .paper::before {
    content: ''; position: absolute; top: 18px; left: 18px; right: 18px; bottom: 18px;
    border: 1px solid var(--p-primary);
    border-radius: calc(var(--p-r-md) - 4px);
    pointer-events: none;
  }
  .cert .top {
    display: flex; align-items: center; justify-content: space-between;
    z-index: 1; position: relative;
  }
  .cert .top .mark {
    width: 32px; height: 32px; border-radius: var(--p-r-sm);
    background: var(--p-primary); color: var(--p-on);
    display: flex; align-items: center; justify-content: center;
    font-family: var(--p-display); font-weight: 700; font-size: 14px;
  }
  .cert .top img { height: 28px; }
  .cert .top .seal {
    font-family: ui-monospace, monospace; font-size: 10px;
    color: var(--p-ink-3); text-transform: uppercase; letter-spacing: 0.08em;
  }
  .cert .mid { text-align: center; flex: 1; display: flex; flex-direction: column; justify-content: center; gap: 8px; z-index: 1; position: relative; }
  .cert .mid .eyebrow { font-family: ui-monospace, monospace; font-size: 10px; color: var(--p-ink-3); text-transform: uppercase; letter-spacing: 0.1em; }
  .cert .mid .name { font-family: "Instrument Serif", Georgia, serif; font-size: 32px; font-style: italic; color: var(--p-primary); line-height: 1; }
  .cert .mid .course { font-family: var(--p-display); font-size: 18px; }
  .cert .bot { display: flex; justify-content: space-between; align-items: flex-end; font-size: 11px; color: var(--p-ink-3); z-index: 1; position: relative; }
  .cert .bot .sig { border-top: 1px solid var(--p-ink-3); padding-top: 4px; width: 140px; }
`;

function StudentPreview({ tenant, logoUrl }) {
  return (
    <>
      <div className="stu-nav">
        <div className="stu-logo">
          {logoUrl
            ? <img src={logoUrl} alt={tenant.name} onError={(e) => { e.target.style.display = 'none'; }} />
            : <span className="mark">{tenant.name[0]}</span>}
          <span>{tenant.name}</span>
        </div>
        <div className="links">
          <a className="on">Catalog</a>
          <a>My courses</a>
          <a>Live</a>
        </div>
        <div className="grow" />
        <div className="search">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
          Search courses
        </div>
        <div className="avatar">CR</div>
      </div>
      <div className="stu-hero">
        <div className="eyebrow">Spring 2026 · Now enrolling</div>
        <h1>Learn the skills that ship.</h1>
        <p>Cohort-based courses from working practitioners. Live sessions, real feedback, and a portfolio you can show.</p>
        <button className="cta">
          Browse the catalog
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
        </button>
      </div>
      <div className="stu-grid">
        {[
          { cat: 'Engineering', name: 'Advanced React Patterns',  meta: '4 wks · 12 lessons', prog: 64, pill: 'Featured' },
          { cat: 'Design',      name: 'Design Systems in Practice', meta: '3 wks · 8 lessons',  prog: 100, pill: 'Completed' },
          { cat: 'Product',     name: 'Roadmapping for Tenants',    meta: '2 wks · 6 lessons',  prog: 12,  pill: null },
          { cat: 'Data',        name: 'SQL for Course Operators',   meta: '5 wks · 18 lessons', prog: 0,   pill: 'New' },
        ].map(c => (
          <div className="stu-card" key={c.name}>
            <div className="thumb" />
            <div className="body">
              <div className="cat">{c.cat}</div>
              <h4>{c.name}</h4>
              <div className="row">
                <span>{c.meta}</span>
                {c.pill && <span className="stu-pill">{c.pill}</span>}
              </div>
              <div className="prog"><i style={{ width: c.prog + '%' }} /></div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

function AdminPreview({ tenant, logoUrl }) {
  return (
    <div className="ad">
      <aside className="ad-side">
        <div className="ad-brand">
          {logoUrl
            ? <img src={logoUrl} alt={tenant.name} onError={(e) => { e.target.style.display = 'none'; }} />
            : <span className="mark">{tenant.name[0]}</span>}
          <b>{tenant.name}</b>
        </div>
        {[
          { n: 'Dashboard', icon: 'M3 11 12 3l9 8v10a1 1 0 0 1-1 1h-5v-7H10v7H5a1 1 0 0 1-1-1z', on: true },
          { n: 'Courses',   icon: 'M4 19.5A2.5 2.5 0 0 1 6.5 17H20M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z' },
          { n: 'Students',  icon: 'M2 21a7 7 0 0 1 14 0' },
          { n: 'Analytics', icon: 'M3 3v18h18M7 16l4-4 3 3 5-6' },
          { n: 'Billing',   icon: 'M2 5h20v14H2zM2 10h20' },
          { n: 'Branding',  icon: 'M12 2 4 6v6c0 5 3.5 9 8 10 4.5-1 8-5 8-10V6z' },
        ].map(item => (
          <a key={item.n} className={item.on ? 'on' : ''}>
            <svg className="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d={item.icon} /></svg>
            {item.n}
          </a>
        ))}
      </aside>
      <div className="ad-main">
        <h2>Good morning, Marcus</h2>
        <p>3 new enrollments overnight · 2 courses awaiting review</p>
        <div className="ad-stats">
          <div className="ad-stat"><div className="lbl">Active</div><div className="val">1,284</div></div>
          <div className="ad-stat"><div className="lbl">Completions</div><div className="val">412</div></div>
          <div className="ad-stat"><div className="lbl">MRR</div><div className="val">$48.2k</div></div>
        </div>
        <div className="ad-actions">
          <button className="btn primary">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14"/></svg>
            New course
          </button>
          <button className="btn secondary">Export report</button>
        </div>
      </div>
    </div>
  );
}

function EmailPreview({ tenant, logoUrl }) {
  return (
    <div className="em">
      <div className="card">
        <div className="top">
          {logoUrl
            ? <img src={logoUrl} alt={tenant.name} onError={(e) => { e.target.style.display = 'none'; }} />
            : <span className="mark">{tenant.name[0]}</span>}
          <span>{tenant.name}</span>
        </div>
        <div className="body">
          <h3>You're in. Welcome to Advanced React Patterns.</h3>
          <p>Hi Camila — your seat is confirmed for the Spring 2026 cohort. The first live session is Monday at 10:00 AM tenant time. Add it to your calendar and say hi in the cohort channel.</p>
          <button className="btn">Open the course</button>
        </div>
      </div>
      <div className="ft">{tenant.domain} · You can <u>unsubscribe</u> or update your preferences any time</div>
    </div>
  );
}

function CertificatePreview({ tenant, logoUrl }) {
  return (
    <div className="cert">
      <div className="paper">
        <div className="top">
          {logoUrl
            ? <img src={logoUrl} alt={tenant.name} onError={(e) => { e.target.style.display = 'none'; }} />
            : <span className="mark">{tenant.name[0]}</span>}
          <div className="seal">Certificate · 2026 · #C-8421</div>
        </div>
        <div className="mid">
          <div className="eyebrow">This certifies that</div>
          <div className="name">Camila Rojas</div>
          <div className="eyebrow">has successfully completed</div>
          <div className="course">Advanced React Patterns · 4 weeks</div>
        </div>
        <div className="bot">
          <div>
            <div className="sig">Marcus Lee, Instructor</div>
          </div>
          <div>
            <div className="sig">{tenant.name}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PreviewStage({ brand, pair, radius, density, dark, device, surface, tenant, logoUrl }) {
  // Density → padding deltas applied via CSS vars at the stage scope
  const dyMap = { compact: 7, comfortable: 10, spacious: 14 };
  const styleVars = {
    '--p-primary-h': brand.h,
    '--p-primary-c': brand.c,
    '--p-primary-l': brand.l,
    '--p-r': radius + 'px',
    '--p-display': pair.display,
    '--p-body': pair.body,
    '--p-d-y': dyMap[density] + 'px',
  };
  return (
    <div className="preview-stage scrolls" data-dark={dark ? '1' : '0'} data-device={device}
         style={styleVars}>
      {surface === 'student' && <StudentPreview tenant={tenant} logoUrl={logoUrl} />}
      {surface === 'admin' && <AdminPreview tenant={tenant} logoUrl={logoUrl} />}
      {surface === 'email' && <EmailPreview tenant={tenant} logoUrl={logoUrl} />}
      {surface === 'cert'  && <CertificatePreview tenant={tenant} logoUrl={logoUrl} />}
    </div>
  );
}

(function () {
  const s = document.createElement('style');
  s.id = 'preview-styles';
  s.textContent = __PREVIEW_CSS;
  document.head.appendChild(s);
})();

Object.assign(window, { PreviewStage });
