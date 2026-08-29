---
name: Layered responsive styling
description: Why the Smart Fridge stylesheet keeps final responsive corrections together for the fridge, navigation, and auth surfaces.
---

The Smart Fridge stylesheet has accumulated several historical responsive layers. Keep future fixes for item cards, shelf spacing, navigation states, and auth breakpoints in the final consolidated override block so they reliably win the cascade.

**Why:** Earlier selectors at different breakpoints can silently override isolated edits, which caused food images and labels to compete for the same visual space and made open navigation/auth layouts inconsistent at intermediate widths.

**How to apply:** When changing responsive UI, update the final override rules first and verify 375px, 768px, and desktop layouts after the workflow restart.