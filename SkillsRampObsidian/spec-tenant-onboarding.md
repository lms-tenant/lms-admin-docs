---
tags: [spec, onboarding, tenants, ux]
created: 2026-06-04
type: spec
status: draft
---

# Spec: Tenant Onboarding Flow

> For: teachers, academies, and organizations creating their SkillsRamp school.
> Audience for this doc: Claude Code (design + implementation).

---

## Files to Edit

| File | Change |
|---|---|
| `lms-frontend/src/app/get-started/` | New wizard route — 5-step onboarding SPA |
| `lms-frontend/src/components/onboarding/` | New components: `OnboardingShell`, `StepAccount`, `StepOrganization`, `StepPlan`, `StepPersonalize`, `StepWelcome`, `PlanCard`, `SubdomainInput` |
| `lms-frontend/src/hooks/useOnboarding.ts` | Wizard state hook — persists draft to `sessionStorage` |
| `lms-backend/src/routes/tenants.ts` | Add `POST /api/tenants/onboard` — atomic tenant creation endpoint |
| `lms-backend/src/controllers/tenants/onboard.ts` | New controller — creates user + tenant + subscription in one transaction |
| `lms-backend/src/routes/public.ts` | Add `GET /api/plans/public` — returns active plans for the wizard (no auth required) |
| `lms-backend/src/services/email/` | New `sendTenantWelcomeEmail()` trigger on successful onboarding |
| `lms-frontend/src/app/get-started/layout.tsx` | Minimal layout — no main navbar, no footer |

---

## Overview

A 5-step wizard that takes a new creator from first landing to a ready-to-use admin dashboard. The goal is to collect only what's necessary to create a working tenant account, then get out of the way.

**Design principles:**
1. **One job per step** — never ask for more than one category of info per screen
2. **Progressive disclosure** — show plan details only when the user reaches step 3
3. **Skip-friendly** — step 4 (personalize) is fully optional with a visible "Skip" link
4. **No credit card upfront** — Starter plan requires no payment to start
5. **Value framing on the left** — the left panel reinforces what the creator gains, not what they're filling in
6. **Auto-save draft** — if the user closes mid-flow, resume from where they left off

---

## Entry Points

| Source | URL |
|---|---|
| Main marketing CTA | `/get-started` |
| Plan selection landing | `/get-started?plan=active` (pre-selects a plan at step 3) |
| Direct link from pricing page | `/get-started?plan=pro` |

---

## Step Flow

```
/get-started
    │
    ├── Step 1: Account         → name, email, password (or Google)
    ├── Step 2: Organization    → org name, type, subdomain
    ├── Step 3: Choose Plan     → Starter / Active / Pro / Enterprise
    ├── Step 4: Personalize     → logo + brand color (optional, skippable)
    └── Step 5: Welcome         → success + first 3 actions checklist
```

Progress bar shown in the right panel header, e.g. `Paso 1 de 4` (step 4 is hidden if skipped).

---

## Left Panel — Value Prop per Step

The left panel content changes per step to stay relevant.

| Step | Headline | Subtext | Visual |
|---|---|---|---|
| 1 | "Creá tu escuela online en minutos" | "Más de 2,400 creadores ya venden sus cursos con SkillsRamp." | Floating creator dashboard screenshot |
| 2 | "Tu marca, tu espacio" | "Subdominio propio, logo y colores. Tu escuela, sin rastro nuestro." | Subdomain URL animation |
| 3 | "Empezá gratis. Escalá cuando quieras." | "Sin tarjeta de crédito para el plan Starter. Cambiá de plan en cualquier momento." | Plan upgrade path diagram |
| 4 | "Primera impresión que vende" | "Los creadores con logo y color de marca tienen 40% más conversión en su tienda." | Before/after branding comparison |
| 5 | "¡Tu escuela está lista!" | "Te enviamos un email con todo lo que necesitás para empezar." | Confetti + dashboard preview |

---

## Step 1 — Account

