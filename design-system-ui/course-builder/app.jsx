// app.jsx — top-level state machine for the course-builder flow.
// Wires tweaks → CSS variables, routes between Home / Builder, and surfaces
// modals (Create, Publish) over the active screen.

const BRAND_PRESETS = [
  ['#4F46E5', 'Indigo',  270, 0.16, 0.5],
  ['#10B981', 'Emerald', 165, 0.13, 0.58],
  ['#7C3AED', 'Violet',  300, 0.18, 0.52],
  ['#0EA5E9', 'Ocean',   235, 0.14, 0.62],
  ['#F59E0B', 'Amber',    75, 0.15, 0.7],
  ['#E11D48', 'Rose',     20, 0.18, 0.56],
  ['#475569', 'Graphite', 250, 0.03, 0.42],
];

function App() {
  const [tweaks, setTweak] = useTweaks(window.__TWEAK_DEFAULTS);
  const [course, setCourse] = React.useState(null);   // null = on home, object = in builder
  const [showCreate, setShowCreate] = React.useState(false);
  const [showPublish, setShowPublish] = React.useState(false);
  const [selected, setSelected] = React.useState({ kind: 'course' });
  const [inspectorOpen, setInspectorOpen] = React.useState(false);
  const [tab, setTab] = React.useState('curriculum');
  const [saveState, setSaveState] = React.useState('idle'); // idle | saving | saved
  const [lang, setLangState] = React.useState(tweaks.lang || 'en');
  const t = useT(lang);

  // Apply tokens
  React.useEffect(() => {
    const root = document.documentElement;
    root.dataset.density = tweaks.density;
    root.dataset.theme = tweaks.dark ? 'dark' : 'light';
    root.dataset.tree = tweaks.tree;
    // Primary brand
    const preset = BRAND_PRESETS.find(p => p[1] === (tweaks.brand && tweaks.brand[1])) || BRAND_PRESETS[0];
    const [, , h, c, l] = preset;
    root.style.setProperty('--primary-h', h);
    root.style.setProperty('--primary-c', c);
    root.style.setProperty('--primary-l', l);
  }, [tweaks]);

  // Persist lang to tweaks block too
  React.useEffect(() => { setTweak('lang', lang); /* eslint-disable-next-line */ }, [lang]);

  // Fake autosave indicator — flips to "saving" briefly whenever something
  // changes inside the builder, then resolves to "saved" for a few seconds.
  React.useEffect(() => {
    if (!course) return;
    setSaveState('saving');
    const t1 = setTimeout(() => setSaveState('saved'), 700);
    const t2 = setTimeout(() => setSaveState('idle'), 3000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [selected, course]);

  // Handlers --------------------------------------------------
  const handleCreated = (draftCourse) => {
    setCourse(draftCourse);
    setShowCreate(false);
    // Pre-select the first lesson so the builder lands on a meaningful editor
    const firstMod = draftCourse.modules[0];
    if (firstMod && firstMod.lessons[0]) {
      setSelected({ kind: 'lesson', id: firstMod.lessons[0].id, moduleId: firstMod.id });
    } else if (firstMod) {
      setSelected({ kind: 'module', id: firstMod.id });
    } else {
      setSelected({ kind: 'course' });
    }
  };
  const handleBackToHome = () => {
    setCourse(null);
    setSelected({ kind: 'course' });
    setInspectorOpen(false);
  };
  const handleAddLesson = (typeId) => {
    if (selected.kind !== 'module') return;
    const newLesson = {
      id: 'l_' + Math.random().toString(36).slice(2, 8),
      type: typeId, title: 'Untitled lesson',
      duration: '—', status: 'empty',
    };
    setCourse(c => ({
      ...c,
      modules: c.modules.map(m => m.id === selected.id
        ? { ...m, lessons: [...m.lessons, newLesson] }
        : m),
    }));
    setSelected({ kind: 'lesson', id: newLesson.id, moduleId: selected.id });
  };
  const handleAddModule = () => {
    const newMod = {
      id: 'm_' + Math.random().toString(36).slice(2, 8),
      title: `Module ${course.modules.length + 1}`,
      description: '', lessons: [],
    };
    setCourse(c => ({ ...c, modules: [...c.modules, newMod] }));
    setSelected({ kind: 'module', id: newMod.id });
  };
  const handlePublish = () => {
    setCourse(c => ({ ...c, published: true }));
    setShowPublish(false);
    setSaveState('saved');
  };

  // RENDER ───────────────────────────────────────────────────
  return (
    <>
      {/* Active screen */}
      {course === null && (
        <CourseHome
          emptyStyle={tweaks.emptyStyle}
          onCreate={() => setShowCreate(true)}
          t={t} lang={lang} setLang={setLangState}
          courses={[]}
        />
      )}

      {course !== null && tweaks.layout !== 'outline' && (
        <div className="cb-shell"
             data-layout={tweaks.layout}
             data-preview={tweaks.preview ? '1' : '0'}
             data-tree={tweaks.tree}>
          <TopBar
            course={course}
            saveState={saveState}
            lang={lang}
            setLang={setLangState}
            onBack={handleBackToHome}
            onPublish={() => setShowPublish(true)}
            onOpenInspector={() => setInspectorOpen(true)}
            onTogglePreview={() => setTweak('preview', !tweaks.preview)}
            tab={tab}
            setTab={setTab}
            t={t}
          />
          <div className="cb-body">
            <CurriculumTree
              course={course}
              selected={selected}
              onSelect={setSelected}
              onAddModule={handleAddModule}
              moduleStyle={tweaks.moduleStyle}
              treeStyle={tweaks.tree}
              t={t}
            />
            <div className="cb-pane">
              <EditorPanel
                course={course}
                selected={selected}
                onSelect={setSelected}
                onSelectLesson={(id) => setSelected({ kind: 'lesson', id, moduleId: selected.id })}
                onAddLesson={handleAddLesson}
                aiOn={tweaks.ai}
                t={t}
              />
            </div>
            {tweaks.preview && (
              <CoursePreview course={course} t={t} />
            )}
            <Inspector
              open={inspectorOpen}
              position={tweaks.inspector === 'bottom-drawer' ? 'bottom' :
                        tweaks.inspector === 'inline-panel' ? 'inline' : 'right'}
              onClose={() => setInspectorOpen(false)}
              course={course}
              selected={selected}
              t={t}
            />
          </div>
        </div>
      )}

      {/* Outline / focus-mode layout — entire course as a single editable doc */}
      {course !== null && tweaks.layout === 'outline' && (
        <div className="cb-shell" data-layout="outline">
          <TopBar
            course={course} saveState={saveState} lang={lang} setLang={setLangState}
            onBack={handleBackToHome} onPublish={() => setShowPublish(true)}
            onOpenInspector={() => setInspectorOpen(true)}
            onTogglePreview={() => setTweak('preview', !tweaks.preview)}
            tab={tab} setTab={setTab} t={t}
          />
          <div className="cb-pane scrolls">
            <div className="cb-outline-shell">
              <div>
                <Stamp>Outline mode · everything in one document</Stamp>
                <h1 style={{ fontSize: 'var(--t-44)', marginTop: 10, letterSpacing: '-0.025em' }}>
                  <Input defaultValue={course.title}
                         style={{ fontSize: 'var(--t-44)', height: 'auto', padding: '8px 12px',
                                  fontFamily: 'var(--font-display)', fontWeight: 500,
                                  letterSpacing: '-0.025em', border: '1px solid transparent', background: 'transparent' }} />
                </h1>
                <Textarea defaultValue={course.description}
                          style={{ background: 'transparent', border: '1px solid transparent', fontSize: 'var(--t-16)' }} />
              </div>
              {course.modules.map((m, i) => (
                <div key={m.id} className="cb-section">
                  <header className="cb-section-hd">
                    <span className="lbl">M{String(i + 1).padStart(2, '0')}</span>
                    <h4 style={{ flex: 1 }}>{m.title}</h4>
                    <Button size="sm" variant="tertiary" icon="more" iconOnly aria-label="More" />
                  </header>
                  <div className="cb-section-body">
                    <Textarea defaultValue={m.description} />
                    <div className="cb-lesson-list">
                      {m.lessons.map(l => {
                        const typ = LESSON_TYPE_BY_ID[l.type];
                        return (
                          <div key={l.id} className="row">
                            <Icon name="grip" size={14} className="sr-ic grip" />
                            <div className="ic-tile"><Icon name={typ.icon} size={15} /></div>
                            <div className="info">
                              <div className="name">{l.title}</div>
                              <div className="meta">{typ.labelEn} · {l.duration}</div>
                            </div>
                            <Badge tone={l.status === 'ready' ? 'success' : l.status === 'draft' ? 'warning' : 'neutral'} dot>{l.status}</Badge>
                          </div>
                        );
                      })}
                    </div>
                    <Button size="sm" variant="tertiary" icon="plus">Add lesson</Button>
                  </div>
                </div>
              ))}
              <Button variant="secondary" icon="plus" onClick={handleAddModule}>Add module</Button>
            </div>
          </div>
        </div>
      )}

      {/* Modals (always rendered above active screen) */}
      {showCreate && (
        <CreateModal
          onClose={() => setShowCreate(false)}
          onCreated={handleCreated}
          t={t}
          aiOn={tweaks.ai}
        />
      )}
      {showPublish && course && (
        <PublishDialog
          course={course}
          onClose={() => setShowPublish(false)}
          onPublish={handlePublish}
          t={t}
        />
      )}

      {/* Tweaks panel */}
      <TweaksPanel title="Builder tweaks">
        <TweakSection label="Flow">
          {course === null
            ? <TweakButton label="Open create modal" onClick={() => setShowCreate(true)} />
            : <TweakButton label="Back to home" onClick={handleBackToHome} secondary />}
          {course !== null && <TweakButton label="Open publish dialog" onClick={() => setShowPublish(true)} />}
        </TweakSection>

        <TweakSection label="Layout">
          <TweakRadio label="Builder" value={tweaks.layout}
                      options={[
                        { value: 'two-pane',   label: '2-pane' },
                        { value: 'three-pane', label: '3-pane' },
                        { value: 'outline',    label: 'outline' },
                      ]}
                      onChange={(v) => setTweak('layout', v)} />
          <TweakRadio label="Tree" value={tweaks.tree}
                      options={[
                        { value: 'collapsible', label: 'collapse' },
                        { value: 'expanded',    label: 'all open' },
                        { value: 'compact',     label: 'compact' },
                      ]}
                      onChange={(v) => setTweak('tree', v)} />
          <TweakSelect label="Inspector" value={tweaks.inspector}
                       options={[
                         { value: 'right-drawer',  label: 'Right drawer' },
                         { value: 'bottom-drawer', label: 'Bottom drawer' },
                         { value: 'inline-panel',  label: 'Inline panel' },
                       ]}
                       onChange={(v) => setTweak('inspector', v)} />
          <TweakToggle label="Show student preview" value={tweaks.preview}
                       onChange={(v) => setTweak('preview', v)} />
        </TweakSection>

        <TweakSection label="Behavior">
          <TweakToggle label="AI assist" value={tweaks.ai}
                       onChange={(v) => setTweak('ai', v)} />
          <TweakRadio label="Modules" value={tweaks.moduleStyle}
                      options={[
                        { value: 'numbered',   label: 'numbered' },
                        { value: 'named-only', label: 'named only' },
                      ]}
                      onChange={(v) => setTweak('moduleStyle', v)} />
          <TweakSelect label="Empty state" value={tweaks.emptyStyle}
                       options={[
                         { value: 'ai-prompt',    label: 'AI-first prompt' },
                         { value: 'illustrated',  label: 'Illustrated' },
                         { value: 'minimal',      label: 'Minimal' },
                       ]}
                       onChange={(v) => setTweak('emptyStyle', v)} />
        </TweakSection>

        <TweakSection label="Theme">
          <TweakToggle label="Dark mode" value={tweaks.dark}
                       onChange={(v) => setTweak('dark', v)} />
          <TweakColor label="Brand" value={tweaks.brand || ['#4F46E5', 'Indigo']}
                      options={BRAND_PRESETS.map(p => [p[0], p[1]])}
                      onChange={(v) => setTweak('brand', v)} />
          <TweakRadio label="Density" value={tweaks.density}
                      options={['compact', 'comfortable', 'spacious']}
                      onChange={(v) => setTweak('density', v)} />
        </TweakSection>
      </TweaksPanel>
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
