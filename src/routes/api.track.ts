import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { ContentApiClient } from "@/lib/api/client";

/**
 * Pageview beacon.
 *
 * The browser posts here, never to Odoo. Two reasons: the Odoo write token
 * stays server-side, and the origin server is where a request can be dropped
 * before it reaches the CRM database.
 *
 * Consent is enforced on the client — the beacon is not called at all without
 * it (see src/lib/tracking.ts). This route does not attempt to re-check
 * consent, because it cannot: it has no reliable way to distinguish a genuine
 * consented visitor from a forged claim. The client is the only place that
 * knows, so it is the only place that decides.
 */
const trackSchema = z.object({
  // 32 lowercase hex: Odoo overloads website.visitor.access_token, and treats
  // anything outside that shape as a res.partner id. Enforced here too so a
  // malformed token fails fast at our own edge rather than 400ing from Odoo.
  visitorToken: z.string().regex(/^[0-9a-f]{32}$/, "Invalid visitor token"),
  langCode: z.string().trim().max(12).optional(),
  events: z
    .array(
      z.object({
        url: z.string().trim().min(1).max(500),
        at: z.string().trim().max(40).optional(),
      }),
    )
    .min(1)
    .max(50),
});

/**
 * Visitor country, taken from Cloudflare's edge rather than the browser.
 *
 * Read here and never accepted from the client: a self-reported country is
 * unverifiable, and this value ends up in a CRM report people make decisions
 * from. Same trust model as the `cf-connecting-ip` read in src/server.ts —
 * both depend on the proxy staying enabled (orange cloud), which DEPLOYMENT.md
 * already requires for rate limiting to work at all.
 *
 * Cloudflare sends `XX` when it cannot resolve a country and `T1` for Tor exit
 * nodes. Both are placeholders, not ISO codes, so they are dropped rather than
 * written into the report as if they were real countries.
 */
function resolveCountry(request: Request): string | undefined {
  const raw = request.headers.get("cf-ipcountry")?.trim().toUpperCase();
  if (!raw || raw === "XX" || raw === "T1" || !/^[A-Z]{2}$/.test(raw)) return undefined;
  return raw;
}

export const Route = createFileRoute("/api/track")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = await request.json();
          const validated = trackSchema.safeParse(body);
          if (!validated.success) {
            return new Response(JSON.stringify({ error: "validation_failed" }), {
              status: 400,
              headers: { "Content-Type": "application/json" },
            });
          }

          const apiClient = new ContentApiClient({
            baseUrl: process.env.VITE_ODOO_BASE_URL || "http://localhost:8069",
            writeToken: process.env.ODOO_WRITE_TOKEN,
          });

          await apiClient.trackVisit({
            visitor_token: validated.data.visitorToken,
            lang_code: validated.data.langCode,
            country_code: resolveCountry(request),
            events: validated.data.events,
          });

          // 204: the client has nothing to do with the result, and analytics
          // must never block or slow the page it is measuring.
          return new Response(null, { status: 204 });
        } catch (error) {
          // Swallowed deliberately. A tracking outage is not a user-facing
          // failure — the visitor is trying to read a page, not send us data.
          console.error("Error forwarding tracking events:", error);
          return new Response(null, { status: 204 });
        }
      },
    },
  },
});
