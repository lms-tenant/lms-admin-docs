# Spec: Marketing Suite for Tenants

## Overview

This spec defines the Marketing Suite for SkillsRamp tenants — tools that help them sell more courses, recover lost sales, and measure the ROI of their advertising.

> **Coupons & Discounts are NOT in this spec.** They are covered in `spec-coupons-discounts.md` because they are tightly coupled to the Store and product management flow.

**Implementation phases:**
- **Phase 1 (MVP):** UTM Tracking, Pixel & Conversion Tracking (Meta Pixel + CAPI, Google Ads, GTM)
- **Phase 2:** Abandoned cart recovery, Flash sales, ROI Calculator, Marketing Dashboard
- **Phase 3:** Affiliate program, Upsell engine, Waitlist / Pre-launch

---

## Files to Edit

> Read this section before starting. These are the exact files that need to be touched per feature.

### Phase 1 — UTM Tracking

| File | Change |
|---|---|
| `lms-backend/src/entities/Order.ts` | Add `utmData` JSON field |
| `lms-backend/src/controllers/checkout/` | Capture `utmData` from request body, persist to Order |
| `lms-frontend/src/pages/_app.tsx` | On mount, read UTM params from URL → save to `localStorage` |
| `lms-frontend/src/api.ts` (or checkout hook) | Read `utmData` from `localStorage` → attach to checkout payload |
| `lms-backend/src/controllers/admin/dashboardController.ts` | Add sales-by-source query using `utmData` |

### Phase 1 — Pixel & Conversion Tracking

| File | Change |
|---|---|
| `lms-backend/src/entities/Tenant.ts` (or `TenantSettings.ts`) | Add pixel ID fields + Meta CAPI token |
| `lms-backend/src/controllers/checkout/` | After order confirmed → call Meta CAPI + Google Ads conversion endpoint |
| `lms-backend/src/services/` | New `TrackingService` — handles Meta CAPI POST and Google Ads conversion POST |
| `lms-frontend/src/pages/_app.tsx` | Inject pixel scripts conditionally based on tenant config |
| `lms-frontend/src/pages/courses/[slug].tsx` | Fire `ViewContent` event |
| `lms-frontend/src/pages/checkout/` | Fire `InitiateCheckout` event |
| `lms-frontend/src/pages/checkout/success.tsx` | Fire `Purchase` event (browser-side, server-side via CAPI) |
| `lms-backend/src/routes/` | New admin route: `PUT /admin/settings/tracking` |

### Phase 2 — Abandoned Cart Recovery

| File | Change |
|---|---|
| `lms-backend/src/entities/` | New `AbandonedCart` entity + migration |
| `lms-backend/src/controllers/checkout/` | On checkout initiation → create `AbandonedCart` record |
| `lms-backend/src/controllers/checkout/` | On order confirmed → mark `AbandonedCart` as recovered |
| `lms-backend/src/services/` | New `AbandonedCartService` — handles detection + email scheduling |
| `lms-backend/src/jobs/` (or cron) | Job that runs every 15 min → sends recovery emails for eligible carts |
| `lms-backend/src/entities/TenantSettings.ts` | Add `abandonedCart*` config fields |
| `lms-backend/src/routes/admin/` | New routes: GET stats, PUT config |
| `lms-frontend/src/app/admin/marketing/abandoned-cart/` | New admin page: config + stats |

### Phase 2 — Flash Sales

| File | Change |
|---|---|
| `lms-backend/src/entities/` | New `FlashSale` entity + migration |
| `lms-backend/src/routes/admin/` | CRUD routes for flash sales |
| `lms-backend/src/controllers/courses/` | Extend course detail endpoint to include active flash sale data |
| `lms-frontend/src/pages/courses/[slug].tsx` | Show sale price + countdown timer if flash sale active |
| `lms-frontend/src/components/` | New `CountdownTimer` component |
| `lms-frontend/src/pages/checkout/` | Show discounted price if flash sale active |

### Phase 2 — ROI Calculator

| File | Change |
|---|---|
| `lms-frontend/src/app/admin/marketing/roi-calculator/` | New admin page — pure frontend calculation |
| `lms-backend/src/controllers/admin/` | Add conversion rate stat to existing plan/stats endpoint |

### Phase 2 — Marketing Dashboard

| File | Change |
|---|---|
| `lms-backend/src/routes/admin/` | New route: `GET /admin/marketing/dashboard` |
| `lms-backend/src/controllers/admin/` | New `MarketingDashboardController` |
| `lms-frontend/src/app/admin/marketing/` | New dashboard page |

---

## Context

- All features are tenant-scoped — a tenant's marketing tools only affect their own school
- Marketing Suite features should be gated by plan (Active / Pro only) — see `spec-plan-billing-features.md`
- The platform uses MercadoPago and PayPal for payments — pixel and CAPI events hook into the existing checkout confirmation flow
- Multi-tenant architecture: all new entities require `tenantId`
- Coupons are handled in `spec-coupons-discounts.md` — the abandoned cart email config references coupon IDs from that system

---

## Phase 1 — Foundation

---

### Feature 1.1 — UTM Tracking

#### What it does

Captures UTM parameters from the URL when a student lands on any tenant page, persists them through the checkout flow, and attaches them to the Order record. This allows the tenant to see which ad campaigns, channels, and content are generating actual sales.

#### Requirements

- [ ] Capture UTM parameters (`utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`) from the landing URL
- [ ] Persist UTM params in `localStorage` — survives page navigation through checkout
- [ ] If a student lands multiple times with different UTMs, use **last-touch attribution** (overwrite with the latest)
- [ ] Attach stored UTM data to the Order record on purchase completion
- [ ] Admin dashboard widget shows sales breakdown by `utm_source`

#### Implementation

**Frontend (`lms-frontend/src/pages/_app.tsx`)**
```typescript
// On mount, read UTM params from URL
const params = new URLSearchParams(window.location.search)
const utmKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term']
const hasUtm = utmKeys.some(k => params.get(k))
if (hasUtm) {
  localStorage.setItem('utmData', JSON.stringify({
    source: params.get('utm_source'),
    medium: params.get('utm_medium'),
    campaign: params.get('utm_campaign'),
    content: params.get('utm_content'),
    term: params.get('utm_term'),
  }))
}
```

**Checkout payload**
```typescript
// Read before submitting checkout
const utmData = JSON.parse(localStorage.getItem('utmData') ?? 'null')
// Include in checkout request body: { ...checkoutData, utmData }
```

#### Data Model — Order entity additions

```typescript
// Add to existing Order entity
utmData: {
  source: string | null
  medium: string | null
  campaign: string | null
  content: string | null
  term: string | null
} | null                    // stored as JSON column
```

#### Admin Dashboard Widget

```
Sales by Source (last 30 days)
──────────────────────────────────────────────
Meta Ads      14 sales   $1,120   42%   ████████████
Organic        8 sales     $640   28%   ████████
Direct         6 sales     $480   18%   ██████
Email          4 sales     $320   12%   ████
Unknown        2 sales     $160   —     ██
```

---

### Feature 1.2 — Pixel & Conversion Tracking

#### Why server-side matters

Since iOS14, Apple blocks third-party browser tracking. A browser-only Meta Pixel loses 30–40% of conversion events. Tenants running Meta Ads get inaccurate data and optimize their campaigns on incomplete information.

The solution is **dual tracking**:
- **Browser-side pixel** — fires on page events (fast, handles ViewContent / InitiateCheckout)
- **Server-side (CAPI / Google Ads API)** — fires on confirmed purchases from the backend (reliable, not blocked by iOS)

#### Supported Integrations

| Platform | Browser-side | Server-side |
|---|---|---|
| **Meta (Facebook)** | Meta Pixel (script inject) | Meta Conversions API (CAPI) |
| **Google Ads** | `gtag` conversion tag | Google Ads Conversion API |
| **Google Tag Manager** | GTM container script | — (GTM handles its own server-side optionally) |
| **TikTok** | TikTok Pixel script | Out of scope for Phase 1 |

---

#### Sub-feature 1.2a — Meta Pixel (Browser-side)

##### Requirements

- [ ] Tenant adds their Meta Pixel ID in Settings → Marketing → Tracking
- [ ] Pixel script is injected into all tenant-facing pages if Pixel ID is configured
- [ ] The following browser events fire automatically:

| Page / Action | Event | Data sent |
|---|---|---|
| Any page load | `PageView` | — |
| Course detail page | `ViewContent` | `content_name`, `value`, `currency` |
| Checkout initiated | `InitiateCheckout` | `value`, `currency`, `content_ids` |
| Purchase confirmed | `Purchase` | `value`, `currency`, `content_ids`, `order_id` |

##### Implementation

```typescript
// lms-frontend/src/pages/_app.tsx
// Inject conditionally based on tenant config
{tenantConfig.metaPixelId && (
  <Script id="meta-pixel" strategy="afterInteractive">
    {`
      !function(f,b,e,v,n,t,s){...}(window,document,'script',
      'https://connect.facebook.net/en_US/fbevents.js');
      fbq('init', '${tenantConfig.metaPixelId}');
      fbq('track', 'PageView');
    `}
  </Script>
)}
```

---

#### Sub-feature 1.2b — Meta Conversions API (CAPI — Server-side)

##### Why CAPI is necessary

```
Without CAPI (browser only):   iOS14 blocks ~35% of events → tenant sees 65% of real sales
With CAPI (server + browser):  backend sends event directly to Meta → ~95%+ accuracy
```

##### Requirements

- [ ] Tenant provides their **Meta Pixel ID** and a **CAPI Access Token** (generated from Meta Business Manager → Events Manager → Settings)
- [ ] On every confirmed purchase (`Order` status → completed), the backend sends a `Purchase` event to the Meta CAPI endpoint
- [ ] Event deduplication: both browser pixel and CAPI fire for the same purchase — use `eventId` to prevent Meta from counting it twice
- [ ] CAPI call is non-blocking — if it fails, the order confirmation still proceeds. Log the failure.
- [ ] Customer data is hashed (SHA-256) before sending per Meta's requirements: email, phone (if available)

##### Data sent to CAPI on Purchase

```typescript
// POST https://graph.facebook.com/v19.0/{pixel-id}/events
{
  data: [{
    event_name: 'Purchase',
    event_time: Math.floor(Date.now() / 1000),
    event_id: order.id,                          // dedup key — must match browser pixel eventId
    action_source: 'website',
    user_data: {
      em: [sha256(student.email)],               // hashed email
      client_ip_address: req.ip,
      client_user_agent: req.headers['user-agent'],
      fbc: cookies._fbc ?? null,                 // Meta click ID from cookie
      fbp: cookies._fbp ?? null,                 // Meta browser ID from cookie
    },
    custom_data: {
      value: order.totalAmount,
      currency: 'USD',
      content_ids: [order.courseId],
      order_id: order.id,
    }
  }],
  access_token: tenant.metaCapiToken
}
```

##### New `TrackingService` (backend)

```typescript
// lms-backend/src/services/TrackingService.ts

class TrackingService {
  async sendMetaCAPIEvent(tenantId: string, event: MetaCAPIEvent): Promise<void>
  async sendGoogleAdsConversion(tenantId: string, event: GoogleAdsConversionEvent): Promise<void>
}
```

Called from the checkout controller after order confirmation — **fire and forget** (non-blocking).

##### Data Model — new fields on TenantSettings

```typescript
metaPixelId: string | null
metaCapiToken: string | null         // stored encrypted at rest
metaCapiEnabled: boolean             // default: false
```

---

#### Sub-feature 1.2c — Google Ads Conversion Tracking

##### Requirements

- [ ] Tenant adds their **Google Ads Conversion ID** and **Conversion Label** (from Google Ads → Tools → Conversions)
- [ ] Browser-side: `gtag('event', 'conversion', {...})` fires on the purchase confirmation page
- [ ] Server-side: backend posts to Google Ads Conversion API on confirmed purchase (same dedup logic as CAPI)
- [ ] Google Ads conversion tag is separate from GA4 — do not confuse the two

##### Browser-side implementation

```typescript
// lms-frontend/src/pages/checkout/success.tsx
// Fire after order confirmed
if (tenantConfig.googleAdsConversionId) {
  gtag('event', 'conversion', {
    send_to: `${tenantConfig.googleAdsConversionId}/${tenantConfig.googleAdsConversionLabel}`,
    value: order.totalAmount,
    currency: 'USD',
    transaction_id: order.id,
  })
}
```

##### Data Model — new fields on TenantSettings

