---
name: Layered fridge styling
description: Why the Smart Fridge stylesheet keeps a final, consolidated responsive block for fridge item sizing.
---

The fridge stylesheet has accumulated several historical responsive layers. Keep any future fixes for item cards, shelf spacing, and narrow-screen sizing in the final consolidated override block so they reliably win the cascade.

**Why:** Earlier selectors at different breakpoints can silently override isolated edits, which caused food images and labels to compete for the same visual space.

**How to apply:** When changing the fridge visual, update the final fridge-content rules first and verify the 375px layout after the workflow restart.