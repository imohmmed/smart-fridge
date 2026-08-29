---
name: Layered responsive styling
description: Why the Smart Fridge stylesheet keeps final responsive corrections together for the fridge, navigation, and auth surfaces.
---

The Smart Fridge stylesheet has accumulated several historical responsive layers. Keep future fixes for item cards, shelf spacing, navigation states, and auth breakpoints in the final consolidated override block so they reliably win the cascade.

**Why:** Earlier selectors at different breakpoints can silently override isolated edits, which caused food images and labels to compete for the same visual space and made open navigation/auth layouts inconsistent at intermediate widths.

**How to apply:** When changing responsive UI, update the final override rules first and verify 375px, 768px, and desktop layouts after the workflow restart.

The sidebar reference pattern is best adapted as a warm, card-like rail with CSS-variable width, delayed label choreography, and `data-tooltip` labels for the collapsed state; mobile should use a translated drawer with a fading scrim.

**Why:** This preserves the reference interaction without replacing the existing navigation behavior or adding a language control outside Settings.

**How to apply:** Keep the sidebar's navigation markup semantic and let CSS own width, label, tooltip, and scrim transitions; keep route selection, Escape, overlay clicks, and mobile link closing in React.