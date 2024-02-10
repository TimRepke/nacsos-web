/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AnnotationQualityModel } from '../models/AnnotationQualityModel';
import type { AnnotationTrackerModel } from '../models/AnnotationTrackerModel';
import type { BotAnnotationMetaDataBaseModel } from '../models/BotAnnotationMetaDataBaseModel';
import type { DehydratedAnnotationTracker } from '../models/DehydratedAnnotationTracker';
import type { LabelScope } from '../models/LabelScope';

import type { CancelablePromise } from '@/plugins/api/core/CancelablePromise';
import type { BaseHttpRequest } from '@/plugins/api/core/BaseHttpRequest';

import type { ApiRequestOptions } from '@/plugins/api/core/ApiRequestOptions';

export class EvaluationService {

  constructor(public readonly httpRequest: BaseHttpRequest) {}

  /**
   * Get Project Scopes
   * @returns LabelScope Successful Response
   * @throws ApiError
   */
  public getProjectScopesApiEvalTrackingScopesGet({
    xProjectId,
  }: {
    xProjectId: string,
  }, options?: Partial<ApiRequestOptions>): CancelablePromise<Array<LabelScope>> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/api/eval/tracking/scopes',
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
   * Get Resolutions For Scope
   * @returns BotAnnotationMetaDataBaseModel Successful Response
   * @throws ApiError
   */
  public getResolutionsForScopeApiEvalResolutionsGet({
    assignmentScopeId,
    xProjectId,
  }: {
    assignmentScopeId: string,
    xProjectId: string,
  }, options?: Partial<ApiRequestOptions>): CancelablePromise<Array<BotAnnotationMetaDataBaseModel>> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/api/eval/resolutions',
      headers: {
        'x-project-id': xProjectId,
      },
      query: {
        'assignment_scope_id': assignmentScopeId,
      },
      errors: {
        422: `Validation Error`,
      },
      ...options,
    });
  }

  /**
   * Get Project Trackers
   * @returns DehydratedAnnotationTracker Successful Response
   * @throws ApiError
   */
  public getProjectTrackersApiEvalTrackingTrackersGet({
    xProjectId,
  }: {
    xProjectId: string,
  }, options?: Partial<ApiRequestOptions>): CancelablePromise<Array<DehydratedAnnotationTracker>> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/api/eval/tracking/trackers',
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

  /**
   * Get Irr
   * @returns AnnotationQualityModel Successful Response
   * @throws ApiError
   */
  public getIrrApiEvalQualityLoadAssignmentScopeIdGet({
    assignmentScopeId,
    xProjectId,
  }: {
    assignmentScopeId: string,
    xProjectId: string,
  }, options?: Partial<ApiRequestOptions>): CancelablePromise<Array<AnnotationQualityModel>> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/api/eval/quality/load/{assignment_scope_id}',
      path: {
        'assignment_scope_id': assignmentScopeId,
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
   * Recompute Irr
   * @returns AnnotationQualityModel Successful Response
   * @throws ApiError
   */
  public recomputeIrrApiEvalQualityComputeGet({
    assignmentScopeId,
    xProjectId,
    botAnnotationMetadataId,
  }: {
    assignmentScopeId: string,
    xProjectId: string,
    botAnnotationMetadataId?: (string | null),
  }, options?: Partial<ApiRequestOptions>): CancelablePromise<Array<AnnotationQualityModel>> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/api/eval/quality/compute',
      headers: {
        'x-project-id': xProjectId,
      },
      query: {
        'assignment_scope_id': assignmentScopeId,
        'bot_annotation_metadata_id': botAnnotationMetadataId,
      },
      errors: {
        422: `Validation Error`,
      },
      ...options,
    });
  }

}
