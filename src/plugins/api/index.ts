
import type { AxiosResponse } from "axios";
import {
  Annotations,
  Default,
  Evaluation,
  Events,
  Export,
  Highlighters,
  Imports,
  Mailing,
  Oauth,
  Project,
  Projects,
  Search,
  Stats,
  Users,
  Pipes,
  Item,
  Prio,
} from "./spec/sdk.gen";
import { EventBus } from "@/plugins/events";
import { ToastEvent } from "@/plugins/events/events/toast";

import { client } from "./spec/client.gen";

client.setConfig({
  baseURL: import.meta.env.VITE_NACSOS_CORE_URL,
});

export const API = {
  annotations: Annotations,
  ping: Default,
  evaluation: Evaluation,
  events: Events,
  export: Export,
  highlighters: Highlighters,
  imports: Imports,
  mailing: Mailing,
  oauth: Oauth,
  project: Project,
  projects: Projects,
  search: Search,
  stats: Stats,
  users: Users,
  pipes: Pipes,
  item: Item,
  prio: Prio,
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

export function toastSuccess(txt: string) {
  return () => {
    EventBus.emit(new ToastEvent("SUCCESS", txt));
  };
}

export type ApiResultIntern<TData = any> = {
  readonly body: TData;
  readonly ok: boolean;
  readonly status: number;
  readonly statusText: string;
  readonly url: string;
  readonly response: AxiosResponse;
};

export enum ErrorLevel {
  WARNING = "WARNING",
  ERROR = "ERROR",
}

export type ErrorDetails = {
  level: ErrorLevel;
  type: string;
  message: string;
  args?: unknown[];
  error?: Error;
};

type ApiResponseBase = {
  readonly ok: boolean;
  readonly status: number;
  readonly response?: AxiosResponse;
};

export type ApiResult<T> = ApiResponseBase & { data: T };
export type ApiResponseReject = ApiResponseBase & { error: { detail: ErrorDetails } };
