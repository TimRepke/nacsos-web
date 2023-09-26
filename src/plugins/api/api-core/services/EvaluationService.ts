/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AnnotationTrackerModel } from '../models/AnnotationTrackerModel';

import type { CancelablePromise } from '@/plugins/api/core/CancelablePromise';
import type { BaseHttpRequest } from '@/plugins/api/core/BaseHttpRequest';

import type { ApiRequestOptions } from '@/plugins/api/core/ApiRequestOptions';

export class EvaluationService {

  constructor(public readonly httpRequest: BaseHttpRequest) {}

  /**
   * Get Tracker
   * @returns AnnotationTrackerModel Successful Response
   * @throws ApiError
   */
  public getTrackerApiEvalTrackingTrackerTrackerIdGet({
    trackerId,
    xProjectId,
  }: {
    trackerId: string,
    xProjectId: string,
  }, options?: Partial<ApiRequestOptions>): CancelablePromise<AnnotationTrackerModel> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/api/eval/tracking/tracker/{tracker_id}',
      path: {
        'tracker_id': trackerId,
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
   * Save Tracker
   * @returns string Successful Response
   * @throws ApiError
   */
  public saveTrackerApiEvalTrackingTrackerPut({
    xProjectId,
    requestBody,
  }: {
    xProjectId: string,
    requestBody: AnnotationTrackerModel,
  }, options?: Partial<ApiRequestOptions>): CancelablePromise<string> {
    return this.httpRequest.request({
      method: 'PUT',
      url: '/api/eval/tracking/tracker',
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
   * Update Tracker
   * @returns AnnotationTrackerModel Successful Response
   * @throws ApiError
   */
  public updateTrackerApiEvalTrackingRefreshPost({
    trackerId,
    xProjectId,
    batchSize,
    reset = false,
  }: {
    trackerId: string,
    xProjectId: string,
    batchSize?: (number | null),
    reset?: boolean,
  }, options?: Partial<ApiRequestOptions>): CancelablePromise<AnnotationTrackerModel> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/api/eval/tracking/refresh',
      headers: {
        'x-project-id': xProjectId,
      },
      query: {
        'tracker_id': trackerId,
        'batch_size': batchSize,
        'reset': reset,
      },
      errors: {
        422: `Validation Error`,
      },
      ...options,
    });
  }

}
