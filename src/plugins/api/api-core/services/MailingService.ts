/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '@/plugins/api/core/CancelablePromise';
import type { BaseHttpRequest } from '@/plugins/api/core/BaseHttpRequest';

import type { ApiRequestOptions } from '@/plugins/api/core/ApiRequestOptions';

export class MailingService {

  constructor(public readonly httpRequest: BaseHttpRequest) {}

  /**
   * Reset Password
   * @returns string Successful Response
   * @throws ApiError
   */
  public resetPasswordApiMailResetPasswordUsernamePost({
    username,
  }: {
    username: string,
  }, options?: Partial<ApiRequestOptions>): CancelablePromise<string> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/api/mail/reset-password/{username}',
      path: {
        'username': username,
      },
      errors: {
        422: `Validation Error`,
      },
      ...options,
    });
  }

  /**
   * Welcome Mail
   * @returns string Successful Response
   * @throws ApiError
   */
  public welcomeMailApiMailWelcomePost({
    username,
    password,
  }: {
    username: string,
    password: string,
  }, options?: Partial<ApiRequestOptions>): CancelablePromise<string> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/api/mail/welcome',
      query: {
        'username': username,
        'password': password,
      },
      errors: {
        422: `Validation Error`,
      },
      ...options,
    });
  }

  /**
   * Remind Users Assigment
   * @returns string Successful Response
   * @throws ApiError
   */
  public remindUsersAssigmentApiMailAssignmentReminderPost({
    assignmentScopeId,
    xProjectId,
  }: {
    assignmentScopeId: string,
    xProjectId: string,
  }, options?: Partial<ApiRequestOptions>): CancelablePromise<Array<string>> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/api/mail/assignment-reminder',
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

}
