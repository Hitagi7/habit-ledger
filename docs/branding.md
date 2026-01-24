# Branding & Design System

This document defines the visual identity and design system for projects. Use this as a reference for consistent styling across all applications.

---

## Color Palette

### Primary Colors

| Name | Hex | RGB | Usage |
|------|-----|-----|-------|
| **Primary (Orange)** | `#ff6b00` | `rgb(255, 107, 0)` | CTA buttons, icons, logo accents, active states |
| **Primary Light** | `#ff8533` | `rgb(255, 133, 51)` | Hover states, highlights |
| **Primary Dark** | `#cc5500` | `rgb(204, 85, 0)` | Pressed states |

### Secondary Colors

| Name | Hex | RGB | Usage |
|------|-----|-----|-------|
| **Secondary (Cyan)** | `#06b6d4` | `rgb(6, 182, 212)` | Text highlights, ambient glows, secondary accents |
| **Secondary Light** | `#22d3ee` | `rgb(34, 211, 238)` | Hover highlights |

### Background Colors

| Name | Hex | RGB | Usage |
|------|-----|-----|-------|
| **Background** | `#0a0a0f` | `rgb(10, 10, 15)` | Main page background |
| **Surface** | `#18181b` | `rgb(24, 24, 27)` | Cards, containers (zinc-900) |
| **Surface Elevated** | `#27272a` | `rgb(39, 39, 42)` | Elevated cards, modals (zinc-800) |

### Text Colors

| Name | Hex | RGB | Usage |
|------|-----|-----|-------|
| **Text Primary** | `#ffffff` | `rgb(255, 255, 255)` | Headings, important text |
| **Text Secondary** | `#a1a1aa` | `rgb(161, 161, 170)` | Body text, descriptions (zinc-400) |
| **Text Muted** | `#71717a` | `rgb(113, 113, 122)` | Captions, hints (zinc-500) |

### Border Colors

| Name | Hex | Usage |
|------|-----|-------|
| **Border Default** | `rgba(255, 255, 255, 0.1)` | Card borders, dividers |
| **Border Hover** | `rgba(255, 255, 255, 0.2)` | Hover state borders |

---

## Typography

### Font Stack

```css
font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 
             "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
```

Or use **Geist Sans** from Next.js for a modern, clean look.

### Font Sizes

| Element | Size | Weight | Line Height |
|---------|------|--------|-------------|
| Hero Heading (h1) | `3.75rem` (60px) | Bold (700) | 1.1 |
| Section Heading (h2) | `2.25rem` (36px) | Bold (700) | 1.2 |
| Subsection (h3) | `1.5rem` (24px) | Semibold (600) | 1.3 |
| Body Large | `1.125rem` (18px) | Regular (400) | 1.6 |
| Body | `1rem` (16px) | Regular (400) | 1.5 |
| Small/Caption | `0.875rem` (14px) | Medium (500) | 1.4 |

---

## UI Components

### Buttons

#### Primary Button
```css
.btn-primary {
  background: linear-gradient(135deg, #ff6b00 0%, #ff8533 100%);
  color: #ffffff;
  padding: 0.75rem 1.5rem;
  border-radius: 9999px; /* fully rounded / pill */
  font-weight: 600;
  box-shadow: 0 4px 14px rgba(255, 107, 0, 0.4);
  transition: all 0.3s ease;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 107, 0, 0.5);
}
```

#### Secondary Button (Ghost)
```css
.btn-secondary {
  background: transparent;
  color: #ffffff;
  padding: 0.75rem 1.5rem;
  border-radius: 9999px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  font-weight: 500;
  transition: all 0.3s ease;
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.3);
}
```

### Cards

```css
.card {
  background: #18181b; /* zinc-900 */
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 1rem; /* rounded-2xl */
  padding: 1.5rem;
  transition: all 0.3s ease;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 40px -12px rgba(0, 0, 0, 0.4);
}
```

### Glassmorphism

```css
.glass {
  background: rgba(10, 10, 15, 0.8);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}
```

---

## Effects & Animations

### Gradient Text

```css
.gradient-text {
  background: linear-gradient(135deg, #ff6b00 0%, #06b6d4 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
```

### Ambient Glows

```css
/* Orange glow */
.glow-orange {
  background: radial-gradient(circle, rgba(255, 107, 0, 0.3) 0%, transparent 70%);
}

/* Cyan glow */
.glow-cyan {
  background: radial-gradient(circle, rgba(6, 182, 212, 0.2) 0%, transparent 70%);
}
```

### Hover Animations

