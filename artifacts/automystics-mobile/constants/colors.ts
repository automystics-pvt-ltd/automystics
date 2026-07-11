/**
 * Semantic design tokens for the mobile app.
 *
 * Derived from the sibling web artifact (artifacts/automystics/src/index.css)
 * `.dark` block — Automystics' brand identity is a dark, violet-blue and
 * cyan/teal aesthetic. The same dark palette is used for both `light` and
 * `dark` keys so the app keeps a single, consistent brand look regardless of
 * the device's system appearance setting.
 */

const dark = {
  // Legacy aliases (kept for backward compatibility)
  text: '#fafafa',
  tint: '#735af2',

  // Core surfaces
  background: '#05080f',
  foreground: '#fafafa',

  // Cards / elevated surfaces
  card: '#0c1120',
  cardForeground: '#fafafa',

  // Primary action color (buttons, links, active states) — violet-blue
  primary: '#735af2',
  primaryForeground: '#ffffff',

  // Secondary accent — bright cyan/teal
  secondary: '#0dccf2',
  secondaryForeground: '#03202a',

  // Muted / subdued elements (dividers, timestamps, placeholders)
  muted: '#16181d',
  mutedForeground: '#9ea3ae',

  // Accent highlights (badges, selected items, focus rings)
  accent: '#221a4d',
  accentForeground: '#c3b8f9',

  // Destructive actions (delete, error states)
  destructive: '#e5484d',
  destructiveForeground: '#ffffff',

  // Borders and input outlines
  border: '#282c34',
  input: '#282c34',
};

const colors = {
  light: dark,
  dark,

  // Border radius (in px), synced from the web artifact's --radius (0.75rem = 12px)
  radius: 12,
};

export default colors;
