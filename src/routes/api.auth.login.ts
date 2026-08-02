import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { ContentApiClient } from "@/lib/api/client";
import { ApiUnauthorizedError } from "@/lib/api/types";

const loginSchema = z.object({
  email: z.string().trim().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export const Route = createFileRoute("/api/auth/login")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = await request.json();
          const validated = loginSchema.safeParse(body);

          if (!validated.success) {
            return new Response(
              JSON.stringify({
                error: "validation_failed",
                message: validated.error.issues[0].message,
              }),
              { status: 400, headers: { "Content-Type": "application/json" } },
            );
          }

          const { email, password } = validated.data;
          const baseUrl = process.env.VITE_ODOO_BASE_URL || "http://localhost:8069";
          const writeToken = process.env.ODOO_WRITE_TOKEN;

          const apiClient = new ContentApiClient({ baseUrl, writeToken });

          let odooAuth;
          try {
            // Odoo is the sole source of truth for credentials — no local fallback session.
            odooAuth = await apiClient.authenticateUser({ login: email, password });
          } catch (authError) {
            if (authError instanceof ApiUnauthorizedError) {
              return new Response(
                JSON.stringify({
                  error: "invalid_credentials",
                  message: "Invalid email or password.",
                }),
                { status: 401, headers: { "Content-Type": "application/json" } },
              );
            }
            console.error("[BFF Proxy Auth] Odoo auth backend unreachable:", authError);
            return new Response(
              JSON.stringify({
                error: "auth_service_unavailable",
                message:
                  "Authentication service is temporarily unavailable. Please try again shortly.",
              }),
              { status: 503, headers: { "Content-Type": "application/json" } },
            );
          }

          if (!odooAuth.session_id) {
            return new Response(
              JSON.stringify({
                error: "invalid_credentials",
                message: "Invalid email or password.",
              }),
              { status: 401, headers: { "Content-Type": "application/json" } },
            );
          }

          const sessionId = odooAuth.session_id;
          const user = {
            id: String(odooAuth.user.id),
            name: odooAuth.user.name || email,
            email: odooAuth.user.email || email,
            company: odooAuth.user.company || "",
            phone: odooAuth.user.phone || "",
            country: odooAuth.user.country || "",
          };

          // Build HTTP-Only cookie header. Max-Age matches Odoo's own default
          // server-side session lifetime (7 days) — a longer browser cookie
          // would outlive the Odoo session, making the browser look "logged
          // in" while every request 401s server-side.
          const cookieValue = `vars_session=${sessionId}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=604800`;

          return new Response(
            JSON.stringify({
              status: "success",
              sessionId,
              user,
            }),
            {
              status: 200,
              headers: {
                "Content-Type": "application/json",
                "Set-Cookie": cookieValue,
              },
            },
          );
        } catch (error) {
          console.error("Login Error:", error);
          return new Response(
            JSON.stringify({
              error: "server_error",
              message: "Authentication failed. Please check credentials.",
            }),
            { status: 500, headers: { "Content-Type": "application/json" } },
          );
        }
      },
    },
  },
});
