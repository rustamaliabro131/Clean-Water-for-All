---
name: HydraFlow Visual Language
colors:
  surface: '#faf8ff'
  surface-dim: '#d2d9f4'
  surface-bright: '#faf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f3ff'
  surface-container: '#eaedff'
  surface-container-high: '#e2e7ff'
  surface-container-highest: '#dae2fd'
  on-surface: '#131b2e'
  on-surface-variant: '#3f4850'
  inverse-surface: '#283044'
  inverse-on-surface: '#eef0ff'
  outline: '#707881'
  outline-variant: '#bfc7d2'
  surface-tint: '#006398'
  primary: '#006194'
  on-primary: '#ffffff'
  primary-container: '#007bb9'
  on-primary-container: '#fdfcff'
  inverse-primary: '#93ccff'
  secondary: '#00687a'
  on-secondary: '#ffffff'
  secondary-container: '#57dffe'
  on-secondary-container: '#006172'
  tertiary: '#006947'
  on-tertiary: '#ffffff'
  tertiary-container: '#00855b'
  on-tertiary-container: '#f5fff6'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#cce5ff'
  primary-fixed-dim: '#93ccff'
  on-primary-fixed: '#001d31'
  on-primary-fixed-variant: '#004b73'
  secondary-fixed: '#acedff'
  secondary-fixed-dim: '#4cd7f6'
  on-secondary-fixed: '#001f26'
  on-secondary-fixed-variant: '#004e5c'
  tertiary-fixed: '#6ffbbe'
  tertiary-fixed-dim: '#4edea3'
  on-tertiary-fixed: '#002113'
  on-tertiary-fixed-variant: '#005236'
  background: '#faf8ff'
  on-background: '#131b2e'
  surface-variant: '#dae2fd'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 48px
    fontWeight: '800'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 12px
  md: 24px
  lg: 48px
  xl: 80px
  gutter: 20px
  margin-mobile: 16px
  margin-desktop: 40px
---

## Brand & Style

The design system is centered on an **Eco-conscious and High-impact** personality. It balances the urgency of clean water awareness with a friendly, gamified user experience. The aesthetic is **Modern-Minimalist with Fluid Glassmorphism**, designed to evoke the clarity and movement of water. 

The UI should feel "fresh" and "crisp," utilizing heavy whitespace to reduce cognitive load while employing translucent layers to create a sense of depth and fluidity. This approach ensures the application remains professional and trustworthy while maintaining the engaging energy of a gamified platform.

## Colors

The palette is inspired by aquatic environments. 
- **Primary (Ocean Blue):** Used for core branding, primary actions, and progress indicators.
- **Secondary (Vibrant Cyan):** Used for interactive elements, highlights, and gamification rewards to provide a sense of energy.
- **Accent (Mint Green):** Reserved for "success" states, eco-impact milestones, and positive reinforcement.
- **Neutral (Deep Slate):** Applied to all primary text and iconography to ensure high legibility against crisp backgrounds.
- **Backgrounds:** A combination of #F8FAFC for base layouts and #FFFFFF for elevated cards and components to create subtle structural contrast.

## Typography

The design system utilizes **Plus Jakarta Sans** for its friendly, rounded terminals which mirror the fluid nature of water. 
- **Headlines:** Use Bold (700) or ExtraBold (800) weights with slightly tight letter-spacing to create a strong, modern impact.
- **Body:** Use Regular (400) weight for maximum readability. 
- **Labels:** Use SemiBold (600) or Bold (700) in all-caps or title case for utility elements, ensuring they stand out within the minimalist layout.

## Layout & Spacing

The layout follows a **fluid grid system** to accommodate the gamified nature of the app across various devices.
- **Grid:** Use a 12-column grid for desktop and a 4-column grid for mobile.
- **Rhythm:** An 8px baseline grid governs all vertical spacing.
- **Fluidity:** Containers should utilize max-widths for desktop (1200px) but remain fluid on smaller breakpoints.
- **Margins:** Generous outer margins (40px on desktop) maintain the minimalist feel and focus attention on the central content.

## Elevation & Depth

This design system uses **Fluid Glassmorphism** and **Ambient Shadows** to create a layered, modern interface.
- **Glassmorphism:** Secondary containers and navigation overlays should use a 60% opacity white fill with a 20px backdrop blur and a 1px semi-transparent white border.
- **Shadows:** Use extremely soft, diffused shadows to lift cards from the background. Shadows should use the Primary color (Ocean Blue) at 5-10% opacity rather than pure black to keep the UI feeling "clean" and "aqueous."
- **Stacking:** Higher elevation levels (e.g., modals) should increase both the shadow spread and the intensity of the backdrop blur.

## Shapes

The shape language is defined by **significant roundedness (16px base)** to convey friendliness and accessibility.
- **Base Components:** 0.5rem (8px) for small items like tags or checkboxes.
- **Standard (rounded-lg):** 1rem (16px) for buttons, input fields, and standard cards.
- **Large (rounded-xl):** 1.5rem (24px) for major section containers and hero elements.
- **Pill:** Used exclusively for status chips and primary action buttons to emphasize interactivity.

## Components

- **Buttons:** Primary buttons use a pill shape with a Vibrant Cyan to Ocean Blue horizontal gradient. Hover states should include a subtle scale-up effect (1.02x).
- **Cards:** White background with a 1px border (#E2E8F0) and the standard 16px corner radius. Include a soft Ocean Blue ambient shadow.
- **Input Fields:** Soft Off-White (#F1F5F9) fill with a 16px radius. Focus states should transition the border to Ocean Blue with a subtle outer glow.
- **Chips/Badges:** Small, pill-shaped elements using low-opacity versions of the Primary or Accent colors (e.g., 10% Mint Green background with 100% Mint Green text).
- **Progress Indicators:** Use fluid, wave-like animations for progress bars to reinforce the water theme.
- **Lists:** Clean rows separated by whitespace rather than lines, using 16px padding and rounded selection states.