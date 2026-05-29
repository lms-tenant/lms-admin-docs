# Spec: Coupons & Discounts

## Overview

This spec covers the coupon and discount system for SkillsRamp tenants. Coupons are a Store feature — they apply to products listed in the tenant's store and are manageable from two entry points: the Store product page and the Marketing panel.

> This spec is intentionally separate from `spec-marketing-suite.md` because coupons are tightly coupled to the Store and product management flow, not just the marketing toolset.

---

## Files to Edit

| File | Change |
|---|---|
| `lms-backend/src/entities/` | New `Coupon` entity + new `CouponRedemption` entity + migrations |
| `lms-backend/src/entities/Order.ts` | Add `couponId` (FK) and `discountAmount` fields |
| `lms-backend/src/routes/admin/` | New coupon CRUD routes (admin) |
| `lms-backend/src/routes/public/` | New `POST /coupons/validate` route (student-facing) |
| `lms-backend/src/controllers/checkout/` | Integrate coupon validation + redemption on purchase confirmation |
| `lms-backend/src/controllers/admin/store/` | Add `GET /store/products/:productId/coupons` route (scoped to product) |
| `lms-frontend/src/pages/checkout/` | Add coupon code input field with real-time validation |
| `lms-frontend/src/app/admin/store/products/[id]/` | Add Coupons tab to store product management page |
| `lms-frontend/src/app/admin/marketing/coupons/` | New global coupon management page |

---

## Context

- Coupons **only apply to products listed in the Store** (`StoreProduct`). A course must have an active store listing to be eligible for a coupon.
- A coupon cannot be created without a product scope — every coupon must target at least one store product, all products, or a product category.
- Coupons are referenced by other features: abandoned cart recovery emails (Email 2) can attach a coupon.
- Multi-tenant: all coupon data is scoped by `tenantId`.

---

## Where Coupons Are Created

Two entry points, same underlying data:

### Entry Point 1 — Store → Product → Coupons tab

The most natural flow. When a tenant is managing a specific product in the store, they can create and view coupons for that product directly.

- `appliesTo` is pre-set to `'product'` and locked to the current product
- Shows only coupons for that product
- Accessible from: `Admin → Store → [Product] → Coupons tab`

### Entry Point 2 — Marketing → Coupons (Global Panel)

A global view of all coupons across all store products. For tenants who prefer to manage everything from one place.

- `appliesTo` must be selected explicitly (no default — required field)
- Shows all coupons with a product filter
- Accessible from: `Admin → Marketing → Coupons`

---

## Discount Types

| Type | Behavior | Example |
|---|---|---|
| `percentage` | Discount = price × % | 20% off → $80 course becomes $64 |
| `fixed_amount` | Discount = fixed USD off | $10 off → $80 becomes $70 |
| `fixed_price` | Override price to fixed amount | Always $49, regardless of original price |
| `free` | 100% discount — $0 | Full free access |

---

## Requirements

- [ ] Tenants can create coupons from Store product page (pre-scoped) and Marketing → Coupons (manual scope selection)
- [ ] Four discount types: `percentage`, `fixed_amount`, `fixed_price`, `free`
- [ ] `appliesTo` options: `'product'` (specific), `'all_products'`, `'category'`
- [ ] A coupon with `appliesTo = 'product'` requires a valid `storeProductId`
- [ ] A coupon with `appliesTo = 'category'` requires a valid `storeCategoryId`
- [ ] Optional expiry date — coupon auto-invalidates after this date
- [ ] Optional total usage limit (`maxUses`) — coupon auto-invalidates when exhausted
- [ ] Optional per-student usage limit (`maxUsesPerStudent`, default: 1)
- [ ] Coupon code is case-insensitive at validation (stored uppercase)
- [ ] Coupon codes must be unique per tenant (not globally)
- [ ] Tenant can deactivate a coupon without deleting it (history preserved)
- [ ] Hard delete only allowed if `usedCount = 0`
- [ ] Students enter the coupon code at checkout — real-time validation with price update
- [ ] Coupon is validated against the specific product being purchased at checkout
- [ ] If the store product is inactive or unlisted, the coupon is invalid even if the coupon itself is active
- [ ] Specific error codes returned for each invalid state

---

## Data Model

### `Coupon` entity (new)

```typescript
{
  id: uuid
  tenantId: uuid

  code: string                       // stored uppercase, unique per tenant
  type: enum                         // 'percentage' | 'fixed_amount' | 'fixed_price' | 'free'
  value: number                      // % or USD; irrelevant if type = 'free'

  appliesTo: enum                    // 'product' | 'all_products' | 'category'
  storeProductId: uuid | null        // required if appliesTo = 'product'
  storeCategoryId: uuid | null       // required if appliesTo = 'category'

  expiresAt: Date | null
  maxUses: number | null             // null = unlimited
  maxUsesPerStudent: number          // default: 1
  usedCount: number                  // default: 0

  active: boolean                    // default: true

  createdAt: Date
  updatedAt: Date
}
```

### `CouponRedemption` entity (new)

```typescript
{
  id: uuid
  couponId: uuid
  orderId: uuid
  storeProductId: uuid
  studentId: uuid
  tenantId: uuid
  discountAmount: number             // actual USD amount discounted on this order
  redeemedAt: Date
}
```

### `Order` entity — additions

```typescript
couponId: uuid | null                // FK → Coupon
discountAmount: number               // default: 0
```

---

## API Endpoints

