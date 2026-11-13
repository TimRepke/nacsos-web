import { fileURLToPath, URL } from "node:url";

import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), "");

  const coreUrl = new URL(env.VITE_NACSOS_CORE_URL || "http://127.0.0.1:8080/proxy-core");
  const proxyPath = coreUrl.pathname.replace(/\/$/, ""); // e.g. "/proxy-core"
  const proxyTarget = env.VITE_PROXY_CORE_TARGET;
  const runProxy = env.VITE_NACSOS_CORE_URL && env.VITE_PROXY_CORE_TARGET;

  return {
    build: {
      manifest: true,
      sourcemap: true,
    },
    plugins: [vue(), vueJsx()],
    base: env.VITE_NACSOS_BASE_URL,
    rollupOptions: {
      // overwrite default .html entry
      input: "src/main.ts",
    },
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
    define: {
      __APP_ENV__: env.APP_ENV,
    },

    // Proxy of public API for local development against
    server: runProxy
      ? {
          host: coreUrl.hostname,
          port: Number(coreUrl.port) || 8080,
          strictPort: true,
          proxy:
            proxyTarget && proxyPath
              ? {
                  [proxyPath]: {
                    target: proxyTarget,
                    changeOrigin: true,
                    secure: true,
                    rewrite: (path) => path.replace(new RegExp(`^${proxyPath}`), ""),
                    cookieDomainRewrite: coreUrl.hostname,
                  },
                }
              : undefined,
        }
      : undefined,
  };
});
