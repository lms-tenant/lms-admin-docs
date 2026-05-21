// sections.jsx — the actual documentation sections.
// Each section is a small component composing primitives + doc-parts.
// Exported via window so app.jsx can compose them.

// ── 00 · COVER ──────────────────────────────────────────────
function CoverSection({ tweaks }) {
  const today = new Date().toISOString().slice(0, 10);
  return (
    <section className="doc-cover" id="cover">
      <div>
        <h1>The <em>Skills</em>Ramp<br />design system</h1>
        <p className="sub">
          A spec sheet for tenant operators, course designers, and platform engineers —
          one consistent surface for SuperAdmin, Admin, and Student. Every token swaps
          per‑tenant; every component shares the same primitives, spacing, and type.
        </p>
      </div>
      <dl className="meta">
        <dt>version</dt><dd>1.0.0 · draft</dd>
        <dt>compiled</dt><dd>{today}</dd>
        <dt>tokens</dt><dd>54</dd>
        <dt>components</dt><dd>22</dd>
        <dt>density</dt><dd>{tweaks.density}</dd>
        <dt>radius</dt><dd>{tweaks.radius}px</dd>
        <dt>pairing</dt><dd>{tweaks.pair}</dd>
        <dt>theme</dt><dd>{tweaks.dark ? "dark" : "light"}</dd>
      </dl>
    </section>
  );
}

// ── 01 · FOUNDATIONS: COLOR ─────────────────────────────────
function ColorSection({ tweaks, setTweak, BRAND_PRESETS }) {
  return (
    <section className="doc-sec" id="color">
      <SectionHeader
        num="01.A"
        title="Color"
        lede="One primary, six neutrals, four semantics. Defined in OKLCH so the white-label primary can swap to any hue without re-balancing chroma or contrast."
      />

      <SubSection label="Primary">
        <p className="caption">
          The tenant brand color is the only saturated hue in the system. It anchors
          interactive surfaces, focus rings, and progress; everything else is neutral.
          Swap the swatch below to preview a tenant brand.
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {BRAND_PRESETS.map((p) => (
            <button key={p[1]}
                    onClick={() => setTweak('primary', p)}
                    aria-pressed={tweaks.primary[1] === p[1]}
                    style={{
                      appearance: 'none', display: 'inline-flex', alignItems: 'center', gap: 8,
                      padding: '6px 10px 6px 6px',
                      border: '1px solid ' + (tweaks.primary[1] === p[1] ? 'var(--ink-2)' : 'var(--border)'),
                      borderRadius: 'var(--r-pill)',
                      background: 'var(--surface)',
                      cursor: 'pointer',
                      color: 'var(--ink-2)',
                      fontFamily: 'var(--font-mono)',
                      fontSize: 11,
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em',
                    }}>
              <span style={{ width: 20, height: 20, borderRadius: 999, background: p[0] }} />
              {p[1]}
            </button>
          ))}
        </div>
        <div className="swatch-row">
          {[
            { k: 'soft',    css: 'var(--primary-soft)',    bg: 'var(--primary-soft)', fg: 'var(--primary-soft-fg)' },
            { k: 'soft-fg', css: 'var(--primary-soft-fg)', bg: 'var(--primary-soft-fg)', fg: 'white' },
            { k: 'primary', css: 'var(--primary)',         bg: 'var(--primary)', fg: 'var(--on-primary)' },
            { k: 'hover',   css: 'var(--primary-hover)',   bg: 'var(--primary-hover)', fg: 'var(--on-primary)' },
            { k: 'on',      css: 'var(--on-primary)',      bg: 'var(--on-primary)', fg: 'var(--primary)' },
          ].map((s) => (
            <Swatch key={s.k} name={s.k} value={s.bg} fg={s.fg} scale="" css={'--primary'} />
          ))}
        </div>
      </SubSection>

      <SubSection label="Neutrals">
        <p className="caption">
          Warm-tinted greys (hue 80) — they pair cleanly with any primary hue.
          Use ink-1 for headings, ink-2 for body, ink-3 for metadata, ink-4 for placeholders.
        </p>
        <div className="swatch-row">
          {[
            { k: 'bg',          fg: 'var(--ink-1)' },
            { k: 'bg-sub',      fg: 'var(--ink-1)' },
            { k: 'surface',     fg: 'var(--ink-1)' },
            { k: 'border',      fg: 'var(--ink-1)' },
            { k: 'ink-5',       fg: 'var(--ink-1)' },
            { k: 'ink-4',       fg: 'white' },
            { k: 'ink-3',       fg: 'white' },
            { k: 'ink-2',       fg: 'white' },
            { k: 'ink-1',       fg: 'white' },
          ].map((s) => (
            <Swatch key={s.k} name={s.k} value={`var(--${s.k})`} fg={s.fg} css={`--${s.k}`} />
          ))}
        </div>
      </SubSection>

      <SubSection label="Semantic">
        <p className="caption">
          Used only to convey status. Never decorative. All four share chroma + lightness; only hue varies — so a row of badges feels balanced.
        </p>
        <div className="swatch-row">
          <Swatch name="success" value="var(--success)" fg="white" css="--success" />
          <Swatch name="warning" value="var(--warning)" fg="oklch(0.25 0.05 75)" css="--warning" />
          <Swatch name="danger"  value="var(--danger)"  fg="white" css="--danger" />
          <Swatch name="info"    value="var(--info)"    fg="white" css="--info" />
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 4 }}>
          <Badge tone="success" dot>Active</Badge>
          <Badge tone="warning" dot>Pending review</Badge>
          <Badge tone="danger" dot>Failed</Badge>
          <Badge tone="info" dot>Draft</Badge>
          <Badge tone="neutral" dot>Archived</Badge>
          <Badge tone="primary" dot>Featured</Badge>
        </div>
      </SubSection>
    </section>
  );
}

