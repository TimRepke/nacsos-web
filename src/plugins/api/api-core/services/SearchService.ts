/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AnnotationFilter } from '../models/AnnotationFilter';
import type { AssignmentFilter } from '../models/AssignmentFilter';
import type { FieldFilter } from '../models/FieldFilter';
import type { FieldFilters } from '../models/FieldFilters';
import type { ImportFilter } from '../models/ImportFilter';
import type { LabelFilterBool } from '../models/LabelFilterBool';
import type { LabelFilterInt } from '../models/LabelFilterInt';
import type { LabelFilterMulti } from '../models/LabelFilterMulti';
import type { MetaFilter } from '../models/MetaFilter';
import type { QueryResult } from '../models/QueryResult';
import type { SearchResult } from '../models/SearchResult';
import type { SubQuery } from '../models/SubQuery';
import type { TermStats } from '../models/TermStats';

import type { CancelablePromise } from '@/plugins/api/core/CancelablePromise';
import type { BaseHttpRequest } from '@/plugins/api/core/BaseHttpRequest';

import type { ApiRequestOptions } from '@/plugins/api/core/ApiRequestOptions';

export class SearchService {

  constructor(public readonly httpRequest: BaseHttpRequest) {}

  /**
   * Search Openalex
   * @returns SearchResult Successful Response
   * @throws ApiError
   */
  public searchOpenalexApiSearchOpenalexSelectPost({
    query,
    xProjectId,
    limit = 20,
    offset,
    defType = 'lucene',
    field = 'title_abstract',
    histogram = false,
    op = 'AND',
    histogramFrom = 1990,
    histogramTo = 2024,
  }: {
    query: string,
    xProjectId: string,
    limit?: number,
    offset?: number,
    defType?: 'edismax' | 'lucene' | 'dismax',
    field?: 'title' | 'abstract' | 'title_abstract',
    histogram?: boolean,
    op?: 'OR' | 'AND',
    histogramFrom?: number,
    histogramTo?: number,
  }, options?: Partial<ApiRequestOptions>): CancelablePromise<SearchResult> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/api/search/openalex/select',
      headers: {
        'x-project-id': xProjectId,
      },
      query: {
        'query': query,
        'limit': limit,
        'offset': offset,
        'def_type': defType,
        'field': field,
        'histogram': histogram,
        'op': op,
        'histogram_from': histogramFrom,
        'histogram_to': histogramTo,
      },
      errors: {
        422: `Validation Error`,
      },
      ...options,
    });
  }

  /**
   * Term Expansion
   * @returns TermStats Successful Response
   * @throws ApiError
   */
  public termExpansionApiSearchOpenalexTermsGet({
    termPrefix,
    xProjectId,
    limit = 20,
  }: {
    termPrefix: string,
    xProjectId: string,
    limit?: number,
  }, options?: Partial<ApiRequestOptions>): CancelablePromise<Array<TermStats>> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/api/search/openalex/terms',
      headers: {
        'x-project-id': xProjectId,
      },
      query: {
        'term_prefix': termPrefix,
        'limit': limit,
      },
      errors: {
        422: `Validation Error`,
      },
      ...options,
    });
  }

  /**
   * Nql Query
   * @returns QueryResult Successful Response
   * @throws ApiError
   */
  public nqlQueryApiSearchNqlQueryPost({
    xProjectId,
    requestBody,
    page = 1,
    limit = 20,
  }: {
    xProjectId: string,
    requestBody: (FieldFilter | FieldFilters | LabelFilterMulti | LabelFilterBool | LabelFilterInt | AssignmentFilter | AnnotationFilter | ImportFilter | MetaFilter | SubQuery),
    page?: number,
    limit?: number,
  }, options?: Partial<ApiRequestOptions>): CancelablePromise<QueryResult> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/api/search/nql/query',
      headers: {
        'x-project-id': xProjectId,
      },
      query: {
        'page': page,
        'limit': limit,
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
   * Nql Query Count
   * @returns number Successful Response
   * @throws ApiError
   */
  public nqlQueryCountApiSearchNqlCountPost({
    xProjectId,
    requestBody,
  }: {
    xProjectId: string,
    requestBody: (FieldFilter | FieldFilters | LabelFilterMulti | LabelFilterBool | LabelFilterInt | AssignmentFilter | AnnotationFilter | ImportFilter | MetaFilter | SubQuery),
  }, options?: Partial<ApiRequestOptions>): CancelablePromise<number> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/api/search/nql/count',
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

}
