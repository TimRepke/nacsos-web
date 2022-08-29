import { App } from 'vue';
import { OpenAPIConfig } from '@/plugins/api/core/OpenAPI';
import { CoreClient } from './api-core';
import { PipelinesClient } from './api-pipe';

const pipelinesAPI = new PipelinesClient({
  BASE: 'http://localhost:8000',
});

const coreAPI = new CoreClient({
  BASE: 'http://localhost:8081',
} as OpenAPIConfig);

export default {
  install(app: App) {
    // eslint-disable-next-line no-param-reassign
    app.config.globalProperties.$coreAPI = coreAPI;
    // eslint-disable-next-line no-param-reassign
    app.config.globalProperties.$pipelineAPI = pipelinesAPI;
  },
};

export { pipelinesAPI, coreAPI };
