/* eslint-disable max-classes-per-file, no-useless-constructor */

import { BaseEvent } from '@/plugins/events/baseEvent';

export type ConfirmationResponse = 'ACCEPT' | 'REJECT' | 'IGNORE';

export type ConfirmationCallback = (response: ConfirmationResponse) => void;

export class ConfirmationRequestEvent extends BaseEvent {
  constructor(
    public body: string,
    public callback: ConfirmationCallback,
    public title: string = 'Please confirm',
    public accept: string = 'Yes, proceed!',
    public reject: string = 'No!',
  ) { super(); }
}
