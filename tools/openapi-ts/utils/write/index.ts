import { compiler, TypeScriptFile } from "../../compiler";
import { getConfig } from "../config";

export const processIndex = async ({ files }: { files: Record<string, TypeScriptFile> }): Promise<void> => {
  const config = getConfig();

  if (config.name) {
    files.index.add(compiler.export.named([config.name], `./${config.name}`));
  }
  if (files.enums && !files.enums.isEmpty()) {
    files.index.add(compiler.export.all(`./${files.enums.getName(false)}`));
  }
  if (files.schemas && !files.schemas.isEmpty()) {
    files.index.add(compiler.export.all(`./${files.schemas.getName(false)}`));
  }
  if (files.services && !files.services.isEmpty()) {
    files.index.add(compiler.export.all(`./${files.services.getName(false)}`));
  }
  if (files.types && !files.types.isEmpty()) {
    files.index.add(compiler.export.all(`./${files.types.getName(false)}`));
  }
};
