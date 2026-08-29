---
name: Squircles and overlays
description: Continuous SVG masks work well for surfaces, but can clip positioned descendants such as notification dropdowns.
---

Use the continuous squircle mask on the visible surface that needs the shape, while leaving an ancestor unmasked when it owns an overlay, popover, or dropdown.

**Why:** CSS masks clip descendant rendering, including positioned overlays. Masking a sticky header that contains its notification menu can make the menu disappear outside the header bounds.

**How to apply:** Mask icon buttons, cards, controls, and standalone panels. Keep overlay-owning wrappers unmasked, or move the overlay outside the masked subtree.