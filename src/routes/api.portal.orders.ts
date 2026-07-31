import { createFileRoute } from "@tanstack/react-router";
import { ContentApiClient } from "@/lib/api/client";
import { MOCK_ORDERS } from "@/lib/mock/account";
import type { Order, OrderStatus } from "@/lib/types";

export const Route = createFileRoute("/api/portal/orders")({
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
          // Attempt to retrieve orders from Odoo backend
          const response = await apiClient.getPortalOrders();
          
          const mappedOrders: Order[] = response.data.map((o) => {
            let status: OrderStatus = "Pending Review";
            if (o.state === "sale") status = "Approved";
            else if (o.state === "done") status = "Shipped";
            else if (o.state === "cancel") status = "Cancelled";

            return {
              id: o.name || `SO-${o.id}`,
              date: o.date ? o.date.split("T")[0] : new Date().toISOString().split("T")[0],
              products: [o.tracking_number ? `Shipment: ${o.tracking_number}` : "Aquaculture Feed & genetics"],
              status,
              total: `$${o.amount_total.toLocaleString()}`,
            };
          });

          return new Response(JSON.stringify({ data: mappedOrders }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        } catch (error) {
          console.warn("[BFF Proxy Orders] Odoo API error. Falling back to mock data:", error);
          return new Response(JSON.stringify({ data: MOCK_ORDERS }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        }
      },
    },
  },
});
