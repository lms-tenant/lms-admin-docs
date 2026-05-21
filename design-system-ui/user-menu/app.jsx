// app.jsx — Design Canvas composition: baseline + 3 directions × light/dark.

function App() {
  // Each artboard sizes itself wide enough that the full navbar (brand + 6 nav
  // links + 2 icon buttons + me-chip) fits without clipping the dropdown.
  const W = 920;
  const H_short = 480;
  const H_med   = 560;
  const H_tall  = 640;

  return (
    <DesignCanvas
      title="User menu · directions"
      subtitle="Replace the current navbar dropdown. 3 directions side-by-side, both themes."
    >
      <DCSection
        id="current"
        title="Current"
        subtitle="What's shipping today — flat list, no identity context, dark-mode-as-a-link, sign-out blends in."
      >
        <DCArtboard id="cur-dark" label="0 · Current · Dark" width={W} height={H_short}>
          <MenuStage variant="current" theme="dark" />
        </DCArtboard>
      </DCSection>

      <DCSection
        id="dir-a"
        title="A · Refined"
        subtitle="Smallest delta. Same menu items, but with an identity header, role pill, proper dark-mode toggle, and destructive sign-out in danger color."
      >
        <DCArtboard id="a-light" label="A · Light" width={W} height={H_short}>
          <MenuStage variant="A" theme="light" />
        </DCArtboard>
        <DCArtboard id="a-dark" label="A · Dark" width={W} height={H_short}>
          <MenuStage variant="A" theme="dark" />
        </DCArtboard>
      </DCSection>

      <DCSection
        id="dir-b"
        title="B · Identity-led"
        subtitle="Bigger identity hero with avatar, email, role, and tenant. Sectioned menu (Account / Switch view / Preferences) and quick-stat tiles. Best when admins juggle many surfaces."
      >
        <DCArtboard id="b-light" label="B · Light" width={W} height={H_med}>
          <MenuStage variant="B" theme="light" />
        </DCArtboard>
        <DCArtboard id="b-dark" label="B · Dark" width={W} height={H_med}>
          <MenuStage variant="B" theme="dark" />
        </DCArtboard>
      </DCSection>

      <DCSection
        id="dir-c"
        title="C · Tenant-aware (SuperAdmin)"
        subtitle="Adds a tenant switcher at the top — critical for SuperAdmin who jumps between tenants. Theme segmented control inline. Keyboard shortcuts visible."
      >
        <DCArtboard id="c-light" label="C · Light" width={W} height={H_tall}>
          <MenuStage variant="C" theme="light" />
        </DCArtboard>
        <DCArtboard id="c-dark" label="C · Dark" width={W} height={H_tall}>
          <MenuStage variant="C" theme="dark" />
        </DCArtboard>
      </DCSection>
    </DesignCanvas>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
