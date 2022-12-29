import { App } from 'vue';
import { CoreClient } from './api-core';
import { PipelinesClient } from './api-pipe';

const API = {
  pipe: new PipelinesClient({
    BASE: process.env.VUE_APP_NACSOS_PIPE_URL,
  }),
  core: new CoreClient({
    BASE: process.env.VUE_APP_NACSOS_CORE_URL,
  }),
};

export default {
  install(app: App) {
    // eslint-disable-next-line no-param-reassign
    app.config.globalProperties.$API = API;
  },
};
export { API };
export type { ApiResponse, ApiResponseReject, ErrorDetails, ErrorLevel } from '@/plugins/api/core/CancelablePromise';
export { ignore, toastReject, logReject } from '@/plugins/api/core/CancelablePromise';
