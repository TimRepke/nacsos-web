import type { OpenApiOperation } from "./OpenApiOperation";
import type { OpenApiParameter } from "./OpenApiParameter";
import type { OpenApiReference } from "./OpenApiReference";

/**
 * {@link} https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#path-item-object
 */
export interface OpenApiPath extends OpenApiReference {
  get?: OpenApiOperation;
  put?: OpenApiOperation;
  post?: OpenApiOperation;
  delete?: OpenApiOperation;
  options?: OpenApiOperation;
  head?: OpenApiOperation;
  patch?: OpenApiOperation;
  parameters?: OpenApiParameter[];
}
