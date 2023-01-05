/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { SubmittedTask } from '../models/SubmittedTask';
import type { TaskInDB } from '../models/TaskInDB';

import type { CancelablePromise } from '@/plugins/api/core/CancelablePromise';
import type { BaseHttpRequest } from '@/plugins/api/core/BaseHttpRequest';

import type { ApiRequestOptions } from '@/plugins/api/core/ApiRequestOptions';

export class QueueService {

  constructor(public readonly httpRequest: BaseHttpRequest) {}

  /**
   * Get All
   * @returns TaskInDB Successful Response
   * @throws ApiError
   */
  public getAllApiQueueListGet(options?: Partial<ApiRequestOptions>): CancelablePromise<Array<TaskInDB>> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/api/queue/list',
      ...options,
    });
  }

  /**
   * Get By Status
   * @returns TaskInDB Successful Response
   * @throws ApiError
   */
  public getByStatusApiQueueListStatusGet({
    status,
  }: {
    status: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED' | 'CANCELLED',
  }, options?: Partial<ApiRequestOptions>): CancelablePromise<Array<TaskInDB>> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/api/queue/list/{status}',
      path: {
        'status': status,
      },
      errors: {
        422: `Validation Error`,
      },
      ...options,
    });
  }

  /**
   * Get All For Project
   * @returns TaskInDB Successful Response
   * @throws ApiError
   */
  public getAllForProjectApiQueueProjectProjectIdListGet({
    projectId,
  }: {
    projectId: string,
  }, options?: Partial<ApiRequestOptions>): CancelablePromise<Array<TaskInDB>> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/api/queue/project/{project_id}/list',
      path: {
        'project_id': projectId,
      },
      errors: {
        422: `Validation Error`,
      },
      ...options,
    });
  }

  /**
   * Get By Status For Project
   * @returns TaskInDB Successful Response
   * @throws ApiError
   */
  public getByStatusForProjectApiQueueProjectProjectIdListStatusGet({
    projectId,
    status,
  }: {
    projectId: string,
    status: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED' | 'CANCELLED',
  }, options?: Partial<ApiRequestOptions>): CancelablePromise<Array<TaskInDB>> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/api/queue/project/{project_id}/list/{status}',
      path: {
        'project_id': projectId,
        'status': status,
      },
      errors: {
        422: `Validation Error`,
      },
      ...options,
    });
  }

  /**
   * Search Tasks
   * @returns TaskInDB Successful Response
   * @throws ApiError
   */
  public searchTasksApiQueueSearchGet({
    functionName,
    fingerprint,
    projectId,
    userId,
    location,
    status,
    orderByFields,
  }: {
    functionName?: string,
    fingerprint?: string,
    projectId?: string,
    userId?: string,
    location?: string,
    status?: string,
    orderByFields?: Array<string>,
  }, options?: Partial<ApiRequestOptions>): CancelablePromise<Array<TaskInDB>> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/api/queue/search',
      query: {
        'function_name': functionName,
        'fingerprint': fingerprint,
        'project_id': projectId,
        'user_id': userId,
        'location': location,
        'status': status,
        'order_by_fields': orderByFields,
      },
      errors: {
        422: `Validation Error`,
      },
      ...options,
    });
  }

  /**
   * Get Status
   * @returns string Successful Response
   * @throws ApiError
   */
  public getStatusApiQueueStatusTaskIdGet({
    taskId,
  }: {
    taskId: string,
  }, options?: Partial<ApiRequestOptions>): CancelablePromise<'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED' | 'CANCELLED'> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/api/queue/status/{task_id}',
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
   * Force Run
   * @returns any Successful Response
   * @throws ApiError
   */
  public forceRunApiQueueForceRunTaskIdPost({
    taskId,
  }: {
    taskId: string,
  }, options?: Partial<ApiRequestOptions>): CancelablePromise<any> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/api/queue/force-run/{task_id}',
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
   * Submit Bulk
   * @returns string Successful Response
   * @throws ApiError
   */
  public submitBulkApiQueueSubmitTasksPut({
    requestBody,
  }: {
    requestBody: Array<SubmittedTask>,
  }, options?: Partial<ApiRequestOptions>): CancelablePromise<Array<string>> {
    return this.httpRequest.request({
      method: 'PUT',
      url: '/api/queue/submit/tasks',
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        422: `Validation Error`,
      },
      ...options,
    });
  }

  /**
   * Submit Single
   * @returns string Successful Response
   * @throws ApiError
   */
  public submitSingleApiQueueSubmitTaskPut({
    requestBody,
  }: {
    requestBody: SubmittedTask,
  }, options?: Partial<ApiRequestOptions>): CancelablePromise<string> {
    return this.httpRequest.request({
      method: 'PUT',
      url: '/api/queue/submit/task',
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        422: `Validation Error`,
      },
      ...options,
    });
  }

  /**
   * Cancel Task
   * @returns any Successful Response
   * @throws ApiError
   */
  public cancelTaskApiQueueCancelTaskIdPut({
    taskId,
  }: {
    taskId: string,
  }, options?: Partial<ApiRequestOptions>): CancelablePromise<any> {
    return this.httpRequest.request({
      method: 'PUT',
      url: '/api/queue/cancel/{task_id}',
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
   * Delete Task
   * @returns any Successful Response
   * @throws ApiError
   */
  public deleteTaskApiQueueTaskTaskIdDelete({
    taskId,
  }: {
    taskId: string,
  }, options?: Partial<ApiRequestOptions>): CancelablePromise<any> {
    return this.httpRequest.request({
      method: 'DELETE',
      url: '/api/queue/task/{task_id}',
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
