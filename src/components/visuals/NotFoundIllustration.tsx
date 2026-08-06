import { useEffect, useState } from "react";

/**
 * 404 illustration: a fish that has swum out through a torn net.
 *
 * Chosen over a generic broken-page graphic because it states the problem in
 * the site's own vocabulary — something got away, and the rest of the shoal is
 * over here.
 *
 * The net is a real knotted mesh: a tiled diamond `<pattern>` clipped to the
 * net's silhouette, with a hole punched through it by a `<mask>` rather than
 * drawn on top. That is what makes the tear read as missing mesh instead of a
 * scribble over intact netting — you can see the water through it, and the cut
 * strands hang loose at the edges.
 *
 * The escapee follows a real route with <animateMotion>. `rotate="auto"` keeps
 * it nose-first through the curve, which is the difference between a fish and
 * a drifting shape.
 *
 * Inline SVG rather than an asset: it inherits the theme tokens, stays crisp
 * at any size, and costs no extra request on a page nobody meant to visit.
 * aria-hidden throughout — decoration only; the heading carries the message.
 */
export function NotFoundIllustration() {
  // <animateMotion> is SMIL, not CSS, so the prefers-reduced-motion block in
  // styles.css cannot stop it — `animation: none` has no effect on SMIL. A
  // visitor who asked for less motion would still watch a fish swim laps, so
  // the element is not rendered at all in that case and the fish rests at the
  // start of its route.
  const [reducedMotion, setReducedMotion] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return (
    <div className="relative mx-auto w-full max-w-md">
      <svg
        viewBox="0 0 400 300"
        className="h-auto w-full"
        fill="none"
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          <linearGradient id="nf-water" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--brand-teal)" stopOpacity="0.22" />
            <stop offset="100%" stopColor="var(--brand-navy)" stopOpacity="0.10" />
          </linearGradient>

          {/* Knotted mesh: crossing diagonals with a knot dot where they meet,
              which is what separates a fishing net from a plain grid. */}
          <pattern
            id="nf-mesh"
            width="18"
            height="18"
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(45)"
          >
            <path
              d="M9 0 V18 M0 9 H18"
              stroke="var(--brand-navy)"
              strokeOpacity="0.30"
              strokeWidth="1.1"
            />
            <circle cx="9" cy="9" r="1.35" fill="var(--brand-navy)" fillOpacity="0.34" />
          </pattern>

          {/* The net's silhouette — a hanging trawl, wider at the mouth. */}
          <path
            id="nf-net-shape"
            d="M232 44 C 316 66, 340 140, 322 206 C 310 252, 274 268, 240 258
               C 214 246, 200 200, 202 150 C 204 100, 214 62, 232 44 Z"
          />

          {/* Punches the tear out of the mesh: white keeps, black removes. The
              hole is an irregular blob, not a circle — a cut net does not tear
              neatly. */}
          <mask id="nf-tear-mask">
            <rect width="400" height="300" fill="#fff" />
            <path
              d="M206 128 C 224 122, 240 132, 244 148 C 248 166, 236 182, 219 180
                 C 202 178, 194 162, 196 146 C 197 137, 200 131, 206 128 Z"
              fill="#000"
            />
          </mask>

          <clipPath id="nf-net-clip">
            <use href="#nf-net-shape" />
          </clipPath>

          {/* Fish: body, tail, dorsal and pectoral fin, nose-first along +x. */}
          <g id="nf-fish">
            <path d="M0 0 C -7 -6, -18 -6.5, -25 0 C -18 6.5, -7 6, 0 0 Z" />
            <path d="M-25 0 L-34 -6.5 L-31.5 0 L-34 6.5 Z" />
            <path d="M-12 -5 L-8 -9.5 L-4 -4.6 Z" />
            <path d="M-13 3.4 L-16 7.5 L-8.5 4.4 Z" />
            <circle cx="-4.5" cy="-1.4" r="1.1" fill="var(--brand-navy)" fillOpacity="0.55" />
          </g>

          {/* Escapee's route: out through the tear, an arc into open water,
              then back toward the net. Closed so the loop is seamless. */}
          <path
            id="nf-route"
            d="M196 152 C 150 130, 96 132, 62 160 C 34 184, 60 214, 104 206
               C 150 198, 178 176, 196 152 Z"
          />

          <linearGradient id="nf-caustic" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#fff" stopOpacity="0" />
            <stop offset="50%" stopColor="#fff" stopOpacity="0.32" />
            <stop offset="100%" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
        </defs>

        <rect width="400" height="300" rx="24" fill="url(#nf-water)" />

        <g className="animate-nf-caustic">
          <rect x="-120" y="0" width="90" height="300" fill="url(#nf-caustic)" />
        </g>

        {/* Whole net sways as one body in the current. */}
        <g className="animate-nf-sway" style={{ transformOrigin: "236px 46px" }}>
          {/* Mesh, clipped to the net shape and holed by the mask. */}
          <g clipPath="url(#nf-net-clip)" mask="url(#nf-tear-mask)">
            <rect x="180" y="30" width="180" height="250" fill="url(#nf-mesh)" />
          </g>

          {/* Head rope and hanging edge: thicker than the mesh, as real rope is. */}
          <use
            href="#nf-net-shape"
            fill="none"
            stroke="var(--brand-navy)"
            strokeOpacity="0.42"
            strokeWidth="2.4"
            strokeLinejoin="round"
          />
          {/* Float line across the mouth. */}
          <path
            d="M232 44 C 262 40, 296 50, 316 66"
            stroke="var(--brand-navy)"
            strokeOpacity="0.35"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <g fill="var(--brand-teal)" fillOpacity="0.75">
            <circle cx="248" cy="42" r="3.2" />
            <circle cx="272" cy="43" r="3.2" />
            <circle cx="296" cy="52" r="3.2" />
          </g>

          {/* Cut strands hanging from the tear's rim — the detail that makes it
              read as torn rather than as a gap that was always there. */}
          <g
            stroke="var(--brand-mint)"
            strokeOpacity="0.8"
            strokeWidth="1.6"
            strokeLinecap="round"
            fill="none"
            className="animate-nf-strands"
          >
            <path d="M206 129 C 200 134, 199 140, 202 145" />
            <path d="M243 147 C 249 150, 251 156, 248 161" />
            <path d="M220 180 C 222 187, 219 192, 214 194" />
            <path d="M198 160 C 192 163, 189 169, 191 174" />
          </g>
          {/* Rim of the hole, so the eye finds the cause immediately. */}
          <path
            d="M206 128 C 224 122, 240 132, 244 148 C 248 166, 236 182, 219 180
               C 202 178, 194 162, 196 146 C 197 137, 200 131, 206 128 Z"
            fill="none"
            stroke="var(--brand-mint)"
            strokeWidth="2.2"
            strokeDasharray="6 5"
            className="animate-nf-tear"
          />

          {/* Shoal still inside, each on its own phase. */}
          <g fill="var(--brand-navy)" fillOpacity="0.32">
            <g className="animate-nf-drift">
              <use href="#nf-fish" transform="translate(276 86) scale(0.72)" />
            </g>
            <g className="animate-nf-drift-delayed">
              <use href="#nf-fish" transform="translate(304 152) scale(0.62)" />
            </g>
            <g className="animate-nf-drift-slow">
              <use href="#nf-fish" transform="translate(268 216) scale(0.58)" />
            </g>
            <g className="animate-nf-drift-delayed">
              <use href="#nf-fish" transform="translate(300 112) scale(0.5)" />
            </g>
            <g className="animate-nf-drift">
              <use href="#nf-fish" transform="translate(292 188) scale(0.54)" />
            </g>
          </g>
        </g>

        {/* The escapee. animateMotion drives position and heading; the nested
            group adds body wobble so the two do not fight each other. */}
        <g transform={reducedMotion ? "translate(196 152)" : undefined}>
          <g className="animate-nf-wobble">
            <use href="#nf-fish" fill="var(--brand-mint)" transform="scale(1.5)" />
          </g>
          {!reducedMotion && (
            <animateMotion dur="16s" repeatCount="indefinite" rotate="auto" calcMode="linear">
              <mpath href="#nf-route" />
            </animateMotion>
          )}
        </g>

        {/* Bubbles rising from where it broke through. */}
        <g fill="var(--brand-teal)" fillOpacity="0.6">
          <circle cx="196" cy="140" r="3" className="animate-nf-bubble" />
          <circle cx="184" cy="150" r="2" className="animate-nf-bubble-delayed" />
          <circle cx="206" cy="132" r="2.4" className="animate-nf-bubble-slow" />
        </g>
      </svg>
    </div>
  );
}
