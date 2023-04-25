/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AuthTokenModel } from '../models/AuthTokenModel';
import type { Body_login_for_access_token_api_login_token_post } from '../models/Body_login_for_access_token_api_login_token_post';
import type { UserModel } from '../models/UserModel';

import type { CancelablePromise } from '@/plugins/api/core/CancelablePromise';
import type { BaseHttpRequest } from '@/plugins/api/core/BaseHttpRequest';

import type { ApiRequestOptions } from '@/plugins/api/core/ApiRequestOptions';

export class OauthService {

  constructor(public readonly httpRequest: BaseHttpRequest) {}

  /**
   * Login For Access Token
   * @returns AuthTokenModel Successful Response
   * @throws ApiError
   */
  public loginForAccessTokenApiLoginTokenPost({
    formData,
  }: {
    formData: Body_login_for_access_token_api_login_token_post,
  }, options?: Partial<ApiRequestOptions>): CancelablePromise<AuthTokenModel> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/api/login/token',
      formData: formData,
      mediaType: 'application/x-www-form-urlencoded',
      errors: {
        422: `Validation Error`,
      },
      ...options,
    });
  }

  /**
   * Refresh Token
   * @returns AuthTokenModel Successful Response
   * @throws ApiError
   */
  public refreshTokenApiLoginTokenRefreshTokenIdPut({
    tokenId,
  }: {
    tokenId: string,
  }, options?: Partial<ApiRequestOptions>): CancelablePromise<AuthTokenModel> {
    return this.httpRequest.request({
      method: 'PUT',
      url: '/api/login/token/refresh/{token_id}',
      path: {
        'token_id': tokenId,
      },
      errors: {
        422: `Validation Error`,
      },
      ...options,
    });
  }

  /**
   * Read Tokens Me
   * @returns AuthTokenModel Successful Response
   * @throws ApiError
   */
  public readTokensMeApiLoginMyTokensGet(options?: Partial<ApiRequestOptions>): CancelablePromise<Array<AuthTokenModel>> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/api/login/my-tokens',
      ...options,
    });
  }

  /**
   * Read Users Me
   * @returns UserModel Successful Response
   * @throws ApiError
   */
  public readUsersMeApiLoginMeGet(options?: Partial<ApiRequestOptions>): CancelablePromise<UserModel> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/api/login/me',
      ...options,
    });
  }

  /**
   * Logout
   * @returns any Successful Response
   * @throws ApiError
   */
  public logoutApiLoginLogoutGet(options?: Partial<ApiRequestOptions>): CancelablePromise<any> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/api/login/logout',
      ...options,
    });
  }

}
