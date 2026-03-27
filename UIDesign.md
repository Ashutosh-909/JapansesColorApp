# Kasane — UI Design Specification

## 1. Design System

### 1.1 Color Tokens

| Token | Hex | Usage |
|-------|-----|-------|
| **Background Primary** | `#1a1a2e` | App background, dark surfaces |
| **Background Card** | `#252547` | Cards, elevated surfaces |
| **Background Card Hover** | `#2e2e5c` | Card hover/pressed state |
| **Text Primary** | `#ffffff` | Headings, primary text |
| **Text Secondary** | `#a0a0b8` | Subtext, labels, hints |
| **Text Muted** | `#6b6b82` | Disabled, placeholder text |
| **Border Default** | `#3a3a5c` | Card borders, dividers |
| **Border Dashed** | `#5a5a7c` | Missing color outlines, upload zone |

**Japanese Accent Colors (used for onboarding, combos, UI accents):**

| Japanese Name | Romaji | Hex | RGB |
|--------------|--------|-----|-----|
| 朱色 | Shu-iro (Vermillion) | `#ef4523` | 239, 69, 35 |
| 藤色 | Fuji-iro (Wisteria) | `#bbbcde` | 187, 188, 222 |
| 桜色 | Sakura-iro (Cherry Blossom) | `#fef4f4` | 254, 244, 244 |
| 群青 | Gunjō (Ultramarine) | `#4c6cb3` | 76, 108, 179 |
| 山吹色 | Yamabuki-iro (Yellow) | `#f8b500` | 248, 181, 0 |
| 青磁色 | Seiji-iro (Celadon) | `#a8d8cb` | 168, 216, 203 |
| 撫子色 | Nadeshiko-iro (Pink) | `#eb6ea5` | 235, 110, 165 |
| 紺色 | Kon-iro (Navy) | `#223a70` | 34, 58, 112 |
| 若草色 | Waka-kusa-iro (Fresh Green) | `#c3d825` | 195, 216, 37 |
| 丁子色 | Chōji-iro (Clove) | `#928178` | 146, 129, 120 |
| 墨色 | Sumi-iro (Ink) | `#595857` | 89, 88, 87 |
| 灰白 | Haijiro (Ash White) | `#e9e4d4` | 233, 228, 212 |

### 1.2 Typography

| Style | Font | Size | Weight | Usage |
|-------|------|------|--------|-------|
| **Display** | Inter | 32px | 700 (Bold) | Splash title, section headers |
| **Display JP** | Noto Sans JP | 28px | 500 (Medium) | Japanese titles (重ね, 春曙) |
| **Heading 1** | Inter | 24px | 600 (Semibold) | Screen titles |
| **Heading 2** | Inter | 18px | 600 (Semibold) | Section headers |
| **Body** | Inter | 16px | 400 (Regular) | Primary body text |
| **Body Small** | Inter | 14px | 400 (Regular) | Secondary text, descriptions |
| **Caption** | Inter | 12px | 400 (Regular) | Labels, badges, metadata |
| **Caption JP** | Noto Sans JP | 12px | 400 (Regular) | Japanese color names under circles |

### 1.3 Spacing & Layout

- **Grid:** 4px base unit. Common spacings: 8px, 12px, 16px, 24px, 32px
- **Card padding:** 16px
- **Card border radius:** 16px
- **Button border radius:** 12px (large), 8px (small/chips)
- **Color circle sizes:** 40px (combo card), 56px (detail view), 24px (inline badge)
- **Screen padding:** 16px horizontal
- **Card grid gap:** 12px
- **Bottom tab bar height:** 64px

### 1.4 Component Library

**Combo Card**
- Background: `#252547`
- Border radius: 16px
- Padding: 16px
- Shadow: 0 2px 8px rgba(0,0,0,0.3)
- Completion badge: top-right corner, 28px pill shape
  - Complete (3/3): background `#2d8a4e`, text white, checkmark icon
  - Partial (2/3): background `#c78c20`, text white
  - Low (1/3): background `#6b6b82`, text white

**Color Circle**
- Border: 2px solid rgba(255,255,255,0.2)
- Shadow: 0 1px 3px rgba(0,0,0,0.2)
- "Missing" state: dashed 2px border using `#5a5a7c`, no fill (transparent)

