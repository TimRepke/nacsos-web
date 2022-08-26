/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Body_upload_file_api_artefacts_files_upload_post } from '../models/Body_upload_file_api_artefacts_files_upload_post';
import type { Body_upload_files_api_artefacts_files_upload_many_post } from '../models/Body_upload_files_api_artefacts_files_upload_many_post';
import type { DeletionRequest } from '../models/DeletionRequest';
import type { FileOnDisk } from '../models/FileOnDisk';

import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

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
  }): CancelablePromise<Array<FileOnDisk>> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/api/artefacts/list/{task_id}',
      path: {
        'task_id': taskId,
      },
      errors: {
        422: `Validation Error`,
      },
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
  }): CancelablePromise<string> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/api/artefacts/log/{task_id}',
      path: {
        'task_id': taskId,
      },
      errors: {
        422: `Validation Error`,
      },
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
  }): CancelablePromise<any> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/api/artefacts/file',
      query: {
        'filename': filename,
      },
      errors: {
        422: `Validation Error`,
      },
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
  }): CancelablePromise<any> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/api/artefacts/files/{task_id}',
      path: {
        'task_id': taskId,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Upload File
   * @returns any Successful Response
   * @throws ApiError
   */
  public uploadFileApiArtefactsFilesUploadPost({
    formData,
    folder,
  }: {
    formData: Body_upload_file_api_artefacts_files_upload_post,
    folder?: string,
  }): CancelablePromise<any> {
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
    });
  }

  /**
   * Upload Files
   * @returns any Successful Response
   * @throws ApiError
   */
  public uploadFilesApiArtefactsFilesUploadManyPost({
    formData,
    folder,
  }: {
    formData: Body_upload_files_api_artefacts_files_upload_many_post,
    folder?: string,
  }): CancelablePromise<any> {
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
  }): CancelablePromise<any> {
    return this.httpRequest.request({
      method: 'DELETE',
      url: '/api/artefacts/files',
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        422: `Validation Error`,
      },
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
  }): CancelablePromise<any> {
    return this.httpRequest.request({
      method: 'DELETE',
      url: '/api/artefacts/task/{task_id}',
      path: {
        'task_id': taskId,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }

}
