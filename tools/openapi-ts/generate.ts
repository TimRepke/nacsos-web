import { initConfig } from "./index";
import { sync } from "cross-spawn";
import { getOpenApiSpec } from "./utils/getOpenApiSpec";
import { postProcessClient } from "./utils/postprocess";
import { parse } from "./openApi";
import { registerHandlebarTemplates } from "./utils/handlebars";
import { writeClient } from "./utils/write/client";
import { UserConfig } from "./types/config";

const userConfig: UserConfig = {
  input: "http://127.0.0.1:8081/openapi.json",
  output: "src/plugins/api/spec/",
  client: "axios",
  enums: "typescript",
  services: {
    export: true,
    response: "response",
  },
  schemas: true,
  useOptions: true,
  exportCore: true,
  // request: "src/plugins/api/request.ts",
  // request: "@/plugins/api/request"
};

const config = await initConfig(userConfig);

const openApi =
  typeof config.input === "string"
    ? await getOpenApiSpec(config.input)
    : (config.input as unknown as Awaited<ReturnType<typeof getOpenApiSpec>>);

const client = postProcessClient(parse(openApi));
const templates = registerHandlebarTemplates();

await writeClient(openApi, client, templates);

console.log("✨ Done! Your client is located in:", config.output);

console.log("✨ Running Prettier");
sync("prettier", ["--ignore-unknown", config.output, "--write"]);
