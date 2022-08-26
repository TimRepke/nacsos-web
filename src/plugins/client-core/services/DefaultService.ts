/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class DefaultService {

  constructor(public readonly httpRequest: BaseHttpRequest) {}

  /**
   *  Pong
   * @returns string Successful Response
   * @throws ApiError
   */
  public pongApiPingGet(): CancelablePromise<string> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/api/ping/',
    });
  }

  /**
   *  Err
   * @returns string Successful Response
   * @throws ApiError
   */
  public errApiPingErrorGet(): CancelablePromise<string> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/api/ping/error',
    });
  }

  /**
   *  Warn
   * @returns string Successful Response
   * @throws ApiError
   */
  public warnApiPingWarnGet(): CancelablePromise<string> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/api/ping/warn',
    });
  }

  /**
   * Perm
   * @returns any Successful Response
   * @throws ApiError
   */
  public permApiPingPermissionGet(): CancelablePromise<any> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/api/ping/permission',
    });
  }

  /**
   *  Ping
   * @returns string Successful Response
   * @throws ApiError
   */
  public pingApiPingNamePost({
    name,
  }: {
    name: string,
  }): CancelablePromise<string> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/api/ping/{name}',
      path: {
        'name': name,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }

}
