# Spec: Plan Billing Model & Feature Permissions System

## Overview

The platform currently has a superadmin plan editor that allows creating and managing tenant plans. This spec extends that system to support:

1. **Flexible billing per plan** — either a fixed monthly fee, a per-transaction commission, or both
2. **Plan limits** — configurable caps on students, courses, and storage per plan, with a flag to show or hide them from tenants
3. **Feature flags per plan** — a structured permission system that controls which platform features a tenant can access based on their active plan

This is the foundation for the Hypothesis B A/B test (commission-based Starter vs. fixed-fee Starter) and for tiered feature rollout.

---

## Context

- The superadmin already has a plan editor UI — we are extending it, not replacing it
- Tenants are already scoped by `tenantId` across the entire data model
- The target billing model: commission % is charged **on top of** MercadoPago fees (not in place of them) — SkillsRamp takes its cut from gross transaction value before the tenant receives funds
- Some features will be gated by plan (e.g. custom domain, advanced analytics, white-label removal, AI features)

---

## Requirements

### R1 — Billing Configuration per Plan

- [ ] Each plan can have a `monthlyFee` (fixed amount in USD, nullable)
- [ ] Each plan can have a `commissionRate` (percentage as decimal, nullable, e.g. `0.05` = 5%)
- [ ] Each plan can have a `minimumTransactionFee` (fixed amount in USD, nullable, e.g. `1.00`)
- [ ] When both `commissionRate` and `minimumTransactionFee` are set, apply whichever is **greater** per transaction
- [ ] Both can be set simultaneously (e.g. $12/month + 2% commission is valid)
- [ ] Both can be null simultaneously (e.g. a fully free internal plan)

### R2 — Plan Limits

- [ ] Each plan can define the following optional limits (all nullable = unlimited):
  - `maxStudents` — maximum active enrolled students across all courses
  - `maxCourses` — maximum published courses
  - `maxStorageGb` — maximum storage in GB for video and file uploads
- [ ] Each limit has a `limitsVisible` boolean flag — when `false`, limits are not shown to the tenant in the UI (useful for soft enforcement without displaying the cap)
- [ ] When a tenant reaches a limit, they are blocked from the action and shown an upgrade prompt
- [ ] The upgrade prompt message is configurable per plan (`upgradePromptMessage`, nullable string)

### R3 — Feature Flags per Plan

- [ ] A defined list of platform features exists as an enum/registry
- [ ] Each plan has a set of enabled features (many-to-many or JSON array)
- [ ] At runtime, tenant feature access is checked against their active plan's feature set
- [ ] Features default to **disabled** — must be explicitly enabled per plan
- [ ] Superadmin can toggle features on/off per plan from the plan editor

### R4 — Superadmin Plan Editor Extensions

- [ ] Extend the existing plan editor form to include billing fields (monthly fee, commission rate, minimum transaction fee)
- [ ] Add a limits section with toggles for each limit and a visibility flag
- [ ] Add a feature flags section with a checklist of all available features

### R5 — Tenant-Side Enforcement

- [ ] Backend middleware/service exposes `checkFeature(tenantId, feature)` — returns boolean
- [ ] Backend middleware/service exposes `checkLimit(tenantId, limitType)` — returns `{ allowed: boolean, current: number, max: number | null }`
- [ ] Frontend utility exposes `useFeatureFlag(feature)` hook — returns boolean
- [ ] Frontend utility exposes `usePlanLimit(limitType)` hook — returns limit state
- [ ] When a tenant tries to access a gated feature, show an upgrade wall component (not a 403 — a friendly UI prompt)

### R6 — Transaction Fee Deduction (Backend)

- [ ] On each successful student payment, calculate SkillsRamp's fee:
  - `fee = max(transactionAmount × commissionRate, minimumTransactionFee)`
  - If both are null, fee = 0
- [ ] Store the calculated fee in the order record (`platformFee` field)
- [ ] Do **not** block the transaction if fee calculation fails — log and alert instead
- [ ] Fee is informational for now (used for reporting) — actual deduction mechanism is out of scope for this spec

---

## Data Model Changes

### `Plan` entity — new fields

