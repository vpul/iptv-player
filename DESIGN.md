# Design

## Theme

Dark, warm-neutral with a faint green tint toward the brand hue. Scene: a dim living room at night; the grid should read like a lit wall of screens in a dark gallery. Light mode is not shipped.

Color strategy: **Restrained**. Tinted neutrals carry every surface; one sage accent (≤10% of any screen) marks selection, focus, and primary action.

## Color palette (OKLCH)

| Token | Value | Use |
|---|---|---|
| `--bg` | `oklch(0.16 0.008 165)` | App background |
| `--surface` | `oklch(0.20 0.010 165)` | Cards, header, input fields |
| `--surface-2` | `oklch(0.245 0.012 165)` | Raised/hover surface, chips active |
| `--ink` | `oklch(0.93 0.006 165)` | Primary text |
| `--ink-muted` | `oklch(0.74 0.012 165)` | Secondary text (≥4.5:1 on bg/surface) |
| `--ink-faint` | `oklch(0.58 0.012 165)` | Meta only, never body |
| `--accent` | `oklch(0.80 0.10 160)` | Selection, focus, primary action, links |
| `--accent-ink` | `oklch(0.19 0.03 160)` | Text on accent surfaces |
| `--accent-soft` | `oklch(0.30 0.04 162)` | Tinted accent background (active chips, glows) |
| `--line` | `oklch(0.32 0.010 165)` | Hairline borders (1px, no paired shadows) |
| `--danger` | `oklch(0.72 0.15 25)` | Stream errors only |
| `--danger-soft` | `oklch(0.28 0.06 25)` | Error panel tint |

Borders instead of shadows on dark surfaces (shadows vanish on dark; a border + surface shift reads cleaner). Never pair a border with a wide blur shadow.

## Typography

Two families, contrast axis serif + humanist sans:

- **UI / body: Figtree** (400, 500, 600, 700). Buttons, labels, channel names, meta, inputs.
- **Display: Fraunces** (500, 600, soft opsz). Wordmark and empty-state headline only. Never in buttons, labels, or data.

Fixed rem scale, ratio ~1.2: `0.75 / 0.8125 / 0.875 / 1 / 1.125 / 1.375 / 1.75rem`. Body line-height 1.55; UI labels line-height 1.2. Channel names clamp to 2 lines with `text-overflow` ellipsis.

## Layout

- **Header** (sticky, hairline bottom border): wordmark left, search center (max 32rem), quiet GitHub link right. Height 4rem.
- **Filter row** below header: country `<select>` + horizontal-scroll category chips, one row, never wrapping into walls.
- **Channel grid**: CSS grid `repeat(auto-fill, minmax(10.5rem, 1fr))`, gap 1rem, virtualized rows (@tanstack/react-virtual). Card: 12px radius, 1px `--line` border, logo centered on surface with fixed 6rem logo box, name + country line below.
- **Watch page**: player at 16:9 max-height 72vh, full-bleed width, meta row (title, country · category · quality badge), then "More channels" rail reusing the card.
- Max content width 90rem; single column of sections, no sidebars.
- Z-scale: content `0` < sticky header `10` < player overlay `20` < toast `30`.

## Components

Each interactive component ships default / hover / focus-visible / active / disabled / loading / error as applicable:

- **Card**: border `--line`; hover: border `--accent` at 45% + `--surface-2` + `translateY(-2px)`; focus-visible ring accent.
- **Chip** (category): pill, border hairline; active: `--accent-soft` bg + accent text; never full-saturation on inactive.
- **Search input**: `--surface` field, hairline border, accent focus ring, `/` shortcut hint.
- **Skeletons**: shimmering `--surface` blocks in grid shape; never center-of-page spinners.
- **Empty state** (no results / stream dead): Fraunces headline + one-line guidance + one action button.
- **Player**: native controls; title overlay fades on idle in fullscreen; error panel uses `--danger-soft`.

## Motion

150–250 ms, `cubic-bezier(0.22, 1, 0.36, 1)` (ease-out-quart) for all state transitions. Card hover lift −2px. Skeleton shimmer 1.6s linear infinite. No page-load choreography, no entrance cascade on every visit; a single subtle 24ms-per-item stagger on first grid reveal only. `prefers-reduced-motion: reduce` → opacity crossfades only, shimmer off.

## Iconography

Minimal inline SVG set (search, arrow-left, play, external, refresh), 1.5px stroke, round caps, `currentColor`. No icon font, no emoji.
