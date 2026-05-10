---
version: alpha
name: LeagueBound Fresh
description: A dark, premium sports-management interface for a basketball career sim with broadcast-style dashboards, editorial story panels, and high-clarity game-state signaling.
colors:
  background: "#090B10"
  surface: "#111827"
  surface-strong: "#0F172A"
  surface-alt: "#1F2937"
  surface-soft: "#020617"
  border: "#1F2937"
  border-strong: "#334155"
  text-primary: "#FFFFFF"
  text-secondary: "#E2E8F0"
  text-muted: "#94A3B8"
  text-subtle: "#64748B"
  accent-premium: "#D4AF37"
  accent-sky: "#38BDF8"
  accent-cyan: "#22D3EE"
  accent-emerald: "#34D399"
  accent-amber: "#FCD34D"
  accent-rose: "#FDA4AF"
  accent-red: "#FCA5A5"
  overlay: "#000000CC"
  win-tint: "#064E3BCC"
  loss-tint: "#4C0519CC"
  story-tint: "#082F49CC"
typography:
  display:
    fontFamily: "System"
    fontSize: 30px
    fontWeight: 700
    lineHeight: 36px
    letterSpacing: -0.02em
  title:
    fontFamily: "System"
    fontSize: 24px
    fontWeight: 700
    lineHeight: 30px
    letterSpacing: -0.02em
  heading:
    fontFamily: "System"
    fontSize: 18px
    fontWeight: 700
    lineHeight: 24px
    letterSpacing: -0.01em
  body:
    fontFamily: "System"
    fontSize: 16px
    fontWeight: 400
    lineHeight: 24px
    letterSpacing: 0em
  body-sm:
    fontFamily: "System"
    fontSize: 14px
    fontWeight: 400
    lineHeight: 20px
    letterSpacing: 0em
  label:
    fontFamily: "System"
    fontSize: 12px
    fontWeight: 600
    lineHeight: 16px
    letterSpacing: 0.08em
  label-tight:
    fontFamily: "System"
    fontSize: 11px
    fontWeight: 600
    lineHeight: 14px
    letterSpacing: 0.08em
  micro:
    fontFamily: "System"
    fontSize: 10px
    fontWeight: 700
    lineHeight: 12px
    letterSpacing: 0.1em
spacing:
  xs: 4px
  sm: 8px
  md: 12px
  lg: 16px
  xl: 20px
  2xl: 24px
  3xl: 32px
  4xl: 40px
rounded:
  sm: 6px
  md: 8px
  lg: 12px
  xl: 16px
  2xl: 20px
  pill: 999px
  full: 9999px
elevation:
  base:
    backgroundColor: "{colors.background}"
    borderColor: "{colors.border}"
  card:
    backgroundColor: "{colors.surface}"
    borderColor: "{colors.border}"
  inset:
    backgroundColor: "{colors.surface-soft}"
    borderColor: "{colors.border-strong}"
  overlay:
    backgroundColor: "{colors.overlay}"
    borderColor: "{colors.border}"
shadows:
  card: "0 0 0 1px rgba(31,41,55,0.9)"
  overlay: "0 24px 64px rgba(0,0,0,0.45)"
  emphasis: "0 0 0 1px rgba(212,175,55,0.2)"
motion:
  instant: 120ms
  standard: 220ms
  deliberate: 320ms
  easing-standard: "ease-out"
  easing-emphasis: "ease-in-out"
components:
  screen:
    backgroundColor: "{colors.background}"
    textColor: "{colors.text-primary}"
  panel:
    backgroundColor: "{colors.surface}"
    borderColor: "{colors.border}"
    borderRadius: "{rounded.xl}"
    padding: "{spacing.lg}"
  panel-inset:
    backgroundColor: "{colors.surface-soft}"
    borderColor: "{colors.border-strong}"
    borderRadius: "{rounded.lg}"
    padding: "{spacing.md}"
  hero-label:
    color: "{colors.accent-premium}"
    typography: "{typography.label}"
  stat-label:
    color: "{colors.text-muted}"
    typography: "{typography.label-tight}"
  stat-value:
    color: "{colors.text-primary}"
    typography: "{typography.body-sm}"
  button-primary:
    backgroundColor: "{colors.accent-emerald}"
    textColor: "#000000"
    borderRadius: "{rounded.lg}"
    padding: "{spacing.md}"
  button-secondary:
    backgroundColor: "{colors.surface-alt}"
    textColor: "{colors.text-primary}"
    borderRadius: "{rounded.lg}"
    padding: "{spacing.md}"
  button-cta:
    backgroundColor: "{colors.accent-sky}"
    textColor: "{colors.text-primary}"
    borderRadius: "{rounded.xl}"
    padding: "{spacing.lg}"
  segmented-control:
    backgroundColor: "{colors.surface}"
    borderColor: "{colors.border}"
    borderRadius: "{rounded.lg}"
  segmented-control-active:
    backgroundColor: "{colors.surface-alt}"
    textColor: "{colors.text-primary}"
  chip-selected:
    backgroundColor: "#34D39926"
    borderColor: "#34D39980"
    textColor: "#D1FAE5"
  chip-info:
    backgroundColor: "#22D3EE1A"
    borderColor: "#22D3EE66"
    textColor: "#CFFAFE"
  badge-premium:
    backgroundColor: "#D4AF371A"
    borderColor: "#D4AF3733"
    textColor: "{colors.accent-premium}"
  badge-user:
    backgroundColor: "#FCD34D26"
    borderColor: "#FCD34D80"
    textColor: "#FEF08A"
  status-win:
    backgroundColor: "#10B98133"
    textColor: "#86EFAC"
  status-loss:
    backgroundColor: "#F43F5E33"
    textColor: "#FDA4AF"
  overlay-card:
    backgroundColor: "{colors.surface}"
    borderColor: "{colors.border}"
    borderRadius: "{rounded.2xl}"
    shadow: "{shadows.overlay}"
