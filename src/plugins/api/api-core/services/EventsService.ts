/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Event } from '../models/Event';

import type { CancelablePromise } from '@/plugins/api/core/CancelablePromise';
import type { BaseHttpRequest } from '@/plugins/api/core/BaseHttpRequest';

export class EventsService {

  constructor(public readonly httpRequest: BaseHttpRequest) {}

  /**
   * Emit
   * This route can be used to trigger an event on the system.
   * FIXME: This should require some sort of authentication!
   *
   * :param event: event (incl optional payload) to emit
   * :return: void
   * @returns any Successful Response
   * @throws ApiError
   */
  public emitApiEventsEmitPost({
    requestBody,
  }: {
    requestBody: Event,
  }): CancelablePromise<any> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/api/events/emit',
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        422: `Validation Error`,
      },
    });
  }

}
