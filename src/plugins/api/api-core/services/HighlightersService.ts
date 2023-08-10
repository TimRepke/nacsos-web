/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { HighlighterModelInput } from '../models/HighlighterModelInput';
import type { HighlighterModelOutput } from '../models/HighlighterModelOutput';

import type { CancelablePromise } from '@/plugins/api/core/CancelablePromise';
import type { BaseHttpRequest } from '@/plugins/api/core/BaseHttpRequest';

import type { ApiRequestOptions } from '@/plugins/api/core/ApiRequestOptions';

export class HighlightersService {

  constructor(public readonly httpRequest: BaseHttpRequest) {}

  /**
   * Get Scope Highlighters
   * @returns any Successful Response
   * @throws ApiError
   */
  public getScopeHighlightersApiHighlightersScopeAssignmentScopeIdGet({
    assignmentScopeId,
    xProjectId,
  }: {
    assignmentScopeId: string,
    xProjectId: string,
  }, options?: Partial<ApiRequestOptions>): CancelablePromise<(Array<HighlighterModelOutput> | null)> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/api/highlighters/scope/{assignment_scope_id}',
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
   * Get Project Highlighters
   * @returns HighlighterModelOutput Successful Response
   * @throws ApiError
   */
  public getProjectHighlightersApiHighlightersProjectGet({
    xProjectId,
  }: {
    xProjectId: string,
  }, options?: Partial<ApiRequestOptions>): CancelablePromise<Array<HighlighterModelOutput>> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/api/highlighters/project',
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
   * Upsert Highlighter
   * @returns string Successful Response
   * @throws ApiError
   */
  public upsertHighlighterApiHighlightersProjectPut({
    xProjectId,
    requestBody,
  }: {
    xProjectId: string,
    requestBody: HighlighterModelInput,
  }, options?: Partial<ApiRequestOptions>): CancelablePromise<string> {
    return this.httpRequest.request({
      method: 'PUT',
      url: '/api/highlighters/project',
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
   * Get Highlighter
   * @returns any Successful Response
   * @throws ApiError
   */
  public getHighlighterApiHighlightersHighlighterIdGet({
    highlighterId,
    xProjectId,
  }: {
    highlighterId: string,
    xProjectId: string,
  }, options?: Partial<ApiRequestOptions>): CancelablePromise<(HighlighterModelOutput | null)> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/api/highlighters/{highlighter_id}',
      path: {
        'highlighter_id': highlighterId,
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
