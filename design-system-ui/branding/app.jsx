// app.jsx — the redesigned Admin · Branding page.
// Top bar + 2-column body (form left / live preview right).

const { useState, useEffect, useMemo } = React;

const __APP_CSS = `
  .br-app { height: 100vh; display: grid; grid-template-rows: 56px 1fr; }

  /* ── TOP BAR ────────────────────────────────────────── */
  .br-top {
    display: flex; align-items: center; gap: 12px;
    padding: 0 24px;
    border-bottom: 1px solid var(--border);
    background: var(--surface);
    flex-shrink: 0;
  }
  .br-top .brand {
    display: flex; align-items: center; gap: 8px;
    padding-right: 14px; margin-right: 4px;
    border-right: 1px solid var(--border);
    height: 32px;
  }
  .br-top .brand .mark {
    width: 24px; height: 24px; border-radius: var(--r-sm);
    background: var(--primary); color: var(--on-primary);
    display: flex; align-items: center; justify-content: center;
    font-family: var(--font-display); font-weight: 700; font-size: 13px;
  }
  .br-top .brand b { font-family: var(--font-display); font-weight: 600; font-size: var(--t-14); }
  .br-top .crumbs {
    color: var(--ink-3); font-size: var(--t-13);
    display: flex; align-items: center; gap: 8px;
  }
  .br-top .crumbs b { color: var(--ink-1); font-weight: 500; }
  .br-top .save-pill {
    display: inline-flex; align-items: center; gap: 6px;
    height: 26px; padding: 0 10px;
    border-radius: var(--r-pill);
    background: var(--bg-sub); color: var(--ink-3);
    font-family: var(--font-mono);
    font-size: 10.5px;
    text-transform: uppercase; letter-spacing: 0.06em;
  }
  .br-top .save-pill .dot { width: 6px; height: 6px; border-radius: 50%; background: currentColor; }
  .br-top .save-pill[data-state="unsaved"] { background: var(--warning-soft); color: oklch(0.45 0.13 70); }
  .br-top .save-pill[data-state="saving"]  { background: var(--info-soft); color: var(--info); }
  .br-top .save-pill[data-state="saved"]   { background: var(--success-soft); color: var(--success); }
  .br-top .save-pill[data-state="saving"] .dot { animation: br-pulse 1s ease-in-out infinite; }
  @keyframes br-pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }

  .br-lang { display: inline-flex; padding: 3px; border-radius: var(--r-md); background: var(--bg-sub); }
  .br-lang button {
    appearance: none; border: 0; background: transparent;
    width: 28px; height: 22px; border-radius: 6px;
    font-family: var(--font-mono); font-size: 10.5px; font-weight: 500;
    color: var(--ink-3); cursor: pointer; letter-spacing: 0.05em;
    text-transform: uppercase;
  }
  .br-lang button.on { background: var(--surface); color: var(--ink-1); box-shadow: var(--shadow-1); }

  /* ── BODY (2 cols) ─────────────────────────────────── */
  .br-body {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(420px, 580px);
    min-height: 0;
  }
  .br-form { overflow-y: auto; padding: 32px 36px 80px; min-width: 0; }
  .br-preview-col {
    border-left: 1px solid var(--border);
    background: var(--bg-sub);
    overflow-y: auto;
    padding: 24px;
    display: flex; flex-direction: column; gap: 14px;
  }

  /* ── PAGE HEADER ───────────────────────────────────── */
  .br-page-hd {
    margin-bottom: 28px;
    max-width: 720px;
  }
  .br-page-hd .eyebrow {
    font-family: var(--font-mono); font-size: 11px;
    color: var(--ink-3); text-transform: uppercase; letter-spacing: 0.08em;
    display: inline-flex; align-items: center; gap: 8px;
  }
  .br-page-hd .eyebrow::before { content:''; width:6px; height:6px; background: var(--primary); border-radius:50%; }
  .br-page-hd h1 {
    font-size: var(--t-32); margin-top: 8px;
    letter-spacing: -0.02em; font-weight: 500;
    font-family: var(--font-display);
  }
  .br-page-hd p { color: var(--ink-3); margin-top: 6px; font-size: var(--t-14); line-height: 1.55; max-width: 64ch; }

  /* ── SECTION ───────────────────────────────────────── */
  .br-section {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--r-lg);
    margin-bottom: 16px;
    overflow: hidden;
  }
  .br-section-hd {
    padding: 16px 22px;
    border-bottom: 1px solid var(--border);
    display: flex; align-items: flex-start; gap: 18px;
    background: var(--surface);
  }
  .br-section-hd .num {
    font-family: var(--font-mono); font-size: 10.5px;
    color: var(--ink-4); padding-top: 4px;
    text-transform: uppercase; letter-spacing: 0.08em;
    flex-shrink: 0; width: 36px;
  }
  .br-section-hd .meta { flex: 1; min-width: 0; }
  .br-section-hd h3 { font-size: var(--t-18); font-family: var(--font-display); font-weight: 600; letter-spacing: -0.01em; }
  .br-section-hd p { color: var(--ink-3); font-size: var(--t-13); margin-top: 4px; line-height: 1.55; }
  .br-section-bd { padding: 22px; display: flex; flex-direction: column; gap: 18px; }

  /* ── BRAND CHIPS ───────────────────────────────────── */
  .brand-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 10px;
  }
  .brand-chip {
    appearance: none; border: 1px solid var(--border);
    background: var(--surface);
    border-radius: var(--r-md);
    padding: 0;
    cursor: pointer;
    overflow: hidden;
    text-align: left;
    transition: border-color 120ms ease, transform 80ms ease, box-shadow 120ms ease;
    font-family: inherit;
    color: inherit;
    display: flex; flex-direction: column;
  }
  .brand-chip:hover {
    border-color: var(--border-strong);
    transform: translateY(-1px);
    box-shadow: var(--shadow-2);
  }
  .brand-chip[data-on="1"] {
    border-color: var(--ink-1);
    box-shadow: 0 0 0 1px var(--ink-1), var(--shadow-2);
  }
  .brand-chip .swatch {
    height: 56px;
    position: relative;
    display: flex; align-items: flex-end; justify-content: space-between;
    padding: 8px 10px;
    color: white;
  }
  .brand-chip .swatch .h {
    font-family: var(--font-mono); font-size: 10px;
    text-transform: uppercase; letter-spacing: 0.06em;
    opacity: 0.85;
  }
  .brand-chip .swatch .ck {
    width: 18px; height: 18px; border-radius: 50%;
    background: rgba(255,255,255,.95);
    display: flex; align-items: center; justify-content: center;
    color: var(--ink-1);
    transition: opacity 120ms ease, transform 120ms ease;
    opacity: 0;
  }
  .brand-chip[data-on="1"] .swatch .ck { opacity: 1; }
  .brand-chip .body {
    padding: 8px 10px 10px;
    display: flex; flex-direction: column; gap: 2px;
  }
  .brand-chip .body .name { font-weight: 600; font-size: var(--t-13); color: var(--ink-1); }
  .brand-chip .body .blurb { color: var(--ink-3); font-size: 11.5px; line-height: 1.45; }

  /* ── DERIVED PALETTE STRIP ─────────────────────────── */
  .derived {
    display: grid; grid-template-columns: repeat(5, 1fr);
    border: 1px solid var(--border);
    border-radius: var(--r-md);
    overflow: hidden;
  }
  .derived > div {
    padding: 14px 10px 10px;
    display: flex; flex-direction: column; gap: 4px;
    font-family: var(--font-mono); font-size: 10px;
    text-transform: uppercase; letter-spacing: 0.06em;
  }
  .derived > div .role { opacity: 0.8; }
  .derived > div .hex { font-size: 9.5px; opacity: 0.65; }

  /* ── TYPOGRAPHY PAIRS ──────────────────────────────── */
  .pair-grid {
    display: grid; gap: 10px;
    grid-template-columns: 1fr 1fr;
  }
  .pair-card {
    appearance: none; border: 1px solid var(--border);
    background: var(--surface);
    border-radius: var(--r-md);
    padding: 14px 16px;
    cursor: pointer;
    text-align: left;
    transition: border-color 120ms ease, transform 80ms ease, box-shadow 120ms ease;
    font-family: inherit;
    color: inherit;
    display: flex; flex-direction: column; gap: 6px;
  }
  .pair-card:hover { border-color: var(--border-strong); transform: translateY(-1px); box-shadow: var(--shadow-2); }
  .pair-card[data-on="1"] {
    border-color: var(--ink-1);
    box-shadow: 0 0 0 1px var(--ink-1), var(--shadow-2);
  }
  .pair-card .title-row {
    display: flex; align-items: center; justify-content: space-between; gap: 8px;
  }
  .pair-card .ttl { font-weight: 600; font-size: var(--t-13); color: var(--ink-1); }
  .pair-card .tag {
    font-family: var(--font-mono); font-size: 10px;
    color: var(--ink-3); text-transform: uppercase; letter-spacing: 0.06em;
  }
  .pair-card .display-sample {
    font-size: 28px; font-weight: 500;
    letter-spacing: -0.02em; line-height: 1;
    color: var(--ink-1);
    margin-top: 4px;
  }
  .pair-card .body-sample {
    font-size: var(--t-13); color: var(--ink-2);
    line-height: 1.45;
  }

  /* ── RADIUS SLIDER + DENSITY ───────────────────────── */
  .ctrl-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 18px;
  }
  .radius-ctrl { display: flex; flex-direction: column; gap: 10px; }
  .radius-track {
    position: relative;
    height: 36px;
    display: flex; align-items: center;
  }
  .radius-track input[type="range"] {
    width: 100%; appearance: none; height: 4px;
    background: var(--border-strong);
    border-radius: var(--r-pill);
    outline: none;
  }
  .radius-track input[type="range"]::-webkit-slider-thumb {
    appearance: none; width: 18px; height: 18px; border-radius: 50%;
    background: white; border: 1px solid var(--border-strong);
    box-shadow: 0 1px 3px rgba(0,0,0,.2); cursor: pointer;
  }
  .radius-track input[type="range"]::-moz-range-thumb {
    width: 18px; height: 18px; border-radius: 50%;
    background: white; border: 1px solid var(--border-strong);
    box-shadow: 0 1px 3px rgba(0,0,0,.2); cursor: pointer;
  }
  .radius-marks {
    display: flex; justify-content: space-between;
    font-family: var(--font-mono); font-size: 10px;
    color: var(--ink-4); text-transform: uppercase; letter-spacing: 0.05em;
  }
  .radius-marks .on { color: var(--ink-1); font-weight: 600; }
  .radius-preview {
    display: flex; align-items: center; justify-content: center;
    height: 56px;
    background: var(--primary-soft);
    color: var(--primary-soft-fg);
    font-family: var(--font-mono); font-size: 11px;
    text-transform: uppercase; letter-spacing: 0.06em;
  }

  .density-ctrl { display: flex; flex-direction: column; gap: 10px; }
  .density-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; }
  .density-card {
    appearance: none; border: 1px solid var(--border);
    background: var(--surface);
    border-radius: var(--r-md);
    padding: 10px 12px;
    cursor: pointer;
    font-family: inherit;
    color: var(--ink-2);
    transition: border-color 120ms ease;
    text-align: left;
  }
  .density-card[data-on="1"] {
    border-color: var(--ink-1);
    box-shadow: 0 0 0 1px var(--ink-1);
    color: var(--ink-1);
  }
  .density-card .name { font-weight: 600; font-size: var(--t-13); }
  .density-card .bars { display: flex; flex-direction: column; gap: 3px; margin-top: 6px; }
  .density-card .bars i {
    display: block; height: 6px; background: var(--border-strong); border-radius: var(--r-pill);
  }
  .density-card[data-d="compact"]     .bars i { height: 4px; }
  .density-card[data-d="comfortable"] .bars i { height: 6px; }
  .density-card[data-d="spacious"]    .bars i { height: 8px; }
  .density-card[data-on="1"] .bars i { background: var(--primary); }

  /* ── TEMPLATES (kept) ──────────────────────────────── */
  .tpl-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 10px; }
  .tpl-card {
    appearance: none; border: 1px solid var(--border);
    background: var(--surface);
    border-radius: var(--r-md);
    padding: 14px;
    cursor: pointer; text-align: left; font-family: inherit; color: inherit;
    transition: border-color 120ms ease, transform 80ms ease, box-shadow 120ms ease;
    display: flex; flex-direction: column; gap: 6px;
  }
  .tpl-card:hover { border-color: var(--border-strong); transform: translateY(-1px); box-shadow: var(--shadow-2); }
  .tpl-card[data-on="1"] {
    border-color: var(--ink-1);
    box-shadow: 0 0 0 1px var(--ink-1), var(--shadow-2);
  }
  .tpl-card .ttl { font-weight: 600; font-size: var(--t-14); }
  .tpl-card .desc { color: var(--ink-3); font-size: var(--t-12); line-height: 1.45; }
  .tpl-card ol { list-style: none; padding: 0; margin: 4px 0 0; display: flex; flex-direction: column; gap: 3px; }
  .tpl-card ol li {
    font-size: 11px; color: var(--ink-3);
    display: flex; align-items: center; gap: 6px;
  }
  .tpl-card ol li span {
    font-family: var(--font-mono); font-size: 9px;
    background: var(--bg-sub); color: var(--ink-3);
    width: 14px; height: 14px; border-radius: 4px;
    display: inline-flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }

  /* ── LOGO INPUT ────────────────────────────────────── */
  .logo-row {
    display: grid; grid-template-columns: 1fr 120px; gap: 12px;
    align-items: end;
  }
  .logo-pad {
    height: 56px;
    background: var(--surface-sub);
    border: 1px dashed var(--border-strong);
    border-radius: var(--r-md);
    display: flex; align-items: center; justify-content: center;
    overflow: hidden;
  }
  .logo-pad img { max-height: 40px; max-width: 100px; object-fit: contain; }
  .logo-pad .ph {
    font-family: var(--font-mono); font-size: 10px;
    color: var(--ink-4); text-transform: uppercase; letter-spacing: 0.08em;
  }

  /* ── PREVIEW PANE ──────────────────────────────────── */
  .br-preview-hd {
    display: flex; align-items: center; gap: 8px; flex-wrap: wrap;
  }
  .br-preview-hd .lbl {
    font-family: var(--font-mono); font-size: 11px;
    color: var(--ink-3); text-transform: uppercase; letter-spacing: 0.08em;
    display: inline-flex; align-items: center; gap: 8px;
  }
  .br-preview-hd .lbl::before { content:''; width:6px; height:6px; background: var(--primary); border-radius:50%; }

  .br-surface-tabs {
    display: flex; padding: 3px; background: var(--surface); border-radius: var(--r-md); border: 1px solid var(--border);
  }
  .br-surface-tabs button {
    appearance: none; border: 0; background: transparent;
    padding: 5px 11px; height: 26px; border-radius: 6px;
    font-family: inherit; font-size: var(--t-13);
    color: var(--ink-3); cursor: pointer;
    font-weight: 500;
  }
  .br-surface-tabs button.on { background: var(--bg-sub); color: var(--ink-1); }
`;

