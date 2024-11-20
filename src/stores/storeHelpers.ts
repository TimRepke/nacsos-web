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

  function clear() {
    promise = null;
    value.value = fallback;
    status.value.loaded = false;
    status.value.loading = false;
  }

  async function reload(): Promise<T> {
    promise = new Promise<T>((resolve) => {
      if (!currentProjectStore.projectId) {
        clear();
        resolve(fallback);
      }
      status.value.loading = true;
      request()
        .then((res) => {
          status.value.loaded = true;
          value.value = res;
        })
        .catch((e) => {
          status.value.loaded = false;
          value.value = fallback;
          console.error(e);
        })
        .finally(() => {
          status.value.loading = false;
          resolve(value.value);
        });
    });
    return promise;
  }

  async function awaitLoaded(): Promise<T> {
    if (promise) return promise;
    return new Promise<T>((resolve, reject) => {
      const { loading, loaded } = status.value;
      if (!loading && !loaded) reload().then(resolve).catch(reject);
      else resolve(fallback);
    });
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
