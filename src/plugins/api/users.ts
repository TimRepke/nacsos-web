import { Endpoint, EndpointFunction, ResponseReason } from '@/plugins/api/types.d';
import { callEndpointFactory } from '@/plugins/api/index';
import { User } from '@/types/user.d';

export interface UserRequestPayload {
  userId: string;
}

const UsersListEndpoint: Endpoint<ResponseReason, User[]> = {
  method: 'GET',
  path: '/users/list',
  transformResponse: (response) => {
    if (response.data) {
      return ['SUCCESS', 'SUCCESS', response.data];
    }
    return ['FAILED', 'POSTPROCESSING_FAILED'];
  },
};

export const callUsersListEndpoint:
  EndpointFunction<never, ResponseReason, User[]> = callEndpointFactory(UsersListEndpoint);
