import { Ref, ref, toRef } from "vue";
import { ignore, toastReject } from "@/plugins/api";
import { currentProjectStore } from "@/stores/index";

export interface LoadStatus {
  loading: boolean;
  loaded: boolean;
}

export interface DeferredValue<T> {
  value: Ref<T>;
  status: Ref<LoadStatus>;
  clear: () => void;
  reload: () => Promise<T>;
  awaitLoaded: () => Promise<T>;
  ensureLoaded: () => void;
}

export function useDeferredValue<T>(fallback: T, request: () => Promise<T>) {
  const value = ref<T>(fallback) as Ref<T>;
  const status = ref<LoadStatus>({
    loaded: false,
    loading: false,
  }) as Ref<LoadStatus>;

  let promise: Promise<T> | null = null;
  let requestId = 0;

  function clear() {
    requestId += 1; // invalidate in-flight requests so their responses are dropped
    promise = null;
    value.value = fallback;
    status.value.loaded = false;
    status.value.loading = false;
  }

  async function reload(): Promise<T> {
    if (!currentProjectStore.projectId) {
      clear();
      return fallback;
    }
    const id = ++requestId;
    status.value.loading = true;
    promise = request()
      .then((res) => {
        if (id === requestId) {
          status.value.loaded = true;
          value.value = res;
          return res;
        }
        return value.value; // stale response -> drop it
      })
      .catch((e) => {
        if (id === requestId) {
          status.value.loaded = false;
          value.value = fallback;
        }
        console.error(e);
        return value.value;
      })
      .finally(() => {
        if (id === requestId) status.value.loading = false;
      });
    return promise;
  }

  async function awaitLoaded(): Promise<T> {
    if (promise) return promise;
    if (status.value.loaded) return value.value;
    return reload();
  }

  function ensureLoaded() {
    const { loading, loaded } = status.value;
    if (!loading && !loaded) reload().then(ignore).catch(toastReject);
  }

  return {
    value: toRef(value),
    status: toRef(status),
    clear,
    reload,
    awaitLoaded,
    ensureLoaded,
  };
}
