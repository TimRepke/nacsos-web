/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BaseHttpRequest } from '@/plugins/api/core/BaseHttpRequest';
import type { OpenAPIConfig } from '@/plugins/api/core/OpenAPI';
import { AxiosHttpRequest } from '@/plugins/api/core/AxiosHttpRequest';

import { AnnotationsService } from './services/AnnotationsService';
import { DefaultService } from './services/DefaultService';
import { EventsService } from './services/EventsService';
import { ExportService } from './services/ExportService';
import { HighlightersService } from './services/HighlightersService';
import { ImportsService } from './services/ImportsService';
import { OauthService } from './services/OauthService';
import { ProjectService } from './services/ProjectService';
import { ProjectsService } from './services/ProjectsService';
import { SearchService } from './services/SearchService';
import { StatsService } from './services/StatsService';
import { UsersService } from './services/UsersService';

type HttpRequestConstructor = new (config: OpenAPIConfig) => BaseHttpRequest;

export class CoreClient {

  public readonly annotations: AnnotationsService;
  public readonly default: DefaultService;
  public readonly events: EventsService;
  public readonly export: ExportService;
  public readonly highlighters: HighlightersService;
  public readonly imports: ImportsService;
  public readonly oauth: OauthService;
  public readonly project: ProjectService;
  public readonly projects: ProjectsService;
  public readonly search: SearchService;
  public readonly stats: StatsService;
  public readonly users: UsersService;

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

    this.annotations = new AnnotationsService(this.request);
    this.default = new DefaultService(this.request);
    this.events = new EventsService(this.request);
    this.export = new ExportService(this.request);
    this.highlighters = new HighlightersService(this.request);
    this.imports = new ImportsService(this.request);
    this.oauth = new OauthService(this.request);
    this.project = new ProjectService(this.request);
    this.projects = new ProjectsService(this.request);
    this.search = new SearchService(this.request);
    this.stats = new StatsService(this.request);
    this.users = new UsersService(this.request);
  }
}

