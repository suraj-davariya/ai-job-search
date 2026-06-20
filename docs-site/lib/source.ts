import { docs } from "@/.source/server";
import { loader } from "fumadocs-core/source";
import { i18n } from "@/lib/i18n";

/**
 * Content source for the guide tree — everything under content/docs.
 *
 * Passing `i18n` turns on dot-locale parsing (`apply.es.mdx`) and per-language
 * page trees. With it enabled, `source.pageTree` is now a `Record<locale, Root>`
 * — read a single tree with `source.getPageTree(locale)` and a single page with
 * `source.getPage(slug, locale)`.
 */
export const source = loader({
  baseUrl: "/docs",
  i18n,
  source: docs.toFumadocsSource(),
});
