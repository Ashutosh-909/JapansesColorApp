# Kasane — Japanese Color Wardrobe App Design Document

A cross-platform (iOS, Android, Web) wardrobe management app built on Japanese traditional color theory (和色 Wa-iro + 襲の色目 Kasane no Irome). Users upload clothing photos, the app extracts dominant colors client-side, maps them to Japanese colors, detects color combinations they own, and suggests what to buy next. Premium features (annual subscription) unlock buy recommendations + seasonal outfit suggestions.

---

## 1. Recommended Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| **Frontend** | React Native + Expo SDK 52+ (with React Native Web) | Single codebase for iOS, Android, Web. JS ecosystem has best client-side color extraction libs |
| **Routing** | Expo Router (file-based) | Unified routing + deep linking across all platforms |
| **State** | Zustand + TanStack Query | Lightweight global state + server-state caching |
| **Auth** | Supabase Auth | Google + Apple social login with Row Level Security |
| **Database** | Supabase (PostgreSQL) | User data, wardrobe items, color mappings, subscription status |
| **Image Storage** | Azure ADLS Gen2 | Per your preference. SAS-token upload from client, CDN retrieval |
| **Color Extraction** | `colorthief` (web) + `react-native-image-colors` (native) | Client-side, zero server cost, instant feedback |
| **Color Matching** | Delta-E 2000 (CIEDE2000) | Perceptually accurate color distance — far better than RGB Euclidean |
| **Payments (Mobile)** | RevenueCat | Abstracts App Store / Play Store billing |
| **Payments (Web)** | Stripe Checkout | Web subscription management |

---

## 2. Data Model

**Core tables** in Supabase PostgreSQL:

- **wardrobe_items** — user_id, image_url, clothing_type, `dominant_colors` (JSONB array of {hex, percentage, japanese_color_id}), season_tags
- **japanese_colors** (seed/reference) — 465+ traditional colors with name_en, name_ja, hex, rgb, category, season, cultural description
- **color_combinations** (seed/reference) — ~200 Kasane no Irome + traditional pairings with required colors, season, occasion
- **user_combinations** (computed/cached) — per-user completeness scores for each combination, matching items, missing colors

All tables protected with Row-Level Security: users can only access their own data; reference tables are read-only for all authenticated users.

---

## 3. Feature Breakdown

**FREE Tier:**
- Upload clothing photos (camera/gallery), up to **50 items**
- Manual clothing categorization (tops, bottoms, outerwear, dresses, accessories, shoes)
- Auto-extract dominant colors (top 3-5) client-side
- Map to nearest Japanese traditional color (Delta-E ≤ 15 threshold)
- View **first 5 color combinations** with completion status (e.g., 2/3, 3/3)
- Tap any combo → see which owned clothes match it

**PREMIUM Tier (🔒 Annual ~$29.99/yr, 7-day trial):**
- **AI-Powered Categorization** — automatic clothing type detection from uploaded photos (no manual tagging needed)
- **Unlock all color combinations** — full library of 200+ Kasane no Irome & traditional pairings (free tier limited to 5)
- **"What Should I Buy Next"** — ranked suggestions for colors + clothing types that complete the most combinations, weighted by seasonal relevance and versatility
- **Unlimited wardrobe** — remove 50-item cap

---

## 4. Screen Structure & App Flow

The app is **combination-centric** — the main screen IS the combinations dashboard, not a wardrobe grid.

```
(splash)          → Splash screen with quote + combo examples
(auth)
  ├── upload.tsx  → Upload clothes + categorize → "Go" button
  └── login.tsx   → Social login (Google / Apple) for returning users
(main)
  ├── combos/
  │    ├── index.tsx    → THE main screen: combo grid with completion badges
  │    ├── [id].tsx     → Combo detail: matching clothes for this combo
  │    └── buy-next.tsx → "What should I buy next" 🔒
  ├── wardrobe/
  │    ├── index.tsx    → Manage uploaded clothes (add/remove/re-categorize)
  │    └── add.tsx      → Upload more items
  └── profile/
       ├── index.tsx       → User profile, settings
       └── subscription.tsx → Manage subscription / upgrade
```

**Key flow:** Splash → Upload clothes → Categorize (manual or AI 🔒) → Go → **Combinations dashboard** (the core experience) → Tap combo → See matching clothes → Scroll down → "What should I buy next" 🔒

---

## 5. Paywall Architecture

**What's behind the paywall:**

