/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ExportRequest } from '../models/ExportRequest';
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
  }: {
    xProjectId: string,
    requestBody: ExportRequest,
  }, options?: Partial<ApiRequestOptions>): CancelablePromise<string> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/api/export/annotations/csv',
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
