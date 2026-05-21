// data.jsx — mock data for the notifications page + i18n.

// ─── Notifications history (mock) ────────────────────────────
const NOTIFICATIONS = [
  {
    id: 'n_1290', status: 'sent', sentAt: '2026-05-20T14:32:00Z', label: '2 hours ago',
    title: 'Live session reminder: Office hours start in 1 hour',
    body: 'Hola {{firstName}}, recordatorio que nuestra sesión de oficina para «{{courseName}}» empieza a las 15:00 hora de Acme.',
    audience: { kind: 'course', label: 'Advanced React Patterns', sub: 'Spring 2026 cohort' },
    channels: ['in-app', 'email'],
    recipients: 312, delivered: 309, openInApp: 207, openEmail: 234, clicks: 184, failed: 3,
    sentBy: { name: 'Marcus Lee', role: 'Admin' },
  },
  {
    id: 'n_1289', status: 'sent', sentAt: '2026-05-20T09:00:00Z', label: '7 hours ago',
    title: 'Weekly digest — your progress + new lessons',
    body: 'Hola {{firstName}}, esta semana se publicaron 3 lecciones nuevas en cursos que estás siguiendo…',
    audience: { kind: 'all', label: 'All active students', sub: '1,284 students' },
    channels: ['email'],
    recipients: 1284, delivered: 1247, openInApp: 0, openEmail: 947, clicks: 234, failed: 37,
    sentBy: { name: 'Aisha Bello', role: 'SuperAdmin' },
  },
  {
    id: 'n_1288', status: 'scheduled', sentAt: '2026-05-22T09:00:00Z', label: 'In 2 days · Fri 09:00',
    title: 'Q2 satisfaction survey — 3 minutes',
    body: 'Estamos preparando el plan del próximo trimestre. ¿Nos das 3 minutos para entender qué funciona y qué no?',
    audience: { kind: 'segment', label: 'Active in last 30 days', sub: 'Auto-segment · 928 students' },
    channels: ['in-app', 'email'],
    recipients: 928, delivered: 0, openInApp: 0, openEmail: 0, clicks: 0, failed: 0,
    sentBy: { name: 'Marcus Lee', role: 'Admin' },
  },
  {
    id: 'n_1287', status: 'sent', sentAt: '2026-05-19T18:14:00Z', label: 'Yesterday',
    title: 'New course published: Design Systems in Practice',
    body: 'Acabamos de publicar un curso nuevo que te puede interesar según tu historial.',
    audience: { kind: 'segment', label: 'Completed: Intro to React', sub: '187 students' },
    channels: ['in-app', 'email'],
    recipients: 187, delivered: 187, openInApp: 156, openEmail: 142, clicks: 68, failed: 0,
    sentBy: { name: 'Camila Rojas', role: 'Admin' },
  },
  {
    id: 'n_1286', status: 'sent', sentAt: '2026-05-19T12:01:00Z', label: 'Yesterday',
    title: 'Payment failed — please update your method',
    body: 'No pudimos procesar el pago para tu suscripción. Actualiza tu método de pago para no perder acceso a {{courseName}}.',
    audience: { kind: 'individual', label: '6 individual recipients', sub: 'Tomáš · Priya · +4' },
    channels: ['email'],
    recipients: 6, delivered: 6, openInApp: 0, openEmail: 5, clicks: 3, failed: 0,
    sentBy: { name: 'System · Billing', role: 'System' },
  },
  {
    id: 'n_1285', status: 'failed', sentAt: '2026-05-19T08:42:00Z', label: 'Yesterday',
    title: 'Welcome to Acme University · onboarding',
    body: 'Te damos la bienvenida a Acme University. Estos son tus primeros pasos…',
    audience: { kind: 'role', label: 'Role: Student', sub: 'New this week · 24 students' },
    channels: ['in-app', 'email'],
    recipients: 24, delivered: 0, openInApp: 0, openEmail: 0, clicks: 0, failed: 24,
    sentBy: { name: 'Marcus Lee', role: 'Admin' },
    error: 'Email provider rejected sender domain · DKIM not configured',
  },
  {
    id: 'n_1284', status: 'sent', sentAt: '2026-05-18T16:25:00Z', label: '3 days ago',
    title: 'Module 3 of «{{courseName}}» now available',
    body: 'Suspense & data ya está disponible. Tu última actividad fue hace {{daysSince}} días.',
    audience: { kind: 'cohort', label: 'Cohort: Spring 2026', sub: '312 students' },
    channels: ['in-app'],
    recipients: 312, delivered: 312, openInApp: 264, openEmail: 0, clicks: 198, failed: 0,
    sentBy: { name: 'Camila Rojas', role: 'Admin' },
  },
  {
    id: 'n_1283', status: 'draft', sentAt: null, label: 'Saved 2 days ago',
    title: 'Cohort applications close in 48 hours',
    body: '',
    audience: { kind: 'all', label: 'All students', sub: '' },
    channels: ['email'],
    recipients: 0, delivered: 0, openInApp: 0, openEmail: 0, clicks: 0, failed: 0,
    sentBy: { name: 'Marcus Lee', role: 'Admin' },
  },
  {
    id: 'n_1282', status: 'sent', sentAt: '2026-05-17T10:00:00Z', label: '4 days ago',
    title: 'Maintenance window scheduled — Sunday 02:00 UTC',
    body: 'Vamos a hacer mantenimiento programado por ~30 minutos. No deberías notar interrupciones.',
    audience: { kind: 'all', label: 'All users', sub: '1,612 across roles' },
    channels: ['in-app', 'email'],
    recipients: 1612, delivered: 1601, openInApp: 1042, openEmail: 1187, clicks: 0, failed: 11,
    sentBy: { name: 'Aisha Bello', role: 'SuperAdmin' },
  },
];

