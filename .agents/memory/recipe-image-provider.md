---
name: Recipe image provider
description: Provider fallback decision for recipe and meal imagery.
---

The UI currently uses translated `source.unsplash.com` queries as a keyless temporary image provider. Spoonacular remains the intended provider, but the saved credential returned HTTP 401 during verification.

**Why:** This keeps recipe and meal cards useful without exposing or repeatedly retrying an invalid API credential.

**How to apply:** When Spoonacular is repaired, restore the server-proxied lookup and invalidate the temporary image cache so old Unsplash URLs do not persist.