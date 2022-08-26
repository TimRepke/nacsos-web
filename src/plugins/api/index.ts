import { App } from 'vue';
import { PipelinesClient } from '@/plugins/client-pipe';
import { CoreClient } from '@/plugins/client-core';

const pipelinesAPI = new PipelinesClient({
  BASE: 'http://localhost:8000',
});

const coreAPI = new CoreClient({
  BASE: 'http://localhost:8081',
});

export default {
  install(app: App) {
    // eslint-disable-next-line no-param-reassign
    app.config.globalProperties.$coreAPI = coreAPI;
    // eslint-disable-next-line no-param-reassign
    app.config.globalProperties.$pipelineAPI = pipelinesAPI;
  },
};

export { pipelinesAPI, coreAPI };
