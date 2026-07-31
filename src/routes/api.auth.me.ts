import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/auth/me")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const cookieHeader = request.headers.get("cookie") || "";
        const sessionMatch = cookieHeader.match(/vars_session=([^;]+)/);

        if (!sessionMatch) {
          return new Response(JSON.stringify({ authenticated: false }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        }

        const sessionId = sessionMatch[1];

        return new Response(
          JSON.stringify({
            authenticated: true,
            sessionId,
            user: {
              id: `usr_${sessionId}`,
              name: "B2B Partner",
              email: "partner@varsco.com",
              company: "Aquaculture Partner",
              phone: "+90 232 290 57 56",
              country: "Turkey",
            },
          }),
          { status: 200, headers: { "Content-Type": "application/json" } },
        );
      },
    },
  },
});
