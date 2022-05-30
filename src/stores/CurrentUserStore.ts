import { defineStore } from 'pinia';
import { useStorage, RemovableRef } from '@vueuse/core';
import type { User } from '@/types/user.d';
import Serializer from '@/types/serializer';
import { EventBus } from '@/plugins/events';
import {
  AuthFailedEvent,
  AuthTokenReceivedEvent,
  LoginSuccessEvent,
} from '@/plugins/events/events/auth';
import { callCurrentUserEndpoint, callLoginEndpoint } from '@/plugins/api/login';

const UserSerializer = Serializer<User>();

export type CurrentUserStoreType = {
  user?: RemovableRef<User>,
  accessToken?: RemovableRef<string>,
}

export const useCurrentUserStore = defineStore('CurrentUserStore', {
  state: () => ({
    user: useStorage<User>(
      'currentUser',
      null,
      undefined,
      { serializer: UserSerializer },
    ),
    accessToken: useStorage<string>('accessToken', null),
  } as CurrentUserStoreType),
  actions: {
    clear() {
      this.logout();
    },
    logout() {
      this.accessToken = undefined;
      this.user = undefined;
    },
    async login(username: string, password: string) {
      try {
        const loginResponse = await callLoginEndpoint({ username, password });
        const accessToken = loginResponse.payload?.accessToken;
        this.accessToken = accessToken;
        EventBus.emit(new AuthTokenReceivedEvent(this.accessToken));

        const currentUserResponse = await callCurrentUserEndpoint();
        this.user = currentUserResponse.payload;

        EventBus.emit(new LoginSuccessEvent(this.user));
      } catch (error) {
        console.error(error);
        EventBus.emit(new AuthFailedEvent());
      }
    },
  },
  getters: {
    isLoggedIn: (state): boolean => !!state.user && !!state.accessToken,
  },
});
