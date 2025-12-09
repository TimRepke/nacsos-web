import { BaseEvent } from "@/plugins/events/baseEvent";
import type { UserModel } from "@/plugins/api/spec/types.gen";
import { ErrorDetails } from "@/plugins/api";

// FIXME this event seems wrong here...
export class RequestSubmittedEvent extends BaseEvent {
  constructor(public endpoint: string) {
    super();
  }
}

export class UserLoginEvent extends BaseEvent {
  constructor(
    public username: string,
    public password: string,
  ) {
    super();
  }
}

export class AuthTokenReceivedEvent extends BaseEvent {
  constructor(public authToken: string) {
    super();
  }
}

export class LoginSuccessEvent extends BaseEvent {
  constructor(public user: UserModel) {
    super();
  }
}

export class AuthFailedEvent extends BaseEvent {
  constructor(public reason: ErrorDetails) {
    super();
  }
}

export class LoggedOutEvent extends BaseEvent {}

export class LogoutSuccessEvent extends BaseEvent {}

export class ClearUserStoreEvent extends BaseEvent {}
