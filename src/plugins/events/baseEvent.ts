/* eslint-disable max-classes-per-file, no-useless-constructor */

import { User } from '@/types/user.model';

export class BaseEvent {}

export class RequestSubmittedEvent extends BaseEvent {
  constructor(public endpoint: string) { super(); }
}

export class AuthTokenReceivedEvent extends BaseEvent {
  constructor(public authToken: string) { super(); }
}

export class LoginSuccessEvent extends BaseEvent {
  constructor(public user: User) { super(); }
}
export class AuthFailedEvent extends BaseEvent {}
