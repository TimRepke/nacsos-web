import type { AxiosResponse } from "axios";
import type { ApiRequestOptions } from "./ApiRequestOptions";
import type { ApiResult } from "./ApiResult";

export class ApiError extends Error {
  public readonly url: string;

  public readonly ok: boolean;

  public readonly status: number;

  public readonly statusText: string;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public readonly body: any;

  public readonly response: AxiosResponse;

  public readonly request: ApiRequestOptions;

  constructor(request: ApiRequestOptions, response: ApiResult, message: string) {
    super(message);

    this.name = "ApiError";
    this.ok = response.ok;
    this.url = response.url;
    this.status = response.status;
    this.statusText = response.statusText;
    this.body = response.body;
    this.response = response.response;
    this.request = request;
  }
}