// ─── Per-recipient mock for the selected notification ────────
const RECIPIENTS = [
  { name: 'Camila Rojas',    email: 'camila@acme.edu',    inApp: 'opened',     email_s: 'opened',     clicked: true,  device: 'iPhone 15' },
  { name: 'Marcus Lee',      email: 'marcus@acme.edu',    inApp: 'opened',     email_s: 'opened',     clicked: true,  device: 'macOS · Chrome' },
  { name: 'Priya Sharma',    email: 'priya@acme.edu',     inApp: 'delivered',  email_s: 'opened',     clicked: false, device: 'Android' },
  { name: 'Diego Fernández', email: 'diego@acme.edu',     inApp: 'opened',     email_s: 'opened',     clicked: true,  device: 'iPad' },
  { name: 'Aisha Bello',     email: 'aisha@acme.edu',     inApp: 'opened',     email_s: 'delivered',  clicked: false, device: 'macOS · Safari' },
  { name: 'Tomáš Novák',     email: 'tomas@acme.edu',     inApp: 'delivered',  email_s: 'failed',     clicked: false, device: '—' },
  { name: 'Yuki Tanaka',     email: 'yuki@acme.edu',      inApp: 'opened',     email_s: 'opened',     clicked: true,  device: 'iPhone 14' },
  { name: 'Lucas Müller',    email: 'lucas@acme.edu',     inApp: 'opened',     email_s: 'opened',     clicked: false, device: 'Windows · Edge' },
  { name: 'Sofia Castro',    email: 'sofia@acme.edu',     inApp: 'delivered',  email_s: 'opened',     clicked: true,  device: 'iPhone 13' },
  { name: 'Henrik Olsen',    email: 'henrik@acme.edu',    inApp: 'opened',     email_s: 'opened',     clicked: true,  device: 'macOS · Firefox' },
  { name: 'Ana Vega',        email: 'ana@acme.edu',       inApp: 'delivered',  email_s: 'delivered',  clicked: false, device: 'Android' },
  { name: 'Omar Khan',       email: 'omar@acme.edu',      inApp: 'opened',     email_s: 'bounced',    clicked: false, device: 'macOS · Chrome' },
];

// ─── Courses, cohorts, segments, audiences for the picker ────
const COURSES = [
  { id: 'c1', name: 'Advanced React Patterns',     students: 312, color: '270 0.16 0.55' },
  { id: 'c2', name: 'Design Systems in Practice',  students: 187, color: '20 0.18 0.56' },
  { id: 'c3', name: 'SQL for Course Operators',    students: 96,  color: '165 0.13 0.58' },
  { id: 'c4', name: 'Roadmapping for Tenants',     students: 64,  color: '75 0.15 0.7'  },
  { id: 'c5', name: 'Intro to React',              students: 412, color: '235 0.14 0.62' },
];

