import { defineCollection, reference } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";
import { loadPublications } from "./lib/publications";

const themeKey = z.enum(["rlaif", "cl", "topology", "agentic"]);

/**
 * The four starting research themes (non-binding). The descriptions are the
 * exact text of the theme documents (sources/private/research-themes/),
 * published verbatim at the user's request (2026-09-18), two typos fixed:
 * `summary` is the opening paragraph, the Markdown body holds the sections
 * that follow. Numbers follow the site order set on 2026-09-18 (Agentic 01 →
 * RLAIF 04), not the order of the original call.
 */
const themes = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/themes" }),
  schema: z.object({
    number: z.string().regex(/^0[1-4]$/),
    title: z.string(),
    shortTitle: z.string(),
    colour: themeKey,
    supervisor: z.string(),
    coSupervisor: z.string(),
    phdStudent: z.string().optional(),
    /** One-line question shown in the Research menu. TODO until approved. */
    question: z.string().optional(),
    /** Opening paragraph of the theme document, shown as the page lede. */
    summary: z.string().optional(),
    /** `draft` descriptions are never rendered; `approved` ones are. */
    status: z.enum(["draft", "approved"]).default("draft"),
  }),
});

const people = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/people" }),
  schema: z.object({
    name: z.string(),
    role: z.enum(["pi", "co-supervisor", "phd", "researcher", "collaborator"]),
    affiliation: z.string(),
    themes: z.array(reference("themes")).default([]),
    orcid: z.string().optional(),
    scholar: z.url().optional(),
    website: z.url().optional(),
    /** Real portraits only (taste.md D4); no placeholder imagery. */
    portrait: z.string().optional(),
  }),
});

const events = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/events" }),
  schema: z.object({
    title: z.string(),
    kind: z.enum(["seminar", "talk", "workshop", "meeting"]),
    start: z.coerce.date(),
    end: z.coerce.date().optional(),
    location: z.string(),
    themes: z.array(reference("themes")).default([]),
    slides: z.url().optional(),
    recording: z.url().optional(),
  }),
});

const news = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/news" }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    /** Explanatory posts live in News behind this field (taste.md / synthesis §3). */
    type: z.enum(["announcement", "blog"]),
    summary: z.string(),
    themes: z.array(reference("themes")).default([]),
  }),
});

const resources = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/resources" }),
  schema: z.object({
    title: z.string(),
    kind: z.enum(["dataset", "benchmark", "model", "code"]),
    theme: reference("themes"),
    licence: z.string(),
    dataLicence: z.string().optional(),
    version: z.string(),
    date: z.coerce.date(),
    /** Copyable BibTeX, rendered in mono. */
    citation: z.string(),
    links: z.object({
      huggingface: z.url().optional(),
      github: z.url().optional(),
      zenodo: z.url().optional(),
      doi: z.string().optional(),
    }),
  }),
});

/** Generated from src/content/publications.bib — parser arrives in Phase 4. */
const publications = defineCollection({
  loader: loadPublications,
  schema: z.object({
    title: z.string(),
    authors: z.array(z.string()),
    year: z.number().int(),
    venue: z.string(),
    type: z.enum(["conference", "journal", "workshop", "preprint"]),
    doi: z.string().optional(),
    url: z.url().optional(),
    themes: z.array(themeKey).default([]),
  }),
});

export const collections = { themes, people, events, news, resources, publications };