function App() {
  const [tweaks, setTweak] = useTweaks(window.__TWEAK_DEFAULTS);
  const [lang, setLang] = useState(tweaks.lang || 'es');
  const t = useT(lang);

  // Branding state — what would normally be a form bound to /tenants/current
  const [logoUrl, setLogoUrl] = useState('');
  const [brandName, setBrandName] = useState(TENANT.name);
  const [brandId, setBrandId] = useState('emerald');         // active preset
  const [customHex, setCustomHex] = useState('');            // overrides preset when set
  const [pairId, setPairId] = useState('outfit');             // current font pair
  const [radius, setRadius] = useState(10);
  const [density, setDensity] = useState('comfortable');
  const [templateId, setTemplateId] = useState('hero-grid');

  // Track dirty state — saved snapshot vs current. In a real impl this would
  // come from the server.
  const [saved, setSaved] = useState({ logoUrl: '', brandName: TENANT.name, brandId: 'emerald', customHex: '', pairId: 'outfit', radius: 10, density: 'comfortable', templateId: 'hero-grid' });
  const [saveState, setSaveState] = useState('saved'); // saved | unsaved | saving

  const dirty = useMemo(() => {
    const cur = { logoUrl, brandName, brandId, customHex, pairId, radius, density, templateId };
    return JSON.stringify(cur) !== JSON.stringify(saved);
  }, [logoUrl, brandName, brandId, customHex, pairId, radius, density, templateId, saved]);

  // Drive the save pill (saved unless dirty, unless actively saving)
  useEffect(() => {
    if (saveState === 'saving') return;
    setSaveState(dirty ? 'unsaved' : 'saved');
  }, [dirty]); // eslint-disable-line

  useEffect(() => { setTweak('lang', lang); /* eslint-disable */ }, [lang]);

  const handleSave = () => {
    setSaveState('saving');
    setTimeout(() => {
      setSaved({ logoUrl, brandName, brandId, customHex, pairId, radius, density, templateId });
      setSaveState('saved');
    }, 900);
  };
  const handleReset = () => {
    setLogoUrl(saved.logoUrl); setBrandName(saved.brandName);
    setBrandId(saved.brandId); setCustomHex(saved.customHex);
    setPairId(saved.pairId); setRadius(saved.radius);
    setDensity(saved.density); setTemplateId(saved.templateId);
  };

  // Resolve the effective brand object (preset or synthesized from custom hex).
  const effectiveBrand = useMemo(() => {
    if (customHex && /^#?[0-9a-f]{6}$/i.test(customHex.replace('#', '').padEnd(6, '0'))) {
      // For custom hex we don't translate to OKLCH coords here (would need a
      // proper conversion); fall back to a neutral derivation using the chosen
      // preset's c/l and a guessed hue. In a real impl we'd convert hex→OKLCH.
      const baseline = BRAND_BY_ID[brandId] || BRAND_PRESETS[0];
      return { ...baseline, hex: customHex.startsWith('#') ? customHex : '#' + customHex, name: 'Custom' };
    }
    return BRAND_BY_ID[brandId] || BRAND_PRESETS[0];
  }, [brandId, customHex]);

  const effectivePair = PAIR_BY_ID[pairId] || FONT_PAIRS[0];

  const tenant = useMemo(() => ({ ...TENANT, name: brandName || TENANT.name }), [brandName]);

  // Contrast on white for the active brand
  const contrast = contrastRatio(effectiveBrand.hex);
  const grade = contrastGrade(contrast);

  return (
    <div className="br-app">
      {/* TOP BAR */}
      <header className="br-top">
        <div className="brand">
          <div className="mark">S</div>
          <b>SkillsRamp</b>
        </div>
        <div className="crumbs">Acme University · <b>{t('page.crumb')}</b></div>
        <div style={{ flex: 1 }} />
        <div className="save-pill" data-state={saveState}>
          <span className="dot" />
          {saveState === 'unsaved' ? t('save.unsaved') : saveState === 'saving' ? t('save.saving') : t('save.saved')}
        </div>
        <div className="br-lang">
          <button className={lang === 'en' ? 'on' : ''} onClick={() => setLang('en')}>EN</button>
          <button className={lang === 'es' ? 'on' : ''} onClick={() => setLang('es')}>ES</button>
        </div>
        <Button size="sm" variant="secondary" icon="external">{t('btn.viewProd')}</Button>
        <Button size="sm" variant="tertiary" onClick={handleReset} disabled={!dirty}>{t('btn.reset')}</Button>
        <Button size="sm" variant="primary" icon="check" onClick={handleSave} disabled={!dirty || saveState === 'saving'}>
          {t('btn.save')}
        </Button>
      </header>

      <div className="br-body">
        {/* LEFT — FORM */}
        <div className="br-form scrolls">
          <header className="br-page-hd">
            <div className="eyebrow">Settings · {tenant.slug}.skillsramp.com</div>
            <h1>{t('page.title')}</h1>
            <p>{t('page.subtitle')}</p>
          </header>

          {/* IDENTITY */}
          <section className="br-section">
            <header className="br-section-hd">
              <div className="num">01</div>
              <div className="meta">
                <h3>{t('sec.identity')}</h3>
                <p>{t('sec.identity.sub')}</p>
              </div>
            </header>
            <div className="br-section-bd">
              <FieldGroup label={t('fld.logo')} hint={t('fld.logo.hint')}>
                <div className="logo-row">
                  <div style={{ display: 'flex', gap: 8 }}>
                    <Input value={logoUrl} onChange={(e) => setLogoUrl(e.target.value)}
                           placeholder="https://cdn.acme.edu/logo.svg" leadingIcon="link" />
                    <Button variant="secondary" icon="upload">{t('fld.logo.upload')}</Button>
                  </div>
                  <div className="logo-pad">
                    {logoUrl
                      ? <img src={logoUrl} alt="" onError={(e) => { e.target.style.display = 'none'; }} />
                      : <span className="ph">no logo</span>}
                  </div>
                </div>
              </FieldGroup>
              <FieldGroup label={t('fld.brandname')} hint={t('fld.brandname.hint')}>
                <Input value={brandName} onChange={(e) => setBrandName(e.target.value)} />
              </FieldGroup>
            </div>
          </section>

          {/* BRAND COLOR */}
          <section className="br-section">
            <header className="br-section-hd">
              <div className="num">02</div>
              <div className="meta">
                <h3>{t('sec.brand')}</h3>
                <p>{t('sec.brand.sub')}</p>
              </div>
            </header>
            <div className="br-section-bd">
              <div className="brand-grid">
                {BRAND_PRESETS.map(b => {
                  const on = !customHex && brandId === b.id;
                  return (
                    <button key={b.id} className="brand-chip" data-on={on ? '1' : '0'}
                            onClick={() => { setBrandId(b.id); setCustomHex(''); }}>
                      <div className="swatch" style={{ background: b.hex }}>
                        <span className="h">{b.hex}</span>
                        <span className="ck"><Icon name="check" size={11} /></span>
                      </div>
                      <div className="body">
                        <span className="name">{b.name}</span>
                        <span className="blurb">{b.blurb}</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 14, alignItems: 'end' }}>
                <FieldGroup label={t('brand.custom')} hint={t('brand.hint')}>
                  <Input value={customHex} placeholder="#10B981"
                         onChange={(e) => setCustomHex(e.target.value)}
                         leadingIcon="filter" />
                </FieldGroup>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, paddingBottom: 4 }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{t('brand.contrast')}</div>
                  <Badge tone={grade.tone}>{grade.label} · {contrast.toFixed(2)}:1</Badge>
                </div>
              </div>

              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>{t('brand.swatches')}</div>
                <div className="derived"
                     style={{
                       // Re-derive locally so admin doesn't have to look at preview to see the palette
                       '--__h': effectiveBrand.h,
                       '--__c': effectiveBrand.c,
                       '--__l': effectiveBrand.l,
                     }}>
                  <div style={{ background: `oklch(0.96 0.035 ${effectiveBrand.h})`, color: `oklch(0.32 ${effectiveBrand.c * 0.9} ${effectiveBrand.h})` }}>
                    <span className="role">soft</span>
                    <span className="hex">--primary-soft</span>
                  </div>
                  <div style={{ background: `oklch(0.32 ${effectiveBrand.c * 0.9} ${effectiveBrand.h})`, color: 'white' }}>
                    <span className="role">soft-fg</span>
                    <span className="hex">--primary-soft-fg</span>
                  </div>
                  <div style={{ background: `oklch(${effectiveBrand.l} ${effectiveBrand.c} ${effectiveBrand.h})`, color: 'white' }}>
                    <span className="role">primary</span>
                    <span className="hex">{effectiveBrand.hex}</span>
                  </div>
                  <div style={{ background: `oklch(${effectiveBrand.l - 0.05} ${effectiveBrand.c} ${effectiveBrand.h})`, color: 'white' }}>
                    <span className="role">hover</span>
                    <span className="hex">--primary-hover</span>
                  </div>
                  <div style={{ background: 'white', color: `oklch(${effectiveBrand.l} ${effectiveBrand.c} ${effectiveBrand.h})`, border: '1px solid var(--border)' }}>
                    <span className="role">on-primary</span>
                    <span className="hex">contrast white</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* TYPOGRAPHY */}
          <section className="br-section">
            <header className="br-section-hd">
              <div className="num">03</div>
              <div className="meta">
                <h3>{t('sec.type')}</h3>
                <p>{t('sec.type.sub')}</p>
              </div>
            </header>
            <div className="br-section-bd">
              <div className="pair-grid">
                {FONT_PAIRS.map(p => {
                  const on = pairId === p.id;
                  return (
                    <button key={p.id} className="pair-card" data-on={on ? '1' : '0'}
                            onClick={() => setPairId(p.id)}>
                      <div className="title-row">
                        <span className="ttl">{p.name}</span>
                        {on && <Badge tone="primary" dot>active</Badge>}
                      </div>
                      <div className="display-sample" style={{ fontFamily: p.display }}>
                        Skills that ship
                      </div>
                      <div className="body-sample" style={{ fontFamily: p.body }}>
                        The quick brown fox jumps over the lazy dog. {p.sample.toLowerCase()}.
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </section>

          {/* SHAPE & FEEL */}
          <section className="br-section">
            <header className="br-section-hd">
              <div className="num">04</div>
              <div className="meta">
                <h3>{t('sec.shape')}</h3>
                <p>{t('sec.shape.sub')}</p>
              </div>
            </header>
            <div className="br-section-bd">
              <div className="ctrl-row">
                <div className="radius-ctrl">
                  <FieldGroup label={t('radius')} hint={`${radius}px · applied to buttons, inputs, cards, modals`}>
                    <div className="radius-track">
                      <input type="range" min={0} max={20} step={2}
                             value={radius} onChange={(e) => setRadius(Number(e.target.value))} />
                    </div>
                    <div className="radius-marks">
                      {RADIUS_PRESETS.map(r => (
                        <span key={r.v} className={r.v === radius ? 'on' : ''}>{r.label}</span>
                      ))}
                    </div>
                  </FieldGroup>
                  <div className="radius-preview" style={{ borderRadius: radius + 'px' }}>
                    {radius}px · preview
                  </div>
                </div>
                <div className="density-ctrl">
                  <FieldGroup label={t('density')} hint="Controls padding inside buttons, inputs, and rows. Inherits across student + admin surfaces.">
                    <div className="density-grid">
                      {DENSITIES.map(d => (
                        <button key={d.v} className="density-card" data-d={d.v} data-on={density === d.v ? '1' : '0'}
                                onClick={() => setDensity(d.v)}>
                          <div className="name">{d.label}</div>
                          <div className="bars"><i /><i style={{ width: '80%' }} /><i style={{ width: '60%' }} /></div>
                        </button>
                      ))}
                    </div>
                  </FieldGroup>
                </div>
              </div>
            </div>
          </section>

          {/* PAGE TEMPLATES */}
          <section className="br-section">
            <header className="br-section-hd">
              <div className="num">05</div>
              <div className="meta">
                <h3>{t('sec.templates')}</h3>
                <p>{t('sec.templates.sub')}</p>
              </div>
            </header>
            <div className="br-section-bd">
              <div className="tpl-grid">
                {PAGE_TEMPLATES.map(tpl => {
                  const on = templateId === tpl.id;
                  return (
                    <button key={tpl.id} className="tpl-card" data-on={on ? '1' : '0'}
                            onClick={() => setTemplateId(tpl.id)}>
                      <span className="ttl">{tpl.name}</span>
                      <span className="desc">{tpl.desc}</span>
                      <ol>
                        {tpl.sections.map((s, i) => (
                          <li key={s}><span>{i + 1}</span>{s}</li>
                        ))}
                      </ol>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 4 }}>
                        {on
                          ? <Badge tone="primary" dot>{t('tpl.applied')}</Badge>
                          : <Badge tone="neutral">{t('tpl.apply')}</Badge>}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </section>
        </div>

        {/* RIGHT — LIVE PREVIEW */}
        <div className="br-preview-col scrolls">
          <div className="br-preview-hd">
            <span className="lbl">{t('preview.title')}</span>
            <div style={{ flex: 1 }} />
            <label style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 'var(--t-12)', color: 'var(--ink-3)' }}>
              <Switch checked={tweaks.previewDark} onChange={(e) => setTweak('previewDark', e.target.checked)} />
              {t('preview.dark')}
            </label>
          </div>

          <div className="br-preview-hd">
            <div className="br-surface-tabs">
              {[
                ['student', t('preview.student')],
                ['admin',   t('preview.admin')],
                ['email',   t('preview.email')],
                ['cert',    t('preview.cert')],
              ].map(([v, l]) => (
                <button key={v} className={tweaks.previewSurface === v ? 'on' : ''}
                        onClick={() => setTweak('previewSurface', v)}>{l}</button>
              ))}
            </div>
            <div style={{ flex: 1 }} />
            <div className="br-surface-tabs">
              {[['desktop', t('preview.device.desktop')], ['mobile', t('preview.device.mobile')]].map(([v, l]) => (
                <button key={v} className={tweaks.previewDevice === v ? 'on' : ''}
                        onClick={() => setTweak('previewDevice', v)}>{l}</button>
              ))}
            </div>
          </div>

          <PreviewStage
            brand={effectiveBrand}
            pair={effectivePair}
            radius={radius}
            density={density}
            dark={tweaks.previewDark}
            device={tweaks.previewDevice}
            surface={tweaks.previewSurface}
            tenant={tenant}
            logoUrl={logoUrl}
          />

          <div style={{ display: 'flex', gap: 6, alignItems: 'center', color: 'var(--ink-3)', fontSize: 'var(--t-12)', padding: '0 4px' }}>
            <Icon name="info" size={13} />
            Preview reflects every brand change in real-time. Save to publish to {tenant.slug}.skillsramp.com.
          </div>
        </div>
      </div>

      {/* TWEAKS — debugging affordances + future extensions */}
      <TweaksPanel title="Branding tweaks">
        <TweakSection label="Preview">
          <TweakRadio label="Surface" value={tweaks.previewSurface}
                      options={[
                        { value: 'student', label: 'student' },
                        { value: 'admin',   label: 'admin' },
                      ]}
                      onChange={(v) => setTweak('previewSurface', v)} />
          <TweakRadio label="Device" value={tweaks.previewDevice}
                      options={[
                        { value: 'desktop', label: 'desktop' },
                        { value: 'mobile',  label: 'mobile' },
                      ]}
                      onChange={(v) => setTweak('previewDevice', v)} />
          <TweakToggle label="Dark mode" value={tweaks.previewDark}
                       onChange={(v) => setTweak('previewDark', v)} />
        </TweakSection>
        <TweakSection label="Quick brands">
          <TweakColor label="Try brand" value={[effectiveBrand.hex, effectiveBrand.name]}
                      options={BRAND_PRESETS.map(b => [b.hex, b.name])}
                      onChange={(v) => {
                        const found = BRAND_PRESETS.find(b => b.hex === v[0]);
                        if (found) { setBrandId(found.id); setCustomHex(''); }
                      }} />
        </TweakSection>
      </TweaksPanel>
    </div>
  );
}

(function () {
  const s = document.createElement('style');
  s.id = 'br-app';
  s.textContent = __APP_CSS;
  document.head.appendChild(s);
})();

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
