/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Body_upload_file_api_artefacts_files_upload_post } from '../models/Body_upload_file_api_artefacts_files_upload_post';
import type { Body_upload_files_api_artefacts_files_upload_many_post } from '../models/Body_upload_files_api_artefacts_files_upload_many_post';
import type { DeletionRequest } from '../models/DeletionRequest';
import type { FileOnDisk } from '../models/FileOnDisk';

import type { CancelablePromise } from '@/plugins/api/core/CancelablePromise';
import type { BaseHttpRequest } from '@/plugins/api/core/BaseHttpRequest';

import { ApiRequestOptions } from '@/plugins/api/core/ApiRequestOptions';

export class ArtefactsService {

  constructor(public readonly httpRequest: BaseHttpRequest) {}

  /**
   * Get Artefacts
   * @returns FileOnDisk Successful Response
   * @throws ApiError
   */
  public getArtefactsApiArtefactsListTaskIdGet({
    taskId,
  }: {
    taskId: string,
  }, options?: Partial<ApiRequestOptions>): CancelablePromise<Array<FileOnDisk>> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/api/artefacts/list/{task_id}',
      path: {
        'task_id': taskId,
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
  public getTaskLogApiArtefactsLogTaskIdGet({
    taskId,
  }: {
    taskId: string,
  }, options?: Partial<ApiRequestOptions>): CancelablePromise<string> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/api/artefacts/log/{task_id}',
      path: {
        'task_id': taskId,
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
  }: {
    filename: string,
  }, options?: Partial<ApiRequestOptions>): CancelablePromise<any> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/api/artefacts/file',
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
  public getArchiveApiArtefactsFilesTaskIdGet({
    taskId,
  }: {
    taskId: string,
  }, options?: Partial<ApiRequestOptions>): CancelablePromise<any> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/api/artefacts/files/{task_id}',
      path: {
        'task_id': taskId,
      },
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
    formData,
    folder,
  }: {
    formData: Body_upload_file_api_artefacts_files_upload_post,
    folder?: string,
  }, options?: Partial<ApiRequestOptions>): CancelablePromise<string> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/api/artefacts/files/upload',
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
    formData,
    folder,
  }: {
    formData: Body_upload_files_api_artefacts_files_upload_many_post,
    folder?: string,
  }, options?: Partial<ApiRequestOptions>): CancelablePromise<Array<string>> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/api/artefacts/files/upload-many',
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
   * Delete Files
   * @returns any Successful Response
   * @throws ApiError
   */
  public deleteFilesApiArtefactsFilesDelete({
    requestBody,
  }: {
    requestBody: DeletionRequest,
  }, options?: Partial<ApiRequestOptions>): CancelablePromise<any> {
    return this.httpRequest.request({
      method: 'DELETE',
      url: '/api/artefacts/files',
      body: requestBody,
      mediaType: 'application/json',
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
  public deleteTaskFilesApiArtefactsTaskTaskIdDelete({
    taskId,
  }: {
    taskId: string,
  }, options?: Partial<ApiRequestOptions>): CancelablePromise<any> {
    return this.httpRequest.request({
      method: 'DELETE',
      url: '/api/artefacts/task/{task_id}',
      path: {
        'task_id': taskId,
      },
      errors: {
        422: `Validation Error`,
      },
      ...options,
    });
  }

}
