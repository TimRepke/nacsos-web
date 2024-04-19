import { createPinia } from "pinia";
import { useCurrentUserStore } from "@/stores/CurrentUserStore";
import { useCurrentProjectStore } from "@/stores/CurrentProjectStore";
import { useInterfaceSettingsStore } from "@/stores/InterfaceSettingsStore";
import { useRequestsStore } from "@/stores/RequestsStore";
import { ClearUserStoreEvent } from "@/plugins/events/events/auth";
import { EventBus } from "@/plugins/events";
import { usePlatformUsersStore } from "@/stores/PlatformUsersStore";
import { OpenAPI } from "@/plugins/api/spec";

const pinia = createPinia();

export const currentUserStore = useCurrentUserStore(pinia);
export const currentProjectStore = useCurrentProjectStore(pinia);
export const platformUsersStore = usePlatformUsersStore(pinia);
export const interfaceSettingsStore = useInterfaceSettingsStore(pinia);
export const requestsStore = useRequestsStore(pinia);

EventBus.on(ClearUserStoreEvent, currentUserStore.clear);

if (currentUserStore.isAuthTokenValid) {
  OpenAPI.TOKEN = currentUserStore.authToken?.token_id;
}

export default pinia;
