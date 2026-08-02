import { createFileRoute } from "@tanstack/react-router";
import { getStoreProducts } from "@/lib/api/store-data";
import type { LocaleCode } from "@/lib/api/types";

export const Route = createFileRoute("/api/store/products")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const locale = (url.searchParams.get("locale") || "en") as LocaleCode;
        const result = await getStoreProducts(locale);
        return new Response(JSON.stringify(result), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      },
    },
  },
});
