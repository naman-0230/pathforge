# PathForge — Design System (Ink Dark + Indigo Signal)
> Full specification. When asked to generate CSS, apply every rule here exactly, no deviations.

---

## 1. Theme Identity

**Theme name:** Ink Dark + Indigo Signal  
**Vibe:** Obsidian terminal meets SaaS dashboard — JetBrains IDE × Vercel dashboard × Linear  
**NOT:** Lovable, v0, purple-haze SaaS, glassmorphism, neon glow, gradient surfaces  
**Personality carrier:** JetBrains Mono — used for all metadata, labels, tags, badges, counters  
**Primary font:** Inter — used for all UI text, headings, body  

---

## 2. Color Tokens

```css
:root {
  /* Surfaces — 3-step elevation, never use shadows */
  --bg-base:        #080A0F;   /* page background */
  --bg-surface:     #0B0D12;   /* nav, sidebar */
  --bg-elevated:    #0F1117;   /* cards, rows */
  --bg-hover:       #1A1C24;   /* hover states, hint blocks */

  /* Accent — single accent, used sparingly */
  --accent:         #6B63F6;   /* CTA buttons, active borders, filled dots */
  --accent-mid:     #9D96FF;   /* muted accent, hint labels, section headers, inline text */

  /* Text — 3-step opacity hierarchy */
  --text-high:      #E8E6FF;                  /* headings, values, problem names */
  --text-mid:       rgba(255,255,255,0.55);   /* body, descriptions, subtitles */
  --text-low:       rgba(255,255,255,0.25);   /* metadata, mono labels, time complexity */

  /* Borders */
  --border:         rgba(255,255,255,0.06);   /* default card/row borders */
  --border-accent:  rgba(107,99,246,0.3);     /* active card, accent elements */

  /* Semantic colors */
  --green:          #4ADE80;   /* easy difficulty, solved state */
  --amber:          #FBB040;   /* medium difficulty, warnings */
  --red:            #F87171;   /* hard difficulty, danger actions */

  /* State backgrounds — always paired with matching semantic color */
  --state-success-bg: rgba(74, 222, 128, 0.08);
  --state-warn-bg:    rgba(251, 176, 64, 0.08);
  --state-error-bg:   rgba(248, 113, 113, 0.08);
}
```

