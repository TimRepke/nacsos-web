import { existsSync, mkdirSync } from "node:fs";
import path from "node:path";

import { TypeScriptFile } from "../../compiler";
import type { OpenApi } from "../../openApi";
import type { Client } from "../../types/client";
import { getConfig } from "../config";
import { processIndex } from "./index";
import { processTypesAndEnums } from "./models";
import { processSchemas } from "./schemas";
import { processServices } from "./services";

/**
 * Write our OpenAPI client, using the given templates at the given output
 * @param openApi {@link OpenApi} Dereferenced OpenAPI specification
 * @param client Client containing models, schemas, and services
 */
export const writeClient = async (openApi: OpenApi, client: Client): Promise<void> => {
  const config = getConfig();

  if (config.services.include) {
    const regexp = new RegExp(config.services.include);
    client.services = client.services.filter((service) => regexp.test(service.name));
  }

  if (config.types.include) {
    const regexp = new RegExp(config.types.include);
    client.models = client.models.filter((model) => regexp.test(model.name));
  }

  const outputPath = path.resolve(config.output);

  if (!existsSync(outputPath)) {
    mkdirSync(outputPath, { recursive: true });
  }

  const files: Record<string, TypeScriptFile> = {
    index: new TypeScriptFile({
      dir: config.output,
      name: "index.ts",
    }),
  };
  if (config.enums) {
    files.enums = new TypeScriptFile({
      dir: config.output,
      name: "enums.ts",
    });
  }
  if (config.schemas.export) {
    files.schemas = new TypeScriptFile({
      dir: config.output,
      name: "schemas.ts",
    });
  }
  if (config.services.export) {
    files.services = new TypeScriptFile({
      dir: config.output,
      name: "services.ts",
    });
  }
  if (config.types.export) {
    files.types = new TypeScriptFile({
      dir: config.output,
      name: "types.ts",
    });
  }

  await processSchemas({ file: files.schemas, openApi });
  await processTypesAndEnums({ client, files });
  await processServices({ client, files });

  await processIndex({ files });

  files.enums?.write("\n\n");
  files.schemas?.write("\n\n");
  files.services?.write("\n\n");
  files.types?.write("\n\n");
  files.index.write();
};
