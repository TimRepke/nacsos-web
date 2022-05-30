import { Endpoint, EndpointFunction, ResponseReason } from '@/plugins/api/types.d';
import { callEndpointFactory } from '@/plugins/api/index';

const PingEndpoint: Endpoint<ResponseReason, string> = {
  method: 'GET',
  path: '/ping/',
  transformResponse: (response) => {
    if (response.data) {
      return ['SUCCESS', 'SUCCESS', response.data];
    }
    return ['FAILED', 'POSTPROCESSING_FAILED'];
  },
};

export interface PingPostPayload {
  name: string;
}

const PingPostEndpoint: Endpoint<ResponseReason, string> = {
  method: 'POST',
  path: '/ping/{name}',
  paramsEncoding: 'PATH',
  transformResponse: (response) => {
    if (response.data) {
      return ['SUCCESS', 'SUCCESS', response.data];
    }
    return ['FAILED', 'POSTPROCESSING_FAILED'];
  },
};

export const callPingEndpoint:
  EndpointFunction<never, ResponseReason, string> = callEndpointFactory(PingEndpoint);

export const callPingPostEndpoint:
  EndpointFunction<PingPostPayload, ResponseReason, string> = callEndpointFactory(PingPostEndpoint);
