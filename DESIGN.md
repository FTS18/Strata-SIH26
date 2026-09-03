# Strata - Design System Contract

This document serves as the single source of truth for the design system used in the Strata project. All UI components, Open Design workflows, and Antigravity agents must strictly adhere to these design tokens and conventions.

---

## 1. Dual-Theme Palette System

### Dark Mode: Abyss Teal & Sage Defense System
Curated tactical theme based on deep abyss teals and sage mist accents:
- **Canvas Background (`--surface-canvas`):** `#092328` (Deep Abyss Teal)
- **Panel Surface (`--surface-panel`):** `#0d3137` (Forest Teal Container)
- **Card Surface (`--surface-subtle`):** `#12544F` (Elevated Card)
- **Active Surface (`--surface-active`):** `#18635c` (Selected / Hovered State)
- **Borders & Dividers:**
  - Hairline Border (`--surface-border`): `#1d6d63`
  - Subtle Divider (`--surface-border-subtle`): `#144943`
- **Primary Accents:**
  - Jade Pine Green (`--color-accent-primary`): `#2A835F`
  - Sage Mist Green (`--color-accent-sage`): `#8BBB92`

### Light Mode: Earth, Nature & Botanical Pine Palette
ColorHunt curated warm nature/earth palette:
- **Canvas Background (`--surface-canvas`):** `#FBF5DD` (Warm Cream Beige Canvas / rgb(251, 245, 221))
- **Panel Surface (`--surface-panel`):** `#f3eed6` (Soft Sand Beige Panel)
- **Card Surface (`--surface-subtle`):** `#E7E1B1` (Muted Earth Straw Card / rgb(231, 225, 177))
- **Active Surface (`--surface-active`):** `#dcd49b` (Warm Earth Active Surface)
- **Borders & Dividers:**
  - Hairline Border (`--surface-border`): `#c5be88`
  - Subtle Divider (`--surface-border-subtle`): `#dbd4a4`
- **Primary Accents & Text:**
  - Leafy Moss Green (`--color-accent-primary`): `#306D29` (rgb(48, 109, 41))
  - Deep Botanical Pine (`--color-accent-sage` / `--text-primary`): `#0D530E` (rgb(13, 83, 14))
  - Soft Herbal Green (`--text-muted`): `#537a4a`


---

## 2. Typography Hierarchy
- **Body & Sans (`--font-sans`):** `'Bricolage Grotesque', -apple-system, BlinkMacSystemFont, sans-serif`
- **Headings & Display (`--font-display`):** `'Anton', impact, sans-serif`
- **Mono / Data (`--font-mono`):** `'Bricolage Grotesque', -apple-system, BlinkMacSystemFont, sans-serif`

### Text Colors:
- **Primary Text (`--text-primary`):** `#f0fdf4` (Pure Mist White)
- **Secondary Text (`--text-secondary`):** `#8BBB92` (Sage Accent)
- **Muted Text (`--text-muted`):** `#5b9076` (Muted Forest Sage)
- **Inverse Canvas (`--text-inverse`):** `#092328`

---

## 3. Status & Semantic Tokens
- **Good / Nominal (`--status-good`):** `#8BBB92` (Background: `rgba(139, 187, 146, 0.15)`, Border: `rgba(139, 187, 146, 0.35)`)
- **Warning (`--status-warning`):** `#f59e0b` / `#fbbf24` (Background: `rgba(245, 158, 11, 0.15)`, Border: `rgba(245, 158, 11, 0.35)`)
- **Critical / Urgent (`--status-critical`):** `#ef4444` / `#f87171` (Background: `rgba(239, 68, 68, 0.15)`, Border: `rgba(239, 68, 68, 0.35)`)
- **Transit Telemetry (`--status-transit`):** `#8BBB92`

---

## 4. UI Rules & Geometry
- **Border Radii:**
  - Small elements: `4px` (`--radius-sm`)
  - Standard cards: `6px` (`--radius-md`)
  - Panels & modals: `8px` (`--radius-lg`)
  - Badges / Pills: `9999px` (`--radius-pill`)
- **Shadows:** Deep tinted atmospheric shadows (`0 2px 8px rgba(9, 35, 40, 0.6)`)
- **Layout:** High-density enterprise dashboard layout with flush map containers and structured tabular metrics.
