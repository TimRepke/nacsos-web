/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { UserModel } from '../models/UserModel';

import type { CancelablePromise } from '@/plugins/api/core/CancelablePromise';
import type { BaseHttpRequest } from '@/plugins/api/core/BaseHttpRequest';

import { ApiRequestOptions } from '@/plugins/api/core/ApiRequestOptions';

export class UsersService {

  constructor(public readonly httpRequest: BaseHttpRequest) {}

  /**
   * Get All Users
   * @returns UserModel Successful Response
   * @throws ApiError
   */
  public getAllUsersApiUsersListAllGet({
    xProjectId,
  }: {
    xProjectId: string,
  }, options?: Partial<ApiRequestOptions>): CancelablePromise<Array<UserModel>> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/api/users/list/all',
      headers: {
        'x-project-id': xProjectId,
      },
      errors: {
        422: `Validation Error`,
      },
      ...options,
    });
  }

  /**
   * Get Project Users
   * @returns UserModel Successful Response
   * @throws ApiError
   */
  public getProjectUsersApiUsersListProjectProjectIdGet({
    projectId,
    xProjectId,
  }: {
    projectId: string,
    xProjectId: string,
  }, options?: Partial<ApiRequestOptions>): CancelablePromise<Array<UserModel>> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/api/users/list/project/{project_id}',
      path: {
        'project_id': projectId,
      },
      headers: {
        'x-project-id': xProjectId,
      },
      errors: {
        422: `Validation Error`,
      },
      ...options,
    });
  }

  /**
   * Get User By Id
   * @returns UserModel Successful Response
   * @throws ApiError
   */
  public getUserByIdApiUsersDetailsUserIdGet({
    userId,
    xProjectId,
  }: {
    userId: string,
    xProjectId: string,
  }, options?: Partial<ApiRequestOptions>): CancelablePromise<UserModel> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/api/users/details/{user_id}',
      path: {
        'user_id': userId,
      },
      headers: {
        'x-project-id': xProjectId,
      },
      errors: {
        422: `Validation Error`,
      },
      ...options,
    });
  }

  /**
   * Get Users By Ids
   * @returns UserModel Successful Response
   * @throws ApiError
   */
  public getUsersByIdsApiUsersDetailsGet({
    userId,
    xProjectId,
  }: {
    userId: Array<string>,
    xProjectId: string,
  }, options?: Partial<ApiRequestOptions>): CancelablePromise<Array<UserModel>> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/api/users/details',
      headers: {
        'x-project-id': xProjectId,
      },
      query: {
        'user_id': userId,
      },
      errors: {
        422: `Validation Error`,
      },
      ...options,
    });
  }

}