import type { KWARG } from "@/plugins/api/api-pipe";

export function isFunctionInfo(obj: unknown) {
  if (typeof obj !== "object" || !obj) return false;
  return (
    "module" in obj &&
    "function" in obj &&
    "kwargs" in obj &&
    "name" in obj &&
    "docstring" in obj &&
    "artefacts" in obj &&
    "filepath" in obj &&
    "filepath_rel" in obj &&
    // && 'tags' in obj
    // && 'recommended_lifetime' in obj
    "est_cpu_load" in obj
  );
}

export function isArtefactOrSerializedArtefact(obj: unknown) {
  if (typeof obj !== "object" || !obj) return false;
  return "serializer" in obj && "dtype" in obj && "filename" in obj;
}

export function isNotImplemented() {
  return false;
}

export function type2str(tp: KWARG): string {
  if (tp.artefact) {
    return `Artefact[${tp.artefact.serializer}, ${tp.artefact.dtype}]`;
  }
  if (tp.options) {
    return `Literal['${tp.options.join("', '")}']`;
  }
  if (tp.params) {
    const parsedParams = Object.entries(tp.params).map(([key_, dtype_]) => `${key_}: ${type2str(dtype_)}`);
    return `${tp.dtype}{${parsedParams.join(", ")}}`;
  }
  // FIXME deal with UNIONS where tp.dtype.length > 1
  let ret: string = tp.dtype[0];
  if (tp.generics) {
    ret += `[${tp.generics.join(", ")}]`;
  }
  if (tp.default) {
    ret += ` = ${tp.default}`;
  }
  return ret;
}
