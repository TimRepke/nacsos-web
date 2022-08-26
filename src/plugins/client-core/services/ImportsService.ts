/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ImportModel } from '../models/ImportModel';

import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class ImportsService {

  constructor(public readonly httpRequest: BaseHttpRequest) {}

  /**
   * Get All Imports For Project
   * @returns ImportModel Successful Response
   * @throws ApiError
   */
  public getAllImportsForProjectApiImportsListGet({
    xProjectId,
  }: {
    xProjectId: string,
  }): CancelablePromise<Array<ImportModel>> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/api/imports/list',
      headers: {
        'x-project-id': xProjectId,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Get Import Details
   * @returns ImportModel Successful Response
   * @throws ApiError
   */
  public getImportDetailsApiImportsImportImportIdGet({
    importId,
    xProjectId,
  }: {
    importId: string,
    xProjectId: string,
  }): CancelablePromise<ImportModel> {
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
  }): CancelablePromise<string> {
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
  }): CancelablePromise<number> {
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
    requestBody: ImportModel,
  }): CancelablePromise<string> {
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
    });
  }

}
