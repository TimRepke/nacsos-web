import { defineConfig } from "@hey-api/openapi-ts";

export default defineConfig({
  input: "http://127.0.0.1:8081/openapi.json",
  output: "src/plugins/api/spec/",
  client: "axios",
  enums: "typescript",
  exportServices: true,
  schemas: true,
  useOptions: true,
  serviceResponse: "response",
  // exportCore: true,
  // request: "src/plugins/api/request.ts",
  // request: "@/plugins/api/request"
});
