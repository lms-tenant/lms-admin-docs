// screens.jsx — top-level screens: CourseHome (with empty state), CreateModal,
// PublishDialog. Uses primitives + data.

const { useState, useEffect } = React;

const __SCREENS_CSS = `
  /* HOME / EMPTY STATE ─────────────────────────────────── */
  .home {
    height: 100vh; display: grid; grid-template-rows: 56px 1fr;
    background: var(--bg);
  }
  .home-topbar {
    display: flex; align-items: center; gap: 12px;
    padding: 0 24px;
    border-bottom: 1px solid var(--border);
    background: var(--surface);
  }
  .home-topbar .brand {
    display: flex; align-items: center; gap: 8px;
    padding-right: 14px; margin-right: 4px;
    border-right: 1px solid var(--border);
    height: 32px;
  }
  .home-topbar .brand .mark {
    width: 24px; height: 24px; border-radius: var(--r-sm);
    background: var(--primary); color: var(--on-primary);
    display: flex; align-items: center; justify-content: center;
    font-family: var(--font-display); font-weight: 700; font-size: 13px;
  }
  .home-topbar .crumbs { color: var(--ink-3); font-size: var(--t-13); }
  .home-topbar .crumbs b { color: var(--ink-1); font-weight: 500; }

  .home-body {
    overflow-y: auto; padding: 40px 56px 96px;
    max-width: 1200px; margin: 0 auto; width: 100%;
  }

  /* Three empty-state variants */
  .empty-illustrated {
    text-align: center;
    padding: 64px 24px;
    border: 1px dashed var(--border-strong);
    border-radius: var(--r-lg);
    background: var(--surface-sub);
    display: flex; flex-direction: column; align-items: center; gap: 18px;
  }
  .empty-illustrated .glyph {
    width: 84px; height: 84px;
    background: var(--primary-soft);
    border-radius: var(--r-lg);
    display: flex; align-items: center; justify-content: center;
    color: var(--primary-soft-fg);
    position: relative;
  }
  .empty-illustrated h2 {
    font-size: var(--t-32); font-family: var(--font-display); font-weight: 500;
    letter-spacing: -0.025em;
  }
  .empty-illustrated p {
    color: var(--ink-3); max-width: 52ch; font-size: var(--t-15);
    line-height: 1.55;
  }
  .empty-illustrated .actions { display: flex; gap: 10px; flex-wrap: wrap; justify-content: center; }

  .empty-minimal {
    padding: 80px 0;
    text-align: center;
    color: var(--ink-3);
    display: flex; flex-direction: column; align-items: center; gap: 8px;
  }
  .empty-minimal h2 {
    font-size: var(--t-32); color: var(--ink-1);
    font-family: var(--font-display); font-weight: 500;
    letter-spacing: -0.025em;
  }
  .empty-minimal .actions { display: flex; gap: 8px; margin-top: 16px; }

  .empty-ai {
    max-width: 720px;
    margin: 60px auto;
    padding: 40px;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--r-lg);
    box-shadow: var(--shadow-2);
    display: flex; flex-direction: column; gap: 20px;
  }
  .empty-ai .badge {
    display: inline-flex; align-items: center; gap: 6px;
    font-family: var(--font-mono); font-size: 10.5px;
    color: var(--primary-soft-fg);
    background: var(--primary-soft);
    padding: 4px 10px; border-radius: var(--r-pill);
    text-transform: uppercase; letter-spacing: 0.08em;
    align-self: flex-start;
  }
  .empty-ai h2 {
    font-size: 38px; font-family: var(--font-display); font-weight: 500;
    letter-spacing: -0.025em; line-height: 1.05;
  }
  .empty-ai h2 em {
    font-family: "Instrument Serif", Georgia, serif;
    font-style: italic; font-weight: 400; color: var(--primary-soft-fg);
  }
  .empty-ai .prompt {
    border: 1px solid var(--border-input);
    border-radius: var(--r-md);
    background: var(--surface);
    padding: 14px 16px;
    display: flex; flex-direction: column; gap: 10px;
  }
  .empty-ai .prompt textarea {
    appearance: none; border: 0; background: transparent;
    font-family: inherit; font-size: var(--t-15);
    color: var(--ink-1);
    line-height: 1.55; resize: none; min-height: 64px;
    width: 100%; outline: none;
  }
  .empty-ai .prompt-actions {
    display: flex; gap: 8px; align-items: center;
    padding-top: 8px; border-top: 1px solid var(--border);
  }
  .empty-ai .chips {
    display: flex; gap: 6px; flex-wrap: wrap;
  }
  .empty-ai .chip {
    appearance: none; border: 1px solid var(--border);
    background: var(--bg-sub);
    padding: 5px 10px; border-radius: var(--r-pill);
    font-size: var(--t-12); color: var(--ink-2);
    cursor: pointer; font-family: inherit;
    transition: border-color 120ms ease, background 120ms ease;
  }
  .empty-ai .chip:hover { border-color: var(--ink-4); background: var(--surface); }
  .empty-ai .alts {
    display: flex; gap: 14px;
    font-size: var(--t-13); color: var(--ink-3);
  }
  .empty-ai .alts a {
    color: var(--ink-2); text-decoration: underline; text-underline-offset: 3px;
    cursor: pointer;
  }
  .empty-ai .alts a:hover { color: var(--ink-1); }

  /* MODAL ──────────────────────────────────────────────── */
  .cb-modal-overlay {
    position: fixed; inset: 0; z-index: 80;
    background: var(--overlay);
    display: flex; align-items: center; justify-content: center;
    padding: 24px;
    animation: cb-fade-in 160ms ease-out;
  }
  @keyframes cb-fade-in {
    from { opacity: 0; } to { opacity: 1; }
  }
  .cb-modal {
    background: var(--surface);
    border-radius: var(--r-lg);
    box-shadow: var(--shadow-4);
    width: 100%; max-width: 720px; max-height: calc(100vh - 64px);
    display: flex; flex-direction: column; overflow: hidden;
    animation: cb-pop 200ms cubic-bezier(.3,.7,.4,1);
  }
  .cb-modal[data-wide="1"] { max-width: 900px; }
  @keyframes cb-pop {
    from { transform: scale(0.96) translateY(8px); opacity: 0; }
    to   { transform: scale(1) translateY(0); opacity: 1; }
  }
  .cb-modal-hd {
    display: flex; align-items: center; gap: 12px;
    padding: 18px 22px;
    border-bottom: 1px solid var(--border);
  }
  .cb-modal-hd h3 { font-size: var(--t-18); font-family: var(--font-display); font-weight: 600; letter-spacing: -0.01em; }
  .cb-modal-hd .sub { color: var(--ink-3); font-size: var(--t-13); }
  .cb-modal-tabs {
    display: flex; padding: 0 22px;
    border-bottom: 1px solid var(--border);
    gap: 4px;
  }
  .cb-modal-tabs button {
    appearance: none; border: 0; background: transparent;
    padding: 12px 14px;
    font-family: inherit; font-size: var(--t-13); font-weight: 500;
    color: var(--ink-3); cursor: pointer;
    border-bottom: 2px solid transparent;
    margin-bottom: -1px;
    display: flex; align-items: center; gap: 6px;
  }
  .cb-modal-tabs button:hover { color: var(--ink-1); }
  .cb-modal-tabs button.on { color: var(--ink-1); border-bottom-color: var(--primary); }
  .cb-modal-body { padding: 22px; overflow-y: auto; flex: 1; min-height: 0; }
  .cb-modal-ft {
    padding: 16px 22px; border-top: 1px solid var(--border);
    display: flex; gap: 8px; align-items: center;
  }

  .ai-generating {
    display: flex; flex-direction: column; align-items: center; gap: 16px;
    padding: 56px 24px; text-align: center;
  }
  .ai-generating .pulse {
    width: 56px; height: 56px;
    background: var(--primary-soft);
    border-radius: var(--r-lg);
    display: flex; align-items: center; justify-content: center;
    color: var(--primary-soft-fg);
    animation: cb-pulse-grow 1.4s ease-in-out infinite;
  }
  @keyframes cb-pulse-grow {
    0%, 100% { transform: scale(1); }
    50%      { transform: scale(1.08); }
  }
  .ai-generating .status {
    font-family: var(--font-mono); font-size: 11px;
    color: var(--ink-3); text-transform: uppercase; letter-spacing: 0.08em;
  }
  .ai-generating h3 {
    font-family: var(--font-display); font-size: var(--t-24); font-weight: 500;
    letter-spacing: -0.02em;
  }
  .ai-generating ul {
    list-style: none; padding: 0; margin: 8px 0 0;
    display: flex; flex-direction: column; gap: 6px;
    font-size: var(--t-13); color: var(--ink-3);
    font-family: var(--font-mono);
  }
  .ai-generating ul li.done { color: var(--success); }
  .ai-generating ul li.current { color: var(--ink-1); }

  /* OUTLINE REVIEW */
  .outline-grid {
    display: flex; flex-direction: column; gap: 10px;
  }
  .outline-mod {
    border: 1px solid var(--border);
    border-radius: var(--r-md);
    background: var(--surface);
    overflow: hidden;
  }
  .outline-mod .hd {
    display: flex; align-items: center; gap: 10px;
    padding: 10px 14px;
    background: var(--surface-sub);
    border-bottom: 1px solid var(--border);
  }
  .outline-mod .hd .num {
    font-family: var(--font-mono); font-size: 11px;
    color: var(--primary-soft-fg);
    background: var(--primary-soft);
    padding: 3px 8px;
    border-radius: var(--r-pill);
    letter-spacing: 0.06em;
  }
  .outline-mod .hd b {
    font-weight: 600; font-size: var(--t-14);
  }
  .outline-mod .lessons {
    padding: 10px 14px;
    display: flex; flex-direction: column; gap: 6px;
  }
  .outline-mod .lessons .row {
    display: flex; align-items: center; gap: 10px;
    font-size: var(--t-13); color: var(--ink-2);
  }
  .outline-mod .lessons .row .ic {
    width: 22px; height: 22px;
    background: var(--bg-sub); border-radius: var(--r-sm);
    display: flex; align-items: center; justify-content: center;
    color: var(--ink-3); flex-shrink: 0;
  }
  .outline-mod .lessons .row .meta { color: var(--ink-4); font-family: var(--font-mono); font-size: 10.5px; margin-left: auto; }

  /* TEMPLATES */
  .templates {
    display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 12px;
  }
  .template-card {
    text-align: left; appearance: none;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--r-md);
    padding: 14px;
    display: flex; flex-direction: column; gap: 6px;
    cursor: pointer; color: inherit; font-family: inherit;
    transition: border-color 120ms ease, transform 80ms ease, box-shadow 120ms ease;
  }
  .template-card:hover {
    border-color: var(--primary); transform: translateY(-1px);
    box-shadow: var(--shadow-2);
  }
  .template-card .tag {
    align-self: flex-start;
    font-family: var(--font-mono); font-size: 10px;
    color: var(--ink-3);
    background: var(--bg-sub);
    padding: 2px 6px; border-radius: var(--r-sm);
    text-transform: uppercase; letter-spacing: 0.06em;
  }
  .template-card .ttl { font-weight: 600; font-size: var(--t-14); }
  .template-card .meta { color: var(--ink-3); font-size: var(--t-12); font-family: var(--font-mono); }
  .template-card .desc { color: var(--ink-3); font-size: var(--t-13); line-height: 1.5; }

  /* PUBLISH DIALOG */
  .preflight-list {
    display: flex; flex-direction: column;
    border: 1px solid var(--border);
    border-radius: var(--r-md);
    background: var(--bg-sub);
    overflow: hidden;
  }
  .preflight-list .row {
    display: flex; align-items: center; gap: 12px;
    padding: 12px 16px;
    border-bottom: 1px solid var(--border);
    font-size: var(--t-13);
  }
  .preflight-list .row:last-child { border-bottom: 0; }
  .preflight-list .row .ic {
    width: 22px; height: 22px;
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }
  .preflight-list .row.ok .ic    { background: var(--success-soft); color: var(--success); }
  .preflight-list .row.warn .ic  { background: var(--warning-soft); color: oklch(0.45 0.13 70); }
  .preflight-list .row.fail .ic  { background: var(--danger-soft); color: var(--danger); }
  .preflight-list .row .ttl { font-weight: 500; color: var(--ink-1); }
  .preflight-list .row .sub { color: var(--ink-3); font-size: var(--t-12); margin-top: 1px; }
  .preflight-list .row .body { flex: 1; }

  .visibility-radio {
    display: flex; flex-direction: column;
    border: 1px solid var(--border);
    border-radius: var(--r-md);
    overflow: hidden;
  }
  .visibility-radio label {
    display: flex; align-items: flex-start; gap: 12px;
    padding: 14px 16px;
    border-bottom: 1px solid var(--border);
    cursor: pointer;
    transition: background 120ms ease;
  }
  .visibility-radio label:last-child { border-bottom: 0; }
  .visibility-radio label:hover { background: var(--surface-sub); }
  .visibility-radio label > div { display: flex; flex-direction: column; gap: 2px; }
`;

