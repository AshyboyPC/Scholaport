// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, nitro (build-only using cloudflare as a default target),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import type { Plugin } from "vite";

function developmentQaHtml(): Plugin {
  return {
    name: "scholaport-development-qa-html",
    apply: "serve",
    enforce: "pre",
    configureServer(server) {
      server.middlewares.use(async (request, response, next) => {
        const pathname = new URL(request.url ?? "/", "http://localhost").pathname;
        if (pathname !== "/visual-qa.html") {
          next();
          return;
        }
        try {
          const source = await readFile(resolve(process.cwd(), "visual-qa.html"), "utf8");
          const html = await server.transformIndexHtml(request.url ?? pathname, source);
          response.statusCode = 200;
          response.setHeader("content-type", "text/html; charset=utf-8");
          response.setHeader("cache-control", "no-store");
          response.end(html);
        } catch (error) {
          next(error as Error);
        }
      });
    },
  };
}

export default defineConfig({
  vite: {
    plugins: [developmentQaHtml()],
    optimizeDeps: {
      include: ["use-sync-external-store/shim/with-selector"],
    },
    build: {
      rolldownOptions: {
        external: ["cloudflare:workers"],
      },
    },
  },
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
});
