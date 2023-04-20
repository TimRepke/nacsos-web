import { defineStore } from 'pinia';
import { useStorage } from '@vueuse/core';
import type { RemovableRef } from '@vueuse/core';
import Serializer from '@/types/serializer';
import type { UserModel } from '@/plugins/api/api-core';
import { API } from '@/plugins/api';
import { EventBus } from '@/plugins/events';
import { AuthFailedEvent, LoginSuccessEvent, LogoutSuccessEvent } from '@/plugins/events/events/auth';

const UserSerializer = Serializer<UserModel>();

export type CurrentUserStoreType = {
  user: RemovableRef<UserModel | undefined>,
  accessToken: RemovableRef<string | undefined>,
};

export const useCurrentUserStore = defineStore('CurrentUserStore', {
  state(): CurrentUserStoreType {
    return {
      user: useStorage<UserModel>(
        'nacsos:UserStore:currentUser',
        null,
        undefined,
        { serializer: UserSerializer },
      ),
      accessToken: useStorage<string>(
        'nacsos:UserStore:accessToken',
        null,
        undefined,
      ),
    };
  },
  actions: {
    async login(username: string, password: string) {
      try {
        const token = await API.core.oauth.loginForAccessTokenApiLoginTokenPost({ formData: { username, password } });
        this.setAccessToken(token.data.token_id);
        const me = await API.core.oauth.readUsersMeApiLoginMeGet();
        this.setUser(me.data);
        EventBus.emit(new LoginSuccessEvent(me.data));
      } catch (reason) {
        this.clear();
        console.error(reason);
        EventBus.emit(new AuthFailedEvent());
      }
    },
    async logout() {
      try {
        if (this.accessToken) {
          await API.core.oauth.logoutApiLoginLogoutGet();
        }
      } catch (reason) {
        console.error(reason);
      }
      this.clear();
      EventBus.emit(new LogoutSuccessEvent());
    },
    clear() {
      this.accessToken = undefined;
      this.user = undefined;
      API.core.request.config.TOKEN = undefined;
      API.pipe.request.config.TOKEN = undefined;
    },
    setAccessToken(accessToken: string) {
      this.accessToken = accessToken;
      API.core.request.config.TOKEN = accessToken;
      API.pipe.request.config.TOKEN = accessToken;
    },
    setUser(user: UserModel) {
      this.user = user;
    },
  },
  getters: {
    isLoggedIn: (state): boolean => !!state.user && !!state.accessToken,
  },
});
