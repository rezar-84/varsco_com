/**
 * Whitelists a post-login `redirect` search param to same-origin relative
 * paths only. Login/register bounce a user back to wherever they came from
 * (e.g. checkout) via this param; without validation it's an open redirect,
 * and an unresolvable value silently no-ops router.navigate, stranding the
 * user on the auth page.
 */
export function safeRedirectTarget(raw: unknown, fallback = "/account"): string {
  if (typeof raw !== "string" || raw.length === 0) return fallback;
  if (!raw.startsWith("/") || raw.startsWith("//")) return fallback;
  if (raw.includes("://")) return fallback;
  return raw;
}
