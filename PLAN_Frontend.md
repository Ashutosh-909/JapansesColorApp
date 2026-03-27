# Kasane — Frontend Implementation Plan (Mobile-Friendly Web App)

> **Goal:** Build the complete mobile-friendly web UI with dummy data. No backend, no API calls — all data is hardcoded/mocked. Every screen and interaction described in UIDesign.md is functional and pixel-faithful.

---

## Tech Stack

| Layer | Choice | Why |
|-------|--------|-----|
| **Framework** | React 19 + Vite | Fast builds, SPA, ideal for mobile-first web app |
| **Styling** | CSS Modules + CSS custom properties | Design tokens map 1:1 to CSS vars; no extra dependency |
| **Routing** | React Router v7 | File-ish routing, matches screen structure in design doc |
| **State** | React `useState` / `useContext` | Dummy data phase doesn't need heavy state management |
| **Supabase Client** | `@supabase/supabase-js` | Direct auth, DB, and storage access (added in integration phase) |
| **Fonts** | Google Fonts: Inter + Noto Sans JP | As specified in UIDesign.md typography section |
| **Icons** | Lucide React | Lightweight, tree-shakeable icon set |
| **Linting** | ESLint + Prettier | Consistent code style |

---

## Project Structure

```
kasane-web/
├── index.html
├── vite.config.js
├── package.json
├── public/
│   └── fonts/                    # Fallback font files if needed
├── src/
│   ├── main.jsx                  # App entry point
│   ├── App.jsx                   # Router setup
│   ├── tokens.css                # Design tokens (colors, spacing, typography)
│   ├── global.css                # Reset + global styles
│   ├── data/
│   │   ├── dummyCombinations.js  # 8-10 hardcoded color combos (replaced by compute in integration phase)
│   │   ├── dummyWardrobe.js      # 12 dummy clothing items (replaced by Supabase in integration phase)
│   │   ├── japaneseColors.json   # ~465 Japanese colors with hex, names, CIELAB (bundled static)
│   │   └── colorCombinations.json # ~300 color combos with hex pairs (bundled static)
│   ├── lib/
│   │   ├── colorExtractor.js     # colorthief wrapper → top 5 dominant colors
│   │   ├── colorMatcher.js       # CIEDE2000 hex→CIELAB→Delta-E matching
│   │   ├── comboEngine.js        # Combination completeness computation
│   │   ├── suggestionEngine.js   # "What to buy next" ranking
│   │   └── supabase.js           # Supabase client init (added in integration phase)
│   ├── components/
│   │   ├── BottomTabBar/         # 3-tab navigation (Combos, Clothes, Profile)
│   │   ├── ComboCard/            # Color combo card with completion badge
│   │   ├── ColorCircle/          # Reusable color circle (filled, dashed/missing)
│   │   ├── ClothingCard/         # Wardrobe item card with colors & category
│   │   ├── CategoryChip/         # Category selector chip/dropdown
│   │   ├── SeasonBadge/          # Spring 🌸 / Autumn 🍂 pills
│   │   ├── CompletionBadge/      # 3/3, 2/3, 1/3 pill badge
│   │   ├── ProgressBar/          # Thin completion progress bar
│   │   ├── Button/               # Primary + Secondary + Disabled
│   │   └── UploadZone/           # Dashed upload area (dummy — no real upload)
│   └── screens/
│       ├── SplashScreen/         # Screen 2.1
│       ├── UploadScreen/         # Screen 2.2
│       ├── CategorizeScreen/     # Screen 2.3
│       ├── DashboardScreen/      # Screen 2.4 (main)
│       ├── ComboDetailScreen/    # Screen 2.5
│       ├── MyClothesScreen/      # Screen 2.7
│       └── ProfileScreen/        # Stub profile tab
```

---

## Phases

### Phase 1 — Scaffold & Design Tokens

