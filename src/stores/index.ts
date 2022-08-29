import { useCurrentUserStore } from '@/stores/CurrentUserStore';
import { useCurrentProjectStore } from '@/stores/CurrentProjectStore';
import { createPinia } from 'pinia';
import { coreAPI } from '@/plugins/api';

const pinia = createPinia();

export const currentUserStore = useCurrentUserStore(pinia);
export const currentProjectStore = useCurrentProjectStore(pinia);

if (currentUserStore.accessToken) {
  coreAPI.request.config.TOKEN = currentUserStore.accessToken;
}
export default pinia;
