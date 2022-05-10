import { AxiosRequestHeaders, AxiosResponse, Method } from 'axios';

export type ResponseReason =
  | 'SUCCESS'
  | 'POSTPROCESSING_FAILED'
  | 'REQUEST_FAILED';

export type ResponseStatus =
  | 'SUCCESS'
  | 'FAILED';

export type RequestEncoding =
  | 'URL'
  | 'PATH'
  | 'BODY'
  | 'FORM';

export type ResponseTransformFunction<REASON, RESPONSE> =
  (response: AxiosResponse) => [ResponseStatus, REASON, RESPONSE?];

export interface Endpoint<REASON, RESPONSE> {
  method: Method,
  path: string;
  paramsEncoding?: RequestEncoding;
  customHeaders?: AxiosRequestHeaders;
  transformResponse: ResponseTransformFunction<REASON, RESPONSE>;
}

export interface RequestResult<REASON, RESPONSE> {
  status: ResponseStatus;
  reason: REASON;
  payload?: RESPONSE;
  info?: object;
}

export type EndpointFunction<REQUEST, REASON, RESPONSE> =
  (options?: REQUEST) => Promise<RequestResult<REASON, RESPONSE>>;