```
┌──────────────────────────┬──────────────────────────────────────────┐
│                          │                          ¿Ya tenés cuenta? │
│  CREÁ TU ESCUELA         │                               Ingresá →   │
│  ONLINE EN MINUTOS       │                                           │
│                          │  ── Paso 1 de 4 ──────────────────────── │
│  Más de 2,400 creadores  │                                           │
│  ya venden sus cursos    │  + GRATIS PARA EMPEZAR                    │
│  con SkillsRamp.         │                                           │
│                          │  Creá tu cuenta                           │
│  ┌─────────────────────┐ │  ¿Ya tenés una? Iniciá sesión             │
│  │ ▶  Mi último curso  │ │                                           │
│  │    Lección 4 · 12min│ │  ┌──────────────────────────────────────┐ │
│  │  ██████░░ 68%       │ │  │ G   Continuar con Google             │ │
│  └─────────────────────┘ │  └──────────────────────────────────────┘ │
│                          │                                           │
│  🔥 312 nuevas escuelas  │               ── O CON TU EMAIL ──        │
│     este mes             │                                           │
│                          │   Nombre *          Apellido *            │
│                          │  ┌─────────────┐  ┌─────────────────────┐ │
│  "Increíble herramienta, │  │ Juan        │  │ García              │ │
│  mis ingresos crecieron  │  └─────────────┘  └─────────────────────┘ │
│  3x en 6 meses."         │                                           │
│  — Ana López,            │   Email *                                 │
│    Instructora de Yoga   │  ┌──────────────────────────────────────┐ │
│                          │  │ tu@email.com                         │ │
│  ★★★★★ 4.9 · 2.4K reseñas│  └──────────────────────────────────────┘ │
│                          │                                           │
│                          │   Contraseña *                            │
│                          │  ┌──────────────────────────────────────┐ │
│                          │  │ Mínimo 8 caracteres             👁    │ │
│                          │  └──────────────────────────────────────┘ │
│                          │   ▓▓▓▓░░░░  Regular                      │
│                          │                                           │
│                          │  ☐ Acepto los Términos y Política de      │
│                          │    privacidad.                            │
│                          │                                           │
│                          │  ┌──────────────────────────────────────┐ │
│                          │  │         Continuar →                  │ │
│                          │  └──────────────────────────────────────┘ │
│                          │                                           │
│                          │  🔒 CONEXIÓN CIFRADA                      │
└──────────────────────────┴──────────────────────────────────────────┘
```

**Fields:**
- `firstName` (required)
- `lastName` (required)
- `email` (required, unique validation via `GET /api/auth/check-email`)
- `password` (required, min 8 chars, strength meter)
- `acceptTerms` (required checkbox)
- `Continue with Google` (OAuth — skips to step 2 with Google profile pre-filled)

**Validation:**
- Email uniqueness check is debounced 400ms — inline error if already registered
- Password strength meter: 4 segments (Muy débil / Débil / Regular / Fuerte)
- Clicking "Continuar" with invalid fields shakes the form and highlights errors inline

---

## Step 2 — Organization

```
┌──────────────────────────┬──────────────────────────────────────────┐
│                          │               ── Paso 2 de 4 ──          │
│  TU MARCA,               │                                           │
│  TU ESPACIO              │  Contanos sobre tu escuela                │
│                          │  Este es el nombre que verán tus alumnos  │
│  Subdominio propio,      │                                           │
│  logo y colores.         │   Nombre de tu escuela *                  │
│  Tu escuela, sin         │  ┌──────────────────────────────────────┐ │
│  rastro nuestro.         │  │ Academia de Yoga con Ana              │ │
│                          │  └──────────────────────────────────────┘ │
│                          │                                           │
│  ┌──────────────────┐    │   Tipo de organización *                  │
│  │  academy.skills  │    │  ┌──────────────────────────────────────┐ │
│  │  ramp.com        │    │  │ ○ Instructor / Docente independiente  │ │
│  │                  │    │  │ ● Academia o escuela                  │ │
│  │  Tu URL lista    │    │  │ ○ Empresa / Corporativo               │ │
│  │  en segundos     │    │  │ ○ ONG / Institución educativa         │ │
│  └──────────────────┘    │  └──────────────────────────────────────┘ │
│                          │                                           │
│                          │   Subdominio *                            │
│                          │  ┌──────────────────────┐ .skillsramp.com │
│                          │  │ academia-yoga-ana    │ ✅ Disponible    │
│                          │  └──────────────────────┘                 │
│                          │  Sugerencias: academia-yoga · yoga-ana    │
│                          │                                           │
│                          │  ┌──────────────────────────────────────┐ │
│                          │  │         Continuar →                  │ │
│                          │  └──────────────────────────────────────┘ │
│                          │  ← Volver                                 │
└──────────────────────────┴──────────────────────────────────────────┘
```

