import { Compass, Waves, Wrench, Network } from "lucide-react";

/**
 * The four engagement modes on /services-solutions.
 *
 * Shared so the header mega menu and the page itself cannot drift: the menu
 * previously advertised a two-audience split ("Investor Journey", "Operational
 * Troubleshooting") that the page no longer had, so two of the four modes were
 * unreachable from navigation and one menu item led nowhere in particular.
 *
 * `key` doubles as the section anchor (`#mode-<key>`) and as the locale key
 * prefix (`solutions.mode.<key>.*`), so adding a mode needs no edit here beyond
 * this array — as long as the matching keys exist in en.json.
 */
export const SOLUTION_MODES = [
  { key: "build", icon: Compass, accent: "mint" as const, items: [1, 2, 3, 4, 5] },
  { key: "run", icon: Waves, accent: "teal" as const, items: [1, 2, 3, 4, 5, 6, 7, 8] },
  { key: "improve", icon: Wrench, accent: "teal" as const, items: [1, 2, 3, 4] },
  { key: "source", icon: Network, accent: "mint" as const, items: [1, 2, 3, 4] },
] as const;

export type SolutionMode = (typeof SOLUTION_MODES)[number];