**Button — Primary**
- Background: `#4c6cb3` (群青)
- Text: white, 16px, semibold
- Padding: 16px 24px
- Border radius: 12px
- Disabled state: opacity 0.4

**Button — Secondary / Outlined**
- Background: transparent
- Border: 1.5px solid `#4c6cb3`
- Text: `#4c6cb3`, 16px, semibold

**Chip (Category Tag)**
- Selected: background `#4c6cb3`, text white, border radius 8px
- Unselected: background transparent, border 1px `#3a3a5c`, text `#a0a0b8`
- Size: 14px text, 8px vertical padding, 12px horizontal padding

**Lock Badge**
- 🔒 emoji + text in a small pill
- Background: rgba(0,0,0,0.6)
- Border radius: 6px

**Bottom Tab Bar**
- Background: `#12122a`
- Height: 64px
- Active tab: icon + label in 群青 `#4c6cb3`
- Inactive tab: icon + label in `#6b6b82`
- 3 tabs: Combinations | My Clothes | Profile

---

## 2. Screen Designs

### 2.1 Splash Screen

```
┌──────────────────────────────┐
│                              │
│                              │
│         K a s a n e          │  ← Display, white, centered
│            重ね               │  ← Display JP, #a0a0b8, centered
│                              │
│    "色は沈黙の言葉"            │  ← Body, italic, #a0a0b8
│    "Color is a silent        │  ← Body Small, italic, #6b6b82
│         language."           │
│                              │
│  ┌────────┐ ┌────────┐ ┌────────┐
│  │ outfit │ │ outfit │ │ outfit │  ← 3 outfit photo cards
│  │ photo  │ │ photo  │ │ photo  │     in horizontal scroll
│  │   1    │ │   2    │ │   3    │
│  ├────────┤ ├────────┤ ├────────┤
│  │ ●● ●  │ │ ●  ●●  │ │ ● ●   │  ← Color circles under each
│  │春曙    │ │秋空    │ │冬霞    │  ← Combo name
│  └────────┘ └────────┘ └────────┘
│                              │
│  ┌──────────────────────────┐│
│  │      Get Started         ││  ← Primary button, full width
│  └──────────────────────────┘│
│                              │
└──────────────────────────────┘
```

**Specs:**
- Background: `#1a1a2e`
- "Kasane" text: 40px, white, font-weight 700, letter-spacing 8px
- "重ね": 28px, `#a0a0b8`, Noto Sans JP
- Quote: italic, Japanese in `#a0a0b8` (16px), English in `#6b6b82` (14px)
- Outfit cards: 120px × 160px, border-radius 12px, background `#252547`
- Color circles under each card: 20px diameter, 4px gap between circles
- Combo name: Caption (12px), `#a0a0b8`
- "Get Started" button: full width minus 32px margin, 群青 `#4c6cb3`

**Outfit card examples:**
| Card | Outfit Description | Combo Colors |
|------|-------------------|--------------|
| 1 | Vermillion scarf + celadon coat | 朱色 `#ef4523` + 青磁色 `#a8d8cb` |
| 2 | Yellow top + navy bottom | 山吹色 `#f8b500` + 紺色 `#223a70` |
| 3 | Cherry blossom blouse + ultramarine jacket | 桜色 `#fef4f4` + 群青 `#4c6cb3` |

---

### 2.2 Upload / Login Screen

