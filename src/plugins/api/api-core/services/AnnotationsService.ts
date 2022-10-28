/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AnnotatedItem } from '../models/AnnotatedItem';
import type { AnnotationItem } from '../models/AnnotationItem';
import type { AnnotationMatrix } from '../models/AnnotationMatrix';
import type { AnnotationSchemeModel } from '../models/AnnotationSchemeModel';
import type { AnnotationSchemeModelFlat } from '../models/AnnotationSchemeModelFlat';
import type { AssignmentCounts } from '../models/AssignmentCounts';
import type { AssignmentModel } from '../models/AssignmentModel';
import type { AssignmentScopeModel } from '../models/AssignmentScopeModel';
import type { AssignmentStatus } from '../models/AssignmentStatus';
import type { ItemWithCount } from '../models/ItemWithCount';
import type { MakeAssignmentsRequestModel } from '../models/MakeAssignmentsRequestModel';
import type { UserProjectAssignmentScope } from '../models/UserProjectAssignmentScope';

import type { CancelablePromise } from '@/plugins/api/core/CancelablePromise';
import type { BaseHttpRequest } from '@/plugins/api/core/BaseHttpRequest';

import type { ApiRequestOptions } from '@/plugins/api/core/ApiRequestOptions';

export class AnnotationsService {

  constructor(public readonly httpRequest: BaseHttpRequest) {}