**Tasks:**
1. Initialize Vite + React project (`npm create vite@latest kasane-web -- --template react`)
2. Install dependencies: `react-router-dom`, `lucide-react`
3. Create `tokens.css` with ALL design tokens from UIDesign.md §1.1:
   - Color tokens (background, text, border, accents)
   - Typography scale (display, heading 1/2, body, caption, etc.)
   - Spacing (4px grid multiples)
   - Border radii, shadows, card sizes
4. Create `global.css` with CSS reset, dark background, font imports (Inter + Noto Sans JP via Google Fonts)
5. Set up React Router with routes:
   - `/` → SplashScreen
   - `/upload` → UploadScreen
   - `/categorize` → CategorizeScreen
   - `/combos` → DashboardScreen
   - `/combos/:id` → ComboDetailScreen
   - `/clothes` → MyClothesScreen
   - `/profile` → ProfileScreen

**Acceptance:**
- App loads at `localhost:5173` with dark background and correct fonts
- All routes resolve to stub screens

---

### Phase 2 — Dummy Data

**Tasks:**
1. Create `dummyCombinations.js` — array of 8-10 combos:
   ```js
   { id, nameJp, nameEn, season, colors: [{hex, nameJp, nameEn, romaji}], completionOwned, completionTotal }
   ```
   Use real colors from `JapaneseColorCombos_Database.json` and map to Japanese color names from `UIDesign.md` accent table.
2. Create `dummyWardrobe.js` — array of 12 items:
   ```js
   { id, imageUrl (placeholder), category: 'Top'|'Bottom'|..., dominantColors: [{hex, japaneseNameJp, japaneseNameEn}] }
   ```
   Use placeholder image URLs (solid color rectangles or `picsum.photos` with color overlays).
**Acceptance:**
- Importing any data file returns well-structured arrays
- Data covers all combo completion states (3/3, 2/3, 1/3)

---

### Phase 3 — Shared Components

Build bottom-up, smallest components first. Each component gets a folder with `Component.jsx` + `Component.module.css`.

**Tasks (in order):**
1. `ColorCircle` — renders filled or dashed (missing) state, size prop (sm/md/lg mapping to 20/40/56px)
2. `CompletionBadge` — renders "3/3 ✓", "2/3", "1/3" with correct bg colors
3. `SeasonBadge` — renders season pill with emoji
4. `Button` — primary, secondary, disabled variants per UIDesign.md §1.4
5. `CategoryChip` — selected/unselected states, tappable
6. `ProgressBar` — thin bar with amber/green fill
7. `ClothingCard` — photo placeholder + color dots + category label
8. `ComboCard` — color circles, combo name (JP/EN), season badge, completion badge, left border color
9. `BottomTabBar` — 3 tabs with active/inactive states, routes to /combos, /clothes, /profile
10. `UploadZone` — dashed border area with icon (static, no real upload logic)

**Acceptance:**
- Each component renders correctly in isolation
- All states (hover, active, disabled) are styled per spec

---

### Phase 4 — Screens

**Tasks:**

1. **SplashScreen (§2.1)**
   - App name "Kasane" with letter-spacing
   - "重ね" subtitle
   - Japanese + English quote
   - 3 horizontal outfit cards (dummy color rectangles as stand-ins for photos, color circles underneath, combo name)
   - "Get Started" button → navigates to `/upload`

2. **UploadScreen (§2.2)**
   - Upload zone (dashed area, icon, "Tap to upload" text)
   - Two side-by-side buttons: "📷 Take Photo" / "🖼️ Choose from Gallery" (no-op)
   - Caption: "No account needed..."
   - Dummy thumbnails row (4 small squares + "+" button) — hardcoded
   - Divider + "or" + Google / Apple login buttons (no-op)
   - "Continue" logic → navigates to `/categorize`

3. **CategorizeScreen (§2.3)**
   - Header with "Categorize Your Clothes" title
   - 2-column grid of `ClothingCard` from dummy data
   - Each card has a `CategoryChip` dropdown (tap opens a bottom sheet or select-like UI with: Top, Bottom, Outerwear, Dress, Accessory, Shoes)
   - Extracted color dots on each card (from dummy data)
   - "Go →" button (disabled until all items categorized) → navigates to `/combos`

