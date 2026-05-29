# Spec: Marketing Suite for Tenants

## Overview

This spec defines the full Marketing Suite for SkillsRamp tenants — a set of tools that help them sell more courses, recover lost sales, grow through affiliates, and measure the ROI of their advertising.

The platform today handles course creation and delivery well. The Marketing Suite closes the gap: tenants who can't grow their student base churn regardless of platform quality. A tenant who sells with SkillsRamp doesn't leave.

**Implementation phases:**
- **Phase 1 (MVP):** Coupons, UTM tracking, Pixel integration
- **Phase 2:** Abandoned cart recovery, Flash sales, ROI Calculator, Marketing Dashboard
- **Phase 3:** Affiliate program, Upsell engine, Waitlist / Pre-launch

> This spec covers **Phase 1 and Phase 2** in full detail. Phase 3 is described at design level only — a separate spec will cover implementation.

---

## Context

- All features are tenant-scoped — a tenant's marketing tools only affect their own school
- Marketing Suite features should be gated by plan (Active / Pro only) — see `spec-plan-billing-features.md`
- The platform uses MercadoPago and PayPal for payments — tracking must hook into the existing checkout flow
- Multi-tenant architecture: all new entities require `tenantId`

---

## Phase 1 — Foundation

---

### Feature 1.1 — Coupon & Discount System

#### Where Coupons Live

Coupons have **two entry points** in the admin UI:

1. **Store (Tienda) → Product page → Coupons tab** — when a tenant is managing a specific course in the store, they can create coupons scoped to that product directly. This is the most natural creation flow.
2. **Marketing → Coupons** — a global panel showing all coupons across all store products, for tenants who want to manage everything in one place.

Both entry points use the same underlying data and API. A coupon created from the Store is identical to one created from Marketing — the only difference is that the Store flow pre-fills the `productId` and sets `appliesTo = 'product'` by default.

> **Key constraint:** Coupons only apply to products that are listed in the Store (`StoreProduct`). A course must have an active store listing to be eligible for a coupon. Coupons cannot be created for courses that are not in the store.

#### Requirements

- [ ] Tenants can create coupons from two places: **Store product page** and **Marketing → Coupons**
- [ ] Coupons are always associated with at least one store product — a coupon cannot exist without a product scope
- [ ] Four discount types: `percentage`, `fixed_amount`, `fixed_price`, `free`
- [ ] Coupons can apply to: a specific store product, all store products, or a store category
- [ ] When creating from the Store product page, `appliesTo` defaults to that product and is pre-filled
- [ ] When creating from Marketing, the tenant must explicitly select the product scope
- [ ] Optional expiry date — after which the coupon is automatically invalid
- [ ] Optional usage limit (total uses across all students)
- [ ] Optional per-student usage limit (default: 1 use per student)
- [ ] Coupon code is case-insensitive at validation
- [ ] Tenants can deactivate a coupon without deleting it (preserves history)
- [ ] Students enter the coupon code at checkout — real-time validation with price update
- [ ] If a coupon is expired, exhausted, or invalid: show a specific error message
- [ ] The coupon is only valid if the product it applies to is currently active in the store

#### Data Model

```typescript
// New entity: Coupon
{
  id: uuid
  tenantId: uuid
  code: string                    // unique per tenant, stored uppercase
  type: enum                      // 'percentage' | 'fixed_amount' | 'fixed_price' | 'free'
  value: number                   // % or USD amount (ignored if type = 'free')
  appliesTo: enum                 // 'product' | 'all_products' | 'category'
  storeProductId: uuid | null     // FK → StoreProduct (required if appliesTo = 'product')
  storeCategoryId: uuid | null    // FK → StoreCategory (required if appliesTo = 'category')
  expiresAt: Date | null
  maxUses: number | null          // total usage limit
  maxUsesPerStudent: number       // default: 1
  usedCount: number               // incremented on each valid use
  active: boolean                 // soft-disable without deletion
  createdAt: Date
  updatedAt: Date
}

// New entity: CouponRedemption
{
  id: uuid
  couponId: uuid
  orderId: uuid
  storeProductId: uuid            // which product was purchased with this coupon
  studentId: uuid
  tenantId: uuid
  discountAmount: number          // actual USD amount discounted
  redeemedAt: Date
}
```