**Fields:**
- `organizationName` (required, 3–80 chars)
- `organizationType` (required radio): `individual` | `academy` | `company` | `ngo`
- `subdomain` (required, 3–30 chars, lowercase + hyphens only)
  - Auto-generated from `organizationName` (slugified, max 20 chars)
  - User can edit manually
  - Availability checked via `GET /api/tenants/check-subdomain?slug=X` (debounced 400ms)
  - Shows: ✅ Disponible / ❌ Ya está en uso / 🔄 checking...
  - Suggestions: 3 auto-generated alternatives shown below if slug is taken

**Subdomain rules:**
- Lowercase alphanumeric + hyphens only
- Cannot start or end with a hyphen
- Min 3, max 30 characters
- Reserved slugs blocked: `www`, `app`, `admin`, `api`, `mail`, `support`, `help`, `static`, `assets`

---

## Step 3 — Choose Plan

```
┌──────────────────────────┬──────────────────────────────────────────┐
│                          │               ── Paso 3 de 4 ──          │
│  EMPEZÁ GRATIS.          │                                           │
│  ESCALÁ CUANDO           │  Elegí tu plan                            │
│  QUIERAS.                │  Podés cambiar en cualquier momento.       │
│                          │                                           │
│  Sin tarjeta de crédito  │  ┌────────────┐ ┌────────────┐ ┌────────┐ │
│  para el plan Starter.   │  │  STARTER   │ │  ACTIVE ★  │ │  PRO   │ │
│  Cambiá de plan en       │  │            │ │ MÁS POPULAR│ │        │ │
│  cualquier momento.      │  │  $0/mes    │ │  $79/mes   │ │$149/mes│ │
│                          │  │  + 8% por  │ │  + 2%      │ │+ 0.5%  │ │
│                          │  │  venta     │ │  por venta │ │ x venta│ │
│                          │  │            │ │            │ │        │ │
│                          │  │ ✓ 2 cursos │ │ ✓ 20 cursos│ │✓ ∞ cur.│ │
│                          │  │ ✓ 20 alum. │ │ ✓ 500 alum.│ │✓ ∞ al. │ │
│                          │  │ ✓ 5 GB     │ │ ✓ 50 GB    │ │✓ 200 GB│ │
│                          │  │ ✗ Dominio  │ │ ✓ Dominio  │ │✓ Domin.│ │
│                          │  │   propio   │ │   propio   │ │ propio │ │
│                          │  │ ✗ White    │ │ ✗ White    │ │✓ White │ │
│                          │  │   label    │ │   label    │ │ label  │ │
│                          │  │            │ │            │ │        │ │
│                          │  │ [ Elegir ] │ │[ Elegir ★ ]│ │[Elegir]│ │
│                          │  └────────────┘ └────────────┘ └────────┘ │
│                          │                                           │
│                          │  Enterprise — a medida para instituciones  │
│                          │  con +500 alumnos. [ Contactar ventas → ] │
│                          │                                           │
│                          │  ← Volver                                 │
└──────────────────────────┴──────────────────────────────────────────┘
```

**Plan data source:** `GET /api/plans/public` — returns active plans sorted by `sortOrder`.

**Plan card content:**
- Plan name + badge ("MÁS POPULAR" on Active)
- `monthlyFee` / month (bold, large)
- Commission rate: "+ X% por venta" (grayed subtext)
- Feature list: derived from `limits` + `features` fields of `SubscriptionPlan`
- CTA button: "Elegir" (outlined for non-highlighted, filled purple for the recommended plan)

**Plan card states:**
- Default: neutral card with dark border
- Highlighted (Active): purple border, "MÁS POPULAR" badge
- Selected: purple fill on card border + checkmark icon top-right
- Enterprise: text-only row below the 3 cards, links to a contact form / Calendly

