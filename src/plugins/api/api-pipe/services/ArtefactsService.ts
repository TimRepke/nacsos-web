/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Body_upload_file_api_artefacts_files_upload_post } from '../models/Body_upload_file_api_artefacts_files_upload_post';
import type { Body_upload_files_api_artefacts_files_upload_many_post } from '../models/Body_upload_files_api_artefacts_files_upload_many_post';
import type { DeletionRequest } from '../models/DeletionRequest';
import type { FileOnDisk } from '../models/FileOnDisk';

import type { CancelablePromise } from '@/plugins/api/core/CancelablePromise';
import type { BaseHttpRequest } from '@/plugins/api/core/BaseHttpRequest';

import type { ApiRequestOptions } from '@/plugins/api/core/ApiRequestOptions';

export class ArtefactsService {

  constructor(public readonly httpRequest: BaseHttpRequest) {}

  /**
   * Get Artefacts
   * @returns FileOnDisk Successful Response
   * @throws ApiError
   */
  public getArtefactsApiArtefactsListGet({
    xTaskId,
    xProjectId,
  }: {
    xTaskId: string,
    xProjectId: string,
  }, options?: Partial<ApiRequestOptions>): CancelablePromise<Array<FileOnDisk>> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/api/artefacts/list',
      headers: {
        'x-task-id': xTaskId,
        'x-project-id': xProjectId,
      },
      errors: {
        422: `Validation Error`,
      },
      ...options,
    });
  }

  /**
   * Get Task Log
   * @returns string Successful Response
   * @throws ApiError
   */
  public getTaskLogApiArtefactsLogGet({
    xTaskId,
    xProjectId,
  }: {
    xTaskId: string,
    xProjectId: string,
  }, options?: Partial<ApiRequestOptions>): CancelablePromise<string> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/api/artefacts/log',
      headers: {
        'x-task-id': xTaskId,
        'x-project-id': xProjectId,
      },
      errors: {
        422: `Validation Error`,
      },
      ...options,
    });
  }

  /**
   * Get File
   * @returns any Successful Response
   * @throws ApiError
   */
  public getFileApiArtefactsFileGet({
    filename,
    xTaskId,
    xProjectId,
  }: {
    filename: string,
    xTaskId: string,
    xProjectId: string,
  }, options?: Partial<ApiRequestOptions>): CancelablePromise<any> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/api/artefacts/file',
      headers: {
        'x-task-id': xTaskId,
        'x-project-id': xProjectId,
      },
      query: {
        'filename': filename,
      },
      errors: {
        422: `Validation Error`,
      },
      ...options,
    });
  }

  /**
   * Get Archive
   * @returns any Successful Response
   * @throws ApiError
   */
  public getArchiveApiArtefactsFilesGet({
    xTaskId,
    xProjectId,
  }: {
    xTaskId: string,
    xProjectId: string,
  }, options?: Partial<ApiRequestOptions>): CancelablePromise<any> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/api/artefacts/files',
      headers: {
        'x-task-id': xTaskId,
        'x-project-id': xProjectId,
      },
      errors: {
        422: `Validation Error`,
      },
      ...options,
    });
  }

  /**
   * Delete Files
   * @returns any Successful Response
   * @throws ApiError
   */
  public deleteFilesApiArtefactsFilesDelete({
    xTaskId,
    xProjectId,
    requestBody,
  }: {
    xTaskId: string,
    xProjectId: string,
    requestBody: DeletionRequest,
  }, options?: Partial<ApiRequestOptions>): CancelablePromise<any> {
    return this.httpRequest.request({
      method: 'DELETE',
      url: '/api/artefacts/files',
      headers: {
        'x-task-id': xTaskId,
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
   * Upload File
   * @returns string Successful Response
   * @throws ApiError
   */
  public uploadFileApiArtefactsFilesUploadPost({
    xProjectId,
    formData,
    folder,
  }: {
    xProjectId: string,
    formData: Body_upload_file_api_artefacts_files_upload_post,
    folder?: (string | null),
  }, options?: Partial<ApiRequestOptions>): CancelablePromise<string> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/api/artefacts/files/upload',
      headers: {
        'x-project-id': xProjectId,
      },
      query: {
        'folder': folder,
      },
      formData: formData,
      mediaType: 'multipart/form-data',
      errors: {
        422: `Validation Error`,
      },
      ...options,
    });
  }

  /**
   * Upload Files
   * @returns string Successful Response
   * @throws ApiError
   */
  public uploadFilesApiArtefactsFilesUploadManyPost({
    xProjectId,
    formData,
    folder,
  }: {
    xProjectId: string,
    formData: Body_upload_files_api_artefacts_files_upload_many_post,
    folder?: (string | null),
  }, options?: Partial<ApiRequestOptions>): CancelablePromise<Array<string>> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/api/artefacts/files/upload-many',
      headers: {
        'x-project-id': xProjectId,
      },
      query: {
        'folder': folder,
      },
      formData: formData,
      mediaType: 'multipart/form-data',
      errors: {
        422: `Validation Error`,
      },
      ...options,
    });
  }

  /**
   * Delete Task Files
   * @returns any Successful Response
   * @throws ApiError
   */
  public deleteTaskFilesApiArtefactsTaskDelete({
    xTaskId,
    xProjectId,
  }: {
    xTaskId: string,
    xProjectId: string,
  }, options?: Partial<ApiRequestOptions>): CancelablePromise<any> {
    return this.httpRequest.request({
      method: 'DELETE',
      url: '/api/artefacts/task',
      headers: {
        'x-task-id': xTaskId,
        'x-project-id': xProjectId,
      },
      errors: {
        422: `Validation Error`,
      },
      ...options,
    });
  }

}
