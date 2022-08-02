/* eslint-disable max-classes-per-file, no-useless-constructor */

import type { User } from '@/types/user.d';
import { BaseEvent } from '@/plugins/events/baseEvent';

// FIXME this event seems wrong here...
export class RequestSubmittedEvent extends BaseEvent {
  constructor(public endpoint: string) { super(); }
}

export class UserLoginEvent extends BaseEvent {
  constructor(public username: string, public password: string) { super(); }
}

export class AuthTokenReceivedEvent extends BaseEvent {
  constructor(public authToken: string) { super(); }
}

export class LoginSuccessEvent extends BaseEvent {
  constructor(public user: User) { super(); }
}

export class AuthFailedEvent extends BaseEvent {}

export class LoggedOutEvent extends BaseEvent {}