// ── 01.B · TYPE ─────────────────────────────────────────────
function TypeSection() {
  return (
    <section className="doc-sec" id="type">
      <SectionHeader
        num="01.B"
        title="Typography"
        lede="One display face for headlines and brand voice, one body face for UI and prose, one monospace for metadata and codes. The pairing is tweakable — swap from the panel."
      />

      <SubSection label="Specimen">
        <div style={{ borderTop: '1px solid var(--border)' }}>
          <TypeLine label="Display 88" sample="Teach better, ship faster."
                    spec="display · 88/0.92 · -0.035em"
                    sampleStyle={{ fontFamily: 'var(--font-display)', fontSize: 'var(--t-88)', fontWeight: 500, lineHeight: 0.92, letterSpacing: '-0.035em' }} />
          <TypeLine label="Display 64" sample="Course operations, refined."
                    spec="display · 64/0.95"
                    sampleStyle={{ fontFamily: 'var(--font-display)', fontSize: 'var(--t-64)', fontWeight: 500, lineHeight: 0.95, letterSpacing: '-0.03em' }} />
          <TypeLine label="H1 · 44" sample="Tenant dashboard"
                    spec="display · 44/1.0 · -0.025em"
                    sampleStyle={{ fontFamily: 'var(--font-display)', fontSize: 'var(--t-44)', fontWeight: 500, lineHeight: 1, letterSpacing: '-0.025em' }} />
          <TypeLine label="H2 · 32" sample="Active courses this term"
                    spec="display · 32/1.1"
                    sampleStyle={{ fontFamily: 'var(--font-display)', fontSize: 'var(--t-32)', fontWeight: 500, lineHeight: 1.1, letterSpacing: '-0.02em' }} />
          <TypeLine label="H3 · 24" sample="Recent enrollments"
                    spec="display · 24/1.2"
                    sampleStyle={{ fontFamily: 'var(--font-display)', fontSize: 'var(--t-24)', fontWeight: 500, lineHeight: 1.2 }} />
          <TypeLine label="H4 · 20" sample="Course settings"
                    spec="display · 20/1.3"
                    sampleStyle={{ fontFamily: 'var(--font-display)', fontSize: 'var(--t-20)', fontWeight: 500, lineHeight: 1.3 }} />
          <TypeLine label="Body 16" sample="Approve, decline, or hold the seat — the affected student is notified instantly."
                    spec="body · 16/1.55"
                    sampleStyle={{ fontSize: 'var(--t-16)', lineHeight: 1.55 }} />
          <TypeLine label="Body 14" sample="Default UI body. 14/1.55. Sentence case, no smart quotes mid-paragraph."
                    spec="body · 14/1.55"
                    sampleStyle={{ fontSize: 'var(--t-14)', lineHeight: 1.55 }} />
          <TypeLine label="Caption 13" sample="Metadata, captions, and helper text. 13/1.5, ink-3."
                    spec="body · 13/1.5 · ink-3"
                    sampleStyle={{ fontSize: 'var(--t-13)', color: 'var(--ink-3)', lineHeight: 1.5 }} />
          <TypeLine label="Label 11" sample="COURSE · DRAFT · 2026-05-20"
                    spec="mono · 11 · uppercase · 0.08em"
                    sampleStyle={{ fontFamily: 'var(--font-mono)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--ink-3)' }} />
        </div>
      </SubSection>

      <SubSection label="Weights">
        <Demo grid>
          {[400, 500, 600, 700].map(w => (
            <div key={w} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <Stamp>{w}</Stamp>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: w, fontSize: 32, lineHeight: 1, letterSpacing: '-0.02em' }}>
                Display {w}
              </div>
              <div style={{ fontFamily: 'var(--font-body)', fontWeight: w, fontSize: 14 }}>
                Body text at weight {w} for reference.
              </div>
            </div>
          ))}
        </Demo>
      </SubSection>

      <SubSection label="Tokens">
        <Tokens rows={[
          { k: '--font-display', v: 'Bricolage Grotesque, Inter Tight, system-ui', x: 'headings, brand voice' },
          { k: '--font-body',    v: 'Geist, Inter, system-ui',                     x: 'UI, paragraphs' },
          { k: '--font-mono',    v: 'JetBrains Mono, ui-monospace',                x: 'codes, labels, IDs' },
          { k: '--t-12 … --t-88', v: '12 13 14 15 16 18 20 24 32 44 64 88',         x: '12 step ramp' },
        ]} />
      </SubSection>
    </section>
  );
}

// ── 01.C · SPACING + RADIUS ─────────────────────────────────
function SpacingSection() {
  const steps = [
    { name: '0',  v: '0px',   px: 0 },
    { name: '1',  v: '4px',   px: 4 },
    { name: '2',  v: '8px',   px: 8 },
    { name: '3',  v: '12px',  px: 12 },
    { name: '4',  v: '16px',  px: 16 },
    { name: '5',  v: '20px',  px: 20 },
    { name: '6',  v: '24px',  px: 24 },
    { name: '8',  v: '32px',  px: 32 },
    { name: '10', v: '40px',  px: 40 },
    { name: '12', v: '48px',  px: 48 },
    { name: '16', v: '64px',  px: 64 },
    { name: '20', v: '80px',  px: 80 },
  ];
  return (
    <section className="doc-sec" id="spacing">
      <SectionHeader
        num="01.C"
        title="Spacing & radius"
        lede="A 4-px base scale powers everything from inline gaps to page padding. Radius runs from sharp (4px) to soft (20px); density swaps padding & line-height globally."
      />

      <SubSection label="Spacing scale">
        <div className="demo" data-stack="1">
          {steps.map(s => (
            <div key={s.name} className="spacing-bar">
              <div className="name">space-{s.name}</div>
              <div className="bar" style={{ width: s.px || 2 }} />
              <div className="size">{s.v}</div>
            </div>
          ))}
        </div>
      </SubSection>

      <SubSection label="Radius scale">
        <div className="demo" data-grid="1">
          {[
            { k: '--r-sm',   sample: 'sm · 4px' },
            { k: '--r-md',   sample: 'md · token' },
            { k: '--r-lg',   sample: 'lg · 1.6×' },
            { k: '--r-pill', sample: 'pill' },
          ].map(r => (
            <div key={r.k} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div className="radius-tile" style={{ borderRadius: `var(${r.k})` }}>{r.sample}</div>
              <Stamp>{r.k}</Stamp>
            </div>
          ))}
        </div>
        <p className="caption">
          The full radius scale is derived from one knob (<code style={{ fontFamily: 'var(--font-mono)' }}>--r</code>). Drag the radius
          slider in Tweaks to retune every rounded corner in the system at once.
        </p>
      </SubSection>

      <SubSection label="Density">
        <Demo grid>
          {['compact', 'comfortable', 'spacious'].map(d => (
            <div key={d} data-density={d} style={{
              border: '1px solid var(--border)', borderRadius: 'var(--r-lg)',
              padding: 'var(--d-y) var(--d-x)', background: 'var(--surface)',
            }}>
              <Stamp>{d}</Stamp>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--d-gap)', marginTop: 12 }}>
                <Input placeholder="Course title" />
                <div style={{ display: 'flex', gap: 8 }}>
                  <Button size="sm">Save</Button>
                  <Button size="sm" variant="secondary">Cancel</Button>
                </div>
              </div>
            </div>
          ))}
        </Demo>
      </SubSection>
    </section>
  );
}

// ── 01.D · ELEVATION ────────────────────────────────────────
function ElevationSection() {
  return (
    <section className="doc-sec" id="elevation">
      <SectionHeader
        num="01.D"
        title="Elevation"
        lede="Four shadow steps. Used to disambiguate stacking, never decoratively. Borders do most of the visual work; shadow is reserved for floating surfaces."
      />
      <Demo grid bg>
        {[1, 2, 3, 4].map(n => (
          <div key={n} className="shadow-tile" style={{ boxShadow: `var(--shadow-${n})`, border: n === 1 ? '1px solid var(--border)' : 'none' }}>
            shadow-{n}
          </div>
        ))}
      </Demo>
      <Tokens rows={[
        { k: '--shadow-1', v: 'hairline', x: 'cards, inputs at rest' },
        { k: '--shadow-2', v: 'lifted',   x: 'hover, dropdowns' },
        { k: '--shadow-3', v: 'floating', x: 'popovers, toasts' },
        { k: '--shadow-4', v: 'overlay',  x: 'modals, dialogs' },
      ]} />
    </section>
  );
}

// ── 02 · BUTTONS ────────────────────────────────────────────
function ButtonsSection() {
  return (
    <section className="doc-sec" id="buttons">
      <SectionHeader
        num="02"
        title="Buttons"
        lede="Five variants, three sizes, full state coverage. Today's repo has 5+ button atoms — this collapses them to one component with a variant prop."
      />

      <SubSection label="Variants">
        <Demo>
          <Button variant="primary">Save changes</Button>
          <Button variant="secondary">Cancel</Button>
          <Button variant="tertiary">Skip for now</Button>
          <Button variant="soft" icon="spark">Generate outline</Button>
          <Button variant="danger" icon="trash">Delete course</Button>
          <Button variant="link" trailing="arrowRight">View tenant</Button>
        </Demo>
      </SubSection>

      <SubSection label="Sizes">
        <Demo>
          <Button size="sm" variant="primary">Small · 30px</Button>
          <Button size="md" variant="primary">Medium · 38px</Button>
          <Button size="lg" variant="primary">Large · 46px</Button>
          <Button size="sm" variant="secondary">Small</Button>
          <Button size="md" variant="secondary">Medium</Button>
          <Button size="lg" variant="secondary">Large</Button>
        </Demo>
      </SubSection>

      <SubSection label="With icons">
        <Demo>
          <Button icon="plus">New course</Button>
          <Button variant="secondary" trailing="chevronDown">Filter</Button>
          <Button variant="secondary" icon="download">Export CSV</Button>
          <Button variant="tertiary" icon="more" iconOnly aria-label="More" />
          <Button variant="secondary" icon="edit" iconOnly aria-label="Edit" />
          <Button variant="danger" icon="trash" iconOnly aria-label="Delete" />
        </Demo>
      </SubSection>

      <SubSection label="States">
        <Demo grid>
          <div>
            <DemoCap>Rest</DemoCap>
            <Button variant="primary">Save changes</Button>
          </div>
          <div>
            <DemoCap>Loading</DemoCap>
            <Button variant="primary" loading>Saving</Button>
          </div>
          <div>
            <DemoCap>Disabled</DemoCap>
            <Button variant="primary" disabled>Save changes</Button>
          </div>
          <div>
            <DemoCap>Focused</DemoCap>
            <Button variant="primary" style={{ outline: '2px solid var(--primary-ring)', outlineOffset: 2 }}>Save changes</Button>
          </div>
        </Demo>
      </SubSection>

      <SubSection label="Usage">
        <Tokens rows={[
          { k: 'primary',   v: 'one per surface',    x: 'destructive CTAs use the danger variant, not primary' },
          { k: 'secondary', v: 'paired with primary', x: 'cancel, dismiss, back' },
          { k: 'tertiary',  v: 'inline, low-emphasis', x: 'table rows, toolbars' },
          { k: 'soft',      v: 'AI / generative',     x: 'reserve for assistive actions' },
          { k: 'link',      v: 'inline references',   x: 'navigates without committing' },
          { k: 'danger',    v: 'irreversible only',   x: 'delete, suspend, terminate' },
        ]} />
      </SubSection>
    </section>
  );
}

// ── 03 · FORMS ──────────────────────────────────────────────
function IndeterminateCheckbox({ label, sublabel, ...rest }) {
  const ref = React.useRef(null);
  React.useEffect(() => { if (ref.current) ref.current.indeterminate = true; }, []);
  return (
    <label className="sr-cb-row">
      <input ref={ref} type="checkbox" className="sr-check" {...rest} />
      <div>
        <span className="sr-cb-ttl">{label}</span>
        {sublabel && <span className="sr-cb-sub">{sublabel}</span>}
      </div>
    </label>
  );
}

function FormsSection() {
  return (
    <section className="doc-sec" id="forms">
      <SectionHeader
        num="03"
        title="Forms & inputs"
        lede="Every input shares one shell — same height, padding, border, focus ring. Labels and hints live in a field group; errors replace the hint inline."
      />

      <SubSection label="Text inputs">
        <Demo grid>
          <FieldGroup label="Course title" hint="Shown to students on the catalog.">
            <Input placeholder="e.g. Intro to Python" defaultValue="Advanced React Patterns" />
          </FieldGroup>
          <FieldGroup label="Search" optional>
            <Input placeholder="Find a student…" leadingIcon="search" />
          </FieldGroup>
          <FieldGroup label="Slug" hint="auto-generated from title">
            <Input defaultValue="advanced-react-patterns" disabled />
          </FieldGroup>
          <FieldGroup label="Stripe key" error="Key format invalid — should start with sk_">
            <Input defaultValue="pk_test_abc123" invalid trailingIcon="alert" />
          </FieldGroup>
        </Demo>
      </SubSection>

      <SubSection label="Selects & textareas">
        <Demo grid>
          <FieldGroup label="Visibility" hint="Who can see this course before publish.">
            <Select>
              <option>Public</option>
              <option>Tenant only</option>
              <option>Hidden</option>
            </Select>
          </FieldGroup>
          <FieldGroup label="Tier" required>
            <Select>
              <option>Free</option>
              <option>Pro</option>
              <option>Enterprise</option>
            </Select>
          </FieldGroup>
          <FieldGroup label="Description" hint="Markdown supported. Up to 600 characters." style={{ gridColumn: 'span 2' }}>
            <Textarea defaultValue="A deep tour of compound components, render props, and modern Suspense patterns…" />
          </FieldGroup>
        </Demo>
      </SubSection>

      <SubSection label="Choices">
        <Demo grid>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <DemoCap>Checkbox</DemoCap>
            <Checkbox defaultChecked label="Enroll students automatically" sublabel="When a payment succeeds, grant access without confirmation." />
            <Checkbox label="Send weekly progress digest" sublabel="Every Monday at 9am tenant time." />
            <IndeterminateCheckbox label="Indeterminate state" sublabel="e.g. some items selected in a list." />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <DemoCap>Radio</DemoCap>
            <Radio name="vis" defaultChecked label="Public" sublabel="Listed in the catalog." />
            <Radio name="vis" label="Tenant only" sublabel="Requires a tenant account." />
            <Radio name="vis" label="Unlisted" sublabel="Direct link only." />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <DemoCap>Switch</DemoCap>
            <label style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 'var(--t-14)' }}>
              <Switch defaultChecked /> Issue certificate on completion
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 'var(--t-14)' }}>
              <Switch /> Allow late submissions
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 'var(--t-14)' }}>
              <Switch defaultChecked /> Show progress to instructors
            </label>
          </div>
        </Demo>
      </SubSection>

      <SubSection label="Layout">
        <Demo bg style={{ flexDirection: 'column', alignItems: 'stretch', gap: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <FieldGroup label="First name" required>
              <Input defaultValue="Camila" />
            </FieldGroup>
            <FieldGroup label="Last name" required>
              <Input defaultValue="Rojas" />
            </FieldGroup>
            <FieldGroup label="Email" required style={{ gridColumn: 'span 2' }}>
              <Input defaultValue="camila@acme.edu" leadingIcon="inbox" />
            </FieldGroup>
            <FieldGroup label="Role" required>
              <Select>
                <option>Student</option>
                <option>Admin</option>
                <option>SuperAdmin</option>
              </Select>
            </FieldGroup>
            <FieldGroup label="Cohort" optional>
              <Select>
                <option>2026 Spring</option>
                <option>2026 Summer</option>
              </Select>
            </FieldGroup>
          </div>
          <hr />
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <Button variant="tertiary">Cancel</Button>
            <Button variant="primary">Invite to tenant</Button>
          </div>
        </Demo>
      </SubSection>
    </section>
  );
}

// ── 04 · TABLES ─────────────────────────────────────────────
function TablesSection() {
  const rows = [
    { id: 'usr_8814', name: 'Camila Rojas',    email: 'camila@acme.edu',    role: 'Student',    cohort: '2026 Spring', status: 'active',  joined: '2026-04-12', courses: 4 },
    { id: 'usr_8773', name: 'Marcus Lee',      email: 'marcus@acme.edu',    role: 'Admin',      cohort: '—',           status: 'active',  joined: '2025-11-02', courses: 12 },
    { id: 'usr_8730', name: 'Priya Sharma',    email: 'priya@acme.edu',     role: 'Student',    cohort: '2026 Spring', status: 'pending', joined: '2026-05-09', courses: 1 },
    { id: 'usr_8702', name: 'Diego Fernández', email: 'diego@acme.edu',     role: 'Student',    cohort: '2026 Summer', status: 'active',  joined: '2026-03-21', courses: 2 },
    { id: 'usr_8688', name: 'Aisha Bello',     email: 'aisha@acme.edu',     role: 'SuperAdmin', cohort: '—',           status: 'active',  joined: '2025-08-15', courses: 0 },
    { id: 'usr_8645', name: 'Tomáš Novák',     email: 'tomas@acme.edu',     role: 'Student',    cohort: '2026 Spring', status: 'suspended', joined: '2026-02-04', courses: 7 },
  ];
  const tone = { active: 'success', pending: 'warning', suspended: 'danger' };
  return (
    <section className="doc-sec" id="tables">
      <SectionHeader
        num="04"
        title="Tables"
        lede="Admin pages live and die by their tables. Generous row padding, mono uppercase headers, hover highlight, right-aligned numerics, action column always last."
      />

      <SubSection label="Toolbar + table">
        <div className="sr-table-wrap">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 20px', borderBottom: '1px solid var(--border)' }}>
            <div style={{ flex: '1 1 280px', maxWidth: 320 }}>
              <Input size="sm" leadingIcon="search" placeholder="Search users…" />
            </div>
            <Button size="sm" variant="secondary" trailing="chevronDown">Role: all</Button>
            <Button size="sm" variant="secondary" trailing="chevronDown">Status: all</Button>
            <div style={{ flex: 1 }} />
            <Badge tone="neutral">{rows.length} of 1,284</Badge>
            <Button size="sm" variant="secondary" icon="download">Export</Button>
            <Button size="sm" variant="primary" icon="plus">Invite</Button>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table className="sr-table">
              <thead>
                <tr>
                  <th style={{ width: 30 }}><Checkbox /></th>
                  <th>User</th>
                  <th>Role</th>
                  <th>Cohort</th>
                  <th>Status</th>
                  <th>Joined</th>
                  <th className="num">Courses</th>
                  <th style={{ width: 48 }} />
                </tr>
              </thead>
              <tbody>
                {rows.map(r => (
                  <tr key={r.id}>
                    <td><Checkbox /></td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <Avatar name={r.name} />
                        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.25 }}>
                          <span style={{ fontWeight: 500 }}>{r.name}</span>
                          <span style={{ color: 'var(--ink-3)', fontSize: 12 }}>{r.email}</span>
                        </div>
                      </div>
                    </td>
                    <td><Badge tone={r.role === 'SuperAdmin' ? 'primary' : r.role === 'Admin' ? 'info' : 'neutral'}>{r.role}</Badge></td>
                    <td style={{ color: 'var(--ink-3)' }}>{r.cohort}</td>
                    <td><Badge tone={tone[r.status]} dot>{r.status}</Badge></td>
                    <td style={{ color: 'var(--ink-3)', fontFamily: 'var(--font-mono)', fontSize: 12 }}>{r.joined}</td>
                    <td className="num" style={{ fontFamily: 'var(--font-mono)' }}>{r.courses}</td>
                    <td className="actions">
                      <Button size="sm" variant="tertiary" icon="more" iconOnly aria-label="Row actions" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 20px', borderTop: '1px solid var(--border)', fontSize: 'var(--t-13)', color: 'var(--ink-3)' }}>
            <span style={{ fontFamily: 'var(--font-mono)' }}>1–6 of 1,284</span>
            <div style={{ flex: 1 }} />
            <Button size="sm" variant="secondary">Prev</Button>
            <Button size="sm" variant="secondary">Next</Button>
          </div>
        </div>
      </SubSection>
    </section>
  );
}

// ── 05 · CARDS ──────────────────────────────────────────────
function CardsSection() {
  const courses = [
    { cat: 'Engineering', title: 'Advanced React Patterns', meta: '12 lessons · 4h 20m', progress: 64 },
    { cat: 'Design',      title: 'Design Systems in Practice', meta: '8 lessons · 2h 50m', progress: 100 },
    { cat: 'Product',     title: 'Roadmapping for Tenants',    meta: '6 lessons · 3h 10m', progress: 12 },
    { cat: 'Data',        title: 'SQL for Course Operators',   meta: '10 lessons · 5h 00m', progress: 0 },
  ];
  return (
    <section className="doc-sec" id="cards">
      <SectionHeader
        num="05"
        title="Cards"
        lede="Three card patterns cover 90% of the LMS: stat (a single number with delta), course (catalog + my-courses), and list (admin rows that read like cards)."
      />

      <SubSection label="Stat cards">
        <Demo grid bg>
          <div className="stat">
            <div className="lbl">Active students</div>
            <div className="val">1,284 <small><Icon name="arrowUp" size={10} />8.2%</small></div>
            <div style={{ color: 'var(--ink-3)', fontSize: 'var(--t-12)' }}>vs. last 30 days</div>
          </div>
          <div className="stat">
            <div className="lbl">Course completions</div>
            <div className="val">412 <small><Icon name="arrowUp" size={10} />12%</small></div>
            <div style={{ color: 'var(--ink-3)', fontSize: 'var(--t-12)' }}>vs. last 30 days</div>
          </div>
          <div className="stat">
            <div className="lbl">Revenue (MRR)</div>
            <div className="val">$48.2k <small className="down"><Icon name="arrowDown" size={10} />2.1%</small></div>
            <div style={{ color: 'var(--ink-3)', fontSize: 'var(--t-12)' }}>vs. last 30 days</div>
          </div>
          <div className="stat">
            <div className="lbl">Avg. session</div>
            <div className="val">23<span style={{ fontSize: 18, color: 'var(--ink-3)', marginLeft: -4 }}>min</span></div>
            <div style={{ color: 'var(--ink-3)', fontSize: 'var(--t-12)' }}>across all tenants</div>
          </div>
        </Demo>
      </SubSection>

      <SubSection label="Course cards">
        <Demo grid bg>
          {courses.map(c => (
            <div className="course-card" key={c.title}>
              <div className="course-thumb">
                <div className="placeholder">{c.cat} · cover</div>
              </div>
              <div className="course-body">
                <div className="cat">{c.cat}</div>
                <h4>{c.title}</h4>
                <div className="row">
                  <span>{c.meta}</span>
                  <span style={{ fontFamily: 'var(--font-mono)' }}>{c.progress}%</span>
                </div>
                <div className="progress"><i style={{ width: c.progress + '%' }} /></div>
              </div>
            </div>
          ))}
        </Demo>
      </SubSection>

      <SubSection label="List card">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0, border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', overflow: 'hidden', background: 'var(--surface)' }}>
          {[
            { icon: 'book',  name: 'Curriculum library',  meta: '128 lessons, last edit 2d ago', tone: 'neutral' },
            { icon: 'users', name: 'Cohort enrollments',  meta: '6 cohorts open · 312 seats',    tone: 'primary' },
            { icon: 'chart', name: 'Outcomes report',     meta: 'Quarterly · ready to publish',  tone: 'success' },
            { icon: 'folder', name: 'Tenant assets',      meta: '14 GB used of 50 GB',           tone: 'neutral' },
          ].map((it, i, arr) => (
            <div key={it.name}
                 style={{
                   display: 'flex', alignItems: 'center', gap: 14,
                   padding: '16px 20px',
                   borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : '0',
                 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 'var(--r-md)',
                background: 'var(--bg-sub)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--ink-2)',
              }}>
                <Icon name={it.icon} size={16} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 500 }}>{it.name}</div>
                <div style={{ color: 'var(--ink-3)', fontSize: 'var(--t-13)' }}>{it.meta}</div>
              </div>
              <Badge tone={it.tone}>{it.tone === 'primary' ? 'Active' : it.tone === 'success' ? 'Ready' : 'OK'}</Badge>
              <Icon name="chevronRight" size={16} style={{ color: 'var(--ink-4)' }} />
            </div>
          ))}
        </div>
      </SubSection>
    </section>
  );
}

// ── 06 · STATUS ─────────────────────────────────────────────
function StatusSection() {
  return (
    <section className="doc-sec" id="status">
      <SectionHeader
        num="06"
        title="Status & feedback"
        lede="Badges, alerts, and toasts share one tone vocabulary. Pick semantic intent first, color second — the token does the rest."
      />

      <SubSection label="Badges">
        <Demo>
          <Badge dot tone="success">Active</Badge>
          <Badge dot tone="warning">Pending review</Badge>
          <Badge dot tone="danger">Failed</Badge>
          <Badge dot tone="info">Draft</Badge>
          <Badge dot tone="primary">Featured</Badge>
          <Badge tone="neutral">v2.4.1</Badge>
          <Badge tone="neutral">SuperAdmin only</Badge>
          <Badge tone="primary">Beta</Badge>
        </Demo>
      </SubSection>

      <SubSection label="Alerts">
        <Demo stack>
          <Alert tone="info" title="Tenant export queued">
            We'll email <b>marcus@acme.edu</b> when the archive is ready — usually within 5 minutes.
          </Alert>
          <Alert tone="success" title="Course published">
            "Advanced React Patterns" is now live in the catalog. <a href="#" style={{ color: 'inherit', textDecoration: 'underline' }}>View course →</a>
          </Alert>
          <Alert tone="warning" title="6 students still pending email verification">
            They won't receive course access emails until they verify. <a href="#" style={{ color: 'inherit', textDecoration: 'underline' }}>Resend all</a>
          </Alert>
          <Alert tone="danger" title="Stripe webhook failed (3 attempts)">
            Last attempt at 14:32. Check the webhook endpoint and credentials in <a href="#" style={{ color: 'inherit', textDecoration: 'underline' }}>Billing settings</a>.
          </Alert>
        </Demo>
      </SubSection>

      <SubSection label="Toast">
        <Demo bg>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '12px 16px',
            background: 'var(--ink-1)', color: 'var(--bg)',
            borderRadius: 'var(--r-md)',
            boxShadow: 'var(--shadow-3)',
            fontSize: 'var(--t-14)',
            minWidth: 320,
          }}>
            <Icon name="check" size={16} style={{ color: 'var(--success)' }} />
            <span>Saved 28 changes to "Q2 curriculum"</span>
            <div style={{ flex: 1 }} />
            <button style={{
              appearance: 'none', border: 0, background: 'transparent',
              color: 'var(--bg-sub)', fontFamily: 'inherit', fontSize: 'var(--t-13)',
              padding: '2px 6px', cursor: 'pointer', textDecoration: 'underline',
            }}>Undo</button>
            <Icon name="x" size={14} style={{ color: 'var(--ink-4)' }} />
          </div>
        </Demo>
      </SubSection>
    </section>
  );
}

// ── 07 · EMPTY & LOADING ────────────────────────────────────
function EmptyLoadingSection() {
  return (
    <section className="doc-sec" id="empty">
      <SectionHeader
        num="07"
        title="Empty & loading states"
        lede="A blank page is a design surface, not a failure. Every list and table specifies its zero, loading, and error state."
      />

      <SubSection label="Empty">
        <Demo grid bg>
          <div className="es">
            <div className="es-glyph"><Icon name="users" size={22} /></div>
            <h4>No students enrolled yet</h4>
            <p>Invite students by email or share the tenant signup link to start filling cohorts.</p>
            <div className="es-actions">
              <Button variant="primary" icon="plus">Invite students</Button>
              <Button variant="secondary">Copy signup link</Button>
            </div>
          </div>
          <div className="es">
            <div className="es-glyph"><Icon name="book" size={22} /></div>
            <h4>This cohort has no courses</h4>
            <p>Add at least one course before enrollments open. Courses can come from your library or be drafted fresh.</p>
            <div className="es-actions">
              <Button variant="primary" icon="plus">Add from library</Button>
              <Button variant="tertiary">Create new</Button>
            </div>
          </div>
        </Demo>
      </SubSection>

      <SubSection label="Loading — skeleton">
        <div className="sr-table-wrap">
          <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 12 }}>
            <Skeleton w={220} h={28} r={8} />
            <div style={{ flex: 1 }} />
            <Skeleton w={90} h={28} r={8} />
            <Skeleton w={90} h={28} r={8} />
          </div>
          {[...Array(5)].map((_, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 20px', borderBottom: i < 4 ? '1px solid var(--border)' : 0 }}>
              <Skeleton w={32} h={32} r={999} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1 }}>
                <Skeleton w={`${30 + (i * 13) % 40}%`} h={12} />
                <Skeleton w={`${40 + (i * 9) % 30}%`} h={10} />
              </div>
              <Skeleton w={64} h={20} r={999} />
              <Skeleton w={80} h={12} />
              <Skeleton w={24} h={24} r={6} />
            </div>
          ))}
        </div>
      </SubSection>

      <SubSection label="Loading — inline">
        <Demo>
          <Button variant="primary" loading>Saving</Button>
          <Button variant="secondary" loading>Refreshing</Button>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: 'var(--ink-3)', fontSize: 'var(--t-13)' }}>
            <span className="sr-spin" style={{ width: 12, height: 12, borderColor: 'var(--ink-4)', borderRightColor: 'transparent' }} />
            Verifying email…
          </span>
        </Demo>
      </SubSection>
    </section>
  );
}

// ── 08 · MODALS ─────────────────────────────────────────────
function ModalsSection() {
  return (
    <section className="doc-sec" id="modals">
      <SectionHeader
        num="08"
        title="Modals"
        lede="A modal interrupts. Reserve them for decisions that can't be deferred, irreversible actions, or focused tasks (invite, transfer, delete)."
      />
      <Demo grid bg>
        <div className="sr-modal-stage">
          <div className="sr-modal">
            <div className="sr-modal-hd">
              <h3>Invite to tenant</h3>
              <p>Send an invitation by email. They'll get a one-click signup link valid for 7 days.</p>
            </div>
            <div className="sr-modal-bd">
              <FieldGroup label="Email" required>
                <Input defaultValue="alex@acme.edu" leadingIcon="inbox" />
              </FieldGroup>
              <FieldGroup label="Role" required>
                <Select><option>Student</option><option>Admin</option></Select>
              </FieldGroup>
              <Checkbox defaultChecked label="Auto-enroll in 2026 Spring cohort" />
            </div>
            <div className="sr-modal-ft">
              <Button variant="tertiary">Cancel</Button>
              <Button variant="primary">Send invite</Button>
            </div>
          </div>
        </div>
        <div className="sr-modal-stage">
          <div className="sr-modal">
            <div className="sr-modal-hd">
              <h3 style={{ color: 'var(--danger)' }}>Suspend tenant access?</h3>
              <p>All <b>312</b> users in <b>Acme University</b> will lose access immediately. Their progress, payments, and certificates are preserved.</p>
            </div>
            <div className="sr-modal-bd">
              <Alert tone="warning" title="This pauses billing for the current month">
                You can resume access at any time. Reinstating restores all permissions.
              </Alert>
              <FieldGroup label={<>Type <b>acme</b> to confirm</>}>
                <Input placeholder="acme" />
              </FieldGroup>
            </div>
            <div className="sr-modal-ft">
              <Button variant="tertiary">Keep active</Button>
              <Button variant="danger" icon="alert">Suspend tenant</Button>
            </div>
          </div>
        </div>
      </Demo>
    </section>
  );
}