**Feature row logic:**
- Each row shows ✓ (included) or ✗ (not included) with the feature name
- Rows with limits show the limit value: "✓ 20 cursos", "✓ 500 alumnos", "✓ 50 GB"
- Features rendered from the plan's `features` + `limits` JSON — not hardcoded in the UI

**If URL param `?plan=X` is present:** pre-select that plan card on load.

---

## Step 4 — Personalize (Optional)

```
┌──────────────────────────┬──────────────────────────────────────────┐
│                          │               ── Paso 4 de 4 ──          │
│  PRIMERA IMPRESIÓN       │                                           │
│  QUE VENDE               │  Personalizá tu escuela                   │
│                          │  Podés hacerlo también desde el panel.    │
│  Los creadores con logo  │                                  [Omitir →]│
│  y color de marca tienen │                                           │
│  40% más conversión.     │   Logo de tu escuela                      │
│                          │  ┌──────────────────────────────────────┐ │
│  ANTES          DESPUÉS  │  │                                      │ │
│  ┌──────────┐ ┌────────┐ │  │   ┌────────────────────┐             │ │
│  │SkillsRamp│ │ TU LOGO│ │  │   │   + Subir logo      │             │ │
│  │ default  │ │ aquí   │ │  │   │  PNG o SVG, máx 2MB │             │ │
│  └──────────┘ └────────┘ │  │   └────────────────────┘             │ │
│                          │  └──────────────────────────────────────┘ │
│                          │                                           │
│                          │   Color principal                         │
│                          │   ┌───┐ ┌───┐ ┌───┐ ┌───┐ ┌───┐ ┌───┐  │ │
│                          │   │   │ │   │ │   │ │   │ │   │ │ # │  │ │
│                          │   │███│ │███│ │███│ │███│ │███│ │   │  │ │
│                          │   └───┘ └───┘ └───┘ └───┘ └───┘ └───┘  │ │
│                          │   (6 preset swatches + custom hex input) │ │
│                          │                                           │
│                          │   Vista previa                            │
│                          │  ┌──────────────────────────────────────┐ │
│                          │  │ [LOGO]  Mi Escuela      Ver tienda →  │ │
│                          │  │         POWERED BY SKILLSRAMP         │ │
│                          │  └──────────────────────────────────────┘ │
│                          │                                           │
│                          │  ┌──────────────────────────────────────┐ │
│                          │  │       Guardar y continuar →          │ │
│                          │  └──────────────────────────────────────┘ │
│                          │  ← Volver                                 │
└──────────────────────────┴──────────────────────────────────────────┘
```

**Fields:**
- `logoUrl` (optional) — file upload, max 2MB, PNG/SVG/JPEG, stored in tenant's media bucket
- `primaryColor` (optional, default `#7C3AED`) — 6 preset swatches + custom hex input
  - Presets: Violet `#7C3AED`, Blue `#2563EB`, Emerald `#059669`, Orange `#EA580C`, Rose `#E11D48`, Slate `#475569`

**Live preview:**
- A mini navbar mockup below the color picker updates in real time with the chosen logo + color
- No network call needed — pure CSS variable update

**"Omitir"** button top-right skips directly to step 5 without saving changes. Logo and color can be changed anytime from `Admin → Settings → Branding`.

---

## Step 5 — Welcome

