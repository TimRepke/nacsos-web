import type { Dictionary } from "../../common/interfaces/Dictionary";
import type { OpenApiItems } from "./OpenApiItems";

/**
 * {@link} https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#header-object
 */
export interface OpenApiHeader {
  description?: string;
  type: "string" | "number" | "integer" | "boolean" | "array";
  format?:
    | "int32"
    | "int64"
    | "float"
    | "double"
    | "string"
    | "boolean"
    | "byte"
    | "binary"
    | "date"
    | "date-time"
    | "password";
  items?: Dictionary<OpenApiItems>;
  collectionFormat?: "csv" | "ssv" | "tsv" | "pipes";
  default?: unknown;
  maximum?: number;
  exclusiveMaximum?: boolean;
  minimum?: number;
  exclusiveMinimum?: boolean;
  maxLength?: number;
  minLength?: number;
  pattern?: string;
  maxItems?: number;
  minItems?: number;
  uniqueItems?: boolean;
  enum?: (string | number)[];
  multipleOf?: number;
}
