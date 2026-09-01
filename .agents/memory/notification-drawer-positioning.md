---
name: Notification drawer positioning
description: The responsive notification overlay must remain viewport-bound across dashboard scroll containers.
---

The notification overlay should be rendered at the document body level and positioned with explicit viewport insets, rather than relying on `position: fixed` while nested inside the scrolling dashboard content.

**Why:** The dashboard's overflow and sticky layout can make a nested fixed element use an unexpected containing block, producing a short or off-screen drawer at different widths.

**How to apply:** Keep the scrim and drawer in the body-level overlay, use explicit height/insets for phone and desktop, and verify Arabic and English at phone, tablet, and desktop widths.