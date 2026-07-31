import { createFileRoute } from "@tanstack/react-router";

// Odoo path prefixes this proxy is allowed to forward to — never turn this
// into an open proxy for arbitrary Odoo routes (admin/backend paths, etc).
const ALLOWED_PREFIXES = ["/web/image/", "/web/content/"];

export const Route = createFileRoute("/api/assets/odoo")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const odooPath = url.searchParams.get("path");

        if (!odooPath || !odooPath.startsWith("/") || odooPath.includes("://")) {
          return new Response(JSON.stringify({ error: "invalid_path" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
          });
        }
        if (!ALLOWED_PREFIXES.some((prefix) => odooPath.startsWith(prefix))) {
          return new Response(JSON.stringify({ error: "path_not_allowed" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
          });
        }

        const baseUrl = process.env.VITE_ODOO_BASE_URL || "http://localhost:8069";

        let odooResponse: Response;
        try {
          odooResponse = await fetch(`${baseUrl}${odooPath}`);
        } catch (error) {
          console.error("[BFF Proxy Assets] Odoo unreachable:", error);
          return new Response(JSON.stringify({ error: "asset_service_unavailable" }), {
            status: 503,
            headers: { "Content-Type": "application/json" },
          });
        }

        if (!odooResponse.ok) {
          return new Response(JSON.stringify({ error: "asset_not_found" }), {
            status: odooResponse.status === 404 ? 404 : 502,
            headers: { "Content-Type": "application/json" },
          });
        }

        const contentType = odooResponse.headers.get("Content-Type") || "application/octet-stream";
        // Odoo's own image/content routes already carry a content-hash
        // ("?unique=...") in the URL, so this response is safe to cache
        // aggressively — a changed asset gets a new URL, not a new response
        // for the same one.
        return new Response(odooResponse.body, {
          status: 200,
          headers: {
            "Content-Type": contentType,
            "Cache-Control": "public, max-age=31536000, immutable",
          },
        });
      },
    },
  },
});
