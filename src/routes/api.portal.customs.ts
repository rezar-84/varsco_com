import { createFileRoute } from "@tanstack/react-router";
import { ContentApiClient } from "@/lib/api/client";
import { MOCK_DOCUMENTS } from "@/lib/mock/account";
import type { CustomsDocument } from "@/lib/types";

export const Route = createFileRoute("/api/portal/customs")({
  server: {
    handlers: {
      GET: async ({ request }) => {
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

        const apiClient = new ContentApiClient({ baseUrl, writeToken, sessionId });

        try {
          const response = await apiClient.getPortalCustomsFiles();
          
          const mappedDocs: CustomsDocument[] = [];
          response.data.forEach((file) => {
            file.documents.forEach((doc, idx) => {
              let type: "Invoice" | "Certificate" | "Customs" = "Customs";
              if (doc.type === "Invoice") type = "Invoice";
              else if (doc.type === "Certificate") type = "Certificate";

              mappedDocs.push({
                id: `${file.file_number}-${idx}`,
                name: `${doc.name} — ${file.file_number}`,
                type,
                date: file.arrival_date || new Date().toISOString().split("T")[0],
                url: doc.download_url || "#",
              });
            });
          });

          return new Response(JSON.stringify({ data: mappedDocs }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        } catch (error) {
          console.warn("[BFF Proxy Customs] Odoo API error. Falling back to mock data:", error);
          return new Response(JSON.stringify({ data: MOCK_DOCUMENTS }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        }
      },
    },
  },
});
