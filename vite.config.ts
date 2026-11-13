import { fileURLToPath, URL } from "node:url";

import { defineConfig, loadEnv, UserConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), "");

  const config: UserConfig = {
    build: {
      manifest: true,
      sourcemap: true,
      rollupOptions: {
        output: {
          codeSplitting: {
            groups: [
              { name: "vendor-bootstrap", test: /node_modules[\\/]bootstrap[\\/]/ },
              { name: "vendor-d3", test: /node_modules[\\/]d3-/ },
            ],
          },
        },
      },
    },
    plugins: [vue()],
    base: env.VITE_NACSOS_BASE_URL,
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
    define: {
      __APP_ENV__: env.APP_ENV,
    },
  };

  // Proxy of public API for local development against
  if (env.VITE_NACSOS_CORE_URL && env.VITE_PROXY_CORE_TARGET) {
    const coreUrl = new URL(env.VITE_NACSOS_CORE_URL || "http://127.0.0.1:8080/proxy-core");
    const proxyPath = coreUrl.pathname.replace(/\/$/, ""); // e.g. "/proxy-core"
    const proxyPathRegex = new RegExp("^" + proxyPath.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
    const proxyTarget = env.VITE_PROXY_CORE_TARGET;
    config.server = {
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
                rewrite: (path) => path.replace(proxyPathRegex, ""),
                cookieDomainRewrite: coreUrl.hostname,
              },
            }
          : undefined,
    };
  }

  return config;
});
