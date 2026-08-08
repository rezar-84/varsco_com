import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { ContentApiClient } from "@/lib/api/client";

/**
 * Input schema.
 *
 * Previously this listed only name/email/company/phone/message/source/items,
 * and Zod strips unknown keys — so every other field the forms collected and
 * validated was silently thrown away here, before Odoo ever saw it:
 * `serviceType` from Services & Solutions, `inquiryType` from Contact,
 * `country`, `productSlug` and `customFields` from the quote form. Some of it
 * survived only because a caller had also stuffed it into the message string.
 */
const quoteRequestSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  company: z.string().min(2, "Company must be at least 2 characters"),
  phone: z.string().optional().default(""),
  // Optional on purpose. A buyer who picked a product, chose their formats and
  // gave full contact details has already said what they want; demanding prose
  // on top of that rejected the most common enquiry of all — someone who fills
  // the form in and leaves the free-text box alone. When it is blank the lead
  // gets a subject composed from what they did tell us, below.
  message: z.string().trim().max(1000).optional().default(""),
  country: z.string().trim().max(80).optional(),

  // What the buyer is asking about. Kept as separate fields rather than
  // pre-formatted prose so Odoo can build a real lead subject from them.
  topic: z.string().trim().max(120).optional(),
  productSlug: z.string().trim().max(120).optional(),
  productTitle: z.string().trim().max(200).optional(),
  customFields: z.record(z.string(), z.string()).optional(),

  // Where it came from. `source` is a closed set on the client
  // (SUBMISSION_SOURCES); bounded here rather than enumerated so adding a form
  // does not require a coordinated deploy of both sides.
  source: z.string().trim().min(1).max(80).optional(),
  pagePath: z.string().trim().max(300).optional(),
  pageSection: z.string().trim().max(120).optional(),
  locale: z.string().trim().max(12).optional(),
  referrer: z.string().trim().max(500).optional(),
  utmSource: z.string().trim().max(120).optional(),
  utmMedium: z.string().trim().max(120).optional(),
  utmCampaign: z.string().trim().max(120).optional(),
  portalUserId: z.string().trim().max(64).optional(),
  // Shape-checked, not merely length-bounded: Odoo overloads
  // website.visitor.access_token and parses anything that is not 32 hex
  // characters as a res.partner id, which raises inside a computed field.
  // A malformed token is dropped here rather than 500ing the lead.
  visitorToken: z
    .string()
    .regex(/^[0-9a-f]{32}$/)
    .optional()
    .catch(undefined),

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

          const d = validated.data;
          const { name, email, company, phone, source, items } = d;

          // An empty box is not an empty enquiry. Rather than send Odoo a blank
          // description, describe the request from the fields the buyer did
          // fill in, so the CRM lead still reads as something actionable.
          const message =
            d.message ||
            (d.productTitle
              ? `Quote request: ${d.productTitle}`
              : d.topic
                ? `Enquiry: ${d.topic}`
                : `General enquiry — ${company}`);

          // 3. Format cart items into a summary text block for CRM Lead description
          let cartSummary = "";
          if (items && items.length > 0) {
            cartSummary = items
              .map((i) => `- ${i.title} (${i.productSlug}) x ${i.quantity}`)
              .join("\n");
          }

          // The browser can claim any referrer and page path it likes. Odoo
          // renders these into the lead's Notes tab, so they are bounded here
          // and escaped there — never trusted as-is.
          const referrerHost = (() => {
            if (!d.referrer) return undefined;
            try {
              return new URL(d.referrer).host || undefined;
            } catch {
              return undefined;
            }
          })();

          // 4. Initialize Odoo API client
          const baseUrl = process.env.VITE_ODOO_BASE_URL || "http://localhost:8069";
          const writeToken = process.env.ODOO_WRITE_TOKEN;

          const apiClient = new ContentApiClient({
            baseUrl,
            writeToken,
          });

          // 5. Send lead payload to Odoo.
          //
          // `message` is no longer pre-loaded with the cart block: cart_summary
          // is its own field and Odoo renders it as a proper list. Doubling it
          // up here meant every cart lead showed the same items twice.
          const odooResponse = await apiClient.submitLead({
            name,
            email,
            company,
            phone,
            message,
            source: source || "unknown",
            cart_summary: cartSummary,
            country: d.country,
            topic: d.topic,
            product_slug: d.productSlug,
            product_title: d.productTitle,
            custom_fields: d.customFields,
            page_path: d.pagePath,
            page_section: d.pageSection,
            locale: d.locale,
            referrer_host: referrerHost,
            utm_source: d.utmSource,
            utm_medium: d.utmMedium,
            utm_campaign: d.utmCampaign,
            portal_user_id: d.portalUserId,
            visitor_token: d.visitorToken,
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
