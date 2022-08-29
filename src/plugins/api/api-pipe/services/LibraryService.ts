/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { FunctionInfo } from '../models/FunctionInfo';

import type { CancelablePromise } from '@/plugins/api/core/CancelablePromise';
import type { BaseHttpRequest } from '@/plugins/api/core/BaseHttpRequest';

export class LibraryService {

  constructor(public readonly httpRequest: BaseHttpRequest) {}

  /**
   * Get Full Library
   * @returns FunctionInfo Successful Response
   * @throws ApiError
   */
  public getFullLibraryApiLibraryListGet(): CancelablePromise<Array<FunctionInfo>> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/api/library/list',
    });
  }

  /**
   * Get Function Info
   * @returns FunctionInfo Successful Response
   * @throws ApiError
   */
  public getFunctionInfoApiLibraryInfoFuncNameGet({
    funcName,
  }: {
    funcName: string,
  }): CancelablePromise<FunctionInfo> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/api/library/info/{func_name}',
      path: {
        'func_name': funcName,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Get Function Infos
   * @returns FunctionInfo Successful Response
   * @throws ApiError
   */
  public getFunctionInfosApiLibraryInfosGet({
    funcName,
  }: {
    funcName: Array<string>,
  }): CancelablePromise<Array<FunctionInfo>> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/api/library/infos',
      query: {
        'func_name': funcName,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Reload Library
   * @returns number Successful Response
   * @throws ApiError
   */
  public reloadLibraryApiLibraryRefreshPatch(): CancelablePromise<number> {
    return this.httpRequest.request({
      method: 'PATCH',
      url: '/api/library/refresh',
    });
  }

}
