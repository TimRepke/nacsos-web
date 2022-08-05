export function isFunctionInfo(obj: unknown) {
  if (typeof obj !== 'object' || !obj) return false;
  return 'module' in obj
    && 'function' in obj
    && 'kwargs' in obj
    && 'name' in obj
    && 'docstring' in obj
    && 'artefacts' in obj
    && 'filepath' in obj
    && 'filepath_rel' in obj
    // && 'tags' in obj
    && 'est_cpu_load' in obj
    && 'recommended_lifetime' in obj;
}

export function isArtefactOrSerializedArtefact(obj: unknown) {
  if (typeof obj !== 'object' || !obj) return false;
  return 'serializer' in obj
    && 'dtype' in obj
    && 'filename' in obj;
}

export function isNotImplemented() {
  return false;
}
