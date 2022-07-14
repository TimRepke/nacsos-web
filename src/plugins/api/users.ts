import { Endpoint, EndpointFunction, ResponseReason } from '@/plugins/api/types.d';
import { callEndpointFactory } from '@/plugins/api/index';
import { User } from '@/types/user.d';

export interface UserRequestPayload {
  userId: string;
}

export interface UsersRequestPayload {
  user_id: string[];
}

export interface ProjectUsersRequestPayload {
  projectId: string;
}

const AllUsersListEndpoint: Endpoint<ResponseReason, User[]> = {
  method: 'GET',
  path: '/users/list/all',
  transformResponse: (response) => {
    if (response.data) {
      return ['SUCCESS', 'SUCCESS', response.data];
    }
    return ['FAILED', 'POSTPROCESSING_FAILED'];
  },
};

const AllProjectUsersListEndpoint: Endpoint<ResponseReason, User[]> = {
  method: 'GET',
  path: '/users/list/project/{projectId}',
  paramsEncoding: 'PATH',
  transformResponse: (response) => {
    if (response.data) {
      return ['SUCCESS', 'SUCCESS', response.data];
    }
    return ['FAILED', 'POSTPROCESSING_FAILED'];
  },
};

const UserDetailsEndpoint: Endpoint<ResponseReason, User> = {
  method: 'GET',
  path: '/users/details/{userId}',
  paramsEncoding: 'PATH',
  transformResponse: (response) => {
    if (response.data) {
      return ['SUCCESS', 'SUCCESS', response.data];
    }
    return ['FAILED', 'POSTPROCESSING_FAILED'];
  },
};

const UsersDetailsEndpoint: Endpoint<ResponseReason, User[]> = {
  method: 'GET',
  path: '/users/details',
  paramsEncoding: 'QUERY',
  transformResponse: (response) => {
    if (response.data) {
      return ['SUCCESS', 'SUCCESS', response.data];
    }
    return ['FAILED', 'POSTPROCESSING_FAILED'];
  },
};

export const callAllUsersListEndpoint:
  EndpointFunction<never, ResponseReason, User[]> = callEndpointFactory(AllUsersListEndpoint);

export const callAllProjectUsersListEndpoint:
  EndpointFunction<ProjectUsersRequestPayload, ResponseReason, User[]> = callEndpointFactory(AllProjectUsersListEndpoint);

export const callUserDetailsEndpoint:
  EndpointFunction<UserRequestPayload, ResponseReason, User> = callEndpointFactory(UserDetailsEndpoint);

export const callUsersDetailsEndpoint:
  EndpointFunction<UsersRequestPayload, ResponseReason, User[]> = callEndpointFactory(UsersDetailsEndpoint);
