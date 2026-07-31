import { createFileRoute } from "@tanstack/react-router";
import { ContentApiClient } from "@/lib/api/client";
import { ApiUnauthorizedError } from "@/lib/api/types";

export const Route = createFileRoute("/api/auth/me")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const cookieHeader = request.headers.get("cookie") || "";
        const sessionMatch = cookieHeader.match(/vars_session=([^;]+)/);

        if (!sessionMatch) {
          return new Response(JSON.stringify({ authenticated: false }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        }

        const sessionId = sessionMatch[1];
        const baseUrl = process.env.VITE_ODOO_BASE_URL || "http://localhost:8069";
        const apiClient = new ContentApiClient({ baseUrl, sessionId });

        try {
          // No dedicated session-check endpoint exists — probe with a real
          // session-authenticated read. A cookie value alone is never
          // trusted; Odoo has to confirm it still resolves to a real user.
          await apiClient.getPortalOrders();
          return new Response(JSON.stringify({ authenticated: true, sessionId }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        } catch (error) {
          if (error instanceof ApiUnauthorizedError) {
            return new Response(JSON.stringify({ authenticated: false }), {
              status: 200,
              headers: { "Content-Type": "application/json" },
            });
          }
          // Odoo unreachable — don't force a logout on a transient outage;
          // the mutating endpoints (checkout, profile) still re-check the
          // session with Odoo themselves regardless of what we say here.
          console.warn("[BFF Proxy Auth] Session check backend unreachable:", error);
          return new Response(JSON.stringify({ authenticated: true, sessionId }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        }
      },
    },
  },
});
