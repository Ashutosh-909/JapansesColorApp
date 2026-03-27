# Kasane — Backend Implementation Plan (Supabase + Client-Side Compute)

> **Goal:** Set up Supabase for auth, data persistence, and image storage. All compute (color extraction, CIEDE2000 matching, combination computation, buy-next suggestions) runs in the browser. No custom backend server — the frontend talks directly to Supabase via `@supabase/supabase-js`.

---

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                     Browser                          │
│                                                      │
│  colorthief        → extract dominant colors         │
│  CIEDE2000 module  → match to Japanese colors        │
│  combo engine      → compute combination status      │
│  suggestion engine → "what to buy next" ranking      │
│                                                      │
│  @supabase/supabase-js  → auth, DB CRUD, storage    │
└───────────────┬─────────────────────────┬────────────┘
                │                         │
         Supabase Auth             Supabase Storage
         (Google/Apple)            (wardrobe images)
                │                         │
         Supabase PostgreSQL ─────────────┘
         (wardrobe_items, user_profiles)
         + RLS policies
```

**No Express server. No Edge Functions. No backend deployment.**

---

## Tech Stack

| Layer | Choice | Why |
|-------|--------|-----|
| **Database** | Supabase (PostgreSQL) | Auth, RLS, Storage — single managed service |
| **Auth** | Supabase Auth (Google + Apple OAuth) | Social login with Row Level Security built in |
| **Image Storage** | Supabase Storage | Built-in, no SAS tokens needed, RLS on buckets |
| **Color Extraction** | `colorthief` (browser) | Client-side, zero server cost, instant |
| **Color Matching** | CIEDE2000 (Delta-E) in browser | Pure math — ~465 colors × 5 extracted = ~2300 comparisons (<10ms) |
| **Reference Data** | Bundled static JSON | `japaneseColors.json` + `colorCombinations.json` shipped with the app (~150KB total) |
| **Client SDK** | `@supabase/supabase-js` | Direct DB access from browser with RLS enforcement |

> **Paywall-readiness:** The `user_profiles` table includes `subscription_tier` and Stripe fields from the start. Stripe integration and premium gating will be added in a future phase.

---

## Performance Justification

All compute is client-side. Here's why this is fine:

| Operation | Scale | Expected time |
|-----------|-------|---------------|
| Color extraction | 1 image → top 5 colors | ~50ms (colorthief) |
| CIEDE2000 matching | 5 colors × 465 Japanese colors = 2,325 comparisons | <10ms |
| Combo computation | ~300 combos × set intersection | <5ms |
| Buy-next suggestions | Aggregate over 300 combos | <5ms |
| Total per upload | | ~70ms |

The reference data (Japanese colors + combinations) is ~150KB JSON — comparable to a single image. Loaded once on app start, cached in memory.

---

## What Supabase Handles (server-side)

| Concern | Supabase Feature |
|---------|-----------------|
| **Auth** | Supabase Auth — Google/Apple OAuth, JWT tokens, session management |
| **Data storage** | PostgreSQL — wardrobe items, user profiles |
| **Image storage** | Supabase Storage — bucket with RLS, signed URLs for private images |
| **Security** | Row Level Security — users only see/modify their own data |
| **Auto profile creation** | DB trigger — `auth.users` insert → create `user_profiles` row |

## What the Browser Handles (client-side)

| Concern | Implementation |
|---------|---------------|
| **Color extraction** | `colorthief` extracts top 5 dominant colors from uploaded image |
| **Color matching** | CIEDE2000 (hex → CIELAB → Delta-E ≤ 15) against bundled `japaneseColors.json` |
| **Combo computation** | Set intersection of user's matched colors vs. combo `required_colors` |
| **Buy-next suggestions** | Find missing colors that complete the most combos, rank by versatility |
| **Save results** | Insert/update `wardrobe_items` via Supabase JS client (RLS enforced) |

---

## Database Schema

### Tables

```sql
-- Reference table (NOT stored in DB — shipped as bundled JSON with the app)
-- Shown here for documentation; the actual data lives in:
--   src/data/japaneseColors.json  (~465 colors with hex, name_jp, name_en, romaji, lab)
--   src/data/colorCombinations.json  (~300 combos with required color hex pairs)

-- User wardrobe items
CREATE TABLE wardrobe_items (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id         UUID NOT NULL REFERENCES auth.users(id),
  image_url       TEXT NOT NULL,
  category        TEXT NOT NULL CHECK (category IN ('Top','Bottom','Outerwear','Dress','Accessory','Shoes')),
  dominant_colors JSONB NOT NULL DEFAULT '[]',
  -- [{hex, percentage, matchedColorHex, matchedNameJp, matchedNameEn, distance}]
  created_at      TIMESTAMPTZ DEFAULT now()
);

