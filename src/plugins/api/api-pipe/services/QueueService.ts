/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { SubmittedTask } from '../models/SubmittedTask';
import type { TaskModel } from '../models/TaskModel';
import type { TaskStatus } from '../models/TaskStatus';

import type { CancelablePromise } from '@/plugins/api/core/CancelablePromise';
import type { BaseHttpRequest } from '@/plugins/api/core/BaseHttpRequest';

import type { ApiRequestOptions } from '@/plugins/api/core/ApiRequestOptions';

export class QueueService {

  constructor(public readonly httpRequest: BaseHttpRequest) {}

  /**
   * Get All
   * @returns TaskModel Successful Response
   * @throws ApiError
   */
  public getAllApiQueueListGet(options?: Partial<ApiRequestOptions>): CancelablePromise<Array<TaskModel>> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/api/queue/list',
      ...options,
    });
  }

  /**
   * Get By Status
   * @returns TaskModel Successful Response
   * @throws ApiError
   */
  public getByStatusApiQueueListStatusGet({
    status,
  }: {
    status: TaskStatus,
  }, options?: Partial<ApiRequestOptions>): CancelablePromise<Array<TaskModel>> {
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
   * @returns TaskModel Successful Response
   * @throws ApiError
   */
  public getAllForProjectApiQueueProjectListGet({
    xProjectId,
  }: {
    xProjectId: string,
  }, options?: Partial<ApiRequestOptions>): CancelablePromise<Array<TaskModel>> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/api/queue/project/list',
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
   * Get By Status For Project
   * @returns TaskModel Successful Response
   * @throws ApiError
   */
  public getByStatusForProjectApiQueueProjectListStatusGet({
    status,
    xProjectId,
  }: {
    status: TaskStatus,
    xProjectId: string,
  }, options?: Partial<ApiRequestOptions>): CancelablePromise<Array<TaskModel>> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/api/queue/project/list/{status}',
      path: {
        'status': status,
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
   * Search Tasks
   * @returns TaskModel Successful Response
   * @throws ApiError
   */
  public searchTasksApiQueueSearchGet({
    xProjectId,
    functionName,
    fingerprint,
    userId,
    location,
    status,
    orderByFields,
  }: {
    xProjectId: string,
    functionName?: string,
    fingerprint?: string,
    userId?: string,
    location?: string,
    status?: string,
    orderByFields?: Array<string>,
  }, options?: Partial<ApiRequestOptions>): CancelablePromise<Array<TaskModel>> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/api/queue/search',
      headers: {
        'x-project-id': xProjectId,
      },
      query: {
        'function_name': functionName,
        'fingerprint': fingerprint,
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
   * @returns TaskStatus Successful Response
   * @throws ApiError
   */
  public getStatusApiQueueStatusTaskIdGet({
    taskId,
    xProjectId,
  }: {
    taskId: string,
    xProjectId: string,
  }, options?: Partial<ApiRequestOptions>): CancelablePromise<TaskStatus> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/api/queue/status/{task_id}',
      path: {
        'task_id': taskId,
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
   * Force Run
   * @returns any Successful Response
   * @throws ApiError
   */
  public forceRunApiQueueForceRunTaskIdPost({
    taskId,
    xProjectId,
  }: {
    taskId: string,
    xProjectId: string,
  }, options?: Partial<ApiRequestOptions>): CancelablePromise<any> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/api/queue/force-run/{task_id}',
      path: {
        'task_id': taskId,
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
   * Submit Bulk
   * @returns string Successful Response
   * @throws ApiError
   */
  public submitBulkApiQueueSubmitTasksPut({
    xProjectId,
    requestBody,
  }: {
    xProjectId: string,
    requestBody: Array<SubmittedTask>,
  }, options?: Partial<ApiRequestOptions>): CancelablePromise<Array<string>> {
    return this.httpRequest.request({
      method: 'PUT',
      url: '/api/queue/submit/tasks',
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
   * Submit Single
   * @returns string Successful Response
   * @throws ApiError
   */
  public submitSingleApiQueueSubmitTaskPut({
    xProjectId,
    requestBody,
  }: {
    xProjectId: string,
    requestBody: SubmittedTask,
  }, options?: Partial<ApiRequestOptions>): CancelablePromise<string> {
    return this.httpRequest.request({
      method: 'PUT',
      url: '/api/queue/submit/task',
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
   * Cancel Task
   * @returns any Successful Response
   * @throws ApiError
   */
  public cancelTaskApiQueueCancelTaskIdPut({
    taskId,
    xProjectId,
  }: {
    taskId: string,
    xProjectId: string,
  }, options?: Partial<ApiRequestOptions>): CancelablePromise<any> {
    return this.httpRequest.request({
      method: 'PUT',
      url: '/api/queue/cancel/{task_id}',
      path: {
        'task_id': taskId,
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
   * Delete Task
   * @returns any Successful Response
   * @throws ApiError
   */
  public deleteTaskApiQueueTaskTaskIdDelete({
    taskId,
    xProjectId,
  }: {
    taskId: string,
    xProjectId: string,
  }, options?: Partial<ApiRequestOptions>): CancelablePromise<any> {
    return this.httpRequest.request({
      method: 'DELETE',
      url: '/api/queue/task/{task_id}',
      path: {
        'task_id': taskId,
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