```
┌──────────────────────────┬──────────────────────────────────────────┐
│                          │                                           │
│  🎉  ¡LISTO!             │       ✅                                  │
│                          │                                           │
│  Tu escuela está         │  ¡Tu escuela está lista!                  │
│  online en:              │                                           │
│                          │  academia-yoga-ana.skillsramp.com         │
│  academia-yoga-ana       │  [ Copiar enlace ]   [ Ver mi tienda ]    │
│  .skillsramp.com         │                                           │
│                          │  ─────────────────────────────────────── │
│  Comparte el link con    │                                           │
│  tus primeros alumnos.   │  Primeros pasos                           │
│                          │                                           │
│                          │  ☐  1. Creá tu primer curso               │
│                          │        Subí una clase y publicala en 5 min│
│                          │        [ Crear curso → ]                  │
│                          │                                           │
│                          │  ☐  2. Configurá tu tienda                │
│                          │        Poné precio y publicá tu curso     │
│                          │        [ Ir a la tienda → ]               │
│                          │                                           │
│                          │  ☐  3. Personalizá tu marca               │
│                          │        Logo, colores y dominio propio     │
│                          │        [ Ir a ajustes → ]                 │
│                          │                                           │
│                          │  ┌──────────────────────────────────────┐ │
│                          │  │       Ir a mi panel →                │ │
│                          │  └──────────────────────────────────────┘ │
│                          │                                           │
│                          │  Te enviamos un email a tu@email.com      │
│                          │  con todo para empezar.                   │
└──────────────────────────┴──────────────────────────────────────────┘
```

**Actions:**
- `[ Copiar enlace ]` — copies `{subdomain}.skillsramp.com` to clipboard, shows ✅ tooltip
- `[ Ver mi tienda ]` — opens tenant store in new tab
- Checklist items each link to the relevant admin section (course builder, store, settings)
- `[ Ir a mi panel → ]` — redirects to `{tenantAdminUrl}/dashboard` (sets auth cookie first)
- The checklist state is saved as a `TenantOnboardingProgress` record and appears again in the admin dashboard until all 3 are completed

---

## Data Model

### `TenantOnboardingProgress` (new entity)

```typescript
{
  id: uuid
  tenantId: uuid

  // Checklist completion
  createdFirstCourse: boolean    // default: false
  configuredStore: boolean       // default: false
  personalizedBrand: boolean     // default: false

  // Wizard tracking
  completedAt: Date | null
  skippedPersonalize: boolean    // default: false

  createdAt: Date
}
```

### Wizard draft (client-side, `sessionStorage`)

```typescript
{
  step: 1 | 2 | 3 | 4 | 5
  account: {
    firstName: string
    lastName: string
    email: string
    password: string             // cleared after submit
    googleToken?: string
  }
  organization: {
    name: string
    type: 'individual' | 'academy' | 'company' | 'ngo'
    subdomain: string
  }
  plan: {
    slug: string                 // 'starter' | 'active' | 'pro' | 'enterprise'
    planId: string               // UUID from /api/plans/public
  }
  personalize: {
    logoUrl?: string
    primaryColor?: string
  }
}
```

Password is cleared from `sessionStorage` immediately after the `POST /api/tenants/onboard` call completes.

---

## API Endpoints

### `GET /api/plans/public`

No auth required. Returns active plans for the wizard.

```typescript
// Response
{
  plans: Array<{
    id: uuid
    name: string
    slug: string
    monthlyFee: number | null
    commissionRate: number | null
    features: PlanFeatures
    limits: PlanLimits
    isRecommended: boolean       // true for the "Active" plan
    sortOrder: number
  }>
}
```

### `GET /api/tenants/check-subdomain`

No auth required. Called on every keystroke (debounced 400ms).

```
GET /api/tenants/check-subdomain?slug=academia-yoga-ana

Response: { available: true }
Response: { available: false, suggestions: ['academia-yoga', 'yoga-ana', 'academia-yoga-2'] }
```

### `POST /api/tenants/onboard`

No auth required (public registration). Atomic — creates everything or nothing.

```typescript
// Request
{
  account: {
    firstName: string
    lastName: string
    email: string
    password?: string            // omitted when using Google OAuth
    googleToken?: string         // omitted when using email/password
    acceptedTerms: true          // required
  }
  organization: {
    name: string
    type: 'individual' | 'academy' | 'company' | 'ngo'
    subdomain: string
  }
  plan: {
    planId: uuid
  }
  personalize?: {
    primaryColor?: string        // hex, e.g. '#7C3AED'
  }
}

// Response — success
{
  tenantId: uuid
  adminUrl: string               // e.g. 'https://academia-yoga-ana.skillsramp.com/admin'
  authToken: string              // JWT for the new admin user — auto-logs them in
  subdomain: string
}

// Response — error
{
  error: 'email_taken' | 'subdomain_taken' | 'invalid_plan' | 'validation_error'
  message: string
  field?: string                 // which field caused the error
}
```