| Feature | Free | Premium |
|---------|------|----------|
| Upload clothes | ✅ (up to 50) | ✅ Unlimited |
| Manual clothing categorization | ✅ | ✅ |
| AI auto-categorization | ❌ | ✅ |
| View color combinations | First 5 combos | All 200+ combos |
| Tap combo → see matching clothes | ✅ (for free combos) | ✅ (all combos) |
| "What should I buy next" | ❌ | ✅ |

**Paywall trigger points:**
1. On the combinations screen: after the first 5 combo cards, show a locked section with blurred combo previews + "Unlock all combinations" CTA
2. AI categorization button during upload: tapping shows paywall sheet
3. "What should I buy next" section at bottom of main screen: blurred preview + "Go Premium" CTA

**Implementation:**
- Mobile: RevenueCat SDK → webhook → Supabase Edge Function → update `users.subscription_tier`
- Web: Stripe Checkout → webhook → same Supabase Edge Function
- Client reads `subscription_tier` from user profile; `<PremiumGate>` wrapper component gates UI
- RLS policies additionally guard premium data server-side (defense in depth)

---

## 6. Japanese Color Matching Pipeline

1. User uploads image → extract top 5 dominant colors (hex + %)
2. Convert extracted hex → CIELAB color space
3. For each color, find nearest Japanese color using Delta-E 2000 (threshold ≤ 15)
4. Save mapping to `wardrobe_items.dominant_colors`
5. Recompute combination completeness across wardrobe → cache in `user_combinations`

**Color dataset:** Shipped as bundled JSON (~100KB) — no network call needed for lookups. Sourced from Nippon Colors, 和色大辞典, and your reference PDF.

---

## 7. User Flow (Screen-by-Screen)

### Screen 1: Splash
- Dark background with the app name **"Kasane"** (重ね) in large elegant text
- A Japanese quote about color awareness beneath the title:
  > *"色は沈黙の言葉"*
  > *"Color is a silent language."*
- Below the quote: **2–3 real-life outfit photos** showing Japanese color combinations in action (e.g., a 朱色 vermillion scarf + 群青 ultramarine coat, a 桜色 blush top + 藤色 wisteria skirt). Each outfit photo has its combo colors shown as small circles alongside.
- This immediately communicates what the app does: color combinations on real clothes.
- **"Get Started"** button at bottom

### Screen 2: Login / Upload (The Fork)
Two clear paths on one screen:

**Top section:** "Upload your clothes to discover your color combinations"
- Large upload area / drag-and-drop zone (or "Take Photo" / "Choose from Gallery" on mobile)
- Users can upload multiple images at once
- Subtext: *"No account needed to try — upload and see your combos instantly"*

**Bottom section:** "Already have an account?"
- **"Log In"** link → social login (Google / Apple)
- Returning users go straight to their saved combinations dashboard

### Screen 3: Categorize & Go
After uploading, the user sees a grid of their uploaded clothing thumbnails. For each item:

- **Manual categorization:** A dropdown/chip selector to tag each item: Top / Bottom / Outerwear / Dress / Accessory / Shoes
- **"✨ Auto-categorize with AI" button** at the top — tapping this shows a paywall prompt (premium feature). If premium, it auto-tags all items.
- User reviews the tags, adjusts if needed
- Big **"Go →"** button at the bottom to proceed

*Behind the scenes:* Colors are extracted from each image client-side during upload, and mapped to Japanese colors.

### Screen 4: Combinations Dashboard (THE MAIN SCREEN)
This is the core of the app — a grid of color combination cards.

**Each combo card shows:**
- The combination's color palette: 2–3 color circles (using the actual Japanese colors)
- Combination name in Japanese + English (e.g., "春曙 — Spring Dawn")
- **Completion badge:** e.g., "2/3" or "3/3" showing how many items the user owns that match
- A checkmark overlay if fully complete (3/3)
- Partial combos show which color is missing as a dashed-outline circle

**Layout:**
- First **5 combinations are FREE** — fully visible, tappable
- After the 5th card: a **paywall divider** — blurred combo cards behind a frosted overlay: "🔒 Unlock all 200+ combinations" + "Go Premium" button
- Below the paywall section: **"What Should I Buy Next"** section (also locked for free users)
  - Blurred preview showing a suggestion like "Buy a 藤色 (Wisteria) top → completes 4 combinations"
  - "🔒 Unlock Buy Suggestions" CTA

**Tapping a combo card (free or unlocked):**
→ Opens the **Combo Detail Screen**

### Screen 5: Combo Detail
When the user taps a combination card:

- **Header:** Combination name (JP + EN) + the color palette circles
- **Season badge:** e.g., "Spring 🌸" or "Autumn 🍂"
- **"Your matching clothes" section:** Grid of the user's actual clothing photos that match this combination's colors. Each photo has a small circle showing which color in the combo it represents.
- **Missing colors:** If incomplete, a section below shows: "You're missing: 藤色 (Wisteria)" with the color circle and a suggestion of what clothing type to look for.
- **"Back to Combinations"** button