```typescript
// Add to existing Plan entity

monthlyFee: number | null          // USD, e.g. 12.00
commissionRate: number | null      // decimal, e.g. 0.05 (= 5%)
minimumTransactionFee: number | null  // USD, e.g. 1.00

maxStudents: number | null         // null = unlimited
maxCourses: number | null          // null = unlimited
maxStorageGb: number | null        // null = unlimited
limitsVisible: boolean             // default: true

features: PlanFeature[]            // relation or JSON array
upgradePromptMessage: string | null
```

### `PlanFeature` — new enum/registry

Define the full list of available features. Start with:

```typescript
enum PlanFeature {
  CUSTOM_DOMAIN        = 'custom_domain',
  WHITE_LABEL          = 'white_label',        // remove SkillsRamp branding
  ADVANCED_ANALYTICS   = 'advanced_analytics',
  AI_RECOMMENDATIONS   = 'ai_recommendations',
  CONSULTANCY_BOOKING  = 'consultancy_booking',
  PAGE_BUILDER         = 'page_builder',
  CERTIFICATES         = 'certificates',
  BULK_ENROLLMENT      = 'bulk_enrollment',
  API_ACCESS           = 'api_access',
  PRIORITY_SUPPORT     = 'priority_support',
}
```

> This list will grow — the enum is the single source of truth for all feature gates in the codebase.

### `Order` entity — new field

```typescript
platformFee: number | null   // calculated fee for this transaction, stored for reporting
```

### Migration

- Add new columns to `plans` table with nullable defaults — no breaking changes
- Add `platform_fee` column to `orders` table
- No data migration needed — existing plans get all nulls (unlimited, no billing config)

---

## API Changes

### Superadmin — Plan endpoints

**`PUT /api/platform/plans/:id`** — extend request body:

```typescript
{
  // existing fields...
  monthlyFee?: number | null,
  commissionRate?: number | null,
  minimumTransactionFee?: number | null,
  maxStudents?: number | null,
  maxCourses?: number | null,
  maxStorageGb?: number | null,
  limitsVisible?: boolean,
  features?: PlanFeature[],
  upgradePromptMessage?: string | null,
}
```

**`GET /api/platform/plans/:id`** — extend response to include all new fields.

---

### Tenant — Plan limits & features

**`GET /api/t/:tenantSlug/plan/status`** — new endpoint

Returns the tenant's current plan usage vs. limits:

```typescript
// Response
{
  plan: {
    name: string,
    monthlyFee: number | null,
    commissionRate: number | null,
  },
  limits: {
    students: { current: number, max: number | null, visible: boolean },
    courses:  { current: number, max: number | null, visible: boolean },
    storageGb: { current: number, max: number | null, visible: boolean },
  },
  features: PlanFeature[],   // list of enabled features for this tenant's plan
}
```

---

## Feature Flag System

### Backend — `PlanService`

```typescript
// New methods on PlanService (or a new FeatureGuardService)

hasFeature(tenantId: string, feature: PlanFeature): Promise<boolean>
checkLimit(tenantId: string, limit: 'students' | 'courses' | 'storage'): Promise<{
  allowed: boolean,
  current: number,
  max: number | null,
}>
```

### Backend — middleware

```typescript
// Usage in route handlers
router.post('/courses', requireFeature(PlanFeature.PAGE_BUILDER), async (req, res) => { ... })

// Or inline
const canPublish = await planService.checkLimit(tenantId, 'courses')
if (!canPublish.allowed) {
  return res.status(403).json({ code: 'PLAN_LIMIT_REACHED', limit: 'courses', ...canPublish })
}
```

### Frontend — hooks

```typescript
// useFeatureFlag.ts
const canUseAnalytics = useFeatureFlag(PlanFeature.ADVANCED_ANALYTICS)
// → true/false based on tenant's active plan

// usePlanLimit.ts
const { allowed, current, max } = usePlanLimit('courses')
// → { allowed: false, current: 2, max: 2 }
```

### Frontend — UpgradeWall component

When a tenant hits a limit or tries to access a gated feature, show a non-blocking upgrade prompt:

```
┌─────────────────────────────────────────┐
│  🔒 Esta función requiere el plan Active │
│                                         │
│  "Llegaste al límite de 2 cursos.       │
│   Actualizá para publicar más."         │
│                                         │
│  [Ver planes]        [Más tarde]        │
└─────────────────────────────────────────┘
```

- Component: `<UpgradeWall feature={PlanFeature.X} message={customMessage} />`
- Used as a wrapper or overlay — does not crash the page
- Links to the plan upgrade page

---

## Transaction Fee Calculation

On `POST /checkout/complete` (or wherever order payment is confirmed):

```typescript
function calculatePlatformFee(amount: number, plan: Plan): number {
  if (!plan.commissionRate && !plan.minimumTransactionFee) return 0

  const commissionAmount = plan.commissionRate
    ? amount * plan.commissionRate
    : 0

  const minimumFee = plan.minimumTransactionFee ?? 0

  return Math.max(commissionAmount, minimumFee)
}
```

Store result in `order.platformFee`. Surface in the superadmin revenue reports.

---

## Superadmin UI — Plan Editor Extensions

Extend the existing plan editor form with three new sections:

### Section 1 — Billing

```
Billing Model
─────────────────────────────────────────
Monthly Fee (USD)         [ _______ ]   (leave empty for $0)
Commission Rate (%)       [ _______ ]   (leave empty for no commission)
Minimum Transaction Fee   [ _______ ]   (leave empty for no minimum)

ℹ️ Commission is charged on top of MercadoPago fees.
   If both commission and minimum are set, the higher amount applies per transaction.
```

### Section 2 — Plan Limits

```
Usage Limits
─────────────────────────────────────────
Max Students     [ _______ ]   [ ] Visible to tenants
Max Courses      [ _______ ]   [ ] Visible to tenants
Max Storage (GB) [ _______ ]   [ ] Visible to tenants

Upgrade Prompt Message
[ _________________________________________________ ]
(Shown to tenants when they hit a limit. Leave empty for default message.)
```

### Section 3 — Feature Flags

```
Enabled Features
─────────────────────────────────────────
[x] Custom Domain
[x] White Label (remove SkillsRamp branding)
[ ] Advanced Analytics
[ ] AI Recommendations
[x] Consultancy Booking
[x] Page Builder
[x] Certificates
[ ] Bulk Enrollment
[ ] API Access
[ ] Priority Support
```

---

## Out of Scope (This Spec)

- **Actual payment deduction** of the platform fee from tenant payouts — this requires MercadoPago split payment configuration and is a separate spec
- **Automated billing** — charging tenants for the monthly fee automatically (Stripe/MP subscription integration)
- **Overage handling** — what happens if a tenant exceeds storage after the fact (e.g. they downgrade plans)
- **Trial period logic** — free trial countdown and expiry
- **SSO/SAML** — enterprise feature, separate spec
- **A/B test assignment logic** — routing new tenants to plan variant A vs B is a separate concern handled at the marketing/onboarding layer

---

## Acceptance Criteria

- [ ] Superadmin can set `monthlyFee`, `commissionRate`, and `minimumTransactionFee` on any plan and save successfully
- [ ] Superadmin can set `maxStudents`, `maxCourses`, `maxStorageGb` with individual visibility toggles
- [ ] Superadmin can enable/disable any feature from the `PlanFeature` enum for any plan
- [ ] When a tenant hits a limit, the action is blocked and an upgrade wall is shown
- [ ] When a tenant tries to access a feature not in their plan, an upgrade wall is shown instead of a 403
- [ ] `GET /api/t/:tenantSlug/plan/status` returns correct current usage vs. limits
- [ ] `platformFee` is calculated and stored correctly on every paid order
- [ ] All new plan fields are returned by the existing plan list/detail endpoints
- [ ] Existing plans without the new fields are unaffected (nulls = no billing config, no limits, all features disabled by default)
- [ ] Migration runs cleanly with no downtime on existing data

---

## Open Questions

1. Should `features` be stored as a JSON array on the `Plan` entity, or as a separate `PlanFeatureAssignment` join table? Join table is more queryable; JSON array is simpler to implement.
2. Should the `PlanFeature` enum live in a shared types package (given the multi-repo setup) or be duplicated in backend + frontend?
3. What is the current plan entity structure in `lms-backend`? Read `Plan` entity before implementing to avoid field naming conflicts.
4. Is there currently any feature flag system in place (even informal)? Check for any existing `tenant.features` or similar fields.
