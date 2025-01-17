/**
 * Strip (OpenAPI) namespaces fom values.
 * @param value
 */
export const stripNamespace = (value: string): string =>
  value
    .trim()
    .replace(/^#\/definitions\//, "")
    .replace(/^#\/parameters\//, "")
    .replace(/^#\/responses\//, "")
    .replace(/^#\/securityDefinitions\//, "")
    .replace(/^#\/components\/schemas\//, "")
    .replace(/^#\/components\/responses\//, "")
    .replace(/^#\/components\/parameters\//, "")
    .replace(/^#\/components\/examples\//, "")
    .replace(/^#\/components\/requestBodies\//, "")
    .replace(/^#\/components\/headers\//, "")
    .replace(/^#\/components\/securitySchemes\//, "")
    .replace(/^#\/components\/links\//, "")
    .replace(/^#\/components\/callbacks\//, "");