```
┌──────────────────────────────┐
│                              │
│  Upload your clothes to      │  ← Heading 1, white
│  discover your color         │
│  combinations                │
│                              │
│  ┌ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┐│
│  │                          ││
│  │     📷 ↑                 ││  ← Upload icon, 48px
│  │                          ││  ← Dashed border zone
│  │  Tap to upload photos    ││     Border: 2px dashed #5a5a7c
│  │                          ││     Background: #252547
│  └ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┘│     Height: ~200px
│                              │
│  ┌───────────┐ ┌────────────┐│
│  │📷 Take    │ │🖼️ Choose   ││  ← Two outlined buttons
│  │   Photo   │ │from Gallery││     side by side
│  └───────────┘ └────────────┘│
│                              │
│  No account needed — upload  │  ← Caption, #6b6b82
│  and see your combos         │
│  instantly                   │
│                              │
│  ┌──────┐┌──────┐┌──────┐┌──┐│
│  │thumb ││thumb ││thumb ││ +││  ← Uploaded thumbnails row
│  │  1   ││  2   ││  3   ││  ││     48px squares, + button
│  └──────┘└──────┘└──────┘└──┘│
│                              │
│  ─────────── or ─────────── │  ← Divider with "or"
│                              │
│  Already have an account?    │  ← Body Small, #a0a0b8
│                              │
│  ┌──────────────────────────┐│
│  │ G  Continue with Google  ││  ← White bg, dark text
│  └──────────────────────────┘│
│  ┌──────────────────────────┐│
│  │   Continue with Apple   ││  ← Black bg, white text
│  └──────────────────────────┘│
│                              │
│  Log in to see your saved    │  ← Caption, #6b6b82
│  combinations                │
│                              │
└──────────────────────────────┘
```

**Specs:**
- Upload zone: height 180px, border 2px dashed `#5a5a7c`, background `#252547`, border-radius 16px
- Upload icon: 48px, `#a0a0b8`
- "Tap to upload" text: Body, `#a0a0b8`
- Photo/Gallery buttons: outlined secondary style, 50% width each, 8px gap
- Thumbnail row: 48px squares, border-radius 8px, 8px gap, horizontal scroll if many
- "+" button: 48px square, dashed border, `#5a5a7c`, centered "+" in `#a0a0b8`
- Divider: 1px `#3a3a5c` line with "or" text centered in `#6b6b82`
- Google button: white background, border-radius 12px, Google "G" icon left, dark text
- Apple button: `#000000` background, border-radius 12px, Apple icon left, white text

---

### 2.3 Categorize & Go Screen

```
┌──────────────────────────────┐
│                              │
│  Categorize Your Clothes     │  ← Heading 1
│         ┌───────────────────┐│
│         │✨ Auto-categorize 🔒││  ← AI button (premium)
│         └───────────────────┘│     群青 bg, small pill
│                              │
│  ┌─────────────┐ ┌──────────┐│
│  │             │ │          ││
│  │  clothing   │ │ clothing ││  ← 2-column grid
│  │  photo 1    │ │ photo 2  ││     Card: #252547
│  │             │ │          ││     Border-radius: 12px
│  ├─────────────┤ ├──────────┤│
│  │[● Top    ▼] │ │[Select ▼]││  ← Category chip/dropdown
│  │ ●● (colors) │ │ ●●      ││  ← Extracted color dots
│  └─────────────┘ └──────────┘│
│                              │
│  ┌─────────────┐ ┌──────────┐│
│  │             │ │          ││
│  │  clothing   │ │ clothing ││
│  │  photo 3    │ │ photo 4  ││
│  │             │ │          ││
│  ├─────────────┤ ├──────────┤│
│  │[● Bottom ▼] │ │[Select ▼]││
│  │ ●●●         │ │ ●●      ││
│  └─────────────┘ └──────────┘│
│                              │
│  ... more items (scrollable) │
│                              │
│  ┌──────────────────────────┐│
│  │         Go →             ││  ← Primary button
│  └──────────────────────────┘│  ← Disabled if uncategorized
│                              │     items remain
└──────────────────────────────┘
```

**Specs:**
- AI button: 群青 `#4c6cb3` background, white text, caption size (12px), border-radius 20px (pill), 🔒 icon right, positioned top-right of header
- Grid: 2 columns, 12px gap
- Item card: `#252547`, border-radius 12px, image takes ~70% height, bottom area has category + colors
- Category chip (selected): e.g., "Top" — background `#4c6cb3`, white text, border-radius 8px
- Category chip (unselected): "Select type..." — border 1px `#3a3a5c`, `#6b6b82` text
- Color dots: 16px circles in bottom-right of card, showing extracted Japanese colors
- "Go →" button: full width, 群青 `#4c6cb3`, disabled state at opacity 0.4 when items uncategorized
- Scroll: vertical scroll for the grid, sticky button at bottom (above safe area)

