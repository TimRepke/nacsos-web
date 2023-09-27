import type { AxiosResponse } from "axios";

export type ApiResult = {
  readonly url: string;
  readonly ok: boolean;
  readonly status: number;
  readonly statusText: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly body: any;
  readonly response: AxiosResponse;
};
