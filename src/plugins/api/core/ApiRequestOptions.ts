import type { AxiosRequestConfig } from "axios";

export type ApiRequestOptions = {
  readonly method: "GET" | "PUT" | "POST" | "DELETE" | "OPTIONS" | "HEAD" | "PATCH";
  readonly url: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly path?: Record<string, any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly cookies?: Record<string, any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly headers?: Record<string, any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly query?: Record<string, any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly formData?: Record<string, any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly body?: any;
  readonly mediaType?: string;
  readonly responseHeader?: string;
  readonly errors?: Record<number, string>;
  readonly customRequestConfig?: AxiosRequestConfig;
};
