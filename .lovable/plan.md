# Header Cleanup & Mega Menu Fix

Tighten the desktop header so it stops feeling crowded, fix the logo aspect ratio, close the empty gap above the mega menu, and hide the cart badge when the cart is empty.

## Changes in `src/components/layout/SiteHeader.tsx`

### 1. Reduce nav crowding

- Collapse the standalone **Login** and **Register** buttons into a single icon-only **Account** dropdown (User icon) that opens a menu with `Login` and `Create account` items. Matches the pattern already used when a user is signed in.
- Keep the primary **Get a quote** CTA and the language switcher.

### 2. Move "Export" under Solutions

- Remove `/seafood-export` from the top-level `NAV` array.
- Convert the Solutions entry into a lightweight dropdown containing:
  - Services & Solutions → `/services-solutions`
  - Seafood Export → `/seafood-export`
- Mobile menu: nest Export as an indented child under Solutions.

### 3. Fix logo aspect ratio

- Current `<img>` uses fixed `width={260} height={80}` while the source file's real ratio differs, causing squish. Replace with intrinsic sizing:
  - Drop hardcoded `width`/`height` attributes.
  - Constrain by height only (`h-16` rest / `h-10` scroll on desktop) with `w-auto` so the browser preserves ratio.
  - Same treatment for the mobile square variant (`h-10`).
- Reduce the header rest height from `h-28` to `h-20` (desktop) since the logo no longer needs the extra padding — this also removes visual heaviness.

### 4. Fix mega menu top gap

- The panel currently sits at `top-full` with `mt-3` on the inner card, leaving a visible empty band between the header and the panel and creating a hover dead-zone.
- Remove `mt-3` and let the panel sit flush against the header bottom border.
- Add a small invisible hover bridge (`pt-2` on the outer wrapper) so cursor travel between trigger and panel stays inside the hover region without showing empty whitespace.

### 5. Hide empty cart indicator

- The cart button always renders; only the badge is conditional on `count > 0`, which is already correct — but verify no stray "0" or empty pill is shown. If the empty-state drawer is auto-opening on mount, gate `openDrawer` calls so the drawer only opens on explicit click. (Investigate `CartContext` briefly; if it auto-opens, remove that side effect.)

## Out of scope

- No changes to translations, routes, or business logic.
- Footer, mobile drawer visual style, and mega menu content stay as-is aside from the spacing fix.
