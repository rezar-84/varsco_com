import { ContentApiClient } from "@/lib/api/client";

/** Shared by every session-authenticated BFF route (wishlist, reviews, ...). */
export function sessionIdFrom(request: Request): string | null {
  const cookieHeader = request.headers.get("cookie") || "";
  const match = cookieHeader.match(/vars_session=([^;]+)/);
  return match ? match[1] : null;
}

export function sessionApiClient(sessionId: string) {
  const baseUrl = process.env.VITE_ODOO_BASE_URL || "http://localhost:8069";
  const writeToken = process.env.ODOO_WRITE_TOKEN;
  return new ContentApiClient({ baseUrl, writeToken, sessionId });
}
