import { defineStore } from 'pinia';
import { useStorage, RemovableRef } from '@vueuse/core';
import Serializer from '@/types/serializer';
import { UserModel } from '@/plugins/api/api-core';
import { coreAPI } from '@/plugins/api';
import { EventBus } from '@/plugins/events';
import { AuthFailedEvent, LoginSuccessEvent } from '@/plugins/events/events/auth';

const UserSerializer = Serializer<UserModel>();

export type CurrentUserStoreType = {
  user: RemovableRef<UserModel>,
  accessToken: RemovableRef<string>,
};

export const useCurrentUserStore = defineStore('CurrentUserStore', {
  state(): CurrentUserStoreType {
    return {
      user: useStorage<UserModel>(
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
    async login(username: string, password: string) {
      coreAPI.oauth.loginForAccessTokenApiLoginTokenPost({
        formData: { username, password },
      }).then(async (response) => {
        this.setAccessToken(response.access_token);
        const currentUserResponse = await coreAPI.oauth.readUsersMeApiLoginMeGet();
        if (!currentUserResponse) {
          EventBus.emit(new AuthFailedEvent());
        } else {
          const user = currentUserResponse;
          this.setUser(user);
          EventBus.emit(new LoginSuccessEvent(user));
        }
      }).catch((reason) => {
        console.error(reason);
      });
    },
    logout() {
      this.clear();
    },
    clear() {
      this.accessToken = undefined;
      this.user = undefined;
      coreAPI.request.config.TOKEN = undefined;
    },
    setAccessToken(accessToken: string) {
      this.accessToken = accessToken;
      coreAPI.request.config.TOKEN = accessToken;
    },
    setUser(user: UserModel) {
      this.user = user;
    },
  },
  getters: {
    isLoggedIn: (state): boolean => !!state.user && !!state.accessToken,
  },
});
