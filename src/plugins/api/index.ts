import { App } from 'vue';
import { CoreClient } from './api-core';
import { PipelinesClient } from './api-pipe';

const API = {
  pipe: new PipelinesClient({
    BASE: 'http://localhost:8000',
  }),
  core: new CoreClient({
    BASE: 'http://localhost:8081',
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
