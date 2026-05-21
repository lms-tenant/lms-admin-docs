// app.jsx — top-level App: applies tweak tokens to <html>, renders the doc,
// wires the Tweaks panel. All sections are imported via window from sections.jsx.

const { useEffect, useMemo, useState } = React;

// Curated white-label presets — paired hex (display swatch) + OKLCH coords
// (used to set --primary-h/c/l so soft/hover/ring shades stay harmonious).
const BRAND_PRESETS = [
  ['#10B981', 'Emerald', 165, 0.13, 0.58],
  ['#4F46E5', 'Indigo',  270, 0.16, 0.5],
  ['#7C3AED', 'Violet',  300, 0.18, 0.52],
  ['#0EA5E9', 'Ocean',   235, 0.14, 0.62],
  ['#F59E0B', 'Amber',    75, 0.15, 0.7],
  ['#E11D48', 'Rose',     20, 0.18, 0.56],
  ['#475569', 'Graphite',250, 0.03, 0.42],
];

function App() {
  const [tweaks, setTweak] = useTweaks(window.__TWEAK_DEFAULTS);
  const [activeId, setActiveId] = useState('cover');

  // Apply tokens to <html>. Doing it on the root so the Tweaks panel
  // (rendered into <body> via the panel itself) inherits them too.
  useEffect(() => {
    const root = document.documentElement;
    root.dataset.density = tweaks.density;
    root.dataset.pair = tweaks.pair;
    root.dataset.theme = tweaks.dark ? 'dark' : 'light';
    root.style.setProperty('--r', tweaks.radius + 'px');

    // Primary: look up OKLCH triplet by name (falls back to first preset)
    const preset = BRAND_PRESETS.find(p => p[1] === (tweaks.primary && tweaks.primary[1])) || BRAND_PRESETS[0];
    const [, , h, c, l] = preset;
    root.style.setProperty('--primary-h', h);
    root.style.setProperty('--primary-c', c);
    root.style.setProperty('--primary-l', l);
  }, [tweaks]);

  // Sidebar scroll-spy — observe section anchors and highlight the closest one.
  useEffect(() => {
    const ids = SR_SECTIONS.map(s => s.id);
    const els = ids.map(id => document.getElementById(id)).filter(Boolean);
    if (!els.length) return;
    const io = new IntersectionObserver((entries) => {
      // Pick the topmost intersecting section in the viewport
      const visible = entries
        .filter(e => e.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
      if (visible.length) setActiveId(visible[0].target.id);
    }, { rootMargin: '-20% 0px -60% 0px', threshold: 0 });
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);

  const onNav = (id) => (e) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 24, behavior: 'smooth' });
  };

  // For the brand-preset chip strip in the Color section (passed down).
  const brandPresetsForUI = useMemo(
    () => BRAND_PRESETS.map(([hex, name]) => [hex, name]),
    []
  );

  return (
    <div className="doc">
      <aside className="doc-side" aria-label="Document sections">
        <div>
          <h6>SkillsRamp · DS</h6>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 17, lineHeight: 1.15, letterSpacing: '-0.01em', color: 'var(--ink-1)' }}>
            Design system<br />reference
          </div>
          <div style={{ marginTop: 10, fontFamily: 'var(--font-mono)', fontSize: 10.5, color: 'var(--ink-4)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            v1.0.0 · draft
          </div>
        </div>

        <nav aria-label="Sections">
          {SR_SECTIONS.map(s => (
            <a key={s.id} href={'#' + s.id} onClick={onNav(s.id)}
               className={activeId === s.id ? 'on' : ''}>
              <span className="idx">{s.idx}</span>
              <span>{s.label}</span>
            </a>
          ))}
        </nav>

        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 6 }}>
          <Stamp>tip</Stamp>
          <div style={{ fontSize: 12, color: 'var(--ink-3)', lineHeight: 1.5 }}>
            Open the Tweaks panel to swap brand, density, radius, and dark mode — the entire doc rebalances live.
          </div>
        </div>
      </aside>

      <main className="doc-main">
        <CoverSection tweaks={tweaks} />
        <ColorSection tweaks={tweaks} setTweak={setTweak} BRAND_PRESETS={brandPresetsForUI} />
        <TypeSection />
        <SpacingSection />
        <ElevationSection />
        <ButtonsSection />
        <FormsSection />
        <TablesSection />
        <CardsSection />
        <StatusSection />
        <EmptyLoadingSection />
        <ModalsSection />
        <ExampleSection tweaks={tweaks} />
      </main>

      <TweaksPanel title="System tweaks">
        <TweakSection label="Theme">
          <TweakToggle label="Dark mode" value={tweaks.dark}
                       onChange={(v) => setTweak('dark', v)} />
          <TweakColor label="Brand primary" value={tweaks.primary}
                      options={BRAND_PRESETS.map(p => [p[0], p[1]])
                        // TweakColor's keyer uses JSON.stringify; matching against
                        // the stored ["#hex", "Name"] pair keeps the swatch in sync.
                        .map(([hex, name]) => [hex, name])}
                      onChange={(v) => setTweak('primary', v)} />
        </TweakSection>

        <TweakSection label="Layout">
          <TweakRadio label="Density" value={tweaks.density}
                      options={['compact', 'comfortable', 'spacious']}
                      onChange={(v) => setTweak('density', v)} />
          <TweakSlider label="Radius" value={tweaks.radius}
                       min={0} max={20} step={2} unit="px"
                       onChange={(v) => setTweak('radius', v)} />
          <TweakRadio label="Sidebar" value={tweaks.sidebar}
                      options={[
                        { value: 'rail',      label: 'rail' },
                        { value: 'labeled',   label: 'labeled' },
                        { value: 'collapsed', label: 'off' },
                      ]}
                      onChange={(v) => setTweak('sidebar', v)} />
        </TweakSection>

        <TweakSection label="Typography">
          <TweakSelect label="Font pair" value={tweaks.pair}
                       options={[
                         { value: 'bricolage',  label: 'Bricolage / Geist (default)' },
                         { value: 'intertight', label: 'Inter Tight / Inter' },
                         { value: 'grotesk',    label: 'Space Grotesk / DM Sans' },
                         { value: 'editorial',  label: 'Instrument Serif / Geist' },
                       ]}
                       onChange={(v) => setTweak('pair', v)} />
        </TweakSection>
      </TweaksPanel>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
