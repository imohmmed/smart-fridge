---
name: Layered responsive styling
description: Why the Smart Fridge stylesheet keeps final responsive corrections together for the fridge, navigation, and auth surfaces.
---

The Smart Fridge stylesheet has accumulated several historical responsive layers. Keep future fixes for item cards, shelf spacing, navigation states, and auth breakpoints in the final consolidated override block so they reliably win the cascade.

**Why:** Earlier selectors at different breakpoints can silently override isolated edits, which caused food images and labels to compete for the same visual space and made open navigation/auth layouts inconsistent at intermediate widths.

**How to apply:** When changing responsive UI, update the final override rules first and verify 375px, 768px, and desktop layouts after the workflow restart.

Mobile dashboard header rules may need the same `.dashboard-topbar .dashboard-*` specificity as older declarations; otherwise legacy `order`, `display`, and `flex` values can reintroduce wrapping.

**Why:** A visually correct mobile header can still wrap its action group when an earlier, more-specific grid declaration wins the cascade.

**How to apply:** Keep mobile-only header layout rules together at the end of the stylesheet and verify computed positions, not only screenshot appearance.

When compacting icon-bearing stat cards, preserve the positioning context of decorative pseudo-elements instead of forcing the icon wrapper to `position: static`.

**Why:** The progress-ring inner layer is absolutely positioned and otherwise expands to the card when its relative containing block is removed.

**How to apply:** After changing card flow, verify both the wrapper dimensions and the rendered pseudo-element shape at phone width.

The sidebar reference pattern is best adapted as a warm, card-like rail with CSS-variable width, delayed label choreography, and `data-tooltip` labels for the collapsed state; mobile should use a translated drawer with a fading scrim.

**Why:** This preserves the reference interaction without replacing the existing navigation behavior or adding a language control outside Settings.

**How to apply:** Keep the sidebar's navigation markup semantic and let CSS own width, label, tooltip, and scrim transitions; keep route selection, Escape, overlay clicks, and mobile link closing in React.

For the mobile drawer, define separate final transforms for `html[dir="ltr"]` and `html[dir="rtl"]`; the closed drawer must travel beyond the viewport edge on both sides.

**Why:** A single negative translate value makes the Arabic drawer animate in from the wrong side, while a small offset can leave part of the hidden drawer interactive or visible.

**How to apply:** Keep direction-specific drawer positioning and transforms in the final CSS override block, and test both the open and fully closed bounding boxes.