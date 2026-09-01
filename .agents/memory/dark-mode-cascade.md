---
name: Dark mode cascade
description: The stylesheet-specific cascade constraint for keeping Smart Fridge dark surfaces readable.
---

Final dark-mode surface rules must set `background-color` explicitly, not only a `background` shorthand or inherited CSS variable.

**Why:** The stylesheet contains older grouped rules with important light background declarations; shorthand and custom-property overrides can leave a white computed surface in some browsers.

**How to apply:** Keep dark-mode fixes in the final override block and verify computed surface colors after restarting the web workflow.