```typescript
googleTagManagerId: string | null
googleAnalyticsId: string | null
googleAdsConversionId: string | null       // e.g. 'AW-123456789'
googleAdsConversionLabel: string | null    // e.g. 'abc123DEF'
```

---

#### Admin UI — Settings → Marketing → Tracking

```
Tracking & Pixels
────────────────────────────────────────────────────────

META (FACEBOOK)
Pixel ID              [ _________________________ ]
CAPI Access Token     [ _________________________ ]  🔒 stored encrypted
[ ] Enable server-side Conversions API (recommended)
ℹ️  Get your CAPI token: Meta Business Manager → Events Manager → Settings → Generate token

GOOGLE
Tag Manager ID        [ _________________________ ]  (e.g. GTM-XXXXXXX)
Analytics 4 ID        [ _________________________ ]  (e.g. G-XXXXXXXXXX)
Ads Conversion ID     [ _________________________ ]  (e.g. AW-123456789)
Ads Conversion Label  [ _________________________ ]

[ Save Tracking Settings ]

────────────────────────────────────────────────────────
ℹ️  Events fired automatically:
  PageView → all pages
  ViewContent → course detail page
  InitiateCheckout → checkout start
  Purchase → order confirmation (browser + server-side if CAPI enabled)
```

---

## Phase 2 — Conversion

---

### Feature 2.1 — Abandoned Cart Recovery

#### What it is

When a student starts checkout but doesn't complete the purchase, the platform sends automated recovery emails.

#### Requirements

- [ ] Trigger: student submits checkout form (payment initiated) but order is not completed within 60 minutes
- [ ] Two-email sequence:
  - Email 1: sent 1 hour after abandonment — reminder, no discount
  - Email 2: sent 24 hours after abandonment — reminder + optional coupon (references `spec-coupons-discounts.md`)
- [ ] Each email is individually toggleable by the tenant
- [ ] Tenant can customize subject line and body of each email
- [ ] Tenant can optionally attach a coupon to Email 2 (coupon must exist in the coupon system)
- [ ] If the student completes the purchase at any point, cancel remaining emails in the sequence
- [ ] Track: abandoned carts, emails sent, recovered purchases, recovered revenue

#### Data Model

```typescript
// New entity: AbandonedCart
{
  id: uuid
  tenantId: uuid
  studentId: uuid | null         // null if guest checkout (future)
  studentEmail: string
  storeProductId: uuid           // product they were buying
  priceAtAbandonment: number
  status: enum                   // 'abandoned' | 'recovered' | 'expired'
  email1SentAt: Date | null
  email2SentAt: Date | null
  recoveredAt: Date | null
  recoveredOrderId: uuid | null
  createdAt: Date
}
```

#### Tenant Configuration

```typescript
// New fields on TenantSettings
abandonedCartEnabled: boolean
abandonedCartEmail1Enabled: boolean
abandonedCartEmail1Subject: string
abandonedCartEmail1Body: string       // supports template variables
abandonedCartEmail2Enabled: boolean
abandonedCartEmail2Subject: string
abandonedCartEmail2Body: string
abandonedCartEmail2CouponId: uuid | null
```

#### Email Template Variables

`{{studentName}}`, `{{courseName}}`, `{{courseUrl}}`, `{{coursePrice}}`, `{{discountedPrice}}`, `{{couponCode}}`

#### Admin UI — Marketing → Abandoned Cart

```
Abandoned Cart Recovery
────────────────────────────────────────────────────
[ ] Enable abandoned cart recovery

Email 1 — 1 hour after abandonment
[ ] Enable
Subject: [ Hey {{studentName}}, you left something behind... ]
[ Edit email body ]

Email 2 — 24 hours after abandonment
[ ] Enable
Subject: [ Your spot in {{courseName}} is still available ]
[ Edit email body ]
Attach coupon: [ Select coupon ▼ ]  (optional)

────────────────────────────────────────────────────
STATS — last 30 days
Abandoned carts:     47
Emails sent:         38
Recovered:            6  (15.8%)
Revenue recovered:  $480
```

---

### Feature 2.2 — Flash Sales & Urgency Countdown

#### Requirements