  /**
   * Get Scheme Definition
   * This endpoint returns the detailed definition of an annotation scheme.
   *
   * :param annotation_scheme_id: database id of the annotation scheme.
   * :param flat: True to get the flattened scheme
   * :return: a single annotation scheme
   * @returns any Successful Response
   * @throws ApiError
   */
  public getSchemeDefinitionApiAnnotationsSchemesDefinitionAnnotationSchemeIdGet({
    annotationSchemeId,
    flat = false,
  }: {
    annotationSchemeId: string,
    flat?: boolean,
  }, options?: Partial<ApiRequestOptions>): CancelablePromise<(AnnotationSchemeModel | AnnotationSchemeModelFlat)> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/api/annotations/schemes/definition/{annotation_scheme_id}',
      path: {
        'annotation_scheme_id': annotationSchemeId,
      },
      query: {
        'flat': flat,
      },
      errors: {
        422: `Validation Error`,
      },
      ...options,
    });
  }

  /**
   * Put Annotation Scheme
   * @returns string Successful Response
   * @throws ApiError
   */
  public putAnnotationSchemeApiAnnotationsSchemesDefinitionPut({
    xProjectId,
    requestBody,
  }: {
    xProjectId: string,
    requestBody: AnnotationSchemeModel,
  }, options?: Partial<ApiRequestOptions>): CancelablePromise<string> {
    return this.httpRequest.request({
      method: 'PUT',
      url: '/api/annotations/schemes/definition/',
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
   * Remove Annotation Scheme
   * @returns any Successful Response
   * @throws ApiError
   */
  public removeAnnotationSchemeApiAnnotationsSchemesDefinitionSchemeIdDelete({
    annotationSchemeId,
    xProjectId,
  }: {
    annotationSchemeId: string,
    xProjectId: string,
  }, options?: Partial<ApiRequestOptions>): CancelablePromise<any> {
    return this.httpRequest.request({
      method: 'DELETE',
      url: '/api/annotations/schemes/definition/{scheme_id}',
      headers: {
        'x-project-id': xProjectId,
      },
      query: {
        'annotation_scheme_id': annotationSchemeId,
      },
      errors: {
        422: `Validation Error`,
      },
      ...options,
    });
  }

  /**
   * Get Scheme Definitions For Project
   * This endpoint returns the detailed definitions of all annotation schemes associated with a project.
   *
   * :param project_id: database id of the project
   * :return: list of annotation schemes
   * @returns AnnotationSchemeModel Successful Response
   * @throws ApiError
   */
  public getSchemeDefinitionsForProjectApiAnnotationsSchemesListProjectIdGet({
    projectId,
  }: {
    projectId: string,
  }, options?: Partial<ApiRequestOptions>): CancelablePromise<Array<AnnotationSchemeModel>> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/api/annotations/schemes/list/{project_id}',
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
   * Get Next Assignment For Scope For User
   * @returns AnnotationItem Successful Response
   * @throws ApiError
   */
  public getNextAssignmentForScopeForUserApiAnnotationsAnnotateNextAssignmentScopeIdCurrentAssignmentIdGet({
    assignmentScopeId,
    currentAssignmentId,
    xProjectId,
  }: {
    assignmentScopeId: string,
    currentAssignmentId: string,
    xProjectId: string,
  }, options?: Partial<ApiRequestOptions>): CancelablePromise<AnnotationItem> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/api/annotations/annotate/next/{assignment_scope_id}/{current_assignment_id}',
      path: {
        'assignment_scope_id': assignmentScopeId,
        'current_assignment_id': currentAssignmentId,
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
   * Get Next Open Assignment For Scope For User
   * @returns AnnotationItem Successful Response
   * @throws ApiError
   */
  public getNextOpenAssignmentForScopeForUserApiAnnotationsAnnotateNextAssignmentScopeIdGet({
    assignmentScopeId,
    xProjectId,
  }: {
    assignmentScopeId: string,
    xProjectId: string,
  }, options?: Partial<ApiRequestOptions>): CancelablePromise<AnnotationItem> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/api/annotations/annotate/next/{assignment_scope_id}',
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
   * Get Assignment
   * @returns AnnotationItem Successful Response
   * @throws ApiError
   */
  public getAssignmentApiAnnotationsAnnotateAssignmentAssignmentIdGet({
    assignmentId,
    xProjectId,
  }: {
    assignmentId: string,
    xProjectId: string,
  }, options?: Partial<ApiRequestOptions>): CancelablePromise<AnnotationItem> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/api/annotations/annotate/assignment/{assignment_id}',
      path: {
        'assignment_id': assignmentId,
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
   * Get Assignment Scopes For User
   * @returns UserProjectAssignmentScope Successful Response
   * @throws ApiError
   */
  public getAssignmentScopesForUserApiAnnotationsAnnotateScopesProjectIdGet({
    projectId,
    xProjectId,
  }: {
    projectId: string,
    xProjectId: string,
  }, options?: Partial<ApiRequestOptions>): CancelablePromise<Array<UserProjectAssignmentScope>> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/api/annotations/annotate/scopes/{project_id}',
      path: {
        'project_id': projectId,
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
   * Get Assignment Scopes For Project
   * @returns AssignmentScopeModel Successful Response
   * @throws ApiError
   */
  public getAssignmentScopesForProjectApiAnnotationsAnnotateScopesGet({
    xProjectId,
  }: {
    xProjectId: string,
  }, options?: Partial<ApiRequestOptions>): CancelablePromise<Array<AssignmentScopeModel>> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/api/annotations/annotate/scopes/',
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
   * Get Assignment Scope
   * @returns AssignmentScopeModel Successful Response
   * @throws ApiError
   */
  public getAssignmentScopeApiAnnotationsAnnotateScopeAssignmentScopeIdGet({
    assignmentScopeId,
    xProjectId,
  }: {
    assignmentScopeId: string,
    xProjectId: string,
  }, options?: Partial<ApiRequestOptions>): CancelablePromise<AssignmentScopeModel> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/api/annotations/annotate/scope/{assignment_scope_id}',
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
   * Remove Assignment Scope
   * @returns any Successful Response
   * @throws ApiError
   */
  public removeAssignmentScopeApiAnnotationsAnnotateScopeAssignmentScopeIdDelete({
    assignmentScopeId,
    xProjectId,
  }: {
    assignmentScopeId: string,
    xProjectId: string,
  }, options?: Partial<ApiRequestOptions>): CancelablePromise<any> {
    return this.httpRequest.request({
      method: 'DELETE',
      url: '/api/annotations/annotate/scope/{assignment_scope_id}',
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
   * Put Assignment Scope
   * @returns string Successful Response
   * @throws ApiError
   */
  public putAssignmentScopeApiAnnotationsAnnotateScopePut({
    xProjectId,
    requestBody,
  }: {
    xProjectId: string,
    requestBody: AssignmentScopeModel,
  }, options?: Partial<ApiRequestOptions>): CancelablePromise<string> {
    return this.httpRequest.request({
      method: 'PUT',
      url: '/api/annotations/annotate/scope/',
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
   * Get Num Assignments For Scope
   * @returns AssignmentCounts Successful Response
   * @throws ApiError
   */
  public getNumAssignmentsForScopeApiAnnotationsAnnotateScopeCountsAssignmentScopeIdGet({
    assignmentScopeId,
    xProjectId,
  }: {
    assignmentScopeId: string,
    xProjectId: string,
  }, options?: Partial<ApiRequestOptions>): CancelablePromise<AssignmentCounts> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/api/annotations/annotate/scope/counts/{assignment_scope_id}',
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
   * Get Assignments
   * @returns AssignmentModel Successful Response
   * @throws ApiError
   */
  public getAssignmentsApiAnnotationsAnnotateAssignmentsAssignmentScopeIdGet({
    assignmentScopeId,
    xProjectId,
  }: {
    assignmentScopeId: string,
    xProjectId: string,
  }, options?: Partial<ApiRequestOptions>): CancelablePromise<Array<AssignmentModel>> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/api/annotations/annotate/assignments/{assignment_scope_id}',
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
   * Get Assignments For Scope
   * @returns AssignmentModel Successful Response
   * @throws ApiError
   */
  public getAssignmentsForScopeApiAnnotationsAnnotateAssignmentsScopeAssignmentScopeIdGet({
    assignmentScopeId,
    xProjectId,
  }: {
    assignmentScopeId: string,
    xProjectId: string,
  }, options?: Partial<ApiRequestOptions>): CancelablePromise<Array<AssignmentModel>> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/api/annotations/annotate/assignments/scope/{assignment_scope_id}',
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
   * Get Annotations
   * @returns AssignmentModel Successful Response
   * @throws ApiError
   */
  public getAnnotationsApiAnnotationsAnnotateAnnotationsAssignmentScopeIdGet({
    assignmentScopeId,
    xProjectId,
  }: {
    assignmentScopeId: string,
    xProjectId: string,
  }, options?: Partial<ApiRequestOptions>): CancelablePromise<Array<AssignmentModel>> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/api/annotations/annotate/annotations/{assignment_scope_id}',
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
   * Save Annotation
   * @returns AssignmentStatus Successful Response
   * @throws ApiError
   */
  public saveAnnotationApiAnnotationsAnnotateSavePost({
    xProjectId,
    requestBody,
  }: {
    xProjectId: string,
    requestBody: AnnotatedItem,
  }, options?: Partial<ApiRequestOptions>): CancelablePromise<AssignmentStatus> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/api/annotations/annotate/save',
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
   * Get Items With Count
   * @returns ItemWithCount Successful Response
   * @throws ApiError
   */
  public getItemsWithCountApiAnnotationsConfigItemsGet({
    xProjectId,
  }: {
    xProjectId: string,
  }, options?: Partial<ApiRequestOptions>): CancelablePromise<Array<ItemWithCount>> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/api/annotations/config/items/',
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
   * Make Assignments
   * @returns AssignmentModel Successful Response
   * @throws ApiError
   */
  public makeAssignmentsApiAnnotationsConfigAssignmentsPost({
    xProjectId,
    requestBody,
  }: {
    xProjectId: string,
    requestBody: MakeAssignmentsRequestModel,
  }, options?: Partial<ApiRequestOptions>): CancelablePromise<Array<AssignmentModel>> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/api/annotations/config/assignments/',
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
   * Send Item Annotation Matrix
   * @returns AnnotationMatrix Successful Response
   * @throws ApiError
   */
  public sendItemAnnotationMatrixApiAnnotationsConfigResolveGet({
    xProjectId,
    schemeId,
    scopeId,
    userId,
    key,
    repeat,
    excludeKey,
  }: {
    xProjectId: string,
    schemeId?: string,
    scopeId?: string,
    userId?: string,
    key?: Array<string>,
    repeat?: number,
    excludeKey?: Array<string>,
  }, options?: Partial<ApiRequestOptions>): CancelablePromise<AnnotationMatrix> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/api/annotations/config/resolve/',
      headers: {
        'x-project-id': xProjectId,
      },
      query: {
        'scheme_id': schemeId,
        'scope_id': scopeId,
        'user_id': userId,
        'key': key,
        'repeat': repeat,
        'exclude_key': excludeKey,
      },
      errors: {
        422: `Validation Error`,
      },
      ...options,
    });
  }

  /**
   * Send Resolved Annotations
   * @returns AnnotationMatrix Successful Response
   * @throws ApiError
   */
  public sendResolvedAnnotationsApiAnnotationsConfigResolvedBotAnnotationMetaIdGet({
    botAnnotationMetaId,
    xProjectId,
  }: {
    botAnnotationMetaId: string,
    xProjectId: string,
  }, options?: Partial<ApiRequestOptions>): CancelablePromise<AnnotationMatrix> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/api/annotations/config/resolved/:bot_annotation_meta_id',
      headers: {
        'x-project-id': xProjectId,
      },
      query: {
        'bot_annotation_meta_id': botAnnotationMetaId,
      },
      errors: {
        422: `Validation Error`,
      },
      ...options,
    });
  }

}
