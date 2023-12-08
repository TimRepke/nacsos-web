/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { QueryResult } from '../models/QueryResult';
import type { SearchResult } from '../models/SearchResult';
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
   * Nql Grammar
   * @returns string Successful Response
   * @throws ApiError
   */
  public nqlGrammarApiSearchNqlGrammarGet(options?: Partial<ApiRequestOptions>): CancelablePromise<string> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/api/search/nql/grammar',
      ...options,
    });
  }

  /**
   * Nql Query
   * @returns QueryResult Successful Response
   * @throws ApiError
   */
  public nqlQueryApiSearchNqlQueryGet({
    query,
    xProjectId,
    page = 1,
    limit = 20,
  }: {
    query: string,
    xProjectId: string,
    page?: number,
    limit?: number,
  }, options?: Partial<ApiRequestOptions>): CancelablePromise<QueryResult> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/api/search/nql/query',
      headers: {
        'x-project-id': xProjectId,
      },
      query: {
        'query': query,
        'page': page,
        'limit': limit,
      },
      errors: {
        422: `Validation Error`,
      },
      ...options,
    });
  }

}
