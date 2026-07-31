/**
 * API Middleware for CORS validation, Rate Limiting, and Security Headers on the Start server.
 */

// Simple in-memory rate limiting store
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 15; // Max 15 requests per minute

/**
 * Standard Security Headers helper to satisfy OWASP best practices.
 */
export function applySecurityHeaders(headers: Headers): Headers {
  headers.set("X-Content-Type-Options", "nosniff");
  headers.set("X-Frame-Options", "DENY");
  headers.set("X-XSS-Protection", "1; mode=block");
  headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  return headers;
}

/**
 * Validates whether the incoming request matches approved origins.
 */
export function validateCors(request: Request): Response | null {
  const origin = request.headers.get("origin");

  // Allow requests without Origin (like standard browser address bar GET requests)
  if (!origin) {
    return null;
  }

  try {
    const originHost = new URL(origin).host;
    const requestHost = new URL(request.url).host;

    // Allowed origins: self request host, configured ALLOWED_ORIGINS env, or local dev
    const allowedEnv = process.env.ALLOWED_ORIGINS || "";
    const allowedHosts = allowedEnv
      .split(",")
      .map((h) => h.trim())
      .filter(Boolean);

    const isAllowed =
      originHost === requestHost ||
      allowedHosts.includes(originHost) ||
      originHost.includes("localhost") ||
      originHost.includes("127.0.0.1");

    if (!isAllowed) {
      const resHeaders = applySecurityHeaders(new Headers({ "Content-Type": "application/json" }));
      return new Response(
        JSON.stringify({ error: "cors_blocked", message: "Origin not allowed" }),
        {
          status: 403,
          headers: resHeaders,
        },
      );
    }
  } catch {
    const resHeaders = applySecurityHeaders(new Headers({ "Content-Type": "application/json" }));
    return new Response(
      JSON.stringify({ error: "cors_blocked", message: "Invalid Origin header" }),
      {
        status: 400,
        headers: resHeaders,
      },
    );
  }

  return null;
}

/**
 * Basic rate limiter matching IP addresses.
 */
export function checkRateLimit(request: Request, clientIp: string): Response | null {
  const url = new URL(request.url);

  // Only rate limit API writes (POST, PUT, DELETE)
  if (request.method === "GET") {
    return null;
  }

  // Rate limit /api/ paths
  if (!url.pathname.startsWith("/api/")) {
    return null;
  }

  const now = Date.now();
  const limitKey = `${clientIp}:${url.pathname}`;

  const record = rateLimitStore.get(limitKey);

  if (!record) {
    rateLimitStore.set(limitKey, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW_MS,
    });
    return null;
  }

  if (now > record.resetTime) {
    // Window expired, reset
    record.count = 1;
    record.resetTime = now + RATE_LIMIT_WINDOW_MS;
    rateLimitStore.set(limitKey, record);
    return null;
  }

  // Increment requests
  record.count += 1;
  rateLimitStore.set(limitKey, record);

  if (record.count > MAX_REQUESTS_PER_WINDOW) {
    const retryAfter = Math.ceil((record.resetTime - now) / 1000);
    const resHeaders = applySecurityHeaders(
      new Headers({
        "Content-Type": "application/json",
        "Retry-After": retryAfter.toString(),
      }),
    );
    return new Response(
      JSON.stringify({
        error: "rate_limit_exceeded",
        message: `Too many requests. Please try again in ${retryAfter} seconds.`,
      }),
      {
        status: 429,
        headers: resHeaders,
      },
    );
  }

  return null;
}