const COHORTS = [
  { id: 'h1', name: 'Spring 2026',     students: 312, status: 'active' },
  { id: 'h2', name: 'Summer 2026',     students: 0,   status: 'upcoming' },
  { id: 'h3', name: 'Winter 2025',     students: 264, status: 'completed' },
];

const ROLES = [
  { id: 'student',    name: 'Student',    count: 1284 },
  { id: 'admin',      name: 'Admin',      count: 28 },
  { id: 'superadmin', name: 'SuperAdmin', count: 4 },
];

const SEGMENTS = [
  { id: 'active_30',  name: 'Active in last 30 days',  count: 928, auto: true },
  { id: 'idle_30',    name: 'Inactive 30+ days',       count: 187, auto: true },
  { id: 'never',      name: 'Never logged in',         count: 42,  auto: true },
  { id: 'completed_intro', name: 'Completed: Intro to React', count: 187, auto: true },
  { id: 'pay_failed', name: 'Failed payment last 7 days', count: 6, auto: true },
];

const SAVED_AUDIENCES = [
  { id: 'a1', name: 'Cohort leads',          count: 18,  desc: 'Admins + senior students in each open cohort' },
  { id: 'a2', name: 'High-engagement Q2',    count: 412, desc: 'Opened ≥80% of weekly digests' },
  { id: 'a3', name: 'Re-engagement target',  count: 187, desc: 'Inactive 30d + 1+ completion' },
];

const PEOPLE = [
  { id: 'u1', name: 'Camila Rojas',    email: 'camila@acme.edu',    role: 'Student' },
  { id: 'u2', name: 'Marcus Lee',      email: 'marcus@acme.edu',    role: 'Admin' },
  { id: 'u3', name: 'Priya Sharma',    email: 'priya@acme.edu',     role: 'Student' },
  { id: 'u4', name: 'Diego Fernández', email: 'diego@acme.edu',     role: 'Student' },
  { id: 'u5', name: 'Aisha Bello',     email: 'aisha@acme.edu',     role: 'SuperAdmin' },
  { id: 'u6', name: 'Tomáš Novák',     email: 'tomas@acme.edu',     role: 'Student' },
  { id: 'u7', name: 'Yuki Tanaka',     email: 'yuki@acme.edu',      role: 'Student' },
  { id: 'u8', name: 'Lucas Müller',    email: 'lucas@acme.edu',     role: 'Student' },
];

// ─── Templates ───────────────────────────────────────────────
const TEMPLATES = [
  { id: 't1', name: 'Welcome to course',
    desc: 'Sent when a student is enrolled in a course.',
    title: 'Welcome to «{{courseName}}», {{firstName}}',
    body: 'Estamos felices de tenerte en {{courseName}}. La primera lección está disponible y la primera sesión en vivo es el {{firstLessonDate}}.',
    channels: ['in-app','email'], cta: 'Open the course',
    variables: ['firstName','courseName','firstLessonDate'], used: 142 },
  { id: 't2', name: 'Module unlocked',
    desc: 'Triggered when next module becomes available.',
    title: 'Módulo {{moduleNumber}} de «{{courseName}}» ya está disponible',
    body: '{{moduleName}} ya está listo. Tu última actividad fue hace {{daysSince}} días.',
    channels: ['in-app'], cta: 'Continue learning',
    variables: ['moduleNumber','moduleName','courseName','daysSince'], used: 287 },
  { id: 't3', name: 'Payment failed',
    desc: 'Sent when a Stripe webhook reports failure.',
    title: 'No pudimos procesar tu pago',
    body: 'Tu pago para {{courseName}} falló. Actualiza tu método antes del {{retryDate}}.',
    channels: ['email'], cta: 'Update payment method',
    variables: ['courseName','retryDate'], used: 18 },
  { id: 't4', name: 'Inactivity nudge',
    desc: 'Re-engage after 14 days of inactivity.',
    title: 'Te extrañamos, {{firstName}}',
    body: 'Hace {{daysSince}} días que no entras a {{courseName}}. Te quedan {{lessonsLeft}} lecciones para terminar.',
    channels: ['in-app','email'], cta: 'Pick up where you left off',
    variables: ['firstName','daysSince','courseName','lessonsLeft'], used: 64 },
];

