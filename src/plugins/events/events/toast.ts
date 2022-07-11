/* eslint-disable max-classes-per-file, no-useless-constructor */

import { BaseEvent } from '@/plugins/events/baseEvent';

export type ToastType = 'SUCCESS' | 'INFO' | 'ERROR' | 'WARN';

export class ToastEvent extends BaseEvent {
  constructor(public level: ToastType, public message: string) { super(); }
}