### Admin (tenant)

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/t/:tenantSlug/admin/coupons` | List all coupons (filterable by `storeProductId`, `active`) |
| `GET` | `/api/t/:tenantSlug/admin/store/products/:productId/coupons` | List coupons scoped to a product |
| `POST` | `/api/t/:tenantSlug/admin/coupons` | Create coupon |
| `PUT` | `/api/t/:tenantSlug/admin/coupons/:id` | Update coupon |
| `PATCH` | `/api/t/:tenantSlug/admin/coupons/:id/deactivate` | Soft deactivate |
| `DELETE` | `/api/t/:tenantSlug/admin/coupons/:id` | Hard delete (only if `usedCount = 0`) |

### Student (checkout)

**`POST /api/t/:tenantSlug/coupons/validate`**

```typescript
// Request
{ code: string, storeProductId: uuid }

// Response — valid
{ valid: true, discountAmount: number, finalPrice: number, couponId: uuid }

// Response — invalid
{
  valid: false,
  reason:
    | 'not_found'              // code doesn't exist for this tenant
    | 'inactive'               // coupon was deactivated
    | 'expired'                // past expiresAt
    | 'exhausted'              // maxUses reached
    | 'limit_per_student'      // student already used this coupon
    | 'not_applicable'         // coupon doesn't apply to this product
    | 'product_not_in_store'   // product is not active in the store
}
```

---

## Checkout Integration

1. Student enters coupon code → call `POST /coupons/validate` → show updated price
2. Student submits checkout → include `{ couponCode, couponId }` in the checkout payload
3. Backend re-validates coupon at payment confirmation (not just at entry — price could have changed)
4. On successful payment:
   - Create `CouponRedemption` record
   - Increment `coupon.usedCount`
   - Store `couponId` and `discountAmount` on the `Order` record
5. Coupon validation at step 3 is atomic — use a DB transaction to prevent race conditions on `usedCount`

---

## Admin UI

### Entry Point 1 — Store Product Page (Coupons tab)

```
[Product: UI Design Course]
[Details]  [Pricing]  [Coupons]  [Stats]
──────────────────────────────────────────────────────────
Coupons for this product
[ + New Coupon ]

Code          Type        Value    Uses     Expires     Status
UIOPEN20      %           20%      8 / 50   Jun 1       Active   [Edit] [Deactivate]
UILAUNCH      Free        —        2 / 10   —           Active   [Edit] [Deactivate]
UISUMMER      $ off       $10      50 / 50  —           Exhausted
```

**New Coupon form (from Store):**
- `Applies to` is pre-filled with the current product and is read-only
- All other fields are editable

---

### Entry Point 2 — Marketing → Coupons (Global Panel)

```
All Coupons
──────────────────────────────────────────────────────────────────
[ + New Coupon ]     [ Filter: All products ▼ ]

Code          Product                Type    Value   Uses     Expires     Status
SUMMER20      All products           %       20%     34 / —   Jun 30      Active
UIOPEN20      UI Design Course       %       20%     8 / 50   Jun 1       Active
UILAUNCH      UI Design Course       Free    —       2 / 10   —           Active
EXCEL10       Excel Masterclass      $ off   $10     50 / 50  —           Exhausted
```

**New Coupon form (from Marketing):**
- `Applies to` is a required selector with no default:
  ```
  Applies to
  ○ Specific product  → [ Select product ▼ ]
  ○ All store products
  ○ Category          → [ Select category ▼ ]
  ```

---

### Coupon Form (shared, both entry points)

```
Code *                [ SUMMER20          ]  (auto-uppercased)
Discount type *       [ Percentage ▼      ]
Value *               [ 20                ]  %
Applies to *          [ (pre-filled or select) ]

── Optional limits ─────────────────────────────
Expiry date           [ _________________ ]
Max total uses        [ _________________ ]  (leave empty = unlimited)
Max uses per student  [ 1                 ]

[ Save Coupon ]
```

---

## Acceptance Criteria

- [ ] Tenant can create a coupon from the Store product page with `appliesTo` pre-filled and locked
- [ ] Tenant can create a coupon from Marketing → Coupons with manual product scope selection
- [ ] All four discount types calculate the correct final price
- [ ] `validate` endpoint returns the correct `reason` for each invalid state
- [ ] Expired coupons are automatically rejected after `expiresAt`
- [ ] Exhausted coupons are automatically rejected when `usedCount >= maxUses`
- [ ] A student who has used a coupon once cannot reuse it (when `maxUsesPerStudent = 1`)
- [ ] Coupon validation is re-run at payment confirmation, not only at code entry
- [ ] `usedCount` increment is atomic — concurrent purchases don't exceed `maxUses`
- [ ] Deactivated coupons return `reason: 'inactive'`
- [ ] Hard delete is blocked when `usedCount > 0`
- [ ] `couponId` and `discountAmount` are stored on the Order record
- [ ] Coupon usage stats are visible in both the Store product view and the global Marketing panel

---

## Open Questions

| # | Question | Recommendation |
|---|---|---|
| 1 | Can a flash sale and a coupon be combined on the same checkout? | No — if a flash sale is active, coupon input is hidden. Flash sale price takes precedence. |
| 2 | Should the global coupon panel show usage revenue generated per coupon? | Yes — add `totalRevenue` to the list (sum of orders where this coupon was used) |
| 3 | Can a tenant create a coupon for a product that has no price (free course)? | No — coupon requires a paid product |
| 4 | Should `free` type coupons skip the MercadoPago checkout entirely? | Yes — if finalPrice = $0, bypass payment processor and create order directly |

---

## References

- `spec-marketing-suite.md` — abandoned cart recovery (Email 2) references coupon IDs from this system
- `spec-plan-billing-features.md` — coupon feature may be gated by plan
- Existing `Order` entity in `lms-backend` — extend with `couponId` and `discountAmount`
- Existing Store / `StoreProduct` entity in `lms-backend` — coupons are scoped to store products