-- User profile & subscription
CREATE TABLE user_profiles (
  user_id           UUID PRIMARY KEY REFERENCES auth.users(id),
  display_name      TEXT,
  subscription_tier TEXT NOT NULL DEFAULT 'free' CHECK (subscription_tier IN ('free','premium')),
  stripe_customer_id TEXT,
  subscription_expires_at TIMESTAMPTZ,
  wardrobe_item_count INTEGER DEFAULT 0,
  created_at        TIMESTAMPTZ DEFAULT now()
);
```

> **Removed from DB:** `japanese_colors`, `color_combinations`, and `user_combinations` tables are no longer needed. Reference data is bundled JSON. Combination computation happens in the browser and doesn't need to be persisted — it's derived from the wardrobe items on every load.

### Row Level Security

```sql
-- wardrobe_items: users see only their own
ALTER TABLE wardrobe_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY wardrobe_select ON wardrobe_items FOR SELECT USING (user_id = auth.uid());
CREATE POLICY wardrobe_insert ON wardrobe_items FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY wardrobe_update ON wardrobe_items FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY wardrobe_delete ON wardrobe_items FOR DELETE USING (user_id = auth.uid());

-- user_profiles: users see only their own
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY profile_select ON user_profiles FOR SELECT USING (user_id = auth.uid());
CREATE POLICY profile_update ON user_profiles FOR UPDATE USING (user_id = auth.uid());
```

### Supabase Storage

```sql
-- Create private bucket for wardrobe images
INSERT INTO storage.buckets (id, name, public) VALUES ('wardrobe-images', 'wardrobe-images', false);

