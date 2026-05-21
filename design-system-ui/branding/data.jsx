// data.jsx — branding presets, font pairings, page templates, i18n, tenant mock.

// Curated brand presets — each shipped with OKLCH coordinates so soft/hover/ring
// shades derive automatically and stay harmonious regardless of the picked hue.
// Anchor hex is purely for the swatch chip; CSS reads --primary-h/c/l.
const BRAND_PRESETS = [
  { id: 'indigo',   name: 'Indigo',   hex: '#4F46E5', h: 270, c: 0.16, l: 0.50, blurb: 'Trustworthy, focused — default for B2B' },
  { id: 'emerald',  name: 'Emerald',  hex: '#10B981', h: 165, c: 0.13, l: 0.58, blurb: 'Calm growth — current SkillsRamp default' },
  { id: 'violet',   name: 'Violet',   hex: '#7C3AED', h: 300, c: 0.18, l: 0.52, blurb: 'Creative, premium feel' },
  { id: 'ocean',    name: 'Ocean',    hex: '#0EA5E9', h: 235, c: 0.14, l: 0.62, blurb: 'Friendly tech, high readability' },
  { id: 'amber',    name: 'Amber',    hex: '#F59E0B', h: 75,  c: 0.15, l: 0.70, blurb: 'Warm, energetic — best on dark surfaces' },
  { id: 'rose',     name: 'Rose',     hex: '#E11D48', h: 20,  c: 0.18, l: 0.56, blurb: 'Bold, expressive — use sparingly' },
  { id: 'graphite', name: 'Graphite', hex: '#475569', h: 250, c: 0.03, l: 0.42, blurb: 'Editorial, neutral — let imagery speak' },
];
const BRAND_BY_ID = Object.fromEntries(BRAND_PRESETS.map(b => [b.id, b]));

// Font pairings — paired display + body. Each pair has a personality.
const FONT_PAIRS = [
  {
    id: 'bricolage',
    name: 'Bricolage / Geist',
    display: '"Bricolage Grotesque", "Inter Tight", system-ui, sans-serif',
    body: '"Geist", "Inter", system-ui, sans-serif',
    sample: 'Editorial · optically sized · default',
  },
  {
    id: 'intertight',
    name: 'Inter Tight / Inter',
    display: '"Inter Tight", system-ui, sans-serif',
    body: '"Inter", system-ui, sans-serif',
    sample: 'Clean, modern, hyper-legible',
  },
  {
    id: 'grotesk',
    name: 'Space Grotesk / DM Sans',
    display: '"Space Grotesk", system-ui, sans-serif',
    body: '"DM Sans", "Inter", system-ui, sans-serif',
    sample: 'Geometric, friendly — current legacy default',
  },
  {
    id: 'outfit',
    name: 'Outfit / DM Sans',
    display: '"Outfit", system-ui, sans-serif',
    body: '"DM Sans", "Inter", system-ui, sans-serif',
    sample: 'Rounded, warm, approachable',
  },
  {
    id: 'editorial',
    name: 'Instrument Serif / Geist',
    display: '"Instrument Serif", Georgia, serif',
    body: '"Geist", "Inter", system-ui, sans-serif',
    sample: 'Elegant, distinctive — for premium tenants',
  },
];
const PAIR_BY_ID = Object.fromEntries(FONT_PAIRS.map(p => [p.id, p]));

// Radius presets (keeps the slider tidy without losing the underlying spec)
const RADIUS_PRESETS = [
  { v: 2,  label: 'Sharp' },
  { v: 6,  label: 'Subtle' },
  { v: 10, label: 'Default' },
  { v: 14, label: 'Soft' },
  { v: 20, label: 'Pillowy' },
];

// Density (matches the design system tokens)
const DENSITIES = [
  { v: 'compact',     label: 'Compact' },
  { v: 'comfortable', label: 'Comfortable' },
  { v: 'spacious',    label: 'Spacious' },
];

// Page templates — kept from the existing branding page so we don't regress
const PAGE_TEMPLATES = [
  { id: 'hero-grid',  name: 'Hero + course grid', desc: 'Big hero, featured courses, testimonials.',
    sections: ['Hero','Featured courses','Categories','Testimonials','CTA'] },
  { id: 'catalog',    name: 'Catalog-first',      desc: 'Search-led, filter sidebar, course grid.',
    sections: ['Search hero','Filter sidebar','Course grid','Pagination'] },
  { id: 'cohort',     name: 'Cohort landing',     desc: 'Dates, instructors, modules, apply CTA.',
    sections: ['Hero with dates','Outcomes','Module list','Instructors','Apply form'] },
];

// Mock tenant
const TENANT = {
  name: 'Acme University',
  slug: 'acme',
  domain: 'learn.acme.edu',
  logoUrl: '',
};