- [ ] Tenant can create a time-limited sale for a specific store product
- [ ] Sets a discounted price + end date/time
- [ ] Visible countdown timer on the course detail page and checkout
- [ ] Price reverts automatically when campaign ends
- [ ] Optional: limited seats mode — show "X spots remaining"
- [ ] Tenant can end a campaign early manually
- [ ] Only one active flash sale per product at a time

#### Data Model

```typescript
// New entity: FlashSale
{
  id: uuid
  tenantId: uuid
  storeProductId: uuid
  campaignName: string
  salePrice: number
  originalPrice: number
  startAt: Date
  endsAt: Date
  maxSeats: number | null
  seatsSold: number
  customMessage: string | null
  active: boolean
  createdAt: Date
}
```

#### Frontend Behavior

- Course detail page: detect active flash sale → show sale price + countdown + message
- Countdown: `DD:HH:MM:SS` — client-side update every second
- Timer reaches 0: re-fetch price from API, hide countdown
- `maxSeats` set: show "X spots remaining" alongside timer

#### Admin UI — Marketing → Flash Sales

```
Flash Sales
────────────────────────────────────────────────────────
[ + New Flash Sale ]

Product           Sale Price      Ends             Seats    Status
UI Design         $49 (was $99)   Jun 1 23:59      —        Active   [Edit] [End Now]
Excel Course      $29 (was $59)   Ended May 20     12/30    Ended
```

---

### Feature 2.3 — Ad ROI Calculator

> Pure frontend feature. No new backend endpoints needed.

#### What it solves

Tenants spend on Meta/Google Ads without knowing if the math works. This calculator shows profitability before spending, with platform + payment fees auto-populated.

#### Requirements

- [ ] Interactive calculator under Marketing → ROI Calculator
- [ ] All inputs editable, results update in real-time
- [ ] Platform fee auto-populated from tenant's active plan (via existing plan status endpoint)
- [ ] MercadoPago fee fixed at 4% (displayed as a constant)
- [ ] Historical conversion rate pre-populated from last 90 days of order data
- [ ] Show break-even CPL and actionable recommendations when ROI < 0

#### Inputs

| Field | Source |
|---|---|
| Course price | Input (or pre-select from store products) |
| Ad budget | Input |
| Cost per lead (CPL) | Input |
| Conversion rate | Input (pre-populated from historical data) |

#### Formula

```typescript
const leads = adBudget / cpl
const sales = leads * (conversionRate / 100)
const grossRevenue = sales * coursePrice
const platformFee = grossRevenue * plan.commissionRate
const paymentFee = grossRevenue * 0.04
const netRevenue = grossRevenue - platformFee - paymentFee
const roi = ((netRevenue - adBudget) / adBudget) * 100
const breakEvenCpl = netRevenue / leads
```

#### UI

```
┌──────────────────────────────────────────────────────┐
│  🧮 Ad ROI Calculator                                │
│  ────────────────────────────────────────────────    │
│  Course price         $ [ 80  ]                      │
│  Ad budget            $ [ 200 ]                      │
│  Cost per lead (CPL)  $ [ 8   ]                      │
│  Conversion rate        [ 10  ]%                     │
│  ────────────────────────────────────────────────    │
│  Estimated leads:         25                         │
│  Estimated sales:         2.5                        │
│  Gross revenue:        $ 200                         │
│  Platform fee (5%):    $  10                         │
│  Payment fee (~4%):    $   8                         │
│  Net revenue:          $ 182                         │
│  ────────────────────────────────────────────────    │
│  ROI: -9%  ⚠️  Not profitable yet                    │
│  Break-even CPL: $7.28  (you're at $8.00)            │
│  ────────────────────────────────────────────────    │
│  💡 To be profitable:                                │
│     → Lower CPL to $7.28 or below                   │
│     → Improve conversion rate to 12.5%              │
│     → Raise course price to $88+                    │
└──────────────────────────────────────────────────────┘
```

---

### Feature 2.4 — Marketing Dashboard

#### Requirements

- [ ] Unified marketing view with date range filter (7 / 30 / 90 days / custom)
- [ ] Sections: funnel, sales by source, active campaigns, abandoned cart summary
- [ ] All data derived from Order + AbandonedCart + FlashSale + UTM data — no additional tracking

#### API

`GET /api/t/:tenantSlug/admin/marketing/dashboard?from=YYYY-MM-DD&to=YYYY-MM-DD`

