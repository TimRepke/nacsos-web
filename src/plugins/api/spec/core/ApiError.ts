import type { ApiRequestOptions } from "./ApiRequestOptions";
import type { ApiResultIntern } from "./ApiResult";
import type { AxiosResponse } from "axios";

export class ApiError extends Error {
  public readonly url: string;
  public readonly status: number;
  public readonly statusText: string;
  public readonly body: any;
  public readonly request: ApiRequestOptions;
  public readonly response: AxiosResponse;

  constructor(request: ApiRequestOptions, response: ApiResultIntern, message: string) {
    super(message);

    this.name = "ApiError";
    this.url = response.url;
    this.status = response.status;
    this.statusText = response.statusText;
    this.statusText = response.statusText;
    this.body = response.body;
    this.request = request;
    this.response = response.response;
  }
}