// ─── Available variables ─────────────────────────────────────
const VARIABLES = [
  { token: '{{firstName}}',       sample: 'Camila' },
  { token: '{{lastName}}',        sample: 'Rojas' },
  { token: '{{email}}',           sample: 'camila@acme.edu' },
  { token: '{{tenantName}}',      sample: 'Acme University' },
  { token: '{{courseName}}',      sample: 'Advanced React Patterns' },
  { token: '{{cohortName}}',      sample: 'Spring 2026' },
  { token: '{{firstLessonDate}}', sample: 'Mon May 26' },
  { token: '{{daysSince}}',       sample: '3' },
];

// ─── i18n ────────────────────────────────────────────────────
const I18N = {
  en: {
    'app.brand': 'SkillsRamp',
    'page.crumb.parent': 'Acme University',
    'page.crumb': 'Notifications',
    'page.title': 'Notifications',
    'page.subtitle': 'Send, schedule, and audit every message that reaches students — across in-app and email.',
    'btn.compose': 'Compose',
    'btn.cancel': 'Cancel',
    'btn.close': 'Close',
    'btn.duplicate': 'Duplicate',
    'btn.resend': 'Resend',
    'btn.delete': 'Delete',
    'btn.template': 'Save as template',
    'btn.saveDraft': 'Save draft',
    'btn.scheduleBtn': 'Schedule',
    'btn.sendNow': 'Send now',
    'btn.review': 'Review',

    'tab.sent':      'Sent',
    'tab.scheduled': 'Scheduled',
    'tab.drafts':    'Drafts',
    'tab.templates': 'Templates',
    'tab.audiences': 'Audiences',

    'stats.sent':       'Sent (30 days)',
    'stats.delivered':  'Delivery rate',
    'stats.opens':      'Avg. open rate',
    'stats.clicks':     'Click-through',

    'tbl.search':      'Search by title, body, or recipient…',
    'tbl.filters':     'Filters',
    'tbl.title':       'Notification',
    'tbl.audience':    'Audience',
    'tbl.channels':    'Channels',
    'tbl.recipients':  'Recipients',
    'tbl.opens':       'Open rate',
    'tbl.sent':        'Sent',
    'tbl.by':          'By',
    'tbl.status':      'Status',

    'st.sent':       'Sent',
    'st.scheduled':  'Scheduled',
    'st.draft':      'Draft',
    'st.failed':     'Failed',

    'cmp.title':         'New notification',
    'cmp.subtitle':      'Reach the right people across the right channels.',
    'cmp.sec.audience':  'Audience',
    'cmp.sec.content':   'Content',
    'cmp.sec.channels':  'Channels',
    'cmp.sec.schedule':  'Schedule',
    'cmp.sec.preview':   'Preview',

    'aud.all':          'All students',
    'aud.course':       'By course',
    'aud.cohort':       'By cohort',
    'aud.role':         'By role',
    'aud.individual':   'Individuals',
    'aud.segment':      'Smart segment',
    'aud.saved':        'Saved audience',
    'aud.estimated':    'Estimated reach',
    'aud.placeholder':  'Pick how to target this notification.',

    'fld.title':        'Title',
    'fld.title.ph':     'e.g. Live session reminder',
    'fld.body':         'Message',
    'fld.body.ph':      'Hola {{firstName}}, ',
    'fld.body.hint':    'Markdown supported. Use variables to personalize.',
    'fld.cta':          'Call to action (optional)',
    'fld.cta.label':    'Button label',
    'fld.cta.url':      'URL',
    'fld.subject':      'Email subject (optional)',
    'fld.subject.hint': 'If empty, the title is used as the email subject.',
    'fld.variables':    'Insert variable',

    'sch.now':          'Send now',
    'sch.later':        'Schedule for later',
    'sch.date':         'Date',
    'sch.time':         'Time',
    'sch.tz':           'Timezone',

    'prev.tab.inapp':   'In-app',
    'prev.tab.email':   'Email',

    'det.recipients':   'Recipients',
    'det.delivery':     'Delivery',
    'det.engagement':   'Engagement',
    'det.perRecipient': 'Per-recipient',
    'det.message':      'Message',
    'det.channels':     'Channels',
    'det.failedDetail': 'Failure detail',
  },
  es: {
    'app.brand': 'SkillsRamp',
    'page.crumb.parent': 'Acme University',
    'page.crumb': 'Notificaciones',
    'page.title': 'Notificaciones',
    'page.subtitle': 'Envía, programa y audita cada mensaje que llega a los estudiantes — en in-app y email.',
    'btn.compose': 'Componer',
    'btn.cancel': 'Cancelar',
    'btn.close': 'Cerrar',
    'btn.duplicate': 'Duplicar',
    'btn.resend': 'Reenviar',
    'btn.delete': 'Eliminar',
    'btn.template': 'Guardar como plantilla',
    'btn.saveDraft': 'Guardar borrador',
    'btn.scheduleBtn': 'Programar',
    'btn.sendNow': 'Enviar ahora',
    'btn.review': 'Revisar',

    'tab.sent':      'Enviados',
    'tab.scheduled': 'Programados',
    'tab.drafts':    'Borradores',
    'tab.templates': 'Plantillas',
    'tab.audiences': 'Audiencias',

    'stats.sent':       'Enviados (30 días)',
    'stats.delivered':  'Tasa de entrega',
    'stats.opens':      'Apertura promedio',
    'stats.clicks':     'Clicks',

    'tbl.search':      'Buscar por título, mensaje o destinatario…',
    'tbl.filters':     'Filtros',
    'tbl.title':       'Notificación',
    'tbl.audience':    'Audiencia',
    'tbl.channels':    'Canales',
    'tbl.recipients':  'Destinatarios',
    'tbl.opens':       'Apertura',
    'tbl.sent':        'Enviado',
    'tbl.by':          'Por',
    'tbl.status':      'Estado',

    'st.sent':       'Enviado',
    'st.scheduled':  'Programado',
    'st.draft':      'Borrador',
    'st.failed':     'Falló',

    'cmp.title':         'Nueva notificación',
    'cmp.subtitle':      'Llega a las personas correctas por los canales correctos.',
    'cmp.sec.audience':  'Audiencia',
    'cmp.sec.content':   'Contenido',
    'cmp.sec.channels':  'Canales',
    'cmp.sec.schedule':  'Envío',
    'cmp.sec.preview':   'Vista previa',

    'aud.all':          'Todos los estudiantes',
    'aud.course':       'Por curso',
    'aud.cohort':       'Por cohorte',
    'aud.role':         'Por rol',
    'aud.individual':   'Individuos',
    'aud.segment':      'Segmento',
    'aud.saved':        'Audiencia guardada',
    'aud.estimated':    'Alcance estimado',
    'aud.placeholder':  'Elegí cómo segmentar esta notificación.',

    'fld.title':        'Título',
    'fld.title.ph':     'ej. Recordatorio de sesión en vivo',
    'fld.body':         'Mensaje',
    'fld.body.ph':      'Hola {{firstName}}, ',
    'fld.body.hint':    'Markdown soportado. Usá variables para personalizar.',
    'fld.cta':          'Llamado a la acción (opcional)',
    'fld.cta.label':    'Etiqueta del botón',
    'fld.cta.url':      'URL',
    'fld.subject':      'Asunto del email (opcional)',
    'fld.subject.hint': 'Si está vacío, el título se usa como asunto.',
    'fld.variables':    'Insertar variable',

    'sch.now':          'Enviar ahora',
    'sch.later':        'Programar para más tarde',
    'sch.date':         'Fecha',
    'sch.time':         'Hora',
    'sch.tz':           'Zona horaria',

    'prev.tab.inapp':   'In-app',
    'prev.tab.email':   'Email',

    'det.recipients':   'Destinatarios',
    'det.delivery':     'Entrega',
    'det.engagement':   'Engagement',
    'det.perRecipient': 'Por destinatario',
    'det.message':      'Mensaje',
    'det.channels':     'Canales',
    'det.failedDetail': 'Detalle del error',
  },
};

function useT(lang) {
  return React.useCallback((key) => (I18N[lang] || I18N.en)[key] || key, [lang]);
}

// Tiny helper: interpolate {{var}} tokens in a string with sample values from VARIABLES.
function interpolate(str) {
  if (!str) return '';
  return str.replace(/\{\{(\w+)\}\}/g, (_, k) => {
    const v = VARIABLES.find(x => x.token === '{{' + k + '}}');
    return v ? v.sample : '{{' + k + '}}';
  });
}

Object.assign(window, {
  NOTIFICATIONS, RECIPIENTS,
  COURSES, COHORTS, ROLES, SEGMENTS, SAVED_AUDIENCES, PEOPLE,
  TEMPLATES, VARIABLES,
  I18N, useT, interpolate,
});