**Server-side transaction steps:**
1. Validate all fields (email unique, subdomain unique, planId exists and is active)
2. Hash password (bcrypt, salt rounds 12)
3. Create `User` record (`role: 'admin'`)
4. Create `Tenant` record (`slug: subdomain`, `primaryColor`, `status: 'active'`)
5. Create `TenantUser` join record linking user to tenant as owner
6. Create `TenantSubscription` record for chosen plan
7. Create `TenantOnboardingProgress` record
8. Fire-and-forget: `sendTenantWelcomeEmail(user.email, { tenantName, adminUrl, subdomain })`
9. Return JWT + adminUrl

---

## Logo Upload Flow

Logo upload is a **separate call** from the main onboarding submit, done on step 4:

```
POST /api/tenants/:tenantId/onboarding/logo
Content-Type: multipart/form-data

Response: { logoUrl: string }
```

The `tenantId` is available because step 1 sets a temporary `pendingTenantId` (or logo is uploaded after the `POST /api/tenants/onboard` call using the returned `tenantId`).

**Implementation note:** Logo upload in step 4 should happen **after** the main `POST /api/tenants/onboard` call on submit, not during the step preview. This avoids orphaned uploads if the user abandons the wizard.

---

## Email: Tenant Welcome

Sent after successful onboarding. Uses the existing `SendGrid` integration.

```
Subject: "¡Tu escuela {tenantName} ya está online! 🎉"

Body:
  - Link to admin panel
  - Subdomain URL
  - 3 first steps (same as the welcome screen checklist)
  - Link to documentation / help center
  - Contact support link
```

---

## Routing & Navigation

| Route | Page |
|---|---|
| `/get-started` | Wizard — defaults to step 1 |
| `/get-started?plan=active` | Wizard — step 1, with plan pre-selected for step 3 |
| `/get-started?step=2` | Wizard — resumes from `sessionStorage` draft (if exists) |

- Browser Back button navigates to previous step (not to previous page) — override with `router.beforeEach` or `onpopstate`
- Refreshing on any step restores from `sessionStorage` draft
- If the user has already completed onboarding and hits `/get-started`, redirect to their admin dashboard

---

## Google OAuth flow

1. User clicks "Continuar con Google" on step 1
2. Redirect to Google OAuth → Google returns `googleToken` to `/get-started?token=X&step=2`
3. Pre-fill `firstName`, `lastName`, `email` from the Google profile
4. Fields are shown as read-only with a "✏️ Editar" option
5. Password field is hidden — Google token is used instead
6. Flow continues normally from step 2

---

## State Management

```typescript
// useOnboarding.ts
interface OnboardingState {
  currentStep: 1 | 2 | 3 | 4 | 5
  draft: WizardDraft
  isSubmitting: boolean
  errors: Record<string, string>
}

// Actions
goNext()          // validate current step then advance
goBack()          // go to previous step (no validation)
updateDraft()     // update a field in draft + sync to sessionStorage
submit()          // fire POST /api/tenants/onboard
skipPersonalize() // jump from step 4 to step 5 without saving personalize data
```

The `draft` object is serialized to `sessionStorage` on every `updateDraft()` call. On mount, `useOnboarding` reads from `sessionStorage` and restores the last saved state.

---

## Component Structure

```
app/get-started/
├── page.tsx                     ← mounts <OnboardingWizard />
├── layout.tsx                   ← minimal layout (no nav)
└── _components/
    ├── OnboardingWizard.tsx      ← root, reads currentStep, renders correct step
    ├── OnboardingShell.tsx       ← split layout (left panel + right panel)
    ├── LeftPanel.tsx             ← value prop per step (receives step prop)
    ├── ProgressBar.tsx           ← "Paso X de Y" + thin progress bar
    ├── StepAccount.tsx           ← step 1 form
    ├── StepOrganization.tsx      ← step 2 form + subdomain checker
    ├── StepPlan.tsx              ← step 3 plan cards
    ├── PlanCard.tsx              ← single plan card (used by StepPlan)
    ├── StepPersonalize.tsx       ← step 4 logo + color picker
    ├── BrandPreview.tsx          ← live navbar preview (used by StepPersonalize)
    └── StepWelcome.tsx           ← step 5 success + checklist
```

