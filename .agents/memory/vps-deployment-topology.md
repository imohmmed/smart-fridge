---
name: VPS deployment topology
description: Durable constraints for deploying Smart Fridge to the existing VPS.
---

The VPS is a shared host with existing Nginx sites and services. Smart Fridge should run its API as a private systemd service behind Nginx, using a verified free internal port rather than assuming common ports are available.

**Why:** Common application ports were already occupied, and the public Nginx listener was serving other domains. Replacing the existing default routing without preserving named server blocks could disrupt unrelated sites.

**How to apply:** Before future deployments, inspect listening ports and Nginx default/server-name routing. Keep the API bound to loopback, proxy it through the Smart Fridge Nginx site, and preserve existing named-domain configurations. Never store VPS credentials in the repository.