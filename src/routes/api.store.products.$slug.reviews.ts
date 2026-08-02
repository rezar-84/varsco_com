import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { ContentApiClient } from "@/lib/api/client";
import { ApiError, ApiNotFoundError, ApiUnauthorizedError } from "@/lib/api/types";
import { getProductReviews } from "@/lib/api/store-data";
import type { LocaleCode } from "@/lib/api/types";

const reviewSchema = z.object({
  rating: z.number().min(1).max(5),
  feedback: z.string().trim().max(2000).optional(),
});

export const Route = createFileRoute("/api/store/products/$slug/reviews")({
  server: {
    handlers: {
      GET: async ({ request, params }) => {
        const url = new URL(request.url);
        const locale = (url.searchParams.get("locale") || "en") as LocaleCode;
        const result = await getProductReviews(locale, params.slug);

        if (!result) {
          return new Response(
            JSON.stringify({
              error: "reviews_service_unavailable",
              message: "Unable to load reviews right now. Please try again shortly.",
            }),
            { status: 503, headers: { "Content-Type": "application/json" } },
          );
        }
        return new Response(JSON.stringify(result), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      },

      POST: async ({ request, params }) => {
        const cookieHeader = request.headers.get("cookie") || "";
        const sessionMatch = cookieHeader.match(/vars_session=([^;]+)/);

        if (!sessionMatch) {
          return new Response(
            JSON.stringify({ error: "unauthorized", message: "Please log in to write a review" }),
            { status: 401, headers: { "Content-Type": "application/json" } },
          );
        }

        const body = await request.json();
        const validated = reviewSchema.safeParse(body);
        if (!validated.success) {
          return new Response(
            JSON.stringify({
              error: "validation_failed",
              message: validated.error.issues[0]?.message || "Invalid review",
            }),
            { status: 400, headers: { "Content-Type": "application/json" } },
          );
        }

        const url = new URL(request.url);
        const locale = (url.searchParams.get("locale") || "en") as LocaleCode;
        const sessionId = sessionMatch[1];
        const baseUrl = process.env.VITE_ODOO_BASE_URL || "http://localhost:8069";
        const writeToken = process.env.ODOO_WRITE_TOKEN;
        const apiClient = new ContentApiClient({ baseUrl, writeToken, sessionId });

        try {
          const result = await apiClient.submitProductReview(locale, params.slug, validated.data);
          return new Response(JSON.stringify(result), {
            status: 201,
            headers: { "Content-Type": "application/json" },
          });
        } catch (error) {
          if (error instanceof ApiUnauthorizedError) {
            return new Response(
              JSON.stringify({ error: "unauthorized", message: "Session expired or missing" }),
              { status: 401, headers: { "Content-Type": "application/json" } },
            );
          }
          if (error instanceof ApiError && error.status === 403) {
            return new Response(
              JSON.stringify({
                error: "purchase_required",
                message: "Only customers who purchased this product can write a review.",
              }),
              { status: 403, headers: { "Content-Type": "application/json" } },
            );
          }
          if (error instanceof ApiError && error.status === 409) {
            return new Response(
              JSON.stringify({
                error: "already_reviewed",
                message: "You've already reviewed this product.",
              }),
              { status: 409, headers: { "Content-Type": "application/json" } },
            );
          }
          if (error instanceof ApiNotFoundError) {
            return new Response(
              JSON.stringify({ error: "not_found", message: "This product could not be found." }),
              { status: 404, headers: { "Content-Type": "application/json" } },
            );
          }
          console.error("[BFF Proxy Reviews] Odoo API error:", error);
          return new Response(
            JSON.stringify({
              error: "reviews_service_unavailable",
              message: "Unable to submit your review right now. Please try again shortly.",
            }),
            { status: 503, headers: { "Content-Type": "application/json" } },
          );
        }
      },
    },
  },
});
