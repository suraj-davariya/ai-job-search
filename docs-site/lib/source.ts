import { docs } from "@/.source/server";
import { loader } from "fumadocs-core/source";

/** Content source for the guide tree — everything under content/docs. */
export const source = loader({
  baseUrl: "/docs",
  source: docs.toFumadocsSource(),
});
