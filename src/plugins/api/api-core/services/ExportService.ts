/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { LabelOptions } from '../models/LabelOptions';
import type { ProjectBaseInfo } from '../models/ProjectBaseInfo';

import type { CancelablePromise } from '@/plugins/api/core/CancelablePromise';
import type { BaseHttpRequest } from '@/plugins/api/core/BaseHttpRequest';

import type { ApiRequestOptions } from '@/plugins/api/core/ApiRequestOptions';

export class ExportService {

  constructor(public readonly httpRequest: BaseHttpRequest) {}

  /**
   * Get Annotations Csv
   * @returns string Successful Response
   * @throws ApiError
   */
  public getAnnotationsCsvApiExportAnnotationsCsvPost({
    xProjectId,
    requestBody,
    botAnnotationMetadataIds,
    assignmentScopeIds,
    userIds,
    ignoreHierarchy = true,
    ignoreOrder = true,
    itemFields,
  }: {
    xProjectId: string,
    requestBody: Array<LabelOptions>,
    botAnnotationMetadataIds?: (Array<string> | null),
    assignmentScopeIds?: (Array<string> | null),
    userIds?: (Array<string> | null),
    ignoreHierarchy?: boolean,
    ignoreOrder?: boolean,
    itemFields?: (Array<string> | null),
  }, options?: Partial<ApiRequestOptions>): CancelablePromise<string> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/api/export/annotations/csv',
      headers: {
        'x-project-id': xProjectId,
      },
      query: {
        'bot_annotation_metadata_ids': botAnnotationMetadataIds,
        'assignment_scope_ids': assignmentScopeIds,
        'user_ids': userIds,
        'ignore_hierarchy': ignoreHierarchy,
        'ignore_order': ignoreOrder,
        'item_fields': itemFields,
      },
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        422: `Validation Error`,
      },
      ...options,
    });
  }

  /**
   * Get Export Baseinfo
   * @returns ProjectBaseInfo Successful Response
   * @throws ApiError
   */
  public getExportBaseinfoApiExportProjectBaseinfoGet({
    xProjectId,
  }: {
    xProjectId: string,
  }, options?: Partial<ApiRequestOptions>): CancelablePromise<ProjectBaseInfo> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/api/export/project/baseinfo',
      headers: {
        'x-project-id': xProjectId,
      },
      errors: {
        422: `Validation Error`,
      },
      ...options,
    });
  }

}
