/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ImportModelInput } from '../models/ImportModelInput';
import type { ImportModelOutput } from '../models/ImportModelOutput';

import type { CancelablePromise } from '@/plugins/api/core/CancelablePromise';
import type { BaseHttpRequest } from '@/plugins/api/core/BaseHttpRequest';

import type { ApiRequestOptions } from '@/plugins/api/core/ApiRequestOptions';

export class ImportsService {

  constructor(public readonly httpRequest: BaseHttpRequest) {}

  /**
   * Get All Imports For Project
   * @returns ImportModelOutput Successful Response
   * @throws ApiError
   */
  public getAllImportsForProjectApiImportsListGet({
    xProjectId,
  }: {
    xProjectId: string,
  }, options?: Partial<ApiRequestOptions>): CancelablePromise<Array<ImportModelOutput>> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/api/imports/list',
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
   * Get Import Details
   * @returns ImportModelOutput Successful Response
   * @throws ApiError
   */
  public getImportDetailsApiImportsImportImportIdGet({
    importId,
    xProjectId,
  }: {
    importId: string,
    xProjectId: string,
  }, options?: Partial<ApiRequestOptions>): CancelablePromise<ImportModelOutput> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/api/imports/import/{import_id}',
      path: {
        'import_id': importId,
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
   * Trigger Import
   * @returns string Successful Response
   * @throws ApiError
   */
  public triggerImportApiImportsImportImportIdPost({
    importId,
    xProjectId,
  }: {
    importId: string,
    xProjectId: string,
  }, options?: Partial<ApiRequestOptions>): CancelablePromise<string> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/api/imports/import/{import_id}',
      path: {
        'import_id': importId,
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
   * Get Import Counts
   * @returns number Successful Response
   * @throws ApiError
   */
  public getImportCountsApiImportsImportImportIdCountGet({
    importId,
    xProjectId,
  }: {
    importId: string,
    xProjectId: string,
  }, options?: Partial<ApiRequestOptions>): CancelablePromise<number> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/api/imports/import/{import_id}/count/',
      path: {
        'import_id': importId,
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
   * Put Import Details
   * @returns string Successful Response
   * @throws ApiError
   */
  public putImportDetailsApiImportsImportPut({
    xProjectId,
    requestBody,
  }: {
    xProjectId: string,
    requestBody: ImportModelInput,
  }, options?: Partial<ApiRequestOptions>): CancelablePromise<string> {
    return this.httpRequest.request({
      method: 'PUT',
      url: '/api/imports/import',
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
   * Delete Import Details
   * @returns string Successful Response
   * @throws ApiError
   */
  public deleteImportDetailsApiImportsImportDeleteImportIdDelete({
    importId,
    xProjectId,
  }: {
    importId: string,
    xProjectId: string,
  }, options?: Partial<ApiRequestOptions>): CancelablePromise<string> {
    return this.httpRequest.request({
      method: 'DELETE',
      url: '/api/imports/import/delete/{import_id}',
      path: {
        'import_id': importId,
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

}
