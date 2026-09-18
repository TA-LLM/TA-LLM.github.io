/**
 * Site-wide constants. Facts come from the project record; anything not yet
 * known is left as an explicit TODO rather than guessed.
 */

/**
 * While false, every page carries `noindex` and robots.txt disallows all
 * crawling. Flip to true at launch — the only switch needed.
 */
export const LAUNCHED = false;

export const SITE = {
  name: "TA-LLM",
  title: "TA-LLM — Large Language Models: a matter of time?",
  description:
    "TA-LLM is a research project on time-aware Large Language Models: LLMs that reason over time series, cope with temporally misaligned multimodal data, and stay reliable as the world drifts.",
  locale: "en",
} as const;

/** Project span, as funded. Used by the D10 progress thread and /about. */
export const PROJECT = {
  start: "2026-08-18",
  end: "2029-08-17",
  code: "FIS-01152",
  cup: "E53C25001820001",
  programme: "Fondo Italiano per la Scienza (FIS 2)",
  funder: "Italian Ministry of University and Research (MUR)",
  host: "DAUIN — Department of Control and Computer Engineering, Politecnico di Torino",
} as const;

export interface NavItem {
  href: string;
  label: string;
}

export const NAV: NavItem[] = [
  { href: "/research/", label: "Research" },
  { href: "/publications/", label: "Publications" },
  { href: "/resources/", label: "Resources" },
  { href: "/people/", label: "People" },
  { href: "/events/", label: "Events" },
  { href: "/news/", label: "News" },
  { href: "/collaborate/", label: "Collaborate" },
  { href: "/about/", label: "About" },
];