-- RLS: users can upload to their own folder, read their own images
CREATE POLICY storage_insert ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'wardrobe-images' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY storage_select ON storage.objects FOR SELECT
  USING (bucket_id = 'wardrobe-images' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY storage_delete ON storage.objects FOR DELETE
  USING (bucket_id = 'wardrobe-images' AND (storage.foldername(name))[1] = auth.uid()::text);
```

### DB Trigger — Auto-create profile on signup

```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (user_id, display_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

---

## Phases

### Phase 1 — Supabase Project & Database Schema

**Tasks:**
1. Create Supabase project (or local via Docker with `supabase init`)
2. Create migration files for `wardrobe_items` and `user_profiles` tables
3. Create all RLS policies (per-operation: SELECT, INSERT, UPDATE, DELETE)
4. Create the `handle_new_user()` trigger for auto-profile creation
5. Create `wardrobe-images` storage bucket with RLS policies
6. Run migrations locally, verify via Supabase Studio

**Acceptance:**
- Both tables exist with correct constraints and RLS
- Storage bucket exists with per-user folder isolation
- Creating a test user via Supabase Auth → `user_profiles` row auto-created

---

### Phase 2 — Bundled Reference Data (Static JSON)

**Tasks:**
1. Build `japaneseColors.json` — array of ~465 Japanese colors:
   ```json
   { "hex": "#ef4523", "nameJp": "朱色", "nameEn": "Vermillion", "romaji": "Shu-iro", "lab": { "l": 52.3, "a": 62.1, "b": 54.7 } }
   ```
   - Source: `Japanese Color.pdf` + existing reference data
   - Precompute CIELAB values for each color (run a one-time Node script)
2. Build `colorCombinations.json` — array of ~300 combos:
   ```json
   { "id": 1, "nameJp": "春曙", "nameEn": "Spring Dawn", "season": "spring", "colors": ["#ef4523", "#a8d8cb"] }
   ```
   - Source: `JapaneseColorCombos_Database.json` — map each hex pair
3. Place both files in `kasane-web/src/data/`
4. Write a one-time Node script (`scripts/build-reference-data.js`) that:
   - Reads source data → maps Japanese names → computes CIELAB → outputs the two JSON files
   - This script is run once during development, not at runtime

**Acceptance:**
- `japaneseColors.json` has 465+ entries with hex, nameJp, nameEn, romaji, lab
- `colorCombinations.json` has ~300 entries with id, names, season, color hex array
- Both files are valid JSON, importable in the React app
- Total bundle size < 200KB

---

### Phase 3 — Client-Side Compute Modules

These are JavaScript modules in the frontend (`kasane-web/src/lib/`) that contain all the business logic.

**Tasks:**
1. **`colorExtractor.js`** — Wraps `colorthief`:
   - Input: image element or blob
   - Output: `[{ hex, percentage }]` (top 5 dominant colors)

2. **`colorMatcher.js`** — CIEDE2000 matching:
   - `hexToLab(hex)` — convert hex → RGB → CIELAB
   - `deltaE2000(lab1, lab2)` — compute CIEDE2000 distance
   - `matchToJapaneseColor(hex, japaneseColors)` — find nearest with Delta-E ≤ 15
   - `matchAllColors(dominantColors, japaneseColors)` — batch match
   - Input: array of extracted hex, reference array from `japaneseColors.json`
   - Output: `[{ hex, percentage, matchedColorHex, matchedNameJp, matchedNameEn, distance }]`

3. **`comboEngine.js`** — Combination computation:
   - `computeCombinations(wardrobeItems, colorCombinations)` — for each combo, check which required colors the user owns
   - Input: user's wardrobe items (with matched Japanese colors), combos from `colorCombinations.json`
   - Output: `[{ ...combo, completionOwned, completionTotal, matchingItems, missingColors, locked: false }]`

4. **`suggestionEngine.js`** — "What to buy next":
   - `computeSuggestions(wardrobeItems, colorCombinations, japaneseColors)` — find colors not in wardrobe that complete the most combos
   - Input: wardrobe + reference data
   - Output: `[{ colorHex, colorNameJp, colorNameEn, clothingType, combosCompleted }]` ranked by impact

**Acceptance:**
- `colorMatcher.js` correctly matches test hex values to known Japanese colors
- `comboEngine.js` returns correct completion counts for a test wardrobe set
- `suggestionEngine.js` ranks missing colors by combo completion impact
- All modules are pure functions (no side effects, no DB calls)

---

### Phase 4 — Supabase Integration in Frontend

Wire up the React app to Supabase for auth, storage, and data persistence.

**Tasks:**
1. Install `@supabase/supabase-js` in `kasane-web/`
2. Create `src/lib/supabase.js` — Supabase client initialized with project URL + anon key (from env vars)
3. **Auth:**
   - `signInWithGoogle()` / `signInWithApple()` — Supabase OAuth flow
   - `getSession()` — check current session on app load
   - `signOut()` — end session
   - Auth state listener → update React context
4. **Image upload:**
   - Upload to `wardrobe-images/{user_id}/{uuid}.jpg` via Supabase Storage
   - Get signed URL for display
5. **Wardrobe CRUD:**
   - `saveWardrobeItem({ image_url, category, dominant_colors })` — insert via Supabase JS
   - `getWardrobeItems()` — select all for current user (RLS filters automatically)
   - `updateWardrobeItem(id, { category })` — update
   - `deleteWardrobeItem(id)` — delete + remove image from storage
6. **Full pipeline on upload:**
   ```
   User picks image
   → upload to Supabase Storage → get image URL
   → colorthief extracts colors (client-side)
   → colorMatcher matches to Japanese colors (client-side)
   → save wardrobe item to DB (Supabase JS)
   → comboEngine recomputes all combinations (client-side, in memory)
   → UI updates
   ```
7. Replace all dummy data imports in screens with real data:
   - `dummyWardrobe.js` → `getWardrobeItems()` + local color matching
   - `dummyCombinations.js` → `comboEngine.computeCombinations()`
8. Wire up auth buttons on Upload screen
9. Add loading states and error handling

**Acceptance:**
- Auth flow works (Google sign in → session → profile auto-created)
- Image upload → stored in Supabase Storage → URL saved in wardrobe_items
- Adding a wardrobe item → colors extracted → matched to Japanese colors → combos recomputed → dashboard updates
- Removing an item → combos recompute → UI reflects change
- All data persists across page reloads (fetched from Supabase on load)
- No dummy data remains in the app

---

## Data Shapes

These are the shapes used by the client-side compute modules and stored in Supabase. They match the frontend dummy data contracts:

```jsonc
// japaneseColors.json entry
{
  "hex": "#ef4523",
  "nameJp": "朱色",
  "nameEn": "Vermillion",
  "romaji": "Shu-iro",
  "lab": { "l": 52.3, "a": 62.1, "b": 54.7 }
}

// colorCombinations.json entry
{
  "id": 1,
  "nameJp": "春曙",
  "nameEn": "Spring Dawn",
  "season": "spring",
  "colors": ["#ef4523", "#a8d8cb"]
}

// wardrobe_items row (stored in Supabase)
{
  "id": "uuid",
  "image_url": "https://...supabase.co/storage/v1/...",
  "category": "Top",
  "dominant_colors": [
    { "hex": "#e84530", "percentage": 0.45, "matchedColorHex": "#ef4523", "matchedNameJp": "朱色", "matchedNameEn": "Vermillion", "distance": 4.2 }
  ]
}

// Computed in browser by comboEngine (not persisted)
{
  "id": 1,
  "nameJp": "春曙",
  "nameEn": "Spring Dawn",
  "season": "spring",
  "colors": [
    { "hex": "#ef4523", "nameJp": "朱色", "nameEn": "Vermillion", "romaji": "Shu-iro" },
    { "hex": "#a8d8cb", "nameJp": "青磁色", "nameEn": "Celadon", "romaji": "Seiji-iro" }
  ],
  "completionOwned": 2,
  "completionTotal": 3,
  "matchingItems": ["uuid1", "uuid2"],
  "missingColors": ["#a8d8cb"],
  "locked": false
}
```

---

## Out of Scope (This Phase)

- Stripe subscription / payment processing / premium gating (deferred — schema is ready)
- AI-powered clothing categorization (future ML integration)
- React Native / mobile app builds (Capacitor wrapping planned as a later step)
- Push notifications
- Admin dashboard
- Analytics / logging infrastructure
- Express server / Edge Functions / any custom backend deployment
