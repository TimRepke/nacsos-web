import type { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import axios from "axios";
import FormData from "form-data";
import { useRequestsStore } from "@/stores/RequestsStore";
import { EventBus } from "@/plugins/events";
import { ClearUserStoreEvent } from "@/plugins/events/events/auth";

import type { OnCancel } from "./CancelablePromise";
import { CancelablePromise, ErrorLevel } from "./CancelablePromise";
import { ApiError } from "./ApiError";
import type { ApiRequestOptions } from "./ApiRequestOptions";
import type { ApiResult } from "./ApiResult";
import type { OpenAPIConfig } from "./OpenAPI";

const isDefined = <T>(value: T | null | undefined): value is Exclude<T, null | undefined> =>
  value !== undefined && value !== null;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isString = (value: any): value is string => typeof value === "string";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isStringWithValue = (value: any): value is string => isString(value) && value !== "";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isBlob = (value: any): value is Blob =>
  typeof value === "object" &&
  typeof value.type === "string" &&
  typeof value.stream === "function" &&
  typeof value.arrayBuffer === "function" &&
  typeof value.constructor === "function" &&
  typeof value.constructor.name === "string" &&
  /^(Blob|File)$/.test(value.constructor.name) &&
  /^(Blob|File)$/.test(value[Symbol.toStringTag]);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isFormData = (value: any): value is FormData => value instanceof FormData;

const isSuccess = (status: number): boolean => status >= 200 && status < 300;

const base64 = (str: string): string => {
  try {
    return btoa(str);
  } catch (err) {
    // @ts-ignore
    return Buffer.from(str).toString("base64");
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getQueryString = (params: Record<string, any>): string => {
  const qs: string[] = [];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const append = (key: string, value: any) => {
    qs.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const process = (key: string, value: any) => {
    if (isDefined(value)) {
      if (Array.isArray(value)) {
        value.forEach((v) => {
          process(key, v);
        });
      } else if (typeof value === "object") {
        Object.entries(value).forEach(([k, v]) => {
          process(`${key}[${k}]`, v);
        });
      } else {
        append(key, value);
      }
    }
  };

  Object.entries(params).forEach(([key, value]) => {
    process(key, value);
  });

  if (qs.length > 0) {
    return `?${qs.join("&")}`;
  }

  return "";
};

const getUrl = (config: OpenAPIConfig, options: ApiRequestOptions): string => {
  const encoder = config.ENCODE_PATH || encodeURI;

  const path = options.url
    .replace("{api-version}", config.VERSION)
    .replace(/{(.*?)}/g, (substring: string, group: string) => {
      if (options.path && Object.prototype.hasOwnProperty.call(options.path, group)) {
        return encoder(String(options.path[group]));
      }
      return substring;
    });

  const url = `${config.BASE}${path}`;
  if (options.query) {
    return `${url}${getQueryString(options.query)}`;
  }
  return url;
};

const getFormData = (options: ApiRequestOptions): FormData | undefined => {
  if (options.formData) {
    const formData = new FormData();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const process = (key: string, value: any) => {
      if (isString(value) || isBlob(value)) {
        formData.append(key, value);
      } else {
        formData.append(key, JSON.stringify(value));
      }
    };

    Object.entries(options.formData)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .filter(([_, value]) => isDefined(value))
      .forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach((v) => process(key, v));
        } else {
          process(key, value);
        }
      });

    return formData;
  }
  return undefined;
};

type Resolver<T> = (options: ApiRequestOptions) => Promise<T>;

const resolve = async <T>(options: ApiRequestOptions, resolver?: T | Resolver<T>): Promise<T | undefined> => {
  if (typeof resolver === "function") {
    return (resolver as Resolver<T>)(options);
  }
  return resolver;
};

const getHeaders = async (
  config: OpenAPIConfig,
  options: ApiRequestOptions,
  formData?: FormData,
): Promise<Record<string, string>> => {
  const token = await resolve(options, config.TOKEN);
  const username = await resolve(options, config.USERNAME);
  const password = await resolve(options, config.PASSWORD);
  const additionalHeaders = await resolve(options, config.HEADERS);
  const formHeaders = typeof formData?.getHeaders === "function" ? formData?.getHeaders() : {};

  const headers = Object.entries({
    Accept: "application/json",
    ...additionalHeaders,
    ...options.headers,
    ...formHeaders,
  })
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    .filter(([_, value]) => isDefined(value))
    .reduce(
      (heads, [key, value]) => ({
        ...heads,
        [key]: String(value),
      }),
      {} as Record<string, string>,
    );

  if (isStringWithValue(token)) {
    headers.Authorization = `Bearer ${token}`;
  }

  if (isStringWithValue(username) && isStringWithValue(password)) {
    const credentials = base64(`${username}:${password}`);
    headers.Authorization = `Basic ${credentials}`;
  }

  if (options.body) {
    if (options.mediaType) {
      headers["Content-Type"] = options.mediaType;
    } else if (isBlob(options.body)) {
      headers["Content-Type"] = options.body.type || "application/octet-stream";
    } else if (isString(options.body)) {
      headers["Content-Type"] = "text/plain";
    } else if (!isFormData(options.body)) {
      headers["Content-Type"] = "application/json";
    }
  }

  return headers;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getRequestBody = (options: ApiRequestOptions): any => {
  if (options.body) {
    return options.body;
  }
  return undefined;
};

const sendRequest = async <T>(
  config: OpenAPIConfig,
  options: ApiRequestOptions,
  url: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body: any,
  formData: FormData | undefined,
  headers: Record<string, string>,
  onCancel: OnCancel,
): Promise<AxiosResponse<T>> => {
  const source = axios.CancelToken.source();

  const requestConfig: AxiosRequestConfig = {
    url,
    headers,
    data: body ?? formData,
    method: options.method,
    withCredentials: config.WITH_CREDENTIALS,
    cancelToken: source.token,
    ...options.customRequestConfig,
  };

  onCancel(() => source.cancel("The user aborted a request."));

  try {
    return await axios.request(requestConfig);
  } catch (error) {
    const axiosError = error as AxiosError<T>;
    if (axiosError.response) {
      return axiosError.response;
    }
    throw error;
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getResponseHeader = (response: AxiosResponse<any>, responseHeader?: string): string | undefined => {
  if (responseHeader) {
    const content = response.headers[responseHeader];
    if (isString(content)) {
      return content;
    }
  }
  return undefined;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getResponseBody = (response: AxiosResponse<any>): any => {
  if (response.status !== 204) {
    return response.data;
  }
  return undefined;
};

const catchErrorCodes = (options: ApiRequestOptions, result: ApiResult): void => {
  const errors: Record<number, string> = {
    400: "Bad Request",
    401: "Unauthorized",
    403: "Forbidden",
    404: "Not Found",
    500: "Internal Server Error",
    502: "Bad Gateway",
    503: "Service Unavailable",
    ...options.errors,
  };

  const error = errors[result.status];
  if (error || !result.ok) {
    throw new ApiError(options, result, error);
  }

  if (!result.ok) {
    throw new ApiError(options, result, "Generic Error");
  }
};

/**
 * Request method
 * @param config The OpenAPI configuration object
 * @param options The request options from the service
 * @returns CancelablePromise<T>
 * @throws ApiError
 */
export const request = <T>(config: OpenAPIConfig, options: ApiRequestOptions): CancelablePromise<T> =>
  new CancelablePromise(async (resolvePromise, rejectPromise, onCancel) => {
    const requestsStore = useRequestsStore();
    try {
      requestsStore.logRequestStart();
      const url = getUrl(config, options);
      const formData = getFormData(options);
      const body = getRequestBody(options);
      const headers = await getHeaders(config, options, formData);

      if (!onCancel.isCancelled) {
        const response = await sendRequest<T>(config, options, url, body, formData, headers, onCancel);
        const responseBody = getResponseBody(response);
        const responseHeader = getResponseHeader(response, options.responseHeader);
        requestsStore.logRequestEnd();

        const result: ApiResult = {
          url,
          ok: isSuccess(response.status),
          status: response.status,
          statusText: response.statusText,
          body: responseHeader ?? responseBody,
          response,
        };

        catchErrorCodes(options, result);

        resolvePromise({
          ok: result.ok,
          status: result.status,
          response,
          data: result.body,
        });
      } else {
        requestsStore.logRequestEnd();
      }
    } catch (error) {
      requestsStore.logRequestEnd();

      if (error instanceof ApiError) {
        const reason = {
          ok: error.ok,
          status: error.status,
          response: error.response,
          error: error.body,
        };

        // We might want to log-out when encountering an invalid auth error
        if (reason.error.detail.type === "NotAuthenticated") {
          EventBus.emit(new ClearUserStoreEvent());
          // const userStore = useCurrentUserStore();
          // userStore.clear();
        }

        rejectPromise(reason);
      } else {
        rejectPromise({
          ok: false,
          status: -1,
          error: {
            level: ErrorLevel.ERROR,
            type: "JSError",
            message: "Internal client-side error",
            error: error as Error,
          },
        });
      }
    }
  });
