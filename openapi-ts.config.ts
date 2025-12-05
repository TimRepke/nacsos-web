import { defineConfig } from "@hey-api/openapi-ts";

export default defineConfig({
  input: "http://127.0.0.1:8081/openapi.json",
  output: "src/plugins/api/spec",
  transforms: {
    enums: {
      case: "PascalCase",
      enabled: true,
      mode: "root",
    },
    // propertiesRequiredByDefault
    responses: {
      case: "preserve",
    },
  },
  plugins: [
    {
      name: "@hey-api/client-axios",
      exportFromIndex: true,
      bundle: true,
      baseUrl: false,
      throwOnError: true,
      paramStructure: "flat",
    },
    {
      name: "@hey-api/sdk",
      asClass: true,
      throwOnError: true,
      paramStructure: "flat",
      responseStyle: "fields",
      transformer: false,
      validator: {
        request: false,
        response: false,
      },
    },
    {
      name: "@hey-api/schemas",
      type: "json",
    },
    {
      name: "@hey-api/typescript",
      case: "PascalCase",
      enums: true,
    },
  ],
});

// client: "axios",
// enums: "typescript",
// services: {
//   export: true,
//   response: "response",
// },
// parser: {
//   transforms: {
//     enums: "root",
//   },
// },
// schemas: true,
// useOptions: true,
// exportCore: true,
