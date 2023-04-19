import { useCurrentUserStore } from '@/stores/CurrentUserStore';
import { useCurrentProjectStore } from '@/stores/CurrentProjectStore';
import { useInterfaceSettingsStore } from '@/stores/InterfaceSettingsStore';
import { createPinia } from 'pinia';
import { API } from '@/plugins/api';
import { useRequestsStore } from '@/stores/RequestsStore';

const pinia = createPinia();

export const currentUserStore = useCurrentUserStore(pinia);
export const currentProjectStore = useCurrentProjectStore(pinia);
export const interfaceSettingsStore = useInterfaceSettingsStore(pinia);
export const requestsStore = useRequestsStore(pinia);

if (currentUserStore.accessToken) {
  API.core.request.config.TOKEN = currentUserStore.accessToken;
  API.pipe.request.config.TOKEN = currentUserStore.accessToken;
}
export default pinia;
