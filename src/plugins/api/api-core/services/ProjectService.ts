/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ItemModel } from '../models/ItemModel';
import type { ProjectModel } from '../models/ProjectModel';
import type { ProjectPermissionsModel } from '../models/ProjectPermissionsModel';
import type { TwitterItemModel } from '../models/TwitterItemModel';

import type { CancelablePromise } from '@/plugins/api/core/CancelablePromise';
import type { BaseHttpRequest } from '@/plugins/api/core/BaseHttpRequest';

import type { ApiRequestOptions } from '@/plugins/api/core/ApiRequestOptions';

export class ProjectService {

  constructor(public readonly httpRequest: BaseHttpRequest) {}

  /**
   * Get Project
   * @returns ProjectModel Successful Response
   * @throws ApiError
   */
  public getProjectApiProjectProjectIdInfoGet({
    projectId,
    xProjectId,
  }: {
    projectId: string,
    xProjectId: string,
  }, options?: Partial<ApiRequestOptions>): CancelablePromise<ProjectModel> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/api/project/{project_id}/info/',
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
   * Get Project Permissions Current User
   * @returns ProjectPermissionsModel Successful Response
   * @throws ApiError
   */
  public getProjectPermissionsCurrentUserApiProjectProjectIdPermissionsMeGet({
    xProjectId,
  }: {
    xProjectId: string,
  }, options?: Partial<ApiRequestOptions>): CancelablePromise<ProjectPermissionsModel> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/api/project/{project_id}/permissions/me',
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
   * Get All Project Permissions
   * @returns ProjectPermissionsModel Successful Response
   * @throws ApiError
   */
  public getAllProjectPermissionsApiProjectProjectIdPermissionsListGet({
    projectId,
    xProjectId,
  }: {
    projectId: string,
    xProjectId: string,
  }, options?: Partial<ApiRequestOptions>): CancelablePromise<Array<ProjectPermissionsModel>> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/api/project/{project_id}/permissions/list',
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
   * Get Project Permissions By Id
   * @returns ProjectPermissionsModel Successful Response
   * @throws ApiError
   */
  public getProjectPermissionsByIdApiProjectProjectIdPermissionsProjectPermissionIdGet({
    projectPermissionId,
    xProjectId,
  }: {
    projectPermissionId: string,
    xProjectId: string,
  }, options?: Partial<ApiRequestOptions>): CancelablePromise<ProjectPermissionsModel> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/api/project/{project_id}/permissions/{project_permission_id}',
      path: {
        'project_permission_id': projectPermissionId,
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
   * List Project Data
   * @returns any Successful Response
   * @throws ApiError
   */
  public listProjectDataApiProjectProjectIdItemsItemTypeListGet({
    projectId,
    itemType,
    xProjectId,
  }: {
    projectId: string,
    itemType: 'basic' | 'twitter' | 'academic' | 'patents',
    xProjectId: string,
  }, options?: Partial<ApiRequestOptions>): CancelablePromise<Array<(ItemModel | TwitterItemModel)>> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/api/project/{project_id}/items/{item_type}/list',
      path: {
        'project_id': projectId,
        'item_type': itemType,
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
   * List Project Data Paged
   * @returns any Successful Response
   * @throws ApiError
   */
  public listProjectDataPagedApiProjectProjectIdItemsItemTypeListPagePageSizeGet({
    projectId,
    itemType,
    page,
    pageSize,
    xProjectId,
  }: {
    projectId: string,
    itemType: 'basic' | 'twitter' | 'academic' | 'patents',
    page: number,
    pageSize: number,
    xProjectId: string,
  }, options?: Partial<ApiRequestOptions>): CancelablePromise<Array<(ItemModel | TwitterItemModel)>> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/api/project/{project_id}/items/{item_type}/list/{page}/{page_size}',
      path: {
        'project_id': projectId,
        'item_type': itemType,
        'page': page,
        'page_size': pageSize,
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
   * Get Detail For Item
   * @returns any Successful Response
   * @throws ApiError
   */
  public getDetailForItemApiProjectProjectIdItemsItemTypeDetailItemIdGet({
    itemId,
    itemType,
    xProjectId,
  }: {
    itemId: string,
    itemType: 'basic' | 'twitter' | 'academic' | 'patents',
    xProjectId: string,
  }, options?: Partial<ApiRequestOptions>): CancelablePromise<(ItemModel | TwitterItemModel)> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/api/project/{project_id}/items/{item_type}/detail/{item_id}',
      path: {
        'item_id': itemId,
        'item_type': itemType,
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
   * Count Project Items
   * @returns number Successful Response
   * @throws ApiError
   */
  public countProjectItemsApiProjectProjectIdItemsCountGet({
    projectId,
    xProjectId,
  }: {
    projectId: string,
    xProjectId: string,
  }, options?: Partial<ApiRequestOptions>): CancelablePromise<number> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/api/project/{project_id}/items/count',
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
   * Add Tweet
   * @returns any Successful Response
   * @throws ApiError
   */
  public addTweetApiProjectProjectIdItemsTwitterAddPost({
    projectId,
    xProjectId,
    requestBody,
  }: {
    projectId: string,
    xProjectId: string,
    requestBody: TwitterItemModel,
  }, options?: Partial<ApiRequestOptions>): CancelablePromise<any> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/api/project/{project_id}/items/twitter/add',
      path: {
        'project_id': projectId,
      },
      headers: {
        'x-project-id': xProjectId,
      },
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        422: `Validation Error`,
      },
      ...options,
    });
  }

}
