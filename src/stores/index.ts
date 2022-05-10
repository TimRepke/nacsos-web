import { useCurrentUserStore } from '@/stores/CurrentUserStore';
import { createPinia } from 'pinia';

const pinia = createPinia();
export const currentUserStore = useCurrentUserStore(pinia);

export default pinia;
