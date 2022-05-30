import { useCurrentUserStore } from '@/stores/CurrentUserStore';
import { useCurrentProjectStore } from '@/stores/CurrentProjectStore';
import { createPinia } from 'pinia';

const pinia = createPinia();

export const currentUserStore = useCurrentUserStore(pinia);
export const currentProjectStore = useCurrentProjectStore(pinia);

export default pinia;
