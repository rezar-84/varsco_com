import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { ContentApiClient } from "@/lib/api/client";
import { ApiError } from "@/lib/api/types";

/**
 * Newsletter signup.
 *
 * Split out from /api/quotes: a subscriber is not a sales lead. Signups used
 * to be posted to the quote endpoint, so each one became a crm.lead named
 * "Newsletter Subscriber" with company "N/A" sitting in the pipeline next to
 * real enquiries.
 */
const newsletterSchema = z.object({
  email: z.string().trim().email("Invalid email address"),
  name: z.string().trim().max(100).optional(),
  company: z.string().trim().max(120).optional(),
});

export const Route = createFileRoute("/api/newsletter")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = await request.json();
          const validated = newsletterSchema.safeParse(body);
          if (!validated.success) {
            return new Response(
              JSON.stringify({
                error: "validation_failed",
                details: validated.error.flatten().fieldErrors,
              }),
              { status: 400, headers: { "Content-Type": "application/json" } },
            );
          }

          const apiClient = new ContentApiClient({
            baseUrl: process.env.VITE_ODOO_BASE_URL || "http://localhost:8069",
            writeToken: process.env.ODOO_WRITE_TOKEN,
          });

          try {
            const result = await apiClient.subscribeNewsletter(validated.data);
            return new Response(
              JSON.stringify({
                status: "success",
                alreadySubscribed: result.already_subscribed,
              }),
              { status: 201, headers: { "Content-Type": "application/json" } },
            );
          } catch (error) {
            // 501 means the Odoo side is reachable but mass_mailing is not
            // installed there. This frontend auto-deploys while the addon is
            // deployed by hand, so that combination is not hypothetical — and
            // signups worked before this endpoint existed, via the CRM path.
            // Falling back keeps a live form working instead of turning a
            // deploy-order mismatch into a broken newsletter.
            if (!(error instanceof ApiError) || error.status !== 501) throw error;

            await apiClient.submitLead({
              name: validated.data.name || "Newsletter Subscriber",
              email: validated.data.email,
              company: validated.data.company || "N/A",
              message: "Requested to subscribe to the Aqua MAG Journal newsletter.",
              source: "newsletter",
              // Tagged so sales can filter these out of the pipeline for as
              // long as the fallback is in use.
              topic: "Newsletter subscription",
            });

            return new Response(
              JSON.stringify({ status: "success", alreadySubscribed: false, degraded: true }),
              { status: 201, headers: { "Content-Type": "application/json" } },
            );
          }
        } catch (error) {
          console.error("Error subscribing to newsletter:", error);
          return new Response(
            JSON.stringify({
              error: "server_error",
              message: error instanceof Error ? error.message : "Internal Server Error",
            }),
            { status: 500, headers: { "Content-Type": "application/json" } },
          );
        }
      },
    },
  },
});
