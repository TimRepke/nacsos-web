import { defineStore } from 'pinia';
import { useStorage, RemovableRef } from '@vueuse/core';
import type { User } from '@/types/user.d';
import Serializer from '@/types/serializer';

const UserSerializer = Serializer<User>();

export type CurrentUserStoreType = {
  user: RemovableRef<User>,
  accessToken: RemovableRef<string>,
}

export const useCurrentUserStore = defineStore('CurrentUserStore', {
  state(): CurrentUserStoreType {
    return {
      user: useStorage<User>(
        'currentUser',
        null,
        undefined,
        { serializer: UserSerializer },
      ),
      accessToken: useStorage<string>(
        'accessToken',
        null,
        undefined,
      ),
    };
  },
  actions: {
    clear() {
      this.accessToken = undefined;
      this.user = undefined;
    },
    setAccessToken(accessToken: string) {
      this.accessToken = accessToken;
    },
    setUser(user: User) {
      this.user = user;
    },
  },
  getters: {
    isLoggedIn: (state): boolean => !!state.user && !!state.accessToken,
  },
});
