import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";

import svelte from "@astrojs/svelte";

// https://astro.build/config
export default defineConfig({
  site: "https://gitdmnt.github.io",
  integrations: [mdx(), react(), svelte()],
  vite: {
    plugins: [tailwindcss()],
  },
});
