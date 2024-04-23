/* eslint-disable  @typescript-eslint/no-explicit-any */
import type { AxiosResponse } from "axios";

export type ApiResultIntern<TData = any> = {
  readonly body: TData;
  readonly ok: boolean;
  readonly status: number;
  readonly statusText: string;
  readonly url: string;
  readonly response: AxiosResponse;
};

export enum ErrorLevel {
  WARNING = "WARNING",
  ERROR = "ERROR",
}

export type ErrorDetails = {
  level: ErrorLevel;
  type: string;
  message: string;
  args?: unknown[];
  error?: Error;
};

type ApiResponseBase = {
  readonly ok: boolean;
  readonly status: number;
  readonly response?: AxiosResponse;
};

export type ApiResult<T> = ApiResponseBase & { data: T };
export type ApiResponseReject = ApiResponseBase & { error: { detail: ErrorDetails } };
