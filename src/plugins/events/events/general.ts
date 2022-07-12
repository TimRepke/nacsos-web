import { BaseEvent } from '@/plugins/events/baseEvent';

// eslint-disable-next-line import/prefer-default-export
export class RequestGatewayStatusChangeEvent extends BaseEvent {
  constructor(public newState: boolean, public newNumberPendingRequests: number) { super(); }
}
