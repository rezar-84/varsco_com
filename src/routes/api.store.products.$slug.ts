import { createFileRoute } from "@tanstack/react-router";
import { getStoreProduct } from "@/lib/api/store-data";
import type { LocaleCode } from "@/lib/api/types";

export const Route = createFileRoute("/api/store/products/$slug")({
  server: {
    handlers: {
      GET: async ({ request, params }) => {
        const url = new URL(request.url);
        const locale = (url.searchParams.get("locale") || "en") as LocaleCode;
        const result = await getStoreProduct(locale, params.slug);

        if (result.status === "not_found") {
          return new Response(JSON.stringify({ error: "not_found" }), {
            status: 404,
            headers: { "Content-Type": "application/json" },
          });
        }
        if (result.status === "unavailable") {
          return new Response(
            JSON.stringify({
              error: "store_service_unavailable",
              message: "Unable to load this product right now. Please try again shortly.",
            }),
            { status: 503, headers: { "Content-Type": "application/json" } },
          );
        }
        return new Response(JSON.stringify({ data: result.data }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      },
    },
  },
});
