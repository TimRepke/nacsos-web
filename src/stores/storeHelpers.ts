import { Ref, ref, toRef, UnwrapRef } from 'vue';
import { ignore, toastReject } from "@/plugins/api";

export interface LoadStatus {
  loading: boolean;
  loaded: boolean;
}

export interface DeferredValue<T> {
  value: Ref<T>;
  status: Ref<LoadStatus>;
  clear: () => void;
  reload: () => Promise<T>;
  awaitLoaded: () => Promise<void>;
  ensureLoaded: () => void;
}

export function useDeferredValue<T>(fallback: T, request: () => Promise<T>) {
  const value = ref<T>(fallback) as Ref<T>;
  const status = ref<LoadStatus>({
    loaded: false,
    loading: false,
  }) as Ref<LoadStatus>;

  function clear() {
    value.value = fallback;
    status.value.loaded = false;
    status.value.loading = false;
  }

  async function reload(): Promise<T> {
    status.value.loading = true;
    const ret = await request();
    value.value = ret;
    status.value.loaded = true;
    status.value.loading = false;
    return ret;
  }

  async function awaitLoaded() {
    const { loading, loaded } = status.value;
    if (!loading && !loaded) await reload();
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
