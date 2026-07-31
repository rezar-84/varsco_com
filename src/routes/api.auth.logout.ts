import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/auth/logout")({
  server: {
    handlers: {
      POST: async () => {
        const cookieHeader = "vars_session=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0";
        return new Response(JSON.stringify({ status: "success", message: "Logged out" }), {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            "Set-Cookie": cookieHeader,
          },
        });
      },
    },
  },
});