4. **DashboardScreen (§2.4) — THE MAIN SCREEN**
   - "Your Combinations" header + [+] button
   - 2-up grid of `ComboCard` showing ALL combos from dummy data
   - Tapping any combo card → navigates to `/combos/:id`
   - `BottomTabBar` at bottom (Combos tab active)
   - **Paywall-ready:** combo data includes a `locked` boolean (always `false` for now). When paywall is added later, toggle this to show a `PaywallOverlay` after the Nth card

5. **ComboDetailScreen (§2.5)**
   - Back button → go back
   - Combo JP + EN name, season badge
   - "The Palette" — 56px color circles with have/need status
   - Progress bar
   - "Your Matching Clothes" — grid of matching dummy wardrobe items
   - "Missing" section — card showing what color is missing + suggestion text

6. **MyClothesScreen (§2.7)**
   - "My Clothes (N)" header + [+] button
   - Category filter chips (horizontal scroll): All, Tops, Bottoms, Outerwear, Dress, Accessory, Shoes
   - 2-column grid of `ClothingCard` from dummy wardrobe
   - Filtering works on the dummy data
   - `BottomTabBar` at bottom (Clothes tab active)

7. **ProfileScreen (stub)**
   - Simple placeholder: "Profile" heading, avatar placeholder circle, "Settings" link, "Subscription: Free" text
   - `BottomTabBar` at bottom (Profile tab active)

**Acceptance:**
- Full navigable flow: Splash → Upload → Categorize → Dashboard → Detail
- Tab navigation works: Dashboard ↔ My Clothes ↔ Profile
- Category filtering works on My Clothes
- All styling matches UIDesign.md dimensions, colors, typography

---

### Phase 5 — Interactions & Polish

**Tasks:**
1. Implement transitions per UIDesign.md §4:
   - Splash → Upload: fade + slide up (400ms)
   - Upload → Categorize: slide left (300ms)
   - Categorize → Dashboard: scale up + fade (500ms)
2. Implement state changes per §3:
   - Combo card hover: background `#2e2e5c`
   - Button pressed/disabled states
   - Upload zone drag-hover state (visual only)
   - Category chip selection animation
3. Add mobile viewport meta tag, ensure touch-friendly tap targets (min 44px)
4. Test on mobile viewport widths (375px, 390px, 414px) — ensure no horizontal overflow
5. Add smooth scrolling, snap scrolling on the splash outfit cards

**Acceptance:**
- Transitions are smooth and match specified durations
- No layout issues at 375px width
- All interactive elements have visible feedback (hover/press/active)

---

## Dummy Data ↔ Real Data Contract

To make backend integration easy, dummy data files will export the **exact shapes** the backend will later provide. Key interfaces:

```ts
// Combination
{ id, nameJp, nameEn, season, colors: [{hex, nameJp, nameEn, romaji}], completionOwned, completionTotal }

// WardrobeItem
{ id, imageUrl, category, dominantColors: [{hex, japaneseNameJp, japaneseNameEn}] }

```

In the integration phase (see PLAN_Backend.md Phase 4), dummy imports are replaced by:
- Wardrobe data → fetched from Supabase via `@supabase/supabase-js`
- Combination data → computed client-side by `comboEngine.js` using wardrobe + bundled `colorCombinations.json`
- Color matching → computed client-side by `colorMatcher.js` using bundled `japaneseColors.json`

> **Paywall-readiness note:** The `Combination` shape includes a `locked` field (always `false` in dummy data). A future `BuySuggestion` shape will be added when the paywall/premium tier is implemented.

---

## Out of Scope (Frontend Dummy Data Phase)

- Real image upload / camera access (added in integration phase — see PLAN_Backend.md)
- Actual color extraction from images (added in integration phase)
- Authentication (Google/Apple OAuth via Supabase — added in integration phase)
- Payment / paywall (Stripe, RevenueCat, PaywallOverlay, PaywallSheet, premium gating)
- PWA / Service Worker
- Accessibility audit (will be a later phase)
