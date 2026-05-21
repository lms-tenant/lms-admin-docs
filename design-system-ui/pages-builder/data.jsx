// data.jsx — mock pages, block definitions (matching the project's 13 Craft.js
// nodes), templates, sample block tree for the demo page, and i18n.

// ─── Pages list ───────────────────────────────────────────
const PAGES = [
  {
    id: 'p_home',     slug: '/',                 title: 'Home',                      status: 'published',
    updated: '2026-05-20T15:22:00Z', updatedLabel: '3h ago',
    blocks: 14, views: 18420, visitors: 12104, openRate: 64, owner: 'Marcus Lee',
    seo: { score: 92, missing: [] }, isHome: true,
  },
  {
    id: 'p_about',    slug: '/about',            title: 'About Acme',                status: 'published',
    updated: '2026-05-18T09:10:00Z', updatedLabel: '3d ago',
    blocks: 9, views: 4280, visitors: 3210, openRate: 41, owner: 'Camila Rojas',
    seo: { score: 84, missing: ['og:image'] },
  },
  {
    id: 'p_cohort',   slug: '/cohort/spring-2026', title: 'Spring 2026 cohort',     status: 'published',
    updated: '2026-05-19T11:05:00Z', updatedLabel: '2d ago',
    blocks: 22, views: 7104, visitors: 5320, openRate: 58, owner: 'Marcus Lee',
    seo: { score: 96, missing: [] },
  },
  {
    id: 'p_pricing',  slug: '/pricing',          title: 'Pricing',                   status: 'published',
    updated: '2026-05-15T14:00:00Z', updatedLabel: '1w ago',
    blocks: 11, views: 9402, visitors: 6420, openRate: 71, owner: 'Aisha Bello',
    seo: { score: 88, missing: ['canonical'] },
  },
  {
    id: 'p_contact',  slug: '/contact',          title: 'Contact',                   status: 'published',
    updated: '2026-04-30T10:30:00Z', updatedLabel: '3w ago',
    blocks: 4, views: 1840, visitors: 1620, openRate: 48, owner: 'Camila Rojas',
    seo: { score: 78, missing: ['og:description', 'og:image'] },
  },
  {
    id: 'p_newcourse', slug: '/launch/react-2026', title: 'Launch: Advanced React',   status: 'scheduled',
    updated: '2026-05-21T08:00:00Z', updatedLabel: 'Goes live Fri 09:00',
    blocks: 17, views: 0, visitors: 0, openRate: 0, owner: 'Marcus Lee',
    seo: { score: 91, missing: [] },
  },
  {
    id: 'p_q2',       slug: '/insights/q2-report', title: 'Q2 insights report',      status: 'draft',
    updated: '2026-05-20T18:45:00Z', updatedLabel: '4h ago',
    blocks: 8, views: 0, visitors: 0, openRate: 0, owner: 'Aisha Bello',
    seo: { score: 62, missing: ['title','description','og:image','canonical'] },
  },
  {
    id: 'p_legacy',   slug: '/instructors/legacy', title: 'Instructors (old)',       status: 'archived',
    updated: '2025-11-02T12:00:00Z', updatedLabel: '6mo ago',
    blocks: 6, views: 0, visitors: 0, openRate: 0, owner: 'Marcus Lee',
    seo: { score: 70, missing: ['og:image'] },
  },
];

// ─── Block library (mirrors src/components/molecules/editor/craft/nodes/*) ──
const BLOCKS = [
  { id: 'heading',    icon: 'H',         label: 'Heading',     group: 'Basic',     desc: 'H1–H4 title.' },
  { id: 'text',       icon: 'T',         label: 'Text',        group: 'Basic',     desc: 'Paragraph or rich text.' },
  { id: 'image',      icon: 'image',     label: 'Image',       group: 'Media',     desc: 'Upload, paste URL, or pick from library.' },
  { id: 'video',      icon: 'play',      label: 'Video',       group: 'Media',     desc: 'YouTube, Vimeo, or upload.' },
  { id: 'button',     icon: 'cursor',    label: 'Button',      group: 'Action',    desc: 'Link button with style + size.' },
  { id: 'divider',    icon: 'minus',     label: 'Divider',     group: 'Layout',    desc: 'Horizontal rule.' },
  { id: 'quote',      icon: 'quote',     label: 'Quote',       group: 'Content',   desc: 'Pull quote with citation.' },
  { id: 'callout',    icon: 'alert',     label: 'Callout',     group: 'Content',   desc: 'Info / warning / success.' },
  { id: 'code',       icon: 'code',      label: 'Code',        group: 'Content',   desc: 'Syntax-highlighted block.' },
  { id: 'html',       icon: 'html',      label: 'HTML',        group: 'Advanced',  desc: 'Raw HTML / embed snippet.' },
  { id: 'container',  icon: 'box',       label: 'Container',   group: 'Layout',    desc: 'Section with bg + padding.' },
  { id: 'columns',    icon: 'columns',   label: '2 Columns',   group: 'Layout',    desc: 'Two side-by-side regions.' },
  { id: 'hero',       icon: 'star',      label: 'Hero',        group: 'Section',   desc: 'Title + subtitle + CTAs.', isNew: true },
  { id: 'spacer',     icon: 'spacer',    label: 'Spacer',      group: 'Layout',    desc: 'Vertical gap.' },
  { id: 'grid',       icon: 'grid',      label: 'Card grid',   group: 'Section',   desc: 'Repeating card layout.', isNew: true },
  { id: 'embed',      icon: 'embed',     label: 'Embed',       group: 'Advanced',  desc: 'iframe / external widget.' },
];

