# Lowkey Funnel Specification

This project implements a private access funnel for lowkey.luxury with the following components:

- **Vault Banner** shown on first visit with live inventory counts and checkout links.
- **Cloudflare Worker** providing status, checkout, and webhook endpoints with Square integration.
- **Square checkout** for $1,000 Founder and $5,000 Inner Circle keys.
- **Inventory tracking** backed by Cloudflare KV with webhook-driven decrements.
- **Shared copy** to keep messaging consistent across the site and services.
- **Deployment** via GitHub Actions to Cloudflare Workers and Firebase Hosting.

See repository structure for details:

```
lowkey/
  apps/
    site/
      public/
        index.html
        lowkey-banner.js
      firebase.json
      .firebaserc
  services/
    worker/
      wrangler.toml
      src/
        worker.ts
        square.ts
        routes.ts
        types.ts
  packages/
    shared/
      src/
        copy.ts
        config.ts
  .github/
    workflows/
      deploy-worker.yml
      deploy-site.yml
  .env.example
  PROJECT_SPEC.md
```
