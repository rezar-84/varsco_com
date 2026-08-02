import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { ContentApiClient } from "@/lib/api/client";
import { ApiError } from "@/lib/api/types";

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

          const { name, company, country, email, phone, password } = validated.data;
          const baseUrl = process.env.VITE_ODOO_BASE_URL || "http://localhost:8069";
          const writeToken = process.env.ODOO_WRITE_TOKEN;

          const apiClient = new ContentApiClient({ baseUrl, writeToken });

          // The real account is the source of truth for whether registration
          // succeeded — no session is ever set unless Odoo actually created
          // and authenticated one.
          let odooAuth;
          try {
            odooAuth = await apiClient.registerUser({
              name,
              email,
              phone,
              company,
              country,
              password,
            });
          } catch (registerError) {
            if (registerError instanceof ApiError && registerError.status === 409) {
              return new Response(
                JSON.stringify({
                  error: "email_already_registered",
                  message: "An account with this email already exists. Please sign in instead.",
                }),
                { status: 409, headers: { "Content-Type": "application/json" } },
              );
            }
            if (registerError instanceof ApiError && registerError.status === 400) {
              return new Response(
                JSON.stringify({
                  error: "validation_failed",
                  message: "Please check your registration details and try again.",
                }),
                { status: 400, headers: { "Content-Type": "application/json" } },
              );
            }
            console.error("[BFF Proxy Auth] Odoo registration backend unreachable:", registerError);
            return new Response(
              JSON.stringify({
                error: "registration_service_unavailable",
                message: "Registration is temporarily unavailable. Please try again shortly.",
              }),
              { status: 503, headers: { "Content-Type": "application/json" } },
            );
          }

          // Best-effort CRM lead so sales sees the new signup — never blocks
          // or fakes success/failure of the actual account creation above.
          try {
            await apiClient.submitLead({
              name,
              email,
              company,
              phone,
              message: `New self-service B2B portal registration — Country: ${country}`,
              source: "Aqua Bloom Portal B2B Registration",
            });
          } catch (leadError) {
            console.warn("[BFF Proxy Auth] Registration CRM lead failed (non-fatal):", leadError);
          }

          const sessionId = odooAuth.session_id;
          const user = {
            id: String(odooAuth.user.id),
            name: odooAuth.user.name || name,
            email: odooAuth.user.email || email,
            company: odooAuth.user.company || company,
            phone: odooAuth.user.phone || phone,
            country: odooAuth.user.country || country,
          };

          // Max-Age matches Odoo's own default server-side session lifetime
          // (7 days) — see api.auth.login.ts for the same fix and rationale.
          const cookieValue = `vars_session=${sessionId}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=604800`;

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