```typescript
{
  funnel: {
    visits: number,
    checkoutsStarted: number,
    checkoutsCompleted: number,
    visitToCheckoutRate: number,
    checkoutToSaleRate: number,
  },
  salesBySource: Array<{ source: string, sales: number, revenue: number, percentage: number }>,
  activeCampaigns: Array<{ name: string, type: 'flash_sale' | 'abandoned_cart', sales: number, revenue: number, status: string }>,
  abandonedCart: { total: number, recovered: number, recoveryRate: number, recoveredRevenue: number }
}
```

---

## Phase 3 — Growth (Design Only)

> Full implementation spec to be written separately.

### Feature 3.1 — Affiliate Program
Tenants create an affiliate program. Affiliates get unique referral links. Commissions are tracked per sale and paid manually by the tenant.
**Key entities:** `AffiliateProgram`, `Affiliate`, `AffiliateCommission`

### Feature 3.2 — Upsell & Cross-sell Engine
After purchase or course completion, suggest the next product with an optional discount.
**Key entities:** `UpsellRule`

### Feature 3.3 — Waitlist & Pre-launch
Course published in `pre-launch` state shows a waitlist form. On launch, waitlist receives email with optional early-bird coupon.
**Key entities:** `WaitlistEntry`

---

## Acceptance Criteria

### UTM Tracking
- [ ] UTM params from landing URL persist through checkout
- [ ] UTM data is stored on the Order record
- [ ] Sales by source chart shows correct breakdown in the dashboard

### Meta Pixel (browser)
- [ ] `PageView`, `ViewContent`, `InitiateCheckout`, `Purchase` fire correctly
- [ ] No pixel script loads if Pixel ID is not configured

### Meta CAPI (server-side)
- [ ] `Purchase` event sent to CAPI on every confirmed order when CAPI is enabled
- [ ] Event includes hashed email, `event_id` for deduplication, correct value/currency
- [ ] CAPI failure does not block order confirmation — error is logged only
- [ ] CAPI token is stored encrypted

### Google Ads Conversion
- [ ] Browser-side `gtag` conversion fires on purchase confirmation page
- [ ] No Google Ads tag loads if Conversion ID is not configured

### Abandoned Cart Recovery
- [ ] Abandoned cart detected correctly (checkout started, not completed in 60 min)
- [ ] Email 1 sent at 1h, Email 2 at 24h
- [ ] Emails cancelled when student completes purchase
- [ ] Stats visible in admin panel

### Flash Sales
- [ ] Countdown timer visible on course detail page when active
- [ ] Price reverts automatically on campaign end
- [ ] Only one active flash sale per product at a time

### ROI Calculator
- [ ] Results update in real-time as inputs change
- [ ] Platform fee auto-populated from tenant's plan
- [ ] Break-even CPL and recommendations display correctly

---

## Open Questions

| # | Question | Recommendation |
|---|---|---|
| 1 | Meta CAPI: store `_fbc` and `_fbp` cookies server-side or read from client? | Read from client, pass in checkout payload |
| 2 | Flash sale + coupon combo: allowed or flash sale takes precedence? | Flash sale takes precedence, coupon not applicable during active flash sale |
| 3 | Abandoned cart: require student to be logged in, or capture email at checkout start? | Require login for MVP |
| 4 | Google Ads server-side API: Phase 1 or Phase 2? | Phase 1 browser-side only, server-side in Phase 2 |
| 5 | Marketing Suite gated by plan? | Active and Pro only |

---

## Out of Scope

- Coupons & Discounts → see `spec-coupons-discounts.md`
- Affiliate program → Phase 3 spec
- Upsell engine → Phase 3 spec
- Waitlist / pre-launch → Phase 3 spec
- TikTok server-side API
- Email campaign builder (bulk email to all students)
- Automated ad buying (Meta/Google Ads API)

---

## References

- `spec-coupons-discounts.md` — coupon system (used by abandoned cart email 2)
- `spec-plan-billing-features.md` — plan feature flags to gate Marketing Suite
- `spec-project-lesson-type.md` — other feature spec for context
- Existing `Order` entity in `lms-backend` — extend with `utmData`, `couponId`, `discountAmount`
- Existing checkout flow in `lms-backend` — integrate pixel events, CAPI, abandoned cart detection
