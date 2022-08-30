/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Body_login_for_access_token_api_login_token_post } from '../models/Body_login_for_access_token_api_login_token_post';
import type { Token } from '../models/Token';
import type { UserModel } from '../models/UserModel';

import type { CancelablePromise } from '@/plugins/api/core/CancelablePromise';
import type { BaseHttpRequest } from '@/plugins/api/core/BaseHttpRequest';

import { ApiRequestOptions } from '@/plugins/api/core/ApiRequestOptions';

export class OauthService {

  constructor(public readonly httpRequest: BaseHttpRequest) {}

  /**
   * Login For Access Token
   * @returns Token Successful Response
   * @throws ApiError
   */
  public loginForAccessTokenApiLoginTokenPost({
    formData,
  }: {
    formData: Body_login_for_access_token_api_login_token_post,
  }, options?: Partial<ApiRequestOptions>): CancelablePromise<Token> {
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

}