---

## Design Tokens (matches existing student register page)

```css
/* Reuse existing CSS variables from lms-frontend */
--sr-bg: #0A0A0A                  /* page background */
--sr-surface: #141414             /* card/input surface */
--sr-border-input: #2A2A2A        /* input border default */
--sr-border-input-focus: #7C3AED  /* input border on focus */
--sr-ink-1: #FFFFFF               /* primary text */
--sr-ink-2: #A0A0A0               /* secondary text */
--sr-primary: #7C3AED             /* violet-600 — brand */
--sr-primary-hover: #6D28D9       /* violet-700 */
--sr-ctl-h: 44px                  /* input height */
--sr-r-md: 8px                    /* border radius */

/* Left panel */
--sr-left-bg-from: #4F1F9E        /* gradient start */
--sr-left-bg-to: #1E0B4E          /* gradient end */
```

Left panel: `background: linear-gradient(160deg, var(--sr-left-bg-from) 0%, var(--sr-left-bg-to) 100%)`

---

## Acceptance Criteria

- [ ] Wizard renders at `/get-started` with a split layout matching the design tokens above
- [ ] Step 1: email uniqueness validated inline (debounced, no submit required to see error)
- [ ] Step 1: Google OAuth pre-fills name and email and skips the password field
- [ ] Step 2: subdomain is auto-generated from org name on blur of the org name field
- [ ] Step 2: subdomain availability checked in real time (debounced 400ms) — shows ✅ / ❌ / 🔄
- [ ] Step 2: reserved slugs (`www`, `app`, `admin`, etc.) are blocked with a clear error
- [ ] Step 3: plans loaded from `GET /api/plans/public` — no hardcoded plan data in the component
- [ ] Step 3: `?plan=X` query param pre-selects the correct plan card
- [ ] Step 3: Enterprise card is a contact link, not a selectable plan card
- [ ] Step 4: live preview updates immediately when logo or color changes
- [ ] Step 4: "Omitir" skips to step 5 without making any API call
- [ ] Step 5: subdomain URL has a working "Copiar" button with clipboard feedback
- [ ] Wizard draft is preserved on page refresh (restored from `sessionStorage`)
- [ ] Browser back button navigates to previous step, not previous URL
- [ ] `POST /api/tenants/onboard` is atomic — if any step fails, no partial records are created
- [ ] Welcome email is sent after successful onboarding
- [ ] The `authToken` returned from onboard auto-authenticates the user into the admin panel
- [ ] `TenantOnboardingProgress` checklist items update when the tenant completes each action

---

## Open Questions

| # | Question | Recommendation |
|---|---|---|
| 1 | Should "Enterprise" open a Calendly link, a contact form, or an email `mailto:`? | Contact form modal is cleanest — collects name, email, org size, needs |
| 2 | Do we allow multiple admin users during onboarding or only one owner? | One owner only at onboarding. Multi-admin is a post-onboarding setting |
| 3 | Should the subdomain be editable after onboarding? | No — subdomains are permanent once set (affects indexed URLs). Show a clear "this cannot be changed" warning |
| 4 | Should we verify email before allowing access to the admin panel? | Send verification email but don't block access — allow 7-day grace period |
| 5 | What happens if the user completes step 3 and closes the tab before step 5? | The `sessionStorage` draft persists. On return, they resume from step 3. The tenant record is only created on final submit |
| 6 | Should we show an A/B test variant with the plan step moved to step 2 (before org details)? | Out of scope for MVP — add as a future experiment flag |

---

## References

- [[spec-plan-billing-features.md]] — `SubscriptionPlan` entity + `PlanFeature` enum
- [[pricing-strategy.md]] — Hypothesis A/B pricing structure
- [[revenue-projections.md]] — plan pricing and GMV assumptions
- `lms-frontend/src/pages/auth/register/index.tsx` — existing student register (design base)
- `lms-frontend/src/components/layouts/AuthShell.tsx` — existing split layout shell
- `lms-backend/src/entities/tenants/subscriptionPlan.ts` — plan entity with features + limits