```css
/* Lift effect */
.hover-lift {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.hover-lift:hover {
  transform: translateY(-4px);
}

/* Float animation */
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}
```

### Entry Animations

```css
/* Fade In Up */
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade-in-up {
  animation: fadeInUp 0.5s ease-out forwards;
}

/* Slide In Left */
@keyframes slideInLeft {
  from { opacity: 0; transform: translateX(-20px); }
  to { opacity: 1; transform: translateX(0); }
}

.animate-slide-in-left {
  animation: slideInLeft 0.5s ease-out forwards;
}
```

### Animation Delays

Use these utilities to stagger animations for children elements:

| Class | Delay |
|-------|-------|
| `.delay-100` | 100ms |
| `.delay-200` | 200ms |
| `.delay-300` | 300ms |
| `.delay-500` | 500ms |

### Pulse Ring

```css
@keyframes pulse-ring {
  0% { transform: scale(0.95); opacity: 0.5; }
  50% { transform: scale(1); opacity: 0.3; }
  100% { transform: scale(0.95); opacity: 0.5; }
}

.pulse-ring {
  animation: pulse-ring 2s ease-in-out infinite;
}
```

---

## Layout Patterns

### Hero Section
- Centered content with max-width constraint
- Large, bold headline with accent-colored keywords
- Descriptive subtext in secondary color
- Dual CTA buttons (primary + secondary)
- Ambient glow effects in background

### Feature Grid
- 3-column grid on desktop, 2 on tablet, 1 on mobile
- Icon + Title + Description pattern
- Cards with subtle hover lift effect

### Navigation
- Fixed/sticky with glassmorphism effect
- Logo on left, nav links center/right
- Primary CTA button highlighted

---

## Icon Style

- **Style:** Outline/stroke icons (not filled)
- **Stroke Width:** 1.5px - 2px
- **Size:** 20-24px for UI, 40-48px for feature icons
- **Color:** Match primary accent (orange) or use white

---

## Spacing Scale

Based on 4px base unit:

| Token | Value | Usage |
|-------|-------|-------|
| `xs` | 4px | Tight spacing |
| `sm` | 8px | Icon gaps |
| `md` | 16px | Component padding |
| `lg` | 24px | Section gaps |
| `xl` | 32px | Card padding |
| `2xl` | 48px | Section spacing |
| `3xl` | 64px | Hero spacing |

---

## CSS Variables Template

```css
:root {
  /* Colors */
  --color-primary: #ff6b00;
  --color-primary-light: #ff8533;
  --color-secondary: #06b6d4;
  --color-background: #0a0a0f;
  --color-surface: #18181b;
  --color-surface-elevated: #27272a;
  --color-text-primary: #ffffff;
  --color-text-secondary: #a1a1aa;
  --color-text-muted: #71717a;
  --color-border: rgba(255, 255, 255, 0.1);
  
  /* Gradients */
  --gradient-primary: linear-gradient(135deg, #ff6b00 0%, #ff8533 100%);
  --gradient-accent: linear-gradient(135deg, #ff6b00 0%, #06b6d4 100%);
  
  /* Shadows */
  --shadow-primary: 0 4px 14px rgba(255, 107, 0, 0.4);
  --shadow-elevated: 0 20px 40px -12px rgba(0, 0, 0, 0.4);
  
  /* Transitions */
  --transition-fast: 0.2s ease;
  --transition-normal: 0.3s ease;
}
```

---

## Tailwind CSS Classes Reference

```
/* Backgrounds */
bg-[#0a0a0f]        - Main background
bg-zinc-900         - Cards/surfaces
bg-zinc-800         - Elevated surfaces

/* Text */
text-white          - Primary text
text-zinc-400       - Secondary text
text-zinc-500       - Muted text
text-orange-500     - Accent text

/* Borders */
border-white/10     - Default border
border-white/20     - Hover border
rounded-2xl         - Card corners
rounded-full        - Pill buttons

/* Effects */
backdrop-blur-xl    - Glass effect
shadow-lg           - Elevated shadow
```

---

## Usage Examples

### Hero Headline with Accent
```jsx
<h1 className="text-5xl font-bold text-white">
  Track your <span className="text-orange-500">finances</span> and habits
</h1>
```

### Feature Card
```jsx
<div className="bg-zinc-900 border border-white/10 rounded-2xl p-6 hover:-translate-y-1 transition-transform">
  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center mb-4">
    <Icon className="w-6 h-6 text-white" />
  </div>
  <h3 className="text-xl font-semibold text-white mb-2">Feature Title</h3>
  <p className="text-zinc-400">Feature description goes here.</p>
</div>
```

---

*Last updated: January 2026*
