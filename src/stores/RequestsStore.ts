import { defineStore } from "pinia";

export type RequestsStoreType = {
  numRequests: number;
};

export const useRequestsStore = defineStore("RequestsStore", {
  state(): RequestsStoreType {
    return {
      numRequests: 0,
    };
  },
  getters: {
    hasActiveRequest(): boolean {
      return this.numRequests > 0;
    },
  },
  actions: {
    logRequestStart(): void {
      this.numRequests += 1;
    },
    logRequestEnd(): void {
      this.numRequests -= 1;
      if (this.numRequests < 0) this.numRequests = 0;
    },
  },
});
