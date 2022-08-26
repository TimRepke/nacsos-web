/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BaseHttpRequest } from './core/BaseHttpRequest';
import type { OpenAPIConfig } from './core/OpenAPI';
import { AxiosHttpRequest } from './core/AxiosHttpRequest';

import { ArtefactsService } from './services/ArtefactsService';
import { LibraryService } from './services/LibraryService';
import { PingService } from './services/PingService';
import { QueueService } from './services/QueueService';

type HttpRequestConstructor = new (config: OpenAPIConfig) => BaseHttpRequest;

export class PipelinesClient {

  public readonly artefacts: ArtefactsService;
  public readonly library: LibraryService;
  public readonly ping: PingService;
  public readonly queue: QueueService;

  public readonly request: BaseHttpRequest;

  constructor(config?: Partial<OpenAPIConfig>, HttpRequest: HttpRequestConstructor = AxiosHttpRequest) {
    this.request = new HttpRequest({
      BASE: config?.BASE ?? '',
      VERSION: config?.VERSION ?? '0.1.0',
      WITH_CREDENTIALS: config?.WITH_CREDENTIALS ?? false,
      CREDENTIALS: config?.CREDENTIALS ?? 'include',
      TOKEN: config?.TOKEN,
      USERNAME: config?.USERNAME,
      PASSWORD: config?.PASSWORD,
      HEADERS: config?.HEADERS,
      ENCODE_PATH: config?.ENCODE_PATH,
    });

    this.artefacts = new ArtefactsService(this.request);
    this.library = new LibraryService(this.request);
    this.ping = new PingService(this.request);
    this.queue = new QueueService(this.request);
  }
}

