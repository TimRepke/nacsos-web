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
import { ClearUserStoreEvent } from "@/plugins/events/events/auth";
import { useRequestsStore } from "@/stores/RequestsStore";
import { client } from "./spec/client.gen";

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
  readonly response: Response;
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
  readonly response?: Response;
};
export type RejectReason = { detail: ErrorDetails };

export type ApiResult<T> = ApiResponseBase & { data: T };
export type ApiResponseReject = ApiResponseBase & { error: RejectReason };

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
client.setConfig({
  baseUrl: import.meta.env.VITE_NACSOS_CORE_URL,
});

client.interceptors.request.use((request) => {
  const requestsStore = useRequestsStore();
  requestsStore.logRequestStart();
  return request;
});
client.interceptors.response.use((response: Response) => {
  const requestsStore = useRequestsStore();
  requestsStore.logRequestEnd();
  return response;
});
client.interceptors.error.use((reason: unknown | RejectReason) => {
  const requestsStore = useRequestsStore();
  requestsStore.logRequestEnd();
  return reason;
});
client.interceptors.error.use((reason: unknown | RejectReason) => {
  // We might want to log-out when encountering an invalid auth error
  if (reason && typeof reason === "object" && (reason as RejectReason).detail?.type === "NotAuthenticated") {
    EventBus.emit(new ClearUserStoreEvent());
  }
  return reason;
});
export const OpenAPI = {
  ...client,
  setToken: (token: string | undefined) => {
    client.setConfig({ headers: { Authorization: token ? `Bearer ${token}` : undefined } });
  },
  unsetToken: () => client.setConfig({ headers: { Authorization: undefined } }),
};
