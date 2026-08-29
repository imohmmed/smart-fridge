---
name: Responsive browser test runtime
description: System requirements for running Playwright Chromium checks in this workspace.
---

Playwright Chromium checks require the Nix graphics and browser runtime libraries to be present in the workspace environment; the test package alone is not sufficient.

**Why:** The minimal container image may omit shared libraries such as GLib and GBM, causing the browser to exit before any test can run.

**How to apply:** If responsive browser checks fail during browser launch with a missing `.so` file, install the matching Nix runtime dependency before changing the test or application code.

When a responsive test is intentionally positioned at the end of a long page, avoid clicking an off-screen header control with Playwright's normal locator click; it auto-scrolls the page and changes the condition being tested. Use a visible overlay control or a DOM click when preserving scroll position is the point of the test.

**Why:** Fixed mobile controls can be covered by an opened sidebar, while the header control that opened it may be off-screen; a test that auto-scrolls can falsely report a product regression.

**How to apply:** Preserve the current scroll position when testing overlays that hide or reveal fixed actions, and assert the actual visible sidebar control for closing the overlay.