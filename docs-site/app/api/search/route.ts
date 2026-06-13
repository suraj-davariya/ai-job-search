import { source } from "@/lib/source";
import { createFromSource } from "fumadocs-core/search/server";

// Static search (build-prompt §8): the index is generated at build time and
// exported as a plain file — no server. The client (RootProvider, type:
// "static") fetches it once and searches in the browser via Orama.
export const revalidate = false;

export const { staticGET: GET } = createFromSource(source);