const BLOCK_GROUPS = ['Section', 'Basic', 'Media', 'Layout', 'Content', 'Action', 'Advanced'];

// ─── Templates (page starters) ───────────────────────────
const PAGE_TEMPLATES = [
  { id: 'tpl_marketing', name: 'Marketing landing',   desc: 'Hero + features + testimonials + CTA.',  blocks: 14 },
  { id: 'tpl_cohort',    name: 'Cohort signup',       desc: 'Outcome-led, dates, instructors, apply.', blocks: 22 },
  { id: 'tpl_about',     name: 'About / Company',     desc: 'Story, team, values.',                    blocks: 11 },
  { id: 'tpl_blank',     name: 'Blank',               desc: 'Empty canvas.',                           blocks: 0 },
];

// ─── Demo tree: the page that opens in the builder ───────
// Mirrors a Craft.js node tree shape (id + type + props + children).
const SAMPLE_TREE = [
  {
    id: 'b_hero', type: 'hero', name: 'Hero',
    props: {
      eyebrow: 'Spring 2026 · Now enrolling',
      title: 'Learn the skills that ship.',
      subtitle: 'Cohort-based courses from working practitioners. Live sessions, real feedback, and a portfolio you can show.',
      cta1: 'Browse the catalog', cta2: 'See how it works',
      bg: 'soft',
    },
  },
  {
    id: 'b_container1', type: 'container', name: 'Featured · container',
    props: { padding: 32, bg: 'surface' },
    children: [
      { id: 'b_h1', type: 'heading', name: 'Heading', props: { level: 'h2', text: 'Featured this month' } },
      { id: 'b_text1', type: 'text', name: 'Text', props: { text: 'Hand-picked cohorts opening in the next 30 days. Every spot is held until the live kickoff.' } },
      { id: 'b_grid', type: 'grid', name: 'Card grid', props: { columns: 3, gap: 16 } },
    ],
  },
  {
    id: 'b_columns1', type: 'columns', name: '2 Columns',
    props: { ratio: '1:1', gap: 24 },
    children: [
      { id: 'b_image1', type: 'image', name: 'Image · cover', props: { src: '', alt: 'Office hours photograph' } },
      { id: 'b_quote', type: 'quote', name: 'Quote · student', props: { text: '"The live sessions changed how I think about shipping. Six months later I\u2019m leading our React migration."', author: 'Diego Fernández', role: 'Sr. Engineer · Banamex' } },
    ],
  },
  { id: 'b_divider', type: 'divider', name: 'Divider', props: {} },
  {
    id: 'b_callout', type: 'callout', name: 'Callout · scholarship',
    props: { tone: 'info', title: 'Scholarship deadline: May 31', body: 'Need-based scholarships covering 40–100% of tuition. Apply directly from the cohort page.' },
  },
  { id: 'b_button', type: 'button', name: 'Button · primary CTA', props: { label: 'Browse catalog', variant: 'primary' } },
];

