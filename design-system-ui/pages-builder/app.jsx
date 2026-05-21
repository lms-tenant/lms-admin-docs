// app.jsx — top-level routing between the list view and the builder view.

const { useState: aUseState, useEffect: aUseEffect } = React;

function App() {
  const [tweaks, setTweak] = useTweaks(window.__TWEAK_DEFAULTS);
  const [lang, setLang] = aUseState(tweaks.lang || 'es');
  const t = useT(lang);
  const [openPage, setOpenPage] = aUseState(null);

  aUseEffect(() => {
    const root = document.documentElement;
    root.dataset.density = tweaks.density;
    root.dataset.theme = tweaks.dark ? 'dark' : 'light';
  }, [tweaks]);
  aUseEffect(() => { setTweak('lang', lang); /* eslint-disable */ }, [lang]);

  return (
    <>
      {openPage === null
        ? <PagesList onOpen={(p) => setOpenPage(p)} t={t} lang={lang} setLang={setLang} />
        : <PageBuilder page={openPage} onBack={() => setOpenPage(null)} t={t}
                       lang={lang} setLang={setLang} tweaks={tweaks} setTweak={setTweak} />}

      <TweaksPanel title="Pages tweaks">
        <TweakSection label="Flow">
          {openPage
            ? <TweakButton label="Back to list" onClick={() => setOpenPage(null)} secondary />
            : <TweakButton label="Open Home page in builder" onClick={() => setOpenPage(PAGES[0])} />}
        </TweakSection>
        <TweakSection label="Builder">
          <TweakSelect label="Inspector" value={tweaks.inspectorPos || 'right'}
                       options={[
                         { value: 'right',  label: 'Right rail' },
                         { value: 'bottom', label: 'Bottom drawer' },
                       ]}
                       onChange={(v) => setTweak('inspectorPos', v)} />
          <TweakRadio label="Device" value={tweaks.device || 'desktop'}
                      options={[
                        { value: 'desktop', label: 'desktop' },
                        { value: 'tablet',  label: 'tablet' },
                        { value: 'mobile',  label: 'mobile' },
                      ]}
                      onChange={(v) => setTweak('device', v)} />
        </TweakSection>
        <TweakSection label="Theme">
          <TweakRadio label="Density" value={tweaks.density}
                      options={['compact', 'comfortable', 'spacious']}
                      onChange={(v) => setTweak('density', v)} />
          <TweakToggle label="Dark mode" value={tweaks.dark}
                       onChange={(v) => setTweak('dark', v)} />
        </TweakSection>
      </TweaksPanel>
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
