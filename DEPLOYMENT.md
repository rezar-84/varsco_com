# Deployment Guide — varsco_com

This repo is the self-hosted, Lovable-independent deployment path for the VARS
Aquaculture site. It started as a snapshot of `aqua-bloom-portal` (the Lovable-connected
repo) at the point deployment work began — `aqua-bloom-portal` keeps evolving through
Lovable independently; this repo is where the Dokploy deployment actually lives and
where future work continues if Lovable is dropped entirely.

Read `~/Projects/Deploy/dokploy-agent-deployment/AGENTS.md` in full before touching
production — it's the binding contract (human approval required for sudo/firewall/DNS/
secrets/migrations, etc.).

## Decided: Dokploy/Docker (Node), not Cloudflare Workers

TanStack Start on Vite defaults its Nitro preset to `cloudflare-module`
(`@lovable.dev/vite-tanstack-config`'s default) — the framework assumes Cloudflare
Workers unless told otherwise, and `src/server.ts` reads
`request.headers.get("cf-connecting-ip")` for rate-limiting/client-IP detection, a
Cloudflare-specific header. This repo overrides that in `vite.config.ts`:

```ts
nitro: { preset: "node-server" },
```

Because of the `cf-connecting-ip` dependency, **the Cloudflare DNS record for this
domain must stay proxied (orange cloud) in production**, or rate limiting silently
degrades to treating every client as `127.0.0.1`. `docs/05-cloudflare-dns-and-tls.md`'s
safe sequence still applies — DNS-only *during* first cert issuance, proxied *after*.

Cloudflare Workers was evaluated and shelved, not ruled out — `wrangler.jsonc` is kept
in the repo (pins `nodejs_compat` + `nodejs_compat_populate_process_env`, both required
for `process.env.*` to actually populate from Worker vars/secrets — `nodejs_compat`
alone does not do this and every server route here reads `process.env` directly).
Switching back later is a one-line `vite.config.ts` change.

The `node-server` build and the Docker image have both been verified locally:
`npm run build` produces `.output/server/index.mjs` which boots and serves `/` and
`/api/health` with 200s; `docker compose build && up -d` produces a container that
reports healthy, runs as non-root (`appuser`), and publishes no host ports (only
internal `3000/tcp`, per Dokploy's expectations).

## Status

- **No local database** — the backend is entirely an external Odoo instance, confirmed
  reachable over public HTTPS (required either way, but especially for Workers — moot
  for Dokploy since the VPS reaches it over the regular internet too).
- Runtime variables (see `.env.example`, names only — set real values as Dokploy runtime
  variables, never commit them):
  - `VITE_ODOO_BASE_URL` — production Odoo base URL. Public/build-time, also read
    server-side at runtime.
  - `ODOO_WRITE_TOKEN` — private, server-only, matches `varsco_content_api.write_token`
    on the Odoo side. **Treat the current value as already exposed** — it was pasted in
    a chat session during setup; rotate it with whoever owns the Odoo
    `vars_n11_connector`/`midvex_customs_op` module once the new value is confirmed
    working end-to-end.
  - `VITE_SITE_URL` — production site origin (`https://varsco.com`), used by
    `sitemap.xml.ts`.
  - `ALLOWED_ORIGINS` — CORS allowlist for server API routes.
  - `SESSION_SECRET` — listed in `.env.example` but currently unused anywhere in `src/`;
    `api.auth.login.ts` passes Odoo's `session_id` straight through in the cookie with no
    local signing. Skip setting this until something actually reads it.
- Package manager: **npm** (Dockerfile uses `package-lock.json`; `bun.lock`/`bunfig.toml`
  are dockerignored but left in the repo).
- Public production domain: **varsco.com** (`deployment/project.yaml`, proxied through
  Cloudflare).
- Health endpoint: `src/routes/api.health.ts`, `GET /api/health` → `{status:"ok"}`.
- Auth/session routes (`api.auth.login/register/me/logout`) are live functionality
  against real Odoo — `api.auth.login.ts` was hardened to remove a local fallback
  session that used to be minted whenever Odoo was unreachable (a silent auth bypass);
  it now returns 401 on bad credentials and 503 if Odoo can't be reached.
- Docker assets: `Dockerfile` (multi-stage, non-root `appuser`, npm), `.dockerignore`,
  `compose.yaml` (single `app` service, `dokploy-network` only, healthcheck on
  `/api/health`, no host ports published), `deployment/project.yaml` (Gate 1 done).

## Remaining before production

1. Confirm whether `ODOO_WRITE_TOKEN` needs rotating given the exposure above — **human
   decision, do not rotate without the Odoo owner**.
2. Gate 4 (Dokploy dashboard, human-driven): create the project, connect
   `git@github.com:rezar-84/varsco_com.git` on `main`, set
   `APP_IMAGE_NAME`/`VITE_ODOO_BASE_URL`/`ODOO_WRITE_TOKEN`/`VITE_SITE_URL`/
   `ALLOWED_ORIGINS` as runtime variables, confirm the rendered Compose config has no
   unexpected public ports, set the 512M/1 CPU resource limits from
   `deployment/project.yaml`, deploy a reviewed commit SHA.
3. DNS/TLS per `docs/05`, human-approved — **leave the Cloudflare proxy enabled (orange
   cloud) in production**, per the `cf-connecting-ip` note above.
4. Post-deploy smoke test: homepage, a locale switch, register/login/logout, and one
   Odoo-backed write (e.g. submit a quote request) actually round-tripping to the real
   Odoo instance.