// ── 09 · ADMIN EXAMPLE ──────────────────────────────────────
function ExampleSection({ tweaks }) {
  return (
    <section className="doc-sec" id="example">
      <SectionHeader
        num="09"
        title="In situ"
        lede="Everything assembled — tenant admin overview, primitives only. Use the sidebar tweak to compare rail, labeled, and collapsed nav."
      />

      <div className="shell" data-sidebar={tweaks.sidebar}>
        <aside className="shell-side">
          <div className="shell-brand">
            <div className="mark">S</div>
            <b>SkillsRamp</b>
          </div>
          <div className="shell-section-lbl"><span>Tenant</span></div>
          <nav className="shell-nav">
            <a className="on"><Icon name="home" size={16} /><span>Dashboard</span></a>
            <a><Icon name="book" size={16} /><span>Courses</span></a>
            <a><Icon name="users" size={16} /><span>Students</span></a>
            <a><Icon name="chart" size={16} /><span>Analytics</span></a>
            <a><Icon name="inbox" size={16} /><span>Orders</span></a>
          </nav>
          <div className="shell-section-lbl"><span>Operate</span></div>
          <nav className="shell-nav">
            <a><Icon name="folder" size={16} /><span>Content library</span></a>
            <a><Icon name="layers" size={16} /><span>Cohorts</span></a>
            <a><Icon name="bell" size={16} /><span>Notifications</span></a>
            <a><Icon name="settings" size={16} /><span>Settings</span></a>
          </nav>
        </aside>
        <main className="shell-main">
          <header className="shell-topbar">
            <div className="crumb">
              Acme University · <b>Dashboard</b>
            </div>
            <div style={{ flex: 1 }} />
            <Input size="sm" leadingIcon="search" placeholder="Search…"
                   style={{ width: 240 }} />
            <Button size="sm" variant="tertiary" icon="bell" iconOnly aria-label="Notifications" />
            <Avatar name="Marcus Lee" size="sm" />
          </header>
          <div className="shell-body">
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16 }}>
              <div>
                <Stamp>2026 · Q2 · WEEK 21</Stamp>
                <h2 style={{ fontSize: 32, marginTop: 8, letterSpacing: '-0.02em' }}>
                  Good morning, Marcus
                </h2>
                <p style={{ color: 'var(--ink-3)', marginTop: 6, fontSize: 'var(--t-14)' }}>
                  3 new enrollments overnight · 2 courses awaiting review
                </p>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <Button variant="secondary" icon="download">Export report</Button>
                <Button variant="primary" icon="plus">New course</Button>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
              <div className="stat">
                <div className="lbl">Active students</div>
                <div className="val" style={{ fontSize: 28 }}>1,284 <small><Icon name="arrowUp" size={10} />8%</small></div>
              </div>
              <div className="stat">
                <div className="lbl">Completions</div>
                <div className="val" style={{ fontSize: 28 }}>412 <small><Icon name="arrowUp" size={10} />12%</small></div>
              </div>
              <div className="stat">
                <div className="lbl">MRR</div>
                <div className="val" style={{ fontSize: 28 }}>$48.2k <small className="down"><Icon name="arrowDown" size={10} />2%</small></div>
              </div>
              <div className="stat">
                <div className="lbl">Avg. session</div>
                <div className="val" style={{ fontSize: 28 }}>23<span style={{ fontSize: 14, color: 'var(--ink-3)', marginLeft: -2 }}>min</span></div>
              </div>
            </div>

            <Alert tone="warning" title="6 students still pending email verification">
              They won't receive course access emails until they verify their address.
              <a href="#" style={{ color: 'inherit', textDecoration: 'underline', marginLeft: 6 }}>Resend all</a>
            </Alert>

            <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 16 }}>
              <div className="sr-table-wrap">
                <div style={{ padding: '12px 18px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 12 }}>
                  <h4 style={{ fontSize: 'var(--t-16)' }}>Recent enrollments</h4>
                  <div style={{ flex: 1 }} />
                  <Button size="sm" variant="link" trailing="arrowRight">See all</Button>
                </div>
                <table className="sr-table">
                  <thead><tr><th>Student</th><th>Course</th><th>Status</th><th className="num">When</th></tr></thead>
                  <tbody>
                    <tr><td><div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><Avatar name="Camila Rojas" size="sm" /> Camila Rojas</div></td><td>Advanced React</td><td><Badge tone="success" dot>active</Badge></td><td className="num" style={{ color: 'var(--ink-3)', fontFamily: 'var(--font-mono)' }}>2h ago</td></tr>
                    <tr><td><div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><Avatar name="Diego F." size="sm" /> Diego Fernández</div></td><td>SQL for Operators</td><td><Badge tone="warning" dot>pending</Badge></td><td className="num" style={{ color: 'var(--ink-3)', fontFamily: 'var(--font-mono)' }}>5h ago</td></tr>
                    <tr><td><div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><Avatar name="Priya Sharma" size="sm" /> Priya Sharma</div></td><td>Design Systems</td><td><Badge tone="success" dot>active</Badge></td><td className="num" style={{ color: 'var(--ink-3)', fontFamily: 'var(--font-mono)' }}>9h ago</td></tr>
                  </tbody>
                </table>
              </div>
              <div className="es" style={{ padding: 36 }}>
                <div className="es-glyph"><Icon name="spark" size={22} /></div>
                <h4>Try the new outline assistant</h4>
                <p>Draft a course skeleton from a one-line brief. SuperAdmin enabled this week.</p>
                <Button variant="soft" icon="spark">Generate outline</Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </section>
  );
}

// ── NAVIGATION INDEX ────────────────────────────────────────
const SR_SECTIONS = [
  { id: 'cover',     idx: '00',   label: 'Cover' },
  { id: 'color',     idx: '01.A', label: 'Color' },
  { id: 'type',      idx: '01.B', label: 'Typography' },
  { id: 'spacing',   idx: '01.C', label: 'Spacing' },
  { id: 'elevation', idx: '01.D', label: 'Elevation' },
  { id: 'buttons',   idx: '02',   label: 'Buttons' },
  { id: 'forms',     idx: '03',   label: 'Forms' },
  { id: 'tables',    idx: '04',   label: 'Tables' },
  { id: 'cards',     idx: '05',   label: 'Cards' },
  { id: 'status',    idx: '06',   label: 'Status' },
  { id: 'empty',     idx: '07',   label: 'Empty states' },
  { id: 'modals',    idx: '08',   label: 'Modals' },
  { id: 'example',   idx: '09',   label: 'In situ' },
];

Object.assign(window, {
  CoverSection, ColorSection, TypeSection, SpacingSection, ElevationSection,
  ButtonsSection, FormsSection, TablesSection, CardsSection, StatusSection,
  EmptyLoadingSection, ModalsSection, ExampleSection,
  SR_SECTIONS,
});