**Dropdown options when chip tapped:**
- Top, Bottom, Outerwear, Dress, Accessory, Shoes
- Shown as a bottom sheet or popover with list items

---

### 2.4 Combinations Dashboard (Main Screen)

```
┌──────────────────────────────┐
│  Your Combinations      [+]  │  ← Heading 1 + add button
│                              │
│  ┌─────────────┐ ┌──────────┐│
│  │ ●    ●      │ │ ●   ●   ││
│  │朱色  青磁色  │ │山吹  紺色││  ← Color circles + names
│  │             │ │          ││
│  │ 春曙        │ │ 秋空     ││  ← Combo name (JP)
│  │ Spring Dawn │ │ Autumn   ││  ← Combo name (EN)
│  │             │ │ Sky      ││
│  │ Spring 🌸   │ │Autumn 🍂 ││  ← Season badge
│  │        [3/3]│ │    [2/3] ││  ← Completion badge
│  │          ✓  │ │          ││  ← Checkmark if complete
│  └─────────────┘ └──────────┘│
│                              │
│  ┌─────────────┐ ┌──────────┐│
│  │ ●    ●   ○  │ │ ●   ●   ││  ← ○ = dashed/missing
│  │桜色 藤色    │ │若草 撫子 ││
│  │             │ │          ││
│  │ 冬霞        │ │ 夏祭     ││
│  │ Winter Mist │ │ Summer   ││
│  │             │ │ Festival ││
│  │ Winter ❄️   │ │Summer 🌊 ││
│  │        [2/3]│ │    [1/2] ││
│  └─────────────┘ └──────────┘│
│                              │
│  ┌──────────────────────────┐│
│  │ ●    ●   ●              ││  ← 5th free combo (full width)
│  │ 群青  灰白  朱色         ││
│  │ 雪月花 — Snowy Moonflower││
│  │ Winter ❄️          [3/3]✓││
│  └──────────────────────────┘│
│                              │
│  ═══════════════════════════ │  ← PAYWALL DIVIDER
│  ┌──────────────────────────┐│
│  │ ░░░░ BLURRED ░░░░░░░░░░ ││  ← Frosted glass overlay
│  │ ░░░░░░░░░░░░░░░░░░░░░░░ ││     over 4-6 more combo cards
│  │                          ││
│  │ 🔒 Unlock all 200+       ││  ← Lock icon + heading
│  │    combinations           ││
│  │                          ││
│  │  See every Japanese color ││  ← Subtext
│  │  harmony in your wardrobe ││
│  │                          ││
│  │ ┌──────────────────────┐ ││
│  │ │    Go Premium        │ ││  ← Primary button
│  │ └──────────────────────┘ ││
│  └──────────────────────────┘│
│                              │
│  ┌──────────────────────────┐│
│  │ 🔒 What Should I Buy     ││  ← Second paywall section
│  │    Next?                  ││
│  │                          ││
│  │ ░░ Buy a 藤色 (Wisteria) ││  ← Blurred suggestion preview
│  │ ░░ top → completes 4     ││
│  │ ░░ combinations ░░░░░░░░ ││
│  │                          ││
│  │ ┌──────────────────────┐ ││
│  │ │ Unlock Buy Suggest.  │ ││  ← Primary button
│  │ └──────────────────────┘ ││
│  └──────────────────────────┘│
│                              │
├──────────────────────────────┤
│ 🎨 Combos  │ 👕 Clothes │ 👤 ││  ← Bottom tab bar
│  (active)  │           │    ││
└──────────────────────────────┘
```

**Specs:**
- Combo card: `#252547`, border-radius 16px, padding 16px
- Complete card: left border 3px solid `#2d8a4e` (green)
- Partial card: left border 3px solid `#c78c20` (amber)
- Color circles: 40px diameter, 8px gap between circles
- Japanese name under each circle: Caption JP (12px), `#a0a0b8`
- Combo title (JP): Heading 2 (18px), white
- Combo title (EN): Body Small (14px), `#a0a0b8`
- Season pill: Caption (12px), background `#3a3a5c`, border-radius 12px, padding 4px 10px
- Completion badge: top-right corner of card, pill shape, 28px height
  - 3/3: `#2d8a4e` background + ✓ icon
  - 2/3: `#c78c20` background
  - 1/3: `#6b6b82` background
