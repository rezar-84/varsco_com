import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { ContentApiClient } from "@/lib/api/client";

// Zod validation schema for input requests
const quoteRequestSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  company: z.string().min(2, "Company must be at least 2 characters"),
  phone: z.string().optional().default(""),
  message: z.string().min(5, "Message must be at least 5 characters"),
  source: z.string().trim().min(1).max(80).optional(),
  items: z
    .array(
      z.object({
        productSlug: z.string(),
        category: z.string(),
        title: z.string(),
        quantity: z.number().min(1),
      }),
    )
    .optional()
    .default([]),
});

export const Route = createFileRoute("/api/quotes")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          // 1. Check CORS policy / origin verification
          const origin = request.headers.get("origin") || request.headers.get("referer");
          // Add CORS checks if necessary: if (origin && !isAllowedOrigin(origin)) { return new Response(JSON.stringify({ error: "CORS blocked" }), { status: 403 }) }

          // 2. Parse payload
          const body = await request.json();
          const validated = quoteRequestSchema.safeParse(body);

          if (!validated.success) {
            return new Response(
              JSON.stringify({
                error: "validation_failed",
                details: validated.error.flatten().fieldErrors,
              }),
              {
                status: 400,
                headers: { "Content-Type": "application/json" },
              },
            );
          }

          const { name, email, company, phone, message, source, items } = validated.data;

          // 3. Format cart items into a summary text block for CRM Lead description
          let cartSummary = "";
          if (items && items.length > 0) {
            cartSummary = items
              .map((i) => `- ${i.title} (${i.productSlug}) x ${i.quantity}`)
              .join("\n");
          }

          // 4. Initialize Odoo API client
          const baseUrl = process.env.VITE_ODOO_BASE_URL || "http://localhost:8069";
          const writeToken = process.env.ODOO_WRITE_TOKEN;

          const apiClient = new ContentApiClient({
            baseUrl,
            writeToken,
          });

          // 5. Send lead payload to Odoo
          const odooResponse = await apiClient.submitLead({
            name,
            email,
            company,
            phone,
            message: `${message}\n\nRequested Quote Items:\n${cartSummary || "None"}`,
            source: source || "Aqua Bloom Portal B2B Quote Form",
            cart_summary: cartSummary,
          });

          return new Response(
            JSON.stringify({
              status: "success",
              lead_id: odooResponse.lead_id,
            }),
            {
              status: 201,
              headers: { "Content-Type": "application/json" },
            },
          );
        } catch (error) {
          console.error("Error creating quote request:", error);

          const errorMessage = error instanceof Error ? error.message : "Internal Server Error";
          return new Response(
            JSON.stringify({
              error: "server_error",
              message: errorMessage,
            }),
            {
              status: 500,
              headers: { "Content-Type": "application/json" },
            },
          );
        }
      },
    },
  },
});