---

## Overview

LeagueBound Fresh presents basketball progression as a premium control room rather than an arcade game. The interface is dark, compact, and information-forward. It should feel like a blend of scouting dossier, recruiting dashboard, and stripped-down broadcast package.

The visual identity is serious and grounded. Most of the UI sits on near-black and blue-charcoal surfaces, with metallic gold reserved for framing, category labels, and premium-value stats. Brighter utility colors carry meaning: emerald for progress and positive resolution, sky and cyan for navigation and live interaction, amber for caution, rose or red for losses and failure states.

Nothing in the product should feel decorative for its own sake. Visual emphasis always corresponds to game state, player progression, or narrative importance.

## Colors

The palette is anchored by cold, low-luminance neutrals. Backgrounds should stay in the slate-to-ink range, with subtle step-ups in value for cards, inset wells, tab rails, and modal surfaces. Borders are visible but restrained; they separate layers without turning the interface into a grid of boxes.

Gold is the identity accent, not the default action color. Use it for section kickers, premium-value readouts like money or spotlight labels, and moments where the product wants to signal prestige or career upside.

Emerald is the primary success color. It marks selected builder chips, positive action buttons, recruiting progress bars, successful outcomes, and healthy forward motion.

Sky and cyan are interactive broadcast accents. They fit tabs, links, live moments, tactical controls, and story callouts. These hues should feel analytic and current, not playful.

Rose, red, and amber are strictly semantic. They should appear only when the UI is warning the player, showing injury or risk, flagging errors, or marking negative outcomes.

## Typography

Typography is system-sans and utilitarian. There is no ornamental display face. Hierarchy comes from weight, scale, spacing, and casing rather than font personality.

Large headlines are bold and tight, especially on screen entries such as hub titles, story headlines, and score headers. Supporting copy stays readable and slightly airy, with body text often carrying longer recaps or narrative passages at comfortable line height.

Uppercase micro-labels are an important part of the system. They establish section structure, frame stats, and reinforce the “dashboard” tone. Use generous tracking on these labels so they feel like metadata, not body copy.

Numeric emphasis matters. Scores, ratings, and single-value stats should read as quick-glance anchors inside otherwise dense information panels.

## Layout

The layout model is mobile-first, vertically stacked, and card-driven. Screens are built from a single scrolling column of panels with consistent outer padding and generous spacing between sections.

Within cards, information is grouped into compact inset blocks. These smaller units handle stat clusters, offer details, health summaries, box score rows, or action summaries. The rhythm alternates between large enclosing panels and denser sub-panels.

The app should feel dense but never cramped. It is acceptable to show a lot of information, but grouping must stay obvious: title first, status second, controls third, details after that.

## Elevation & Depth

Depth is created mostly with tonal separation and borders, not dramatic drop shadows. Base screens sit on deep ink. Primary cards rise one step brighter. Inset wells and table rows drop slightly darker again.

Overlays are the one place where depth becomes explicit. Narrative and help modals sit over a strong black scrim and feel clearly detached from the base screen. Their edges should be crisp, their corners slightly rounder, and their internal spacing more generous than standard inline cards.

## Shapes

Corners are consistently rounded, with large cards landing around the soft-rectangle range rather than hard rectangles. Pills and capsules are used for state tags, selected chips, “YOU” markers, and tiny status labels.

Buttons should feel sturdy and touchable, never razor-sharp. Primary calls to action are filled blocks with strong contrast. Secondary controls sit on muted slate fills. Selection states are communicated by tinted fills plus border reinforcement, not by shape changes.

## Components

The most recognizable component pattern is the stacked dashboard card: a rounded dark panel with a subtle border, an uppercase section label, and a sequence of inset content tiles.

Builder controls rely on two repeated ideas:

- Selected options use translucent emerald or cyan fills with matching borders.
- Numerical steppers and small action controls sit inside darker inset wells so the active value can stand out.

Story and match views borrow from broadcast graphics. Score bars, segmented tabs, player rows, and event logs should feel structured, fast to parse, and slightly editorial. Highlight moments can lean into sky or cyan tints, while user-owned or player-specific highlights may use gold or warm yellow to stand apart from neutral team data.

Buttons are stateful and semantic:

- Emerald filled buttons signal acceptance, confirmation, or starting a new progression step.
- Sky filled buttons signal the next major game-flow action, especially entering play.
- Slate buttons are neutral fallback actions.
- Disabled states remain visible but flattened through reduced contrast rather than disappearance.

## Do's and Don'ts

- Do preserve the dark premium sports-broadcast identity.
- Do keep gold scarce so it still reads as prestige.
- Do use semantic colors consistently for success, warning, failure, and live interaction.
- Do favor card groupings, inset stat wells, and uppercase metadata labels.
- Do make dense information easy to scan through spacing and hierarchy.

- Don't introduce bright playful colors outside semantic states.
- Don't treat every interactive element as gold; most actions are emerald, sky, or slate.
- Don't use heavy shadow stacks for ordinary cards.
- Don't flatten the interface into plain text on a single undifferentiated background.
- Don't make the app feel luxurious in a soft lifestyle sense; it should feel competitive, tactical, and progression-driven.
