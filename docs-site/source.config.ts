import { defineConfig, defineDocs } from "fumadocs-mdx/config";

/** All guide content lives in content/docs (build-prompt §5). */
export const docs = defineDocs({
  dir: "content/docs",
});

export default defineConfig({
  mdxOptions: {
    // Defaults are fine; demos are React components registered in
    // mdx-components.tsx, not remark plugins.
  },
});
