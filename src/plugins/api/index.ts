import { App } from 'vue';
import axios, { AxiosInstance, AxiosRequestHeaders } from 'axios';
import { Endpoint, EndpointFunction, RequestResult } from '@/plugins/api/types.d';
import { EventBus } from '@/plugins/events';
import { RequestSubmittedEvent } from '@/plugins/events/events/auth';
import { RemovableRef, useStorage } from '@vueuse/core';
import { RequestGatewayStatusChangeEvent } from '@/plugins/events/events/general';

interface TransformedPayload<REQUEST> {
  params: REQUEST | URLSearchParams | FormData | null;
  path: string;
}

function transformPayload<REQUEST, REASON, RESPONSE>(params: REQUEST, endpoint: Endpoint<REASON, RESPONSE>):
  TransformedPayload<REQUEST> {
  if (!params) return { params: null, path: endpoint.path };
  const encoding = endpoint.paramsEncoding || 'BODY';

  if (encoding === 'URL' || encoding === 'QUERY') {
    const payload = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value instanceof Array) {
        value.forEach((val: string) => payload.append(key, val));
      } else {
        payload.append(key, value);
      }
    });
    return { params: payload, path: endpoint.path };
  }

  if (encoding === 'FORM') {
    const payload = new FormData();
    Object.entries(params).forEach(([key, value]) => {
      payload.append(key, value);
    });
    return { params: payload, path: endpoint.path };
  }

  if (encoding === 'PATH') {
    let { path } = endpoint;
    Object.entries(params).forEach(([key, value]) => {
      path = path.replace(`{${key}}`, value);
    });
    return { params: null, path };
  }

  // if (encoding === 'BODY')
  return { params, path: endpoint.path };
}

class RequestGateway {
  private static instance: RequestGateway; // eslint-disable-line no-use-before-define

  protected httpClient: AxiosInstance;

  protected defaultHeaders: AxiosRequestHeaders;

  protected pendingRequests: number;

  protected accessToken: RemovableRef<string>;

  protected currentProjectId: RemovableRef<string>;

  private constructor() {
    const baseUrl = 'http://localhost:8081';
    this.accessToken = useStorage<string>('accessToken', null);
    this.currentProjectId = useStorage<string>('currentProjectId', null);
    this.pendingRequests = 0;
    this.httpClient = axios.create({
      baseURL: `${baseUrl}/api`,
    });
    this.defaultHeaders = {
      // Origin: baseUrl,
    };
  }

  static getInstance() {
    if (!RequestGateway.instance) {
      RequestGateway.instance = new RequestGateway();
    }
    return RequestGateway.instance;
  }

  isBusy(): boolean {
    return this.pendingRequests > 0;
  }

  updateState(counter: number) {
    this.pendingRequests += counter;
    EventBus.emit(new RequestGatewayStatusChangeEvent(this.isBusy(), this.pendingRequests));
  }

  request<REQUEST, REASON extends string, RESPONSE>(
    payload: REQUEST,
    endpoint: Endpoint<REASON, RESPONSE>,
  ): Promise<RequestResult<REASON, RESPONSE>> {
    const { path, params } = transformPayload<REQUEST, REASON, RESPONSE>(payload, endpoint);

    EventBus.emit(new RequestSubmittedEvent(path));
    this.updateState(1);

    const baseHeaders = this.defaultHeaders;
    if (this.accessToken.value) {
      baseHeaders.Authorization = `Bearer ${this.accessToken.value}`;
      baseHeaders['x-project-id'] = this.currentProjectId.value;
    }

    return new Promise((resolve, reject) => {
      const requestConfig = {
        method: endpoint.method,
        url: path,
        params: (params instanceof URLSearchParams) ? params : undefined,
        data: params,
        headers: { ...baseHeaders, ...endpoint.customHeaders },
      };

      this.httpClient.request(requestConfig).then((response) => {
        this.updateState(-1);
        try {
          const [status, reason, responsePayload] = endpoint.transformResponse(response);
          if (status === 'SUCCESS') {
            const res: RequestResult<REASON, RESPONSE> = {
              status: 'SUCCESS',
              payload: responsePayload,
              reason,
            };
            return resolve(res);
          }
          return reject({
            status: 'FAILED',
            reason: 'POSTPROCESSING_FAILED' as REASON,
          } as RequestResult<REASON, RESPONSE>);
        } catch (error) {
          return reject({
            status: 'FAILED',
            info: { error },
            reason: 'POSTPROCESSING_FAILED' as REASON,
          } as RequestResult<REASON, RESPONSE>);
        }
      }).catch((error) => {
        this.updateState(-1);
        return reject({
          status: 'FAILED',
          info: { error },
          reason: 'REQUEST_FAILED' as REASON,
        } as RequestResult<REASON, RESPONSE>);
      });
    });
  }
}

function callEndpointFactory<REQUEST, REASON extends string, RESPONSE>(endpoint: Endpoint<REASON, RESPONSE>):
  EndpointFunction<REQUEST, REASON, RESPONSE> {
  return (payload?: REQUEST) => {
    const requestGateway = RequestGateway.getInstance();
    return requestGateway.request(payload, endpoint);
  };
}

export default {
  install(app: App, options: any) {
    // eslint-disable-next-line no-param-reassign
    app.config.globalProperties.$api = RequestGateway.getInstance();
  },
};

export { RequestGateway, callEndpointFactory };
