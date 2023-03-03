/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ExampleEvent } from './ExampleEvent';
import type { ExampleSubEvent } from './ExampleSubEvent';

export type Event = {
  event: Event.event;
  payload: (ExampleSubEvent | ExampleEvent);
};

export namespace Event {

  export enum event {
    EXAMPLE_SUB_EVENT = 'ExampleSubEvent',
    EXAMPLE_EVENT = 'ExampleEvent',
  }


}

