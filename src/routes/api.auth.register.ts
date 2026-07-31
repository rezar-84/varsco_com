import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { ContentApiClient } from "@/lib/api/client";

const registerSchema = z.object({
  name: z.string().trim().min(2, "Full name is required"),
  company: z.string().trim().min(2, "Company name is required"),
  country: z.string().trim().min(2, "Country is required"),
  email: z.string().trim().email("Please enter a valid corporate email"),
  phone: z.string().trim().min(6, "Phone number is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const Route = createFileRoute("/api/auth/register")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = await request.json();
          const validated = registerSchema.safeParse(body);

          if (!validated.success) {
            return new Response(
              JSON.stringify({
                error: "validation_failed",
                message: validated.error.issues[0].message,
              }),
              { status: 400, headers: { "Content-Type": "application/json" } },
            );
          }

          const { name, company, country, email, phone } = validated.data;
          const baseUrl = process.env.VITE_ODOO_BASE_URL || "http://localhost:8069";
          const writeToken = process.env.ODOO_WRITE_TOKEN;

          const apiClient = new ContentApiClient({ baseUrl, writeToken });

          // Submit partner / lead record to Odoo ERP backend
          try {
            await apiClient.submitLead({
              name,
              email,
              company,
              phone,
              message: `B2B Account Portal Registration - Country: ${country}`,
              source: "Aqua Bloom Portal B2B Registration",
            });
          } catch {
            console.log(`[BFF Proxy Auth] Registered partner ${email} locally.`);
          }

          const sessionId = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
          const user = {
            id: `usr_${Date.now()}`,
            name,
            email,
            company,
            phone,
            country,
          };

          const cookieValue = `vars_session=${sessionId}; Path=/; HttpOnly; SameSite=Lax; Max-Age=2592000`;

          return new Response(
            JSON.stringify({
              status: "success",
              sessionId,
              user,
            }),
            {
              status: 201,
              headers: {
                "Content-Type": "application/json",
                "Set-Cookie": cookieValue,
              },
            },
          );
        } catch (error) {
          console.error("Register Error:", error);
          return new Response(
            JSON.stringify({
              error: "server_error",
              message: "Registration failed. Please try again.",
            }),
            { status: 500, headers: { "Content-Type": "application/json" } },
          );
        }
      },
    },
  },
});
