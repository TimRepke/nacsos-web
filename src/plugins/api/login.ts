import { Endpoint, EndpointFunction, ResponseReason } from '@/plugins/api/types.d';
import { callEndpointFactory } from '@/plugins/api/index';
import { User } from '@/types/user.d';
import { EventBus } from '@/plugins/events';
import { AuthTokenReceivedEvent } from '@/plugins/events/events/auth';

export type AuthResponseReason =
  | ResponseReason
  | 'ACCEPT'
  | 'TOKEN_MISSING';

export type CurrentUserResponseReason = AuthResponseReason;

export interface AuthRequestPayload {
  username: string;
  password: string;
}

export interface AuthResponsePayload {
  accessToken: string;
  tokenType?: 'bearer' | string;
}

/**
 * This endpoint is used to retrieve an OAuth2 token
 */
const LoginEndpoint: Endpoint<AuthResponseReason, AuthResponsePayload> = {
  method: 'POST',
  path: '/login/token',
  paramsEncoding: 'FORM',
  customHeaders: { 'Content-Type': 'application/x-www-form-urlencoded' },
  transformResponse: (response) => {
    if (response.data.access_token) {
      EventBus.emit(new AuthTokenReceivedEvent(response.data.access_token));
      return [
        'SUCCESS', 'ACCEPT',
        {
          accessToken: response.data.access_token,
          tokenType: response.data.token_type,
        }];
    }
    return ['FAILED', 'TOKEN_MISSING'];
  },
};

const CurrentUserEndpoint: Endpoint<ResponseReason, User> = {
  method: 'GET',
  path: '/login/me',
  transformResponse: (response) => {
    if (response.data.username) {
      return ['SUCCESS', 'SUCCESS', response.data];
    }
    return ['FAILED', 'POSTPROCESSING_FAILED'];
  },
};

export const callLoginEndpoint:
  EndpointFunction<AuthRequestPayload, AuthResponseReason, AuthResponsePayload> = callEndpointFactory(LoginEndpoint);

export const callCurrentUserEndpoint:
  EndpointFunction<never, CurrentUserResponseReason, User> = callEndpointFactory(CurrentUserEndpoint);