// i18n — admin chrome stays in English; the controls and labels translate.
const I18N = {
  en: {
    'page.crumb': 'Settings · Branding',
    'page.title': 'Brand & appearance',
    'page.subtitle': 'Visual identity students see across the catalog, course player, certificates, and emails. Every change updates the live preview on the right.',
    'btn.save': 'Save changes',
    'btn.reset': 'Discard',
    'btn.publish': 'Publish to tenant',
    'btn.viewProd': 'View on production',
    'save.unsaved': 'Unsaved changes',
    'save.saving': 'Saving…',
    'save.saved':  'Saved · live in production',

    'sec.identity':      'Identity',
    'sec.identity.sub':  'Logo + tenant display name. Shown in the nav and on certificates.',
    'sec.brand':         'Brand color',
    'sec.brand.sub':     'One primary hue anchors every interactive surface. Pick a curated preset or define your own.',
    'sec.type':          'Typography',
    'sec.type.sub':      'A paired display + body face. Display is used for headings; body for everything else.',
    'sec.shape':         'Shape & feel',
    'sec.shape.sub':     'Radius and density apply uniformly across buttons, inputs, cards, and modals.',
    'sec.templates':     'Page templates',
    'sec.templates.sub': 'Choose how your public catalog page is laid out.',

    'fld.logo':       'Logo URL',
    'fld.logo.hint':  'PNG or SVG, transparent background, ~120px tall. We render at 32px in the nav.',
    'fld.logo.upload': 'Upload file',
    'fld.brandname':  'Display name',
    'fld.brandname.hint': 'Shown next to the logo. Falls back to tenant name.',

    'brand.custom':   'Custom hex',
    'brand.hint':     'Soft, hover, and focus-ring shades derive automatically.',
    'brand.swatches': 'Derived palette',
    'brand.contrast': 'Contrast on white',

    'type.preview':   'Sample',

    'radius':         'Corner radius',
    'density':        'Density',

    'preview.title':  'Live preview',
    'preview.student': 'Student',
    'preview.admin':   'Admin',
    'preview.email':   'Email',
    'preview.cert':    'Certificate',
    'preview.device.desktop': 'Desktop',
    'preview.device.mobile':  'Mobile',
    'preview.dark':    'Dark',

    'tpl.applied':    'Applied',
    'tpl.apply':      'Apply',
  },
  es: {
    'page.crumb': 'Ajustes · Personalización',
    'page.title': 'Marca y apariencia',
    'page.subtitle': 'Identidad visual que verán los estudiantes en el catálogo, el reproductor, los certificados y los correos. Cada cambio actualiza la vista previa en vivo.',
    'btn.save': 'Guardar cambios',
    'btn.reset': 'Descartar',
    'btn.publish': 'Publicar al tenant',
    'btn.viewProd': 'Ver en producción',
    'save.unsaved': 'Cambios sin guardar',
    'save.saving': 'Guardando…',
    'save.saved':  'Guardado · activo en producción',

    'sec.identity':      'Identidad',
    'sec.identity.sub':  'Logo y nombre del tenant. Se muestran en la navegación y los certificados.',
    'sec.brand':         'Color de marca',
    'sec.brand.sub':     'Un único color primario ancla todas las superficies interactivas. Elegí un preset o definí el tuyo.',
    'sec.type':          'Tipografía',
    'sec.type.sub':      'Pareja de fuentes display + body. La display se usa para títulos; la body, para todo lo demás.',
    'sec.shape':         'Forma y feel',
    'sec.shape.sub':     'Radio y densidad se aplican de forma uniforme a botones, inputs, cards y modales.',
    'sec.templates':     'Plantillas de página',
    'sec.templates.sub': 'Elegí cómo se ve tu catálogo público.',

    'fld.logo':       'URL del logo',
    'fld.logo.hint':  'PNG o SVG, fondo transparente, ~120px de alto. Lo renderizamos a 32px en la navegación.',
    'fld.logo.upload': 'Subir archivo',
    'fld.brandname':  'Nombre visible',
    'fld.brandname.hint': 'Se muestra junto al logo. Por defecto usa el nombre del tenant.',

    'brand.custom':   'Hex personalizado',
    'brand.hint':     'Los tonos soft, hover y focus ring se derivan automáticamente.',
    'brand.swatches': 'Paleta derivada',
    'brand.contrast': 'Contraste sobre blanco',

    'type.preview':   'Muestra',

    'radius':         'Radio',
    'density':        'Densidad',

    'preview.title':  'Vista previa en vivo',
    'preview.student': 'Estudiante',
    'preview.admin':   'Admin',
    'preview.email':   'Correo',
    'preview.cert':    'Certificado',
    'preview.device.desktop': 'Escritorio',
    'preview.device.mobile':  'Móvil',
    'preview.dark':    'Oscuro',

    'tpl.applied':    'Aplicada',
    'tpl.apply':      'Aplicar',
  },
};

function useT(lang) {
  return React.useCallback((key) => (I18N[lang] || I18N.en)[key] || key, [lang]);
}

// Quick hex → relative-luminance contrast helper for the "contrast on white" pill.
function contrastRatio(hex) {
  const h = String(hex).replace('#', '');
  const x = h.length === 3 ? h.replace(/./g, c => c + c) : h.padEnd(6, '0');
  const n = parseInt(x.slice(0, 6), 16);
  const r = ((n >> 16) & 255) / 255, g = ((n >> 8) & 255) / 255, b = (n & 255) / 255;
  const lin = (c) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
  const L = 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
  return (1.0 + 0.05) / (L + 0.05); // contrast vs. white
}
function contrastGrade(ratio) {
  if (ratio >= 7) return { label: 'AAA', tone: 'success' };
  if (ratio >= 4.5) return { label: 'AA', tone: 'success' };
  if (ratio >= 3) return { label: 'AA Large', tone: 'warning' };
  return { label: 'Fail', tone: 'danger' };
}

Object.assign(window, {
  BRAND_PRESETS, BRAND_BY_ID,
  FONT_PAIRS, PAIR_BY_ID,
  RADIUS_PRESETS, DENSITIES,
  PAGE_TEMPLATES, TENANT,
  I18N, useT, contrastRatio, contrastGrade,
});