// ── HOME (course list / empty state) ────────────────────────
function CourseHome({ emptyStyle, onCreate, t, lang, setLang, courses }) {
  return (
    <div className="home">
      <header className="home-topbar">
        <div className="brand">
          <div className="mark">S</div>
          <b style={{ fontFamily: 'var(--font-display)', fontWeight: 600 }}>{t('app.brand')}</b>
        </div>
        <div className="crumbs">
          Acme University · <b>{t('home.title')}</b>
        </div>
        <div style={{ flex: 1 }} />
        <div className="cb-lang" style={{ display: 'inline-flex', padding: 3, borderRadius: 'var(--r-md)', background: 'var(--bg-sub)' }}>
          <button className={lang === 'en' ? 'on' : ''} onClick={() => setLang('en')}
                  style={{ appearance: 'none', border: 0, background: lang === 'en' ? 'var(--surface)' : 'transparent', boxShadow: lang === 'en' ? 'var(--shadow-1)' : 'none', width: 28, height: 22, borderRadius: 6, fontFamily: 'var(--font-mono)', fontSize: 10.5, fontWeight: 500, color: lang === 'en' ? 'var(--ink-1)' : 'var(--ink-3)', cursor: 'pointer', letterSpacing: '0.05em' }}>EN</button>
          <button className={lang === 'es' ? 'on' : ''} onClick={() => setLang('es')}
                  style={{ appearance: 'none', border: 0, background: lang === 'es' ? 'var(--surface)' : 'transparent', boxShadow: lang === 'es' ? 'var(--shadow-1)' : 'none', width: 28, height: 22, borderRadius: 6, fontFamily: 'var(--font-mono)', fontSize: 10.5, fontWeight: 500, color: lang === 'es' ? 'var(--ink-1)' : 'var(--ink-3)', cursor: 'pointer', letterSpacing: '0.05em' }}>ES</button>
        </div>
        <Avatar name="Marcus Lee" size="sm" />
      </header>

      <div className="home-body scrolls">
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 32, gap: 16 }}>
          <div>
            <Stamp>{t('home.eyebrow')}</Stamp>
            <h1 style={{ fontSize: 'var(--t-44)', marginTop: 10, letterSpacing: '-0.025em' }}>{t('home.title')}</h1>
            <p style={{ color: 'var(--ink-3)', marginTop: 6, fontSize: 'var(--t-15)' }}>{t('home.subtitle')}</p>
          </div>
          <Button variant="primary" icon="plus" onClick={onCreate}>{t('btn.newCourse')}</Button>
        </div>

        {emptyStyle === 'illustrated' && (
          <div className="empty-illustrated">
            <div className="glyph"><Icon name="graduation" size={36} /></div>
            <div>
              <h2>{t('home.empty.title')}</h2>
              <p>{t('home.empty.body')}</p>
            </div>
            <div className="actions">
              <Button variant="primary" icon="spark" onClick={onCreate}>{t('home.empty.ai')}</Button>
              <Button variant="secondary" icon="plus" onClick={onCreate}>{t('home.empty.blank')}</Button>
              <Button variant="tertiary" icon="layers" onClick={onCreate}>{t('home.empty.browse')}</Button>
            </div>
          </div>
        )}

        {emptyStyle === 'minimal' && (
          <div className="empty-minimal">
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink-4)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>00 · Empty</div>
            <h2>{t('home.empty.title')}</h2>
            <p style={{ maxWidth: '44ch', lineHeight: 1.55 }}>{t('home.empty.body')}</p>
            <div className="actions">
              <Button variant="primary" icon="spark" onClick={onCreate}>{t('home.empty.ai')}</Button>
              <Button variant="link" trailing="arrowRight" onClick={onCreate}>{t('home.empty.blank')}</Button>
            </div>
          </div>
        )}

        {emptyStyle === 'ai-prompt' && (
          <div className="empty-ai">
            <div className="badge"><Icon name="spark" size={11} /> AI assist</div>
            <h2>Describe your course.<br /><em>We&rsquo;ll draft the outline.</em></h2>
            <div className="prompt">
              <textarea placeholder={t('create.ai.placeholder')} onClick={onCreate} readOnly />
              <div className="prompt-actions">
                <div className="chips">
                  {PROMPT_CHIPS.slice(0, 3).map(c => (
                    <button key={c} className="chip" onClick={onCreate}>{c}</button>
                  ))}
                </div>
                <div style={{ flex: 1 }} />
                <Button variant="primary" icon="spark" onClick={onCreate}>{t('btn.generate')}</Button>
              </div>
            </div>
            <div className="alts">
              <span>Or:</span>
              <a onClick={onCreate}>start blank</a>
              <a onClick={onCreate}>duplicate existing</a>
              <a onClick={onCreate}>browse templates</a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── CREATE MODAL (AI-first with tabs) ───────────────────────
function CreateModal({ onClose, onCreated, t, aiOn }) {
  const [tab, setTab] = useState(aiOn ? 'ai' : 'blank');
  const [prompt, setPrompt] = useState('');
  const [step, setStep] = useState('prompt'); // prompt | generating | review
  const [progress, setProgress] = useState(0);
  const STEPS = [
    'Parsing brief',
    'Drafting module structure',
    'Naming lessons',
    'Estimating duration',
    'Finishing touches',
  ];

  // Advance the fake AI progress steps so the loading screen feels alive.
  useEffect(() => {
    if (step !== 'generating') return;
    setProgress(0);
    let i = 0;
    const tick = () => {
      i++;
      setProgress(i);
      if (i < STEPS.length) setTimeout(tick, 500 + Math.random() * 300);
      else setTimeout(() => setStep('review'), 600);
    };
    setTimeout(tick, 350);
  }, [step]);

  const startGen = () => setStep('generating');
  const acceptOutline = () => onCreated(SAMPLE_COURSE);

  const tabsBar = (
    <div className="cb-modal-tabs">
      {aiOn && <button className={tab === 'ai' ? 'on' : ''} onClick={() => { setTab('ai'); setStep('prompt'); }}>
        <Icon name="spark" size={13} /> {t('create.tab.ai')}
      </button>}
      <button className={tab === 'blank' ? 'on' : ''} onClick={() => setTab('blank')}>
        <Icon name="plus" size={13} /> {t('create.tab.blank')}
      </button>
      <button className={tab === 'duplicate' ? 'on' : ''} onClick={() => setTab('duplicate')}>
        <Icon name="copy" size={13} /> {t('create.tab.duplicate')}
      </button>
      <button className={tab === 'template' ? 'on' : ''} onClick={() => setTab('template')}>
        <Icon name="layers" size={13} /> {t('create.tab.template')}
      </button>
    </div>
  );

  return (
    <div className="cb-modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={'cb-modal' + (tab === 'template' || step === 'review' ? ' ' : '')}
           data-wide={tab === 'template' || step === 'review' ? '1' : undefined}
           onClick={(e) => e.stopPropagation()}>
        <header className="cb-modal-hd">
          <h3>{t('create.title')}</h3>
          <span style={{ color: 'var(--ink-4)', fontSize: 12, fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            {step === 'prompt' && tab === 'ai' && 'Step 01 · Brief'}
            {step === 'generating' && 'Step 02 · Drafting'}
            {step === 'review' && 'Step 03 · Review'}
          </span>
          <div style={{ flex: 1 }} />
          <Button size="sm" variant="tertiary" icon="x" iconOnly aria-label="Close" onClick={onClose} />
        </header>

        {step === 'prompt' && tabsBar}

        <div className="cb-modal-body scrolls">
          {/* AI · prompt */}
          {step === 'prompt' && tab === 'ai' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <FieldGroup label={t('create.ai.label')} hint={t('create.ai.hint')}>
                <Textarea value={prompt} onChange={(e) => setPrompt(e.target.value)}
                          placeholder={t('create.ai.placeholder')}
                          style={{ minHeight: 100, fontSize: 'var(--t-15)' }} />
              </FieldGroup>
              <div>
                <Stamp>{t('create.ai.suggestions')}</Stamp>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 10 }}>
                  {PROMPT_CHIPS.map(c => (
                    <button key={c} className="chip" onClick={() => setPrompt(c)}
                            style={{
                              appearance: 'none', border: '1px solid var(--border)',
                              background: 'var(--bg-sub)', padding: '6px 10px',
                              borderRadius: 'var(--r-pill)', fontSize: 'var(--t-12)',
                              color: 'var(--ink-2)', cursor: 'pointer', fontFamily: 'inherit',
                            }}>{c}</button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* AI · generating */}
          {step === 'generating' && (
            <div className="ai-generating">
              <div className="pulse"><Icon name="spark" size={26} /></div>
              <div className="status">Generating outline…</div>
              <h3>Drafting "{prompt.slice(0, 60) || 'Untitled course'}"</h3>
              <ul>
                {STEPS.map((s, i) => (
                  <li key={s} className={i < progress ? 'done' : i === progress ? 'current' : ''}>
                    {i < progress ? '✓ ' : i === progress ? '› ' : '   '} {s}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* AI · review */}
          {step === 'review' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                <div style={{
                  width: 140, aspectRatio: '16/9',
                  borderRadius: 'var(--r-md)',
                  background: 'linear-gradient(135deg, var(--primary-soft), var(--bg-sub))',
                  border: '1px solid var(--border)',
                  position: 'relative', overflow: 'hidden',
                }}>
                  <div style={{ position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(45deg, transparent 0 11px, oklch(0 0 0 / 0.025) 11px 12px)' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <Stamp>{t('create.review.eyebrow')}</Stamp>
                  <h2 style={{ fontSize: 'var(--t-24)', marginTop: 6 }}>{SAMPLE_COURSE.title}</h2>
                  <p style={{ color: 'var(--ink-3)', marginTop: 4, fontSize: 'var(--t-13)', lineHeight: 1.55 }}>
                    {SAMPLE_COURSE.description}
                  </p>
                  <div style={{ display: 'flex', gap: 6, marginTop: 10, flexWrap: 'wrap' }}>
                    <Badge>{SAMPLE_COURSE.category}</Badge>
                    <Badge>{SAMPLE_COURSE.level}</Badge>
                    <Badge>{SAMPLE_COURSE.duration}</Badge>
                    <Badge>{SAMPLE_COURSE.modules.length} modules</Badge>
                    <Badge>{SAMPLE_COURSE.modules.reduce((n, m) => n + m.lessons.length, 0)} lessons</Badge>
                  </div>
                </div>
              </div>
              <div>
                <Stamp>{t('create.review.modules')}</Stamp>
                <div className="outline-grid" style={{ marginTop: 10 }}>
                  {SAMPLE_COURSE.modules.map((m, i) => (
                    <div key={m.id} className="outline-mod">
                      <div className="hd">
                        <span className="num">M{String(i + 1).padStart(2, '0')}</span>
                        <b>{m.title}</b>
                        <div style={{ flex: 1 }} />
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, color: 'var(--ink-4)' }}>
                          {m.lessons.length} {t('create.review.lessons')}
                        </span>
                      </div>
                      <div className="lessons">
                        {m.lessons.map(l => {
                          const typ = LESSON_TYPE_BY_ID[l.type];
                          return (
                            <div key={l.id} className="row">
                              <span className="ic"><Icon name={typ.icon} size={12} /></span>
                              {l.title}
                              <span className="meta">{l.duration}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* BLANK */}
          {step === 'prompt' && tab === 'blank' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <FieldGroup label={t('create.blank.label')} required>
                <Input placeholder="Untitled course" />
              </FieldGroup>
              <div className="cb-grid-2">
                <FieldGroup label={t('builder.fields.category')}>
                  <Select><option>Engineering</option><option>Design</option><option>Product</option><option>Data</option></Select>
                </FieldGroup>
                <FieldGroup label={t('builder.fields.language')}>
                  <Select><option>English</option><option>Spanish</option></Select>
                </FieldGroup>
              </div>
              <Alert tone="info" title="You can always add the rest later">
                Cover image, outcomes, and pricing aren't required to start. You can fill them in inside the builder.
              </Alert>
            </div>
          )}

          {/* DUPLICATE */}
          {step === 'prompt' && tab === 'duplicate' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <p style={{ color: 'var(--ink-3)', fontSize: 'var(--t-13)' }}>
                Choose a course in this tenant to copy. The new course starts as a draft — students can't see it.
              </p>
              <Input leadingIcon="search" placeholder="Search courses…" />
              <div className="cb-lesson-list" style={{ borderRadius: 'var(--r-md)' }}>
                {EXISTING_COURSES.map(c => (
                  <div key={c.id} className="row" style={{ borderBottom: '1px solid var(--border)' }}>
                    <div className="ic-tile"><Icon name="book" size={14} /></div>
                    <div className="info">
                      <div className="name">{c.name}</div>
                      <div className="meta">{c.meta} · updated {c.updated}</div>
                    </div>
                    <Button size="sm" variant="secondary" icon="copy">{t('btn.duplicate')}</Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TEMPLATES */}
          {step === 'prompt' && tab === 'template' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <p style={{ color: 'var(--ink-3)', fontSize: 'var(--t-13)' }}>
                Curated starting points. Each template includes module structure, recommended lesson types, and pricing defaults.
              </p>
              <div className="templates">
                {TEMPLATES.map(tpl => (
                  <button key={tpl.id} className="template-card" onClick={() => onCreated({ ...SAMPLE_COURSE, title: tpl.name })}>
                    <span className="tag">{tpl.tag}</span>
                    <span className="ttl">{tpl.name}</span>
                    <span className="meta">{tpl.meta}</span>
                    <span className="desc">{tpl.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <footer className="cb-modal-ft">
          {step === 'review' && (
            <Button variant="tertiary" icon="chevronLeft" onClick={() => setStep('prompt')}>{t('btn.back')}</Button>
          )}
          <div style={{ flex: 1 }} />
          {step === 'prompt' && tab === 'ai' && (
            <>
              <Button variant="tertiary" onClick={onClose}>{t('btn.cancel')}</Button>
              <Button variant="primary" icon="spark" disabled={!prompt.trim()} onClick={startGen}>
                {t('btn.generate')}
              </Button>
            </>
          )}
          {step === 'prompt' && tab === 'blank' && (
            <>
              <Button variant="tertiary" onClick={onClose}>{t('btn.cancel')}</Button>
              <Button variant="primary" onClick={() => onCreated({ ...SAMPLE_COURSE, title: 'Untitled course', modules: [{ id: 'm1', title: 'Module 1', description: '', lessons: [] }] })}>
                {t('btn.startBuilding')}
              </Button>
            </>
          )}
          {step === 'review' && (
            <>
              <Button variant="secondary" icon="refresh" onClick={() => setStep('prompt')}>{t('btn.regenerate')}</Button>
              <Button variant="primary" trailing="arrowRight" onClick={acceptOutline}>{t('btn.accept')}</Button>
            </>
          )}
        </footer>
      </div>
    </div>
  );
}

// ── PUBLISH DIALOG ──────────────────────────────────────────
function PublishDialog({ course, onClose, onPublish, t }) {
  const [visibility, setVisibility] = useState('tenant');
  const checks = [
    { kind: 'ok',   ttl: 'Title and description',  sub: '"Advanced React Patterns" · 240 chars' },
    { kind: 'ok',   ttl: 'Cover image',            sub: 'Auto-generated, 1920×1080' },
    { kind: 'ok',   ttl: 'At least one module',    sub: `${course.modules.length} modules · ${course.modules.reduce((n,m)=>n+m.lessons.length,0)} lessons` },
    { kind: 'warn', ttl: '3 lessons have no content', sub: 'Students will see empty lessons until you fill them' },
    { kind: 'ok',   ttl: 'Outcomes defined',       sub: '4 learning outcomes' },
    { kind: 'warn', ttl: 'Pricing not set',        sub: 'Course will publish as free unless you set a price' },
  ];
  const blockers = checks.filter(c => c.kind === 'fail').length;
  const warnings = checks.filter(c => c.kind === 'warn').length;

  return (
    <div className="cb-modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="cb-modal" onClick={(e) => e.stopPropagation()}>
        <header className="cb-modal-hd">
          <h3>{t('publish.title')}</h3>
          <div style={{ flex: 1 }} />
          <Button size="sm" variant="tertiary" icon="x" iconOnly aria-label="Close" onClick={onClose} />
        </header>
        <div className="cb-modal-body scrolls">
          <p style={{ color: 'var(--ink-3)', fontSize: 'var(--t-14)', marginBottom: 16 }}>{t('publish.subtitle')}</p>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <Stamp>{t('publish.checks')}</Stamp>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              {checks.length - blockers - warnings} ok · {warnings} warning{warnings === 1 ? '' : 's'} · {blockers} blocker{blockers === 1 ? '' : 's'}
            </span>
          </div>

          <div className="preflight-list">
            {checks.map((c, i) => (
              <div key={i} className={'row ' + c.kind}>
                <div className="ic">
                  <Icon name={c.kind === 'ok' ? 'check' : c.kind === 'warn' ? 'alert' : 'x'} size={12} />
                </div>
                <div className="body">
                  <div className="ttl">{c.ttl}</div>
                  <div className="sub">{c.sub}</div>
                </div>
                {c.kind !== 'ok' && (
                  <Button size="sm" variant="link" trailing="arrowRight">Fix</Button>
                )}
              </div>
            ))}
          </div>

          <div style={{ marginTop: 20 }}>
            <Stamp>{t('publish.visibility.title')}</Stamp>
            <div className="visibility-radio" style={{ marginTop: 10 }}>
              {[
                { id: 'public',   label: t('publish.visibility.public'),   sub: 'Anyone can find this course on the public catalog.' },
                { id: 'tenant',   label: t('publish.visibility.tenant'),   sub: '312 active students at Acme University will see it on their dashboard.' },
                { id: 'unlisted', label: t('publish.visibility.unlisted'), sub: 'No discovery — share the URL directly with whoever needs access.' },
              ].map(opt => (
                <label key={opt.id}>
                  <Radio name="vis" checked={visibility === opt.id} onChange={() => setVisibility(opt.id)} />
                  <div>
                    <span style={{ fontWeight: 500, fontSize: 'var(--t-14)' }}>{opt.label}</span>
                    <span style={{ color: 'var(--ink-3)', fontSize: 'var(--t-12)' }}>{opt.sub}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>
        <footer className="cb-modal-ft">
          <Button variant="tertiary" icon="calendar">{t('publish.schedule')}</Button>
          <div style={{ flex: 1 }} />
          <Button variant="tertiary" onClick={onClose}>{t('btn.cancel')}</Button>
          <Button variant="primary" icon="send" disabled={blockers > 0} onClick={onPublish}>
            {t('publish.cta')}
          </Button>
        </footer>
      </div>
    </div>
  );
}

(function () {
  const s = document.createElement('style');
  s.id = 'cb-screens';
  s.textContent = __SCREENS_CSS;
  document.head.appendChild(s);
})();

Object.assign(window, { CourseHome, CreateModal, PublishDialog });