### Color usage rules
- `--accent` (#6B63F6): ONLY for filled buttons, active border, filled confidence dots. Never on body text — contrast is ~4.2:1, fails AA at small sizes.
- `--accent-mid` (#9D96FF): Use for inline accent text, labels, section headers, hint labels. Safe contrast.
- Never apply more than one accent color to the same surface. Green/amber/red are semantic only — not decorative.
- No gradient on any surface, ever.

---

## 3. Typography

### Font imports
```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
```

### Scale

| Role | Font | Size | Weight | Tracking | Color |
|---|---|---|---|---|---|
| Page heading | Inter | 22px | 600 | -0.04em | --text-high |
| Section title | Inter | 16px | 500 | -0.03em | --text-high |
| Problem name / UI label | Inter | 13px | 500 | -0.01em | --text-high |
| Body / description | Inter | 13px | 400 | 0 | --text-mid |
| Small body | Inter | 12px | 400 | 0 | --text-mid |
| Section header (mono) | JetBrains Mono | 10px | 500 | 0.12em | --accent-mid, UPPERCASE |
| Metadata / tags | JetBrains Mono | 10–11px | 400 | 0.08em | --text-low |
| Time complexity | JetBrains Mono | 11px | 400 | 0.08em | --text-low |
| Day counter / badge | JetBrains Mono | 9–10px | 500 | 0.08em | --accent-mid |

### Typography rules
- Headings always use negative tracking (-0.03em to -0.04em)
- Mono font is uppercase + letter-spaced ONLY for section headers and badges
- Mono font is lowercase + loose-spaced for metadata (O(n), day-14, #array)
- No decorative fonts, no display fonts, no Google Fonts beyond Inter + JetBrains Mono

---

## 4. Component Specifications

### 4.1 Cards

```css
/* Default card */
.card {
  background: var(--bg-elevated);     /* #0F1117 */
  border: 1px solid var(--border);    /* rgba(255,255,255,0.06) */
  border-radius: 10px;
  padding: 16px;
  /* NO box-shadow, ever */
}

/* Active / featured card */
.card-active {
  background: var(--bg-elevated);         /* same bg, never change */
  border: 1px solid var(--border-accent); /* rgba(107,99,246,0.3) */
  border-radius: 10px;
  padding: 16px;
}

/* Solved state card/row */
.card-solved {
  background: var(--state-success-bg);
  border: 1px solid rgba(74, 222, 128, 0.12);
  border-radius: 10px;
  padding: 16px;
}
```

**Card rules:**
- Never change bg between default and active — only the border changes
- Hover state: bg transitions to `--bg-hover` (#1A1C24), border stays same
- No shadows at any elevation — border contrast IS the elevation signal

### 4.2 Buttons

```css
/* Primary */
.btn-primary {
  background: var(--accent);    /* #6B63F6 */
  color: #ffffff;
  border: none;
  border-radius: 7px;
  padding: 8px 16px;
  font-family: 'Inter', sans-serif;
  font-size: 13px;
  font-weight: 500;
  letter-spacing: -0.01em;
  cursor: pointer;
}
.btn-primary:hover { background: #7c75f8; }

/* Ghost */
.btn-ghost {
  background: transparent;
  color: var(--text-mid);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 7px;
  padding: 8px 16px;
  font-family: 'Inter', sans-serif;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
}
.btn-ghost:hover { background: var(--bg-hover); }

/* Danger */
.btn-danger {
  background: var(--state-error-bg);
  color: var(--red);
  border: 1px solid rgba(248, 113, 113, 0.25);
  border-radius: 7px;
  padding: 8px 16px;
  font-family: 'Inter', sans-serif;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
}

/* Small variant — add to any button */
.btn-sm { font-size: 11px; padding: 5px 12px; }
```

**Button rules:**
- `border-radius: 7px` for all action buttons — NOT pill (99px) unless it's a tag/badge
- Pill shape (`border-radius: 99px`) reserved strictly for tags and badges
- Never gradient on button backgrounds

### 4.3 Difficulty & Topic Tags

```css
/* Base tag */
.tag {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 0.06em;
  padding: 3px 9px;
  border-radius: 4px;  /* square-ish, not pill */
  border: 1px solid;
  display: inline-block;
}

.tag-easy  { color: var(--green); background: rgba(74,222,128,0.1);  border-color: rgba(74,222,128,0.25); }
.tag-med   { color: var(--amber); background: rgba(251,176,64,0.1);  border-color: rgba(251,176,64,0.25); }
.tag-hard  { color: var(--red);   background: rgba(248,113,113,0.1); border-color: rgba(248,113,113,0.25); }
.tag-topic { color: var(--accent-mid); background: rgba(107,99,246,0.1); border-color: var(--border-accent); }
.tag-mono  { color: var(--text-low); background: transparent; border-color: var(--border); }
```

**Tag rules:**
- NEVER filled solid blocks for difficulty — always colored text + 10% bg + border
- `border-radius: 4px` for tags, NOT 99px
- `border-radius: 99px` ONLY for hero section badges (Adaptive, SM-2, etc.)

### 4.4 Confidence Dots

```css
.dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  display: inline-block;
}
.dot-filled { background: var(--accent); }          /* #6B63F6 */
.dot-empty  { background: rgba(255,255,255,0.1); }
.dot-green  { background: var(--green); }           /* used at rating 4 */

/* Dot row container */
.dots-row { display: flex; gap: 6px; align-items: center; }
```

**Confidence scale:**
- 1 dot filled (accent) = Guessed / had to peek solution
- 2 dots filled (accent) = Solved with hints
- 3 dots filled (accent) = Solved independently
- 4 dots filled (GREEN, not accent) = Optimal, no hesitation

### 4.5 Hint Blocks

```css
.hint-block {
  border-left: 2px solid var(--accent);
  padding: 10px 14px;
  background: var(--bg-hover);
  border-radius: 0 6px 6px 0;  /* square left (touching border), rounded right */
}

.hint-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 9px;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--accent-mid);
  margin-bottom: 5px;
}

.hint-text {
  font-size: 12px;
  color: var(--text-mid);
  line-height: 1.6;
}

/* Hint 2+ can escalate border color */
.hint-block-warn { border-left-color: var(--amber); }
.hint-block-warn .hint-label { color: var(--amber); }
```

### 4.6 Heatmap Cells

```css
.hcell {
  width: 14px;
  height: 14px;
  border-radius: 2px;
}

/* 5 intensity stops — #1A1C24 → #9D96FF */
.h0 { background: #1A1C24; }                        /* no activity */
.h1 { background: rgba(107, 99, 246, 0.25); }
.h2 { background: rgba(107, 99, 246, 0.45); }
.h3 { background: rgba(107, 99, 246, 0.65); }
.h4 { background: #9D96FF; }                        /* max activity */

.heatmap { display: flex; gap: 3px; flex-wrap: wrap; }
```

### 4.7 Navigation

```css
.nav {
  background: var(--bg-surface);       /* #0B0D12 */
  border-bottom: 1px solid var(--border);
  padding: 12px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.nav-link {
  font-size: 13px;
  color: rgba(255,255,255,0.45);       /* inactive */
  text-decoration: none;
  transition: color 0.15s;
}
.nav-link.active,
.nav-link:hover { color: rgba(255,255,255,0.9); }

/* Day badge in nav */
.nav-day {
  font-family: 'JetBrains Mono', monospace;
  font-size: 9px;
  font-weight: 500;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  background: rgba(107,99,246,0.15);
  color: var(--accent-mid);
  padding: 3px 8px;
  border-radius: 4px;
  border: 1px solid var(--border-accent);
}
```

### 4.8 Problem List Rows

```css
.prob-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px;
  border-radius: 8px;
  border: 1px solid var(--border);
  margin-bottom: 6px;
  transition: background 0.15s;
}
.prob-row:hover    { background: var(--bg-hover); }
.prob-row.solved   { background: var(--state-success-bg); border-color: rgba(74,222,128,0.12); }
.prob-row.active   { background: var(--bg-hover); border-color: var(--border-accent); }

.prob-name { font-size: 13px; font-weight: 500; color: var(--text-high); }
.prob-meta {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  color: var(--text-low);
  margin-top: 2px;
  letter-spacing: 0.06em;
}
```

### 4.9 Section Headers (Mono style)

```css
.section-header {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--accent-mid);
  padding-bottom: 8px;
  border-bottom: 1px solid var(--border);
  margin-bottom: 14px;
}
```

---

## 5. What to Absolutely Never Do

| ❌ Forbidden | ✅ Correct alternative |
|---|---|
| Gradient on any surface or button | Solid flat color only |
| `box-shadow` on cards | Border contrast = elevation |
| Glassmorphism / `backdrop-filter: blur()` | Solid opaque surfaces |
| Glow / neon halo on any element | No glow, ever |
| Pill buttons (`border-radius: 99px`) for actions | `border-radius: 7px` for buttons |
| Filled solid blocks for difficulty tags | Text + 10% bg + 1px border |
| Multiple accent colors at full saturation | One accent, semantic colors only for meaning |
| Emoji icons in feature cards | None, or a proper icon library (Lucide/Tabler) |
| `--accent` (#6B63F6) on small body text | Use `--accent-mid` (#9D96FF) instead |
| Purple-to-blue gradient anywhere | Not even on the logo |

---

## 6. Full :root CSS Block (Copy-paste ready)

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

:root {
  --bg-base:          #080A0F;
  --bg-surface:       #0B0D12;
  --bg-elevated:      #0F1117;
  --bg-hover:         #1A1C24;
  --accent:           #6B63F6;
  --accent-mid:       #9D96FF;
  --text-high:        #E8E6FF;
  --text-mid:         rgba(255,255,255,0.55);
  --text-low:         rgba(255,255,255,0.25);
  --border:           rgba(255,255,255,0.06);
  --border-accent:    rgba(107,99,246,0.3);
  --green:            #4ADE80;
  --amber:            #FBB040;
  --red:              #F87171;
  --state-success-bg: rgba(74,222,128,0.08);
  --state-warn-bg:    rgba(251,176,64,0.08);
  --state-error-bg:   rgba(248,113,113,0.08);
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  background: var(--bg-base);
  color: var(--text-high);
  font-family: 'Inter', sans-serif;
  font-size: 13px;
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
}

.mono {
  font-family: 'JetBrains Mono', monospace;
}
```

---

## 7. The Prompt to Trigger Full CSS Generation

When you want the full CSS built, paste this exactly:

---

**"Generate the full CSS for PathForge using the Ink Dark + Indigo Signal design system. Apply every token, typography rule, component spec, and constraint exactly as defined in the saved design system. No gradients on surfaces. No shadows. No glassmorphism. No glow. No pill buttons. Elevation = border contrast only. Inter for UI, JetBrains Mono for metadata/labels/badges. Three surface levels: bg-base (#080A0F), bg-surface (#0B0D12), bg-elevated (#0F1117). Single accent #6B63F6 for filled buttons and active borders only; use #9D96FF for inline accent text. Difficulty tags: colored text + 10% bg + 1px border, border-radius 4px. Confidence dots: 6px circles, 4-dot scale, green only at rating 4. Hint blocks: border-left 2px solid accent, square left corners, JetBrains Mono label. Heatmap: 14×14px cells, border-radius 2px, 5 stops from #1A1C24 to #9D96FF. Generate CSS for: [list the pages/components you want]."**

---

## 8. File Reference

| File | Purpose |
|---|---|
| `pathforge-design-system.md` | This file — full spec |
| `index.html` | Landing page (existing HTML/CSS) |
| React components to build | Dashboard, ProblemView, Roadmap, Analytics, Revision |