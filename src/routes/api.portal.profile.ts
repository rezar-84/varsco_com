import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { ContentApiClient } from "@/lib/api/client";
import { ApiUnauthorizedError } from "@/lib/api/types";

const profileSchema = z.object({
  name: z.string().trim().optional(),
  company: z.string().trim().optional(),
  phone: z.string().trim().optional(),
  street: z.string().trim().optional(),
  city: z.string().trim().optional(),
  country: z.string().trim().optional(),
  email: z.string().trim().email().optional(),
});

export const Route = createFileRoute("/api/portal/profile")({
  server: {
    handlers: {
      PUT: async ({ request }) => {
        const cookieHeader = request.headers.get("cookie") || "";
        const sessionMatch = cookieHeader.match(/vars_session=([^;]+)/);

        if (!sessionMatch) {
          return new Response(
            JSON.stringify({ error: "unauthorized", message: "Session expired or missing" }),
            { status: 401, headers: { "Content-Type": "application/json" } },
          );
        }

        const sessionId = sessionMatch[1];
        const baseUrl = process.env.VITE_ODOO_BASE_URL || "http://localhost:8069";
        const writeToken = process.env.ODOO_WRITE_TOKEN;

        try {
          const body = await request.json();
          const validated = profileSchema.safeParse(body);

          if (!validated.success) {
            return new Response(
              JSON.stringify({
                error: "validation_failed",
                message: validated.error.issues[0].message,
              }),
              { status: 400, headers: { "Content-Type": "application/json" } },
            );
          }

          const apiClient = new ContentApiClient({ baseUrl, writeToken, sessionId });

          try {
            await apiClient.updatePortalProfile(validated.data);
            return new Response(JSON.stringify({ status: "success" }), {
              status: 200,
              headers: { "Content-Type": "application/json" },
            });
          } catch (odooError) {
            if (odooError instanceof ApiUnauthorizedError) {
              return new Response(
                JSON.stringify({ error: "unauthorized", message: "Session expired or missing" }),
                { status: 401, headers: { "Content-Type": "application/json" } },
              );
            }
            console.error("[BFF Proxy Profile] Odoo update error:", odooError);
            return new Response(
              JSON.stringify({
                error: "profile_update_failed",
                message: "Unable to update your profile right now. Please try again shortly.",
              }),
              { status: 503, headers: { "Content-Type": "application/json" } },
            );
          }
        } catch (error) {
          console.error("Profile update error:", error);
          return new Response(
            JSON.stringify({ error: "server_error", message: "Failed to update profile" }),
            { status: 500, headers: { "Content-Type": "application/json" } },
          );
        }
      },
    },
  },
});
