export { OpenAPI } from "@/plugins/api/spec/core/OpenAPI";
import { OpenAPI } from "@/plugins/api/spec/core/OpenAPI";
import {
  AnnotationsService,
  DefaultService,
  EvaluationService,
  EventsService,
  ExportService,
  HighlightersService,
  ImportsService,
  MailingService,
  OauthService,
  ProjectService,
  ProjectsService,
  SearchService,
  StatsService,
  UsersService,
  PipesService,
  ItemService,
} from '@/plugins/api/spec/services.gen';
import type { ApiResponseReject } from "@/plugins/api/spec/core/ApiResult";
import { EventBus } from "@/plugins/events";
import { ToastEvent } from "@/plugins/events/events/toast";

OpenAPI.BASE = import.meta.env.VITE_NACSOS_CORE_URL;

export const API = {
  annotations: AnnotationsService,
  ping: DefaultService,
  evaluation: EvaluationService,
  events: EventsService,
  export: ExportService,
  highlighters: HighlightersService,
  imports: ImportsService,
  mailing: MailingService,
  oauth: OauthService,
  project: ProjectService,
  projects: ProjectsService,
  search: SearchService,
  stats: StatsService,
  users: UsersService,
  pipes: PipesService,
  item: ItemService,
};

export function ignore() {}

export function logReject(reason: ApiResponseReject) {
  console.error(reason);
}

export function toastReject(reason: ApiResponseReject) {
  console.log(reason);
  EventBus.emit(
    new ToastEvent(
      "WARN",
      `Request failed ${reason.error.detail.level}[${reason.status}] ${reason.error?.detail?.type}(${reason.error?.detail?.message})`,
    ),
  );
}

export type { ApiResult, ApiResponseReject, ErrorDetails } from "@/plugins/api/spec/core/ApiResult";
export { ErrorLevel } from "@/plugins/api/spec/core/ApiResult";
