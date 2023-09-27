import { BaseEvent } from "@/plugins/events/baseEvent";

export class RequestGatewayStatusChangeEvent extends BaseEvent {
  constructor(
    public newState: boolean,
    public newNumberPendingRequests: number,
  ) {
    super();
  }
}