- Missing color (○): 40px circle with 2px dashed border `#5a5a7c`, no fill
- Paywall overlay: backdrop-filter blur(12px), semi-transparent `rgba(26, 26, 46, 0.85)`
- "Go Premium" button: 群青 `#4c6cb3`
- "What Should I Buy Next" card: `#252547`, suggestion text blurred with CSS blur(6px)
- "[+]" add button: 32px circle, `#4c6cb3` background, white "+" icon

---

### 2.5 Combo Detail Screen

```
┌──────────────────────────────┐
│  ← Back                     │  ← Back arrow, #a0a0b8
│                              │
│  春曙                        │  ← Display JP (28px), white
│  Spring Dawn                 │  ← Heading 2 (18px), #a0a0b8
│                              │
│  ┌────────────────────────┐  │
│  │  Spring 🌸              │  │  ← Season pill badge
│  └────────────────────────┘  │
│                              │
│  The Palette                 │  ← Heading 2 (18px)
│                              │
│  ┌───────┐  ┌───────┐  ┌ ─ ─ ┐
│  │  ●    │  │  ●    │  │  ○  │  ← 56px color circles
│  │ 桜色  │  │ 朱色  │  │若草色│  ← JP name (12px)
│  │Sakura │  │ Shu   │  │Waka │  ← Romaji (11px, #6b6b82)
│  │Cherry │  │Vermil.│  │Fresh │  ← EN name (11px, #a0a0b8)
│  │Blossom│  │       │  │Green │
│  │ ✓ have│  │✓ have │  │✗ need│  ← Status badge
│  └───────┘  └───────┘  └ ─ ─ ┘
│                              │
│  ■■■■■■■■■■■■■□□□□□□  2/3   │  ← Progress bar, amber
│                              │
│  ─────────────────────────── │
│                              │
│  Your Matching Clothes       │  ← Heading 2
│                              │
│  ┌─────────────┐ ┌──────────┐│
│  │             │ │          ││
│  │  pink       │ │  red     ││  ← Actual clothing photos
│  │  blouse     │ │  scarf   ││     that match combo colors
│  │  photo      │ │  photo   ││
│  │             │ │          ││
│  ├─────────────┤ ├──────────┤│
│  │ ● 桜色     │ │ ● 朱色   ││  ← Which combo color
│  │   Top       │ │ Accessory││     it matches + category
│  └─────────────┘ └──────────┘│
│                              │
│  ─────────────────────────── │
│                              │
│  Missing                     │  ← Heading 2
│                              │
│  ┌──────────────────────────┐│
│  │ ┌──┐                     ││
│  │ │● │ You're missing:     ││  ← Missing color card
│  │ └──┘ 若草色 (Waka-kusa)  ││     Dashed border card
│  │      Fresh Green          ││     Color: #c3d825
│  │                          ││
│  │  💡 Look for a green      ││  ← Suggestion text
│  │  bottom or accessory to   ││
│  │  complete this combo      ││
│  └──────────────────────────┘│
│                              │
└──────────────────────────────┘
```

**Specs:**
- Back arrow: 24px, `#a0a0b8`, top-left
- Combo JP name: Display JP (28px), white
- Combo EN name: Heading 2 (18px), `#a0a0b8`
- Season pill: same as dashboard spec
- Color circles section: 56px circles, 16px gap
  - "Have" circle: filled with Japanese color, solid 2px white border, small ✓ badge bottom-right in `#2d8a4e`
  - "Need" circle: filled with the color but dashed 2px border `#5a5a7c`, small ✗ badge in `#ef4523`
- Progress bar: height 6px, border-radius 3px, track `#3a3a5c`, fill amber `#c78c20` for partial, green `#2d8a4e` for complete
- Matching clothes cards: same style as wardrobe grid cards, `#252547`, 12px border-radius
- Matching circle badge on photo card: 24px circle in bottom-left showing which combo color it represents
- Missing card: `#252547` background, 2px dashed border `#5a5a7c`, border-radius 12px, padding 16px
- Suggestion icon: 💡 emoji or light bulb icon
- Suggestion text: Body Small (14px), `#a0a0b8`

---

### 2.6 Paywall Sheet (Modal)

```
┌──────────────────────────────┐
│  ░░░░░░░░░░░░░░░░░░░░░░░░░░ │  ← Dimmed background
│  ░░░░░░░░░░░░░░░░░░░░░░░░░░ │     rgba(0,0,0,0.6)
│  ░░░░░░░░░░░░░░░░░░░░░░░░░░ │
├──────────────────────────────┤  ← Sheet slides up from bottom
│  ┌──┐                  [✕]  │     Border-radius: 24px top
│  │✨│ Kasane Premium         │     Background: #252547
│  └──┘                        │
│                              │
│  ┌────────┐┌────────┐┌──────┐│
│  │gradient│├gradient│├gradi.││  ← 3 feature cards
│  │ bg     ││  bg    ││  bg  ││     horizontal scroll
│  │  🎨    ││  ✨    ││  🛍️  ││
│  │All 200+││AI Auto-││ What ││
│  │Combos  ││Categ.  ││to Buy││
│  │        ││        ││ Next ││
│  └────────┘└────────┘└──────┘│
│                              │
│  ✓ Unlock all 200+ Japanese  │  ← Benefits list
│    color combinations        │     ✓ in #2d8a4e
│  ✓ AI-powered clothing       │     Text in white (16px)
│    categorization            │
│  ✓ Personalized "What to     │
│    buy next" suggestions     │
│  ✓ Unlimited wardrobe        │
│    (no 50-item cap)          │
│                              │
│  ┌──────────────────────────┐│
│  │ 7 days free, then        ││  ← Pricing block
│  │      $29.99 / year       ││     Price: 24px, bold, white
│  │   That's just $2.50/mo   ││     Subtext: 14px, #a0a0b8
│  └──────────────────────────┘│
│                              │
│  ┌──────────────────────────┐│
│  │ ░░ Start Free Trial ░░░ ││  ← CTA button
│  └──────────────────────────┘│     Gradient: #4c6cb3 → #bbbcde
│                              │     Text: white, bold, 18px
│  Restore Purchases · Terms   │  ← Footer links
│                              │     Caption, #6b6b82
└──────────────────────────────┘
```

**Specs:**
- Background overlay: `rgba(0,0,0,0.6)`
- Sheet: background `#252547`, border-radius 24px 24px 0 0, max-height 85vh
- Close button: 32px circle, `#3a3a5c` background, "✕" in white
- "Kasane Premium": Heading 1 (24px), white, ✨ emoji left
- Feature cards: 120px × 140px, border-radius 12px, each with a different Japanese color gradient background:
  - Card 1: gradient `#ef4523` → `#f8b500`
  - Card 2: gradient `#4c6cb3` → `#bbbcde`
  - Card 3: gradient `#a8d8cb` → `#c3d825`
- Feature card text: white, 14px semibold, centered
- Benefits: ✓ icon in `#2d8a4e`, text white, Body (16px), 12px gap between items
- Pricing: container `#1a1a2e` background, border-radius 12px, 16px padding, centered
- Price: 24px bold white
- "That's just $2.50/mo": 14px, `#a0a0b8`
- CTA button: full width, height 56px, gradient `#4c6cb3` → `#bbbcde`, text white 18px bold, border-radius 12px
- Footer: caption (12px), `#6b6b82`, centered, links underlined

---

### 2.7 My Clothes Screen (Tab 2)

