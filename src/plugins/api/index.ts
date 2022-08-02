import { App } from 'vue';
import axios, { AxiosInstance, AxiosRequestConfig, AxiosRequestHeaders, AxiosResponse } from 'axios';
import { Endpoint, EndpointFunction, RequestResult, ResponseStatus } from '@/plugins/api/types.d';
import { EventBus } from '@/plugins/events';
import { RequestSubmittedEvent } from '@/plugins/events/events/auth';
import { RequestGatewayStatusChangeEvent } from '@/plugins/events/events/general';
import { currentProjectStore, currentUserStore } from '@/stores';

interface TransformedPayload<REQUEST> {
  params: REQUEST | URLSearchParams | FormData | null;
  path: string;
  headers?: AxiosRequestHeaders;
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

  if (encoding === 'MULTI') {
    const payload = new FormData();
    Object.entries(params).forEach(([key, value]) => {
      payload.append(key, value);
    });
    return { params: payload, path: endpoint.path, headers: { 'Content-Type': 'multipart/form-data' } };
  }

  // if (encoding === 'BODY')
  return { params, path: endpoint.path };
}

class RequestGateway {
  private static instance: RequestGateway; // eslint-disable-line no-use-before-define

  private static pipelinesInstance: RequestGateway; // eslint-disable-line no-use-before-define

  protected httpClient: AxiosInstance;

  protected defaultHeaders: AxiosRequestHeaders;

  protected pendingRequests: number;

  private constructor(baseUrl: string) {
    this.pendingRequests = 0;
    this.httpClient = axios.create({
      baseURL: baseUrl,
    });
    this.defaultHeaders = {
      // empty
    };
  }

  static getInstance() {
    if (!RequestGateway.instance) {
      RequestGateway.instance = new RequestGateway('http://localhost:8081/api');
    }
    return RequestGateway.instance;
  }

  static getPipelinesInstance() {
    if (!RequestGateway.pipelinesInstance) {
      RequestGateway.pipelinesInstance = new RequestGateway('http://localhost:8000/api');
    }
    return RequestGateway.pipelinesInstance;
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
    customRequestConfig?: AxiosRequestConfig<REQUEST>,
  ): Promise<RequestResult<REASON, RESPONSE>> {
    const { path, params, headers } = transformPayload<REQUEST, REASON, RESPONSE>(payload, endpoint);

    EventBus.emit(new RequestSubmittedEvent(path));
    this.updateState(1);

    const baseHeaders = this.defaultHeaders;
    if (currentUserStore.isLoggedIn) {
      baseHeaders.Authorization = `Bearer ${currentUserStore.accessToken}`;
    }
    if (currentProjectStore.projectId) {
      baseHeaders['x-project-id'] = currentProjectStore.projectId;
    }

    return new Promise((resolve, reject) => {
      const requestConfig = {
        method: endpoint.method,
        url: path,
        params: (params instanceof URLSearchParams) ? params : undefined,
        data: params,
        headers: { ...baseHeaders, ...headers, ...endpoint.customHeaders },
        ...customRequestConfig,
      };

      this.httpClient.request(requestConfig).then((response) => {
        this.updateState(-1);
        try {
          const transformResponse = (endpoint.transformResponse) ? endpoint.transformResponse
            : (res: AxiosResponse): [ResponseStatus, REASON, RESPONSE?] => {
              if (response.data) {
                return ['SUCCESS', 'SUCCESS' as REASON, res.data];
              }
              return ['FAILED', 'POSTPROCESSING_FAILED' as REASON];
            };
          const [status, reason, responsePayload] = transformResponse(response);

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
  return (payload?: REQUEST, customRequestConfig?: AxiosRequestConfig<REQUEST>) => {
    const requestGateway = RequestGateway.getInstance();
    return requestGateway.request(payload, endpoint, customRequestConfig);
  };
}

function callPipelineEndpointFactory<REQUEST, REASON extends string, RESPONSE>(endpoint: Endpoint<REASON, RESPONSE>):
  EndpointFunction<REQUEST, REASON, RESPONSE> {
  return (payload?: REQUEST, customRequestConfig?: AxiosRequestConfig<REQUEST>) => {
    const requestGateway = RequestGateway.getPipelinesInstance();
    return requestGateway.request(payload, endpoint, customRequestConfig);
  };
}

export default {
  install(app: App) {
    // eslint-disable-next-line no-param-reassign
    app.config.globalProperties.$api = RequestGateway.getInstance();
    // eslint-disable-next-line no-param-reassign
    app.config.globalProperties.$pipelineAPI = RequestGateway.getPipelinesInstance();
  },
};

export { RequestGateway, callEndpointFactory, callPipelineEndpointFactory };