### Navigation
Simple bottom tab bar with 3 tabs:
- **Combinations** (the main screen, active by default)
- **My Clothes** (manage uploaded items, add more, re-categorize)
- **Profile** (account, subscription, settings)

### Returning User Flow
- Open app → auto-login → lands directly on Combinations Dashboard with saved data
- "My Clothes" tab lets them add more items → combos automatically recompute

### UX Decisions

| Decision | Rationale |
|----------|----------|
| No account required to try | Eliminates friction — users see value (their combos) before committing |
| Combo-first main screen (not wardrobe grid) | The value proposition IS the combinations; wardrobe is just input |
| 5 free combos, rest behind paywall | Gives enough to demonstrate value; creates natural upgrade moment |
| AI categorization behind paywall | Manual tagging is functional; AI is a convenience upgrade worth paying for |
| "What to buy next" behind paywall | The highest-value feature; strong motivator to convert |

---

## 8. Implementation Phases

**Phase 1: Foundation (Weeks 1-3)**
1. Initialize Expo project + TypeScript + Expo Router
2. Set up Supabase (auth, DB schema, RLS policies)
3. Set up Azure ADLS Gen2 + SAS token generation (Supabase Edge Function)
4. Curate Japanese color JSON dataset (465+ colors from PDF + Nippon Colors)
5. Curate Kasane no Irome combination dataset (~200 combos)
6. Implement social login (Google + Apple)
7. Design system: Japanese-aesthetic UI kit

**Phase 2: Upload & Color Engine (Weeks 4-6)**
8. Multi-image upload flow (camera/gallery, compress)
9. Azure blob upload with SAS tokens
10. Client-side color extraction (platform-specific implementations)
11. Color matching engine (hex → Japanese color via Delta-E 2000)
12. Manual clothing categorization UI (chips/dropdowns per item)
13. "Categorize & Go" screen with review + proceed flow

**Phase 3: Combinations Dashboard (Weeks 7-9)**
14. Combination matching algorithm + completeness scoring (e.g., 2/3, 3/3)
15. Combinations grid UI with completion badges
16. Combo detail screen (matching clothes + missing colors)
17. Free tier gating: first 5 combos free, rest locked

**Phase 4: Premium Features (Weeks 10-12)**
18. RevenueCat (mobile) + Stripe (web) integration
19. Subscription webhooks → Supabase Edge Function
20. `<PremiumGate>` component + paywall triggers (combo limit, AI categorize, buy next)
21. AI-powered clothing categorization (server-side image classification)
22. "What should I buy next" recommendation engine

**Phase 5: Polish & Launch (Weeks 13-15)**
24. Onboarding flow + empty states
25. Performance optimization (image caching, virtualized lists)
26. Accessibility audit
27. App Store assets + beta testing
28. Production deployment + monitoring

---

## 9. Verification Plan

1. **Color accuracy** — upload 20 known-color items, verify Japanese color mapping within Delta-E ≤ 15
2. **Combination detection** — seed test wardrobe with known combos, verify detection
3. **Cross-platform parity** — identical flows on iOS, Android, Web
4. **Paywall integrity** — verify free users can't access premium API responses (test RLS directly)
5. **Payment flow** — test purchase, cancellation, restoration on all platforms
6. **Performance** — 200+ item wardrobe loads in < 2s; color extraction < 3s per image

---

## 10. Decisions & Scope

| In Scope (V1) | Excluded (V1) |
|---|---|
| iOS + Android + Web (single codebase) | Offline mode |
| Client-side color extraction | Social/community features |
| Wa-iro + Kasane no Irome color systems | Affiliate links / shopping integration |
| Freemium + annual subscription | AI/ML outfit generation |
| Google + Apple social login | Multi-language (English only) |
| English only | Watch companion apps |

---

## 11. Further Considerations

1. **Background Removal** — Color extraction picks up wall/floor colors. Consider a lightweight background removal step (client-side ONNX model or `remove.bg` API) in Phase 2 as enhancement. For V1, mitigate with a user-selectable crop region during upload.

2. **Cross-Platform Color Consistency** — Native color extraction APIs (Android Palette / iOS UIImage) may differ from web's colorthief. Normalizing to CIELAB before Japanese color matching should minimize discrepancies.

3. **Clothing Segmentation** — For V2, ML-based garment segmentation would isolate the clothing region and ignore buttons/tags/background. Out of scope for V1.