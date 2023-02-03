/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AcademicSearchDB } from '../models/AcademicSearchDB';
import type { QueryGroup } from '../models/QueryGroup';

import type { CancelablePromise } from '@/plugins/api/core/CancelablePromise';
import type { BaseHttpRequest } from '@/plugins/api/core/BaseHttpRequest';

import type { ApiRequestOptions } from '@/plugins/api/core/ApiRequestOptions';

export class SearchService {

  constructor(public readonly httpRequest: BaseHttpRequest) {}

  /**
   * Search
   * This endpoint converts the query definition to an actual SQL query and runs it
   * against one of our academic search engines (OpenAlex, S2, or CORE).
   *
   * :param query: the query definition
   * :param offset: see SQL OFFSET
   * :param limit: max. number of items to return (see SQL LIMIT)
   * :param database: database to query (OpenAlex, S2, or CORE)
   * :param permissions: force authentication
   * :return: query result
   * @returns any Successful Response
   * @throws ApiError
   */
  public searchApiSearchQueryPost({
    xProjectId,
    requestBody,
    database,
    limit = 20,
    offset,
  }: {
    xProjectId: string,
    requestBody: QueryGroup,
    database?: AcademicSearchDB,
    limit?: number,
    offset?: number,
  }, options?: Partial<ApiRequestOptions>): CancelablePromise<Array<any>> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/api/search/query',
      headers: {
        'x-project-id': xProjectId,
      },
      query: {
        'database': database,
        'limit': limit,
        'offset': offset,
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
