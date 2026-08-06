/**
 * Background pattern for a Solutions engagement-mode section.
 *
 * Each mode gets a pattern that echoes what the mode is about rather than a
 * generic texture: blueprint grid for design work, a moving water field for
 * the people who run the biology, a rising trace for performance recovery, and
 * a node mesh for the supply network.
 *
 * Inline SVG on purpose — four tileable patterns cost less than four image
 * requests, they inherit the accent colour, and they stay crisp at any width.
 * Everything sits at low opacity behind the content and is aria-hidden: it is
 * decoration and must never be announced.
 */
export type ModePatternKind = "build" | "run" | "improve" | "source";

const STROKE = { mint: "var(--brand-mint)", teal: "var(--brand-teal)" } as const;

export function ModePattern({ kind, accent }: { kind: ModePatternKind; accent: "mint" | "teal" }) {
  const color = STROKE[accent];
  const id = `mode-pattern-${kind}`;

  return (
    <svg
      aria-hidden="true"
      focusable="false"
      className="pointer-events-none absolute inset-0 h-full w-full"
      style={{ opacity: 0.16 }}
    >
      <defs>
        {kind === "build" && (
          /* Blueprint grid — the drawings the client's engineers work from. */
          <pattern id={id} width="48" height="48" patternUnits="userSpaceOnUse">
            <path d="M48 0H0V48" fill="none" stroke={color} strokeWidth="1" />
            <circle cx="0" cy="0" r="1.8" fill={color} />
          </pattern>
        )}
        {kind === "run" && (
          /* Water field — the medium the placed specialists work in. */
          <pattern id={id} width="80" height="40" patternUnits="userSpaceOnUse">
            <path
              d="M0 20 Q 20 6 40 20 T 80 20"
              fill="none"
              stroke={color}
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <path
              d="M0 34 Q 20 20 40 34 T 80 34"
              fill="none"
              stroke={color}
              strokeWidth="1"
              strokeLinecap="round"
              opacity="0.6"
            />
          </pattern>
        )}
        {kind === "improve" && (
          /* Rising trace over a baseline — recovering an underperforming line. */
          <pattern id={id} width="72" height="48" patternUnits="userSpaceOnUse">
            <path d="M0 44 H72" stroke={color} strokeWidth="0.75" opacity="0.5" />
            <path
              d="M0 40 L18 28 L34 33 L52 14 L72 6"
              fill="none"
              stroke={color}
              strokeWidth="1.5"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
            <circle cx="52" cy="14" r="2" fill={color} />
          </pattern>
        )}
        {kind === "source" && (
          /* Node mesh — the supplier and logistics network. */
          <pattern id={id} width="64" height="64" patternUnits="userSpaceOnUse">
            <path
              d="M8 8 L56 24 M56 24 L24 56 M24 56 L8 8"
              fill="none"
              stroke={color}
              strokeWidth="0.9"
              opacity="0.65"
            />
            <circle cx="8" cy="8" r="2.6" fill={color} />
            <circle cx="56" cy="24" r="2" fill={color} />
            <circle cx="24" cy="56" r="2.2" fill={color} />
          </pattern>
        )}

        {/* Fades the tile out toward the centre so it never competes with the
            body copy sitting on top of it. */}
        <radialGradient id={`${id}-fade`} cx="50%" cy="50%" r="70%">
          <stop offset="0%" stopColor="#000" stopOpacity="0" />
          <stop offset="55%" stopColor="#000" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#000" stopOpacity="1" />
        </radialGradient>
        <mask id={`${id}-mask`}>
          <rect width="100%" height="100%" fill={`url(#${id}-fade)`} />
        </mask>
      </defs>

      <rect width="100%" height="100%" fill={`url(#${id})`} mask={`url(#${id}-mask)`} />
    </svg>
  );
}