#### API Endpoints

**Admin (tenant)**
- `GET /api/t/:tenantSlug/admin/coupons` — list all coupons with usage stats (filterable by `storeProductId`)
- `GET /api/t/:tenantSlug/admin/store/products/:productId/coupons` — list coupons for a specific product
- `POST /api/t/:tenantSlug/admin/coupons` — create coupon
- `PUT /api/t/:tenantSlug/admin/coupons/:id` — update coupon
- `PATCH /api/t/:tenantSlug/admin/coupons/:id/deactivate` — soft deactivate
- `DELETE /api/t/:tenantSlug/admin/coupons/:id` — hard delete (only if 0 uses)

**Student (checkout)**
- `POST /api/t/:tenantSlug/coupons/validate` — validate code + return discount amount
  ```typescript
  // Request
  { code: string, storeProductId: uuid }
  // Response
  { valid: true, discountAmount: number, finalPrice: number }
  // or
  { valid: false, reason: 'expired' | 'exhausted' | 'not_found' | 'not_applicable' | 'product_not_in_store' }
  ```

#### Checkout Integration

- Add `couponCode` field to the existing checkout request body
- On payment confirmation: create `CouponRedemption` record, increment `coupon.usedCount`
- Store `couponId` and `discountAmount` on the `Order` entity
- Validate that the store product is still active at the time of checkout (not just at coupon entry)

#### Admin UI — Entry Point 1: Store Product Page

On the Store product management page, add a **Coupons** tab:

```
[Product: UI Design Course]  [Details] [Pricing] [Coupons] [Stats]
──────────────────────────────────────────────────────────────────
Coupons for this product
[ + New Coupon for this product ]

Code         Type    Value   Uses    Expires    Status
UIOPEN20     %       20%     8/50    Jun 1      Active   [Edit] [Deactivate]
UILAUNCH     Free    —       2/10    —          Active   [Edit] [Deactivate]
```

Clicking **+ New Coupon for this product** opens the coupon form with `appliesTo = 'product'` and the current product pre-selected and locked.

#### Admin UI — Entry Point 2: Marketing → Coupons (Global Panel)

```
All Coupons
──────────────────────────────────────────────────────────────────
[ + New Coupon ]   [ Filter by product ▼ ]

Code         Product              Type    Value   Uses    Expires    Status
UIOPEN20     UI Design Course     %       20%     8/50    Jun 1      Active
SUMMER20     All products         %       20%     34/—    Jun 30     Active
UILAUNCH     UI Design Course     Free    —       2/10    —          Active
EXCEL10      Excel Masterclass    $       $10     50/50   —          Exhausted
```

Clicking **+ New Coupon** opens the form with a required **"Applies to"** selector (no default — must choose).

---

### Feature 1.2 — UTM Tracking

#### Requirements

- [ ] Capture UTM parameters (`utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`) from the URL when a student lands on any tenant page
- [ ] Store UTM params in the session (persist through checkout)
- [ ] Attach UTM data to the `Order` record on purchase
- [ ] Admin dashboard shows sales breakdown by UTM source

#### Implementation

- Frontend: on page load, read URL params → store in `localStorage` (persist across page navigations)
- On checkout completion: send stored UTM data with the order payload
- Backend: store on `Order` entity as JSON field `utmData`

#### Data Model — Order entity additions

```typescript
utmData: {
  source: string | null       // e.g. 'facebook', 'google'
  medium: string | null       // e.g. 'cpc', 'email'
  campaign: string | null     // e.g. 'black-friday-2026'
  content: string | null
  term: string | null
} | null
```

#### Admin Dashboard Widget

```
Sales by Source (last 30 days)
──────────────────────────────
Meta Ads      14 sales   $1,120   ████████████░░
Organic        8 sales     $640   ████████░░░░░░
Direct         6 sales     $480   ██████░░░░░░░░
Email          4 sales     $320   ████░░░░░░░░░░
Unknown        2 sales     $160   ██░░░░░░░░░░░░
```

