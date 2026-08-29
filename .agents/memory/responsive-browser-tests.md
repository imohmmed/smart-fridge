---
name: Responsive browser test runtime
description: System requirements for running Playwright Chromium checks in this workspace.
---

Playwright Chromium checks require the Nix graphics and browser runtime libraries to be present in the workspace environment; the test package alone is not sufficient.

**Why:** The minimal container image may omit shared libraries such as GLib and GBM, causing the browser to exit before any test can run.

**How to apply:** If responsive browser checks fail during browser launch with a missing `.so` file, install the matching Nix runtime dependency before changing the test or application code.