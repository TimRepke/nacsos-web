/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ProjectModel } from '../models/ProjectModel';

import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class ProjectsService {

  constructor(public readonly httpRequest: BaseHttpRequest) {}

  /**
   * Get All Projects
   * This endpoint returns all projects the currently logged-in user can see.
   * For regular users, this includes all projects for which an entry in ProjectPermissions exists.
   * For SuperUsers, this returns all projects on the platform.
   *
   * :return: List of projects
   * @returns ProjectModel Successful Response
   * @throws ApiError
   */
  public getAllProjectsApiProjectsListGet(): CancelablePromise<Array<ProjectModel>> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/api/projects/list',
    });
  }

}
