/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BasicProjectStats } from '../models/BasicProjectStats';
import type { HistogramEntry } from '../models/HistogramEntry';
import type { RankEntry } from '../models/RankEntry';

import type { CancelablePromise } from '@/plugins/api/core/CancelablePromise';
import type { BaseHttpRequest } from '@/plugins/api/core/BaseHttpRequest';

import type { ApiRequestOptions } from '@/plugins/api/core/ApiRequestOptions';

export class StatsService {

  constructor(public readonly httpRequest: BaseHttpRequest) {}

  /**
   * Get Basic Stats
   * @returns BasicProjectStats Successful Response
   * @throws ApiError
   */
  public getBasicStatsApiStatsBasicsGet({
    xProjectId,
  }: {
    xProjectId: string,
  }, options?: Partial<ApiRequestOptions>): CancelablePromise<BasicProjectStats> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/api/stats/basics',
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
   * Get Annotator Ranking
   * @returns RankEntry Successful Response
   * @throws ApiError
   */
  public getAnnotatorRankingApiStatsRankGet({
    xProjectId,
  }: {
    xProjectId: string,
  }, options?: Partial<ApiRequestOptions>): CancelablePromise<Array<RankEntry>> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/api/stats/rank',
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
   * Get Publication Year Histogram
   * @returns HistogramEntry Successful Response
   * @throws ApiError
   */
  public getPublicationYearHistogramApiStatsHistogramYearsGet({
    xProjectId,
    fromYear = 1990,
    toYear = 2023,
  }: {
    xProjectId: string,
    fromYear?: number,
    toYear?: number,
  }, options?: Partial<ApiRequestOptions>): CancelablePromise<Array<HistogramEntry>> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/api/stats/histogram/years',
      headers: {
        'x-project-id': xProjectId,
      },
      query: {
        'from_year': fromYear,
        'to_year': toYear,
      },
      errors: {
        422: `Validation Error`,
      },
      ...options,
    });
  }

}
