import type { CancelablePromise } from './CancelablePromise';
import { request as __request } from './request';
import type { ApiRequestOptions } from './ApiRequestOptions';
import type { OpenAPIConfig } from './OpenAPI';

// eslint-disable-next-line import/prefer-default-export
export class BaseHttpRequest {
  constructor(public readonly config: OpenAPIConfig) {}

  /**
   * Request method
   * @param options The request options from the service
   * @returns CancelablePromise<T>
   * @throws ApiError
   */
  public request<T>(options: ApiRequestOptions): CancelablePromise<T> {
    return __request(this.config, options);
  }
}