```
┌──────────────────────────────┐
│  My Clothes (12)        [+]  │  ← Heading 1 + add button
│                              │
│  ┌──────┐┌──────┐┌──────┐┌──┐
│  │ All  ││ Tops ││Botms ││Ou│  ← Category filter chips
│  │(act) ││      ││      ││  │     Horizontal scroll
│  └──────┘└──────┘└──────┘└──┘│
│                              │
│  ┌─────────────┐ ┌──────────┐│
│  │             │ │          ││
│  │  clothing   │ │ clothing ││  ← 2-column grid
│  │  photo      │ │  photo   ││
│  │             │ │          ││
│  ├─────────────┤ ├──────────┤│
│  │ ●● 桜色 朱色│ │ ● 群青   ││  ← Color badges
│  │ Top         │ │ Outerwear││  ← Category label
│  └─────────────┘ └──────────┘│
│                              │
│  ┌─────────────┐ ┌──────────┐│
│  │             │ │          ││
│  │  clothing   │ │ clothing ││
│  │  photo      │ │  photo   ││
│  │             │ │          ││
│  ├─────────────┤ ├──────────┤│
│  │ ●● 藤色 紺色│ │ ●● 山吹  ││
│  │ Bottom      │ │ Accessory││
│  └─────────────┘ └──────────┘│
│                              │
│  ... scrollable ...          │
│                              │
├──────────────────────────────┤
│ 🎨 Combos │ 👕 Clothes │ 👤  │  ← Clothes tab active
│           │  (active)  │     │
└──────────────────────────────┘
```

**Specs:**
- "[+]" button: same as dashboard
- Filter chips: horizontal scroll, 8px gap
  - "All" active: `#4c6cb3` background, white text
  - Others inactive: `#3a3a5c` border, `#a0a0b8` text
- Clothing cards: same component as categorize screen
- Color dots: 20px circles at bottom-left of card info area
- Category: Caption (12px), `#6b6b82`
- Tapping a card: could show an edit sheet to re-categorize or delete

---

## 3. Interaction States

### 3.1 Combo Card States

| State | Visual |
|-------|--------|
| **Complete (3/3)** | Green left border (3px `#2d8a4e`), green badge, ✓ icon, all circles filled |
| **Partial (2/3)** | Amber left border (3px `#c78c20`), amber badge, filled + dashed circles |
| **Low (1/3)** | Gray left border (3px `#6b6b82`), gray badge, mostly dashed circles |
| **Locked (premium)** | Entire card blurred (backdrop-filter blur 12px), lock overlay |

### 3.2 Button States

| State | Primary | Secondary |
|-------|---------|-----------|
| **Default** | `#4c6cb3` bg, white text | Transparent bg, `#4c6cb3` border + text |
| **Pressed** | `#3a5a9e` bg (darker) | `rgba(76,108,179,0.1)` bg |
| **Disabled** | opacity 0.4 | opacity 0.4 |

### 3.3 Upload Zone States

| State | Visual |
|-------|--------|
| **Empty** | Dashed border `#5a5a7c`, upload icon, "Tap to upload" |
| **Drag hover** | Dashed border `#4c6cb3`, background `rgba(76,108,179,0.1)`, "Drop here" |
| **Uploading** | Progress bar inside zone, thumbnail filling in |
| **Has items** | Thumbnail row visible below zone |

### 3.4 Category Chip States

| State | Visual |
|-------|--------|
| **Unselected** | Border `#3a3a5c`, text `#6b6b82`, "Select type..." |
| **Selected** | Background `#4c6cb3`, text white, category name shown |
| **Dropdown open** | Sheet/popover with options list |

---

## 4. Animations & Transitions

| Element | Animation | Duration |
|---------|-----------|----------|
| Splash → Upload | Fade + slide up | 400ms ease-out |
| Upload → Categorize | Slide left | 300ms ease-in-out |
| Categorize → Dashboard | Scale up from center + fade | 500ms ease-out (celebratory) |
| Combo card tap → Detail | Shared element transition (card expands) | 350ms ease-out |
| Paywall sheet | Slide up from bottom + backdrop fade | 300ms ease-out |
| Paywall sheet dismiss | Slide down + backdrop fade out | 200ms ease-in |
| Color extraction | Colors "pull out" from image into circles | 800ms staggered (200ms per circle) |
| Completion badge update | Number counter animation + color pulse | 400ms |
| Tab switch | Cross-fade | 200ms |

---

## 5. Responsive Breakpoints

| Breakpoint | Layout |
|------------|--------|
| **Mobile** (< 640px) | Default: 2-column grid, bottom tabs, full-width buttons |
| **Tablet** (640–1024px) | 3-column grid, larger cards, wider paywall sheet |
| **Desktop** (> 1024px) | 4-column grid, side navigation instead of bottom tabs, centered max-width 1200px container |