---

### Feature 1.3 — Advertising Pixel Integration

#### Requirements

- [ ] Tenant can add tracking pixel IDs in their school settings
- [ ] Supported platforms: Meta (Facebook) Pixel, Google Tag Manager, Google Analytics 4, TikTok Pixel
- [ ] Once configured, the pixel script is automatically injected into all tenant-facing pages (course catalog, course detail, checkout, order confirmation)
- [ ] The following events are fired automatically:

| Page | Event fired |
|---|---|
| Course detail page | `ViewContent` (with course name + price) |
| Checkout initiated | `InitiateCheckout` (with value) |
| Purchase confirmed | `Purchase` (with value, currency) |
| Any page | `PageView` |

#### Implementation

- Store pixel IDs in tenant settings (`TenantSettings` entity or `Tenant` entity)
- Frontend: conditionally render pixel scripts in `_app.tsx` (or root layout) based on tenant config
- Fire events via the platform's existing page/event hooks

#### Data Model — new fields on Tenant or TenantSettings

```typescript
metaPixelId: string | null
googleTagManagerId: string | null
googleAnalyticsId: string | null
tiktokPixelId: string | null
```

#### Admin UI — Settings → Marketing → Pixels

```
Tracking Pixels
────────────────────────────────────────
Meta Pixel ID          [ _________________ ]
Google Tag Manager ID  [ _________________ ]
Google Analytics 4 ID  [ _________________ ]
TikTok Pixel ID        [ _________________ ]

[ Save Pixel Settings ]
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
  - Email 2: sent 24 hours after abandonment — reminder + optional discount coupon
- [ ] Each email is individually toggleable by the tenant
- [ ] Tenant can customize subject line and body of each email
- [ ] Tenant can optionally attach a coupon to Email 2
- [ ] If the student completes the purchase at any point, cancel remaining emails in the sequence
- [ ] Track: abandoned carts, emails sent, recovered purchases, recovered revenue

#### Data Model

```typescript
// New entity: AbandonedCart
{
  id: uuid
  tenantId: uuid
  studentId: uuid | null         // null if student is not logged in
  studentEmail: string
  courseId: uuid
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
// New fields on TenantSettings or MarketingSettings
abandonedCartEnabled: boolean
abandonedCartEmail1Enabled: boolean
abandonedCartEmail1SubjectTemplate: string
abandonedCartEmail1BodyTemplate: string    // supports {{studentName}}, {{courseName}}, {{courseUrl}}
abandonedCartEmail2Enabled: boolean
abandonedCartEmail2SubjectTemplate: string
abandonedCartEmail2BodyTemplate: string
abandonedCartEmail2CouponId: uuid | null   // optional coupon attached to email 2
```

#### Recovery Email Variables

All email templates support:
- `{{studentName}}` — student's first name
- `{{courseName}}` — course title
- `{{courseUrl}}` — direct link to course page
- `{{coursePrice}}` — original price
- `{{discountedPrice}}` — price after coupon (if coupon attached)
- `{{couponCode}}` — coupon code (if attached)

#### Admin UI — Marketing → Abandoned Cart

```
Abandoned Cart Recovery
────────────────────────────────────────────────
[ ] Enable abandoned cart recovery

Email 1 — Sent 1 hour after abandonment
[ ] Enable
Subject: [ Hey {{studentName}}, you left something behind... ]
[ Edit email body ]

Email 2 — Sent 24 hours after abandonment
[ ] Enable
Subject: [ Your spot in {{courseName}} is still available ]
[ Edit email body ]
Attach coupon: [ Select coupon ▼ ]  (optional)

────────────────────────────────────────────────
STATS (last 30 days)
Abandoned carts:     47
Emails sent:         38
Recovered:            6  (15.8%)
Revenue recovered:  $480
```

---

### Feature 2.2 — Flash Sales & Urgency Countdown

#### Requirements

- [ ] Tenant can create a time-limited sale campaign for a specific course
- [ ] Campaign sets a discounted price + an end date/time
- [ ] A visible countdown timer is shown on the course detail page and checkout
- [ ] When the campaign ends, the price automatically reverts to the original price
- [ ] Optional: limited seats mode — show "X spots remaining" instead of (or alongside) the timer
- [ ] Tenant can end a campaign early manually
- [ ] Multiple campaigns can exist but only one active per course at a time

#### Data Model

```typescript
// New entity: FlashSale
{
  id: uuid
  tenantId: uuid
  courseId: uuid
  campaignName: string           // internal label, not shown to students
  salePrice: number
  originalPrice: number          // snapshot at time of creation
  startAt: Date
  endsAt: Date
  maxSeats: number | null        // null = unlimited (date-only countdown)
  seatsSold: number              // incremented on each purchase during campaign
  customMessage: string | null   // e.g. "Launch offer — 48 hours only!"
  active: boolean
  createdAt: Date
}
```

#### Frontend Behavior

- On course detail page: detect active flash sale → show sale price + countdown timer + custom message
- Countdown timer: `DD:HH:MM:SS` — updates every second client-side
- When timer reaches 0: refresh price from API, hide countdown
- If `maxSeats` is set: show "X spots remaining" counter alongside or instead of timer

#### Admin UI — Marketing → Flash Sales

```
Flash Sales
────────────────────────────────────────────────────
[ + New Flash Sale ]

Course          Sale Price   Ends              Seats    Status
UI Design       $49 (was $99) Jun 1 23:59      —        Active   [Edit] [End Now]
Excel Course    $29 (was $59) Ended May 20     12/30    Ended
```

---

### Feature 2.3 — Ad ROI Calculator

> The most differentiating feature of the Marketing Suite. No LMS platform in LATAM has this built in.

#### What it solves

Tenants spend on Meta/Google Ads without knowing if it's worth it. This tool lets them calculate profitability before spending and benchmark against their actual historical conversion data.

#### Requirements

- [ ] Interactive calculator in the tenant admin panel (Marketing → ROI Calculator)
- [ ] All inputs are editable — no input is required (defaults to 0)
- [ ] Results update in real-time as inputs change (no submit button needed)
- [ ] The platform fee and MercadoPago fee are auto-populated from the tenant's active plan
- [ ] If the tenant has historical sales data, the average conversion rate is pre-populated
- [ ] Show break-even CPL (maximum cost per lead to remain profitable)
- [ ] Show recommendations when ROI is below 1x

#### Calculator Inputs

| Field | Description | Source |
|---|---|---|
| Course price | Selling price in USD | Input (or pre-populate from selected course) |
| Ad budget | How much the tenant plans to spend | Input |
| Cost per lead (CPL) | Average cost per lead from their ad platform | Input |
| Lead-to-sale conversion rate | % of leads who buy | Input (or pre-populated from historical data) |

#### Calculator Outputs (computed)

```typescript
const leads = adBudget / cpl
const sales = leads * (conversionRate / 100)
const grossRevenue = sales * coursePrice
const platformFee = grossRevenue * tenant.commissionRate        // from plan
const paymentFee = grossRevenue * 0.04                          // MercadoPago ~4%
const netRevenue = grossRevenue - platformFee - paymentFee
const roi = ((netRevenue - adBudget) / adBudget) * 100          // %
const breakEvenCpl = (netRevenue / leads)                       // max CPL to break even
const profitableConversionRate = (adBudget / (leads * (coursePrice * (1 - commissionRate - 0.04)))) * 100
```

#### UI Layout

```
┌─────────────────────────────────────────────────────────┐
│  🧮 Ad ROI Calculator                                   │
│  ─────────────────────────────────────────────────────  │
│  Course price          $ [ 80      ]                   │
│  Ad budget             $ [ 200     ]                   │
│  Cost per lead (CPL)   $ [ 8       ]  (from Meta/Google)│
│  Conversion rate         [ 10      ]%                  │
│  ─────────────────────────────────────────────────────  │
│  RESULTS                                               │
│  Estimated leads:          25                          │
│  Estimated sales:          2.5                         │
│  Gross revenue:         $ 200                          │
│  Platform fee (5%):     $  10                          │
│  Payment fee (~4%):     $   8                          │
│  Net revenue:           $ 182                          │
│  Ad spend:              $ 200                          │
│  ─────────────────────────────────────────────────────  │
│  ROI:              -9%   ⚠️  Not profitable yet        │
│  Break-even CPL:   $ 7.28  (you're at $8.00)           │
│  ─────────────────────────────────────────────────────  │
│  💡 To be profitable:                                  │
│     Lower your CPL to $7.28 or below, OR              │
│     Improve conversion rate to 12.5%, OR              │
│     Raise the course price to $88+                    │
└─────────────────────────────────────────────────────────┘
```

#### Implementation Notes

- Pure frontend calculation — no API calls needed for the calculator itself
- Auto-populate `commissionRate` from tenant's plan via existing plan status endpoint
- Auto-populate conversion rate: `(total_orders / total_checkout_initiations)` from last 90 days
- No new backend endpoints required for Phase 2 of this feature

---

### Feature 2.4 — Marketing Dashboard

#### Requirements

- [ ] Unified view of all marketing activity for the tenant
- [ ] Date range filter (last 7 days / 30 days / 90 days / custom)
- [ ] Sections: funnel overview, sales by source, active campaigns, abandoned cart stats
- [ ] Data is derived from existing order, coupon, and UTM data — no new tracking required beyond what Phase 1 establishes

#### Dashboard Sections

**Funnel Overview**
```
Visits → Checkout Started → Purchase Completed
 1,240        89 (7.2%)           34 (38.2%)
```

**Sales by Source** (from UTM data)

```
Meta Ads     14 sales   $1,120   42%   ████████████
Organic       8 sales     $640   28%   ████████
Affiliates    6 sales     $480   18%   █████
Direct        4 sales     $320   12%   ████
```

**Active Campaigns**

| Campaign | Type | Sales | Revenue | Status |
|---|---|---|---|---|
| SUMMER20 coupon | Coupon | 12 uses | $480 | Active |
| UI Design Flash Sale | Flash sale | 8 sales | $392 | Ends in 2 days |
| Abandoned cart | Recovery | 3 recovered | $240 | Running |

**Abandoned Cart Summary**

```
This month: 47 abandoned → 6 recovered (12.8%) → $480 recovered revenue
```

#### API Endpoint

`GET /api/t/:tenantSlug/admin/marketing/dashboard?from=2026-05-01&to=2026-05-29`

```typescript
// Response
{
  funnel: {
    visits: number,
    checkoutsStarted: number,
    checkoutsCompleted: number,
    visitToCheckoutRate: number,
    checkoutToSaleRate: number,
  },
  salesBySource: Array<{
    source: string,
    sales: number,
    revenue: number,
    percentage: number,
  }>,
  activeCampaigns: Array<{
    name: string,
    type: 'coupon' | 'flash_sale' | 'abandoned_cart',
    sales: number,
    revenue: number,
    status: string,
  }>,
  abandonedCart: {
    total: number,
    recovered: number,
    recoveryRate: number,
    recoveredRevenue: number,
  }
}
```

---

## Phase 3 — Growth (Design Only)

> Full implementation spec to be written separately. Described here for context.

### Feature 3.1 — Affiliate Program

Tenants can create an affiliate program for their courses. Any person (including existing students) can apply to be an affiliate. Each affiliate gets a unique referral link. When a sale is made through that link, the affiliate earns a commission. Tenants approve affiliates, set commission rates, and mark commissions as paid manually.

**Key entities:** `AffiliateProgram`, `Affiliate`, `AffiliateCommission`
**Key decisions:** cookie duration, per-course vs. all-courses commission, auto-approve vs. manual approval

### Feature 3.2 — Upsell & Cross-sell Engine

After a student purchases or completes a course, the platform suggests the next product. Tenants configure upsell rules per course: what to suggest, when to suggest it, and whether to include a discount.

**Moments:** post-purchase redirect, post-completion page, order bump at checkout
**Key entities:** `UpsellRule`

### Feature 3.3 — Waitlist & Pre-launch

Tenants can publish a course in `pre-launch` state. The course page shows a waitlist form instead of a buy button. Interested students submit their email. When the tenant launches, the waitlist receives an email automatically (with optional early-bird discount).

**Key entities:** `WaitlistEntry`
**Key decisions:** separate from student account or linked, early-bird coupon auto-generation

---

## Acceptance Criteria — Phase 1 & 2

### Coupons
- [ ] Tenant can create, edit, and deactivate coupons of all 4 types
- [ ] Students can apply coupon at checkout with real-time price update
- [ ] Expired or exhausted coupons return specific error messages
- [ ] Coupon usage is tracked and visible in admin panel

### UTM Tracking
- [ ] UTM params from landing URL are persisted through checkout
- [ ] UTM data is stored on the Order record
- [ ] Sales by source chart is visible in the marketing dashboard

### Pixel Integration
- [ ] Tenant can save pixel IDs in settings
- [ ] `PageView`, `ViewContent`, `InitiateCheckout`, and `Purchase` events fire correctly for Meta Pixel
- [ ] No pixel scripts load if the tenant has not configured them

### Abandoned Cart Recovery
- [ ] Abandoned cart is detected correctly (checkout started, not completed within 60 min)
- [ ] Email 1 and Email 2 send at correct intervals
- [ ] Emails are cancelled if the student completes the purchase
- [ ] Recovery stats are visible in the admin panel

### Flash Sales
- [ ] Tenant can create a flash sale with discounted price + end date
- [ ] Countdown timer is visible on course detail page
- [ ] Price reverts automatically when campaign ends
- [ ] Only one active flash sale per course at a time

### ROI Calculator
- [ ] Calculator is accessible in the admin panel under Marketing
- [ ] Results update in real-time as inputs change
- [ ] Platform fee and payment fee are auto-populated from tenant's plan
- [ ] Break-even CPL and recommendations are displayed correctly

### Marketing Dashboard
- [ ] Funnel overview shows correct visit → checkout → purchase rates
- [ ] Sales by source is accurate based on UTM data
- [ ] Active campaigns are listed with correct stats
- [ ] Abandoned cart summary is shown

---

## Open Questions

| # | Question | Options | Recommendation |
|---|---|---|---|
| 1 | Is the Marketing Suite gated by plan (Active/Pro only)? | All plans / Active+ / Pro+ | Active and Pro only |
| 2 | Abandoned cart: require student account, or capture email before checkout? | Account required / Email capture | Account required for MVP |
| 3 | Flash sale with limited seats: real-time counter (Socket.IO) or approximate? | Real-time / Approximate refresh | Approximate for MVP |
| 4 | ROI Calculator: show historical conversion rate from platform data? | Yes / Manual only | Manual first, auto-populate in V2 |
| 5 | Can a flash sale and a coupon be combined on the same purchase? | Yes / No | No — flash sale price takes precedence |
| 6 | Abandoned cart email 2 coupon: is it a one-time-use coupon auto-generated, or a shared code? | Auto-generated one-time / Shared | Shared code from existing coupon pool |

---

## Out of Scope

- Affiliate program (Phase 3 — separate spec)
- Upsell engine (Phase 3 — separate spec)
- Waitlist / pre-launch (Phase 3 — separate spec)
- Email campaign builder (bulk email to all students — separate spec)
- A/B testing of landing pages
- Automated ad buying (Meta/Google Ads API integration)
- Revenue sharing / payout automation for affiliates

---

## References

- `spec-plan-billing-features.md` — feature flags system to gate Marketing Suite by plan
- `spec-project-lesson-type.md` — other feature spec for context
- Existing `Order` entity in `lms-backend` — extend with `couponId`, `discountAmount`, `utmData`
- Existing checkout flow in `lms-backend` — integrate coupon validation and abandoned cart detection
- Existing `Tenant` / `TenantSettings` entity — extend with pixel IDs and marketing config
