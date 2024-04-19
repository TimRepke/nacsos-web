import path from "node:path";

import { loadConfig } from "c12";

import type { Config, UserConfig } from "./types/config";
import { setConfig } from "./utils/config";

const getSchemas = (userConfig: UserConfig): Config["schemas"] => {
  let schemas: Config["schemas"] = {
    export: true,
    type: "json",
  };
  if (typeof userConfig.schemas === "boolean") {
    schemas.export = userConfig.schemas;
  } else {
    schemas = {
      ...schemas,
      ...userConfig.schemas,
    };
  }
  return schemas;
};

const getServices = (userConfig: UserConfig): Config["services"] => {
  let services: Config["services"] = {
    export: true,
    name: "{{name}}Service",
    operationId: true,
    response: "body",
  };
  if (typeof userConfig.services === "boolean") {
    services.export = userConfig.services;
  } else if (typeof userConfig.services === "string") {
    services.include = userConfig.services;
  } else {
    services = {
      ...services,
      ...userConfig.services,
    };
  }
  return services;
};

const getTypes = (userConfig: UserConfig): Config["types"] => {
  let types: Config["types"] = {
    dates: false,
    export: true,
    name: "preserve",
  };
  if (typeof userConfig.types === "boolean") {
    types.export = userConfig.types;
  } else if (typeof userConfig.types === "string") {
    types.include = userConfig.types;
  } else {
    types = {
      ...types,
      ...userConfig.types,
    };
  }
  return types;
};

export const initConfig = async (userConfig: UserConfig) => {
  const { config: userConfigFromFile } = await loadConfig<UserConfig>({
    jitiOptions: {
      esmResolve: true,
    },
    name: "openapi-ts",
    overrides: userConfig,
  });

  if (userConfigFromFile) {
    userConfig = { ...userConfigFromFile, ...userConfig };
  }

  const {
    base,
    debug = false,
    dryRun = false,
    enums = false,
    exportCore = true,
    format = true,
    input,
    lint = false,
    name,
    request,
    useOptions = true,
  } = userConfig;

  if (debug) {
    console.warn("userConfig:", userConfig);
  }

  if (!input) {
    throw new Error("🚫 input not provided - provide path to OpenAPI specification");
  }

  if (!userConfig.output) {
    throw new Error("🚫 output not provided - provide path where we should generate your client");
  }

  if (!useOptions) {
    console.warn(
      "⚠️ Deprecation warning: useOptions set to false. This setting will be removed in future versions. Please migrate useOptions to true https://heyapi.vercel.app/openapi-ts/migrating.html#v0-27-38",
    );
  }

  const output = path.resolve(process.cwd(), userConfig.output);
  const schemas = getSchemas(userConfig);
  const services = getServices(userConfig);
  const types = getTypes(userConfig);

  return setConfig({
    base,
    client: "axios",
    debug,
    dryRun,
    enums,
    exportCore,
    format,
    input,
    lint,
    name,
    output,
    request,
    schemas,
    services,
    types,
    useOptions,
  });
};