// ─── i18n ────────────────────────────────────────────────
const I18N = {
  en: {
    'app.brand': 'SkillsRamp',
    'crumb.parent': 'Acme University',
    'crumb.pages': 'Pages',
    'page.title': 'Pages',
    'page.subtitle': 'Public pages your students and visitors see — landing, about, cohort pitches, pricing. Drag-and-drop sections, drafts/preview before publish, page-level SEO.',
    'btn.new':       'New page',
    'btn.template':  'Browse templates',
    'btn.import':    'Import from URL',
    'btn.preview':   'Preview',
    'btn.publish':   'Publish',
    'btn.publishUpdate': 'Publish update',
    'btn.unpublish': 'Unpublish',
    'btn.duplicate': 'Duplicate',
    'btn.delete':    'Delete',
    'btn.back':      'Back to pages',
    'btn.save':      'Save',
    'btn.cancel':    'Cancel',
    'btn.viewLive':  'View live',
    'btn.copyLink':  'Copy URL',
    'btn.openSeo':   'Open SEO',
    'btn.versions':  'Version history',
    'btn.aiAssist':  'AI assist',

    'tabs.all':       'All',
    'tabs.published': 'Published',
    'tabs.draft':     'Drafts',
    'tabs.scheduled': 'Scheduled',
    'tabs.archived':  'Archived',

    'tbl.search':     'Search by title, slug, or content…',
    'tbl.title':      'Page',
    'tbl.slug':       'URL',
    'tbl.status':     'Status',
    'tbl.traffic':    'Traffic (30d)',
    'tbl.blocks':     'Blocks',
    'tbl.seo':        'SEO',
    'tbl.updated':    'Updated',
    'tbl.owner':      'Owner',

    'st.published': 'Published',
    'st.draft':     'Draft',
    'st.scheduled': 'Scheduled',
    'st.archived':  'Archived',

    'bld.save.idle':   'Autosaved',
    'bld.save.saving': 'Saving…',
    'bld.save.saved':  'Saved · {when}',

    'bld.palette':    'Add a section',
    'bld.palette.search': 'Search components',
    'bld.layers':     'Layers',
    'bld.inspector':  'Properties',
    'bld.empty.title': 'Empty canvas',
    'bld.empty.body':  'Drag a section from the left, or pick a starter template.',
    'bld.empty.ai':    'Describe your page and let AI draft it',

    'insp.tab.block':  'Block',
    'insp.tab.style':  'Style',
    'insp.tab.page':   'Page',
    'insp.tab.seo':    'SEO',

    'tpl.title':       'Start from a template',
    'tpl.blank':       'Or start blank',
  },
  es: {
    'app.brand': 'SkillsRamp',
    'crumb.parent': 'Acme University',
    'crumb.pages': 'Páginas',
    'page.title': 'Páginas',
    'page.subtitle': 'Páginas públicas que ven tus estudiantes y visitantes — landing, sobre nosotros, cohortes, precios. Secciones drag-and-drop, borradores y vista previa, SEO a nivel página.',
    'btn.new':       'Nueva página',
    'btn.template':  'Ver plantillas',
    'btn.import':    'Importar desde URL',
    'btn.preview':   'Vista previa',
    'btn.publish':   'Publicar',
    'btn.publishUpdate': 'Publicar cambios',
    'btn.unpublish': 'Despublicar',
    'btn.duplicate': 'Duplicar',
    'btn.delete':    'Eliminar',
    'btn.back':      'Volver a páginas',
    'btn.save':      'Guardar',
    'btn.cancel':    'Cancelar',
    'btn.viewLive':  'Ver en vivo',
    'btn.copyLink':  'Copiar URL',
    'btn.openSeo':   'Abrir SEO',
    'btn.versions':  'Historial',
    'btn.aiAssist':  'IA',

    'tabs.all':       'Todas',
    'tabs.published': 'Publicadas',
    'tabs.draft':     'Borradores',
    'tabs.scheduled': 'Programadas',
    'tabs.archived':  'Archivadas',

    'tbl.search':     'Buscar por título, slug o contenido…',
    'tbl.title':      'Página',
    'tbl.slug':       'URL',
    'tbl.status':     'Estado',
    'tbl.traffic':    'Tráfico (30d)',
    'tbl.blocks':     'Bloques',
    'tbl.seo':        'SEO',
    'tbl.updated':    'Última edición',
    'tbl.owner':      'Owner',

    'st.published': 'Publicada',
    'st.draft':     'Borrador',
    'st.scheduled': 'Programada',
    'st.archived':  'Archivada',

    'bld.save.idle':   'Autoguardado',
    'bld.save.saving': 'Guardando…',
    'bld.save.saved':  'Guardado · {when}',

    'bld.palette':    'Añadir sección',
    'bld.palette.search': 'Buscar componentes',
    'bld.layers':     'Capas',
    'bld.inspector':  'Propiedades',
    'bld.empty.title': 'Lienzo vacío',
    'bld.empty.body':  'Arrastrá una sección desde la izquierda, o elegí una plantilla.',
    'bld.empty.ai':    'Describí tu página y dejá que la IA la redacte',

    'insp.tab.block':  'Bloque',
    'insp.tab.style':  'Estilo',
    'insp.tab.page':   'Página',
    'insp.tab.seo':    'SEO',

    'tpl.title':       'Empezar desde una plantilla',
    'tpl.blank':       'O empezar en blanco',
  },
};

function useT(lang) {
  return React.useCallback((key, vars) => {
    let v = (I18N[lang] || I18N.en)[key] || key;
    if (vars) for (const k in vars) v = v.replace('{' + k + '}', vars[k]);
    return v;
  }, [lang]);
}

Object.assign(window, { PAGES, BLOCKS, BLOCK_GROUPS, PAGE_TEMPLATES, SAMPLE_TREE, I18N, useT });
