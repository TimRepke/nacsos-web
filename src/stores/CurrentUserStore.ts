import { defineStore } from 'pinia';
import type { RemovableRef } from '@vueuse/core';
import { useStorage } from '@vueuse/core';
import Serializer from '@/types/serializer';
import type { AuthTokenModel, UserModel } from '@/plugins/api/api-core';
import { API, toastReject } from '@/plugins/api';
import { EventBus } from '@/plugins/events';
import { AuthFailedEvent, LoginSuccessEvent, LogoutSuccessEvent } from '@/plugins/events/events/auth';

const UserSerializer = Serializer<UserModel>();
const AuthtokenSerializer = Serializer<AuthTokenModel>();

export type CurrentUserStoreType = {
  user: RemovableRef<UserModel | undefined>,
  authToken: RemovableRef<AuthTokenModel | undefined>,
};

function isAuthTokenValid(token: AuthTokenModel | null | undefined): boolean {
  return !!token && !!token.valid_till && ((new Date(token.valid_till)) >= (new Date()));
}

export const useCurrentUserStore = defineStore('CurrentUserStore', {
  state(): CurrentUserStoreType {
    const user = useStorage<UserModel>(
      'nacsos:UserStore:currentUser',
      null,
      undefined,
      { serializer: UserSerializer },
    );
    const authToken = useStorage<AuthTokenModel>(
      'nacsos:UserStore:authToken',
      null,
      undefined,
      { serializer: AuthtokenSerializer },
    );

    // check if we have a valid auth token from a previous session
    if (!isAuthTokenValid(authToken.value)) {
      // if not, clear the user store
      user.value = undefined;
      authToken.value = undefined;
    }

    return {
      user,
      authToken,
    };
  },
  actions: {
    async login(username: string, password: string) {
      try {
        const token = await API.core.oauth.loginForAccessTokenApiLoginTokenPost({ formData: { username, password } });
        this.setAuthToken(token.data);
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
      this.authToken = undefined;
      this.user = undefined;
      API.core.request.config.TOKEN = undefined;
      API.pipe.request.config.TOKEN = undefined;
    },
    setAuthToken(authToken: AuthTokenModel) {
      this.authToken = authToken;
      API.core.request.config.TOKEN = authToken.token_id;
      API.pipe.request.config.TOKEN = authToken.token_id;
    },
    setUser(user: UserModel) {
      this.user = user;
    },
    async extendAuthTokenValidity() {
      try {
        const newToken = await API.core.oauth.refreshTokenApiLoginTokenTokenIdPut({ tokenId: this.authToken.token_id });
        this.authToken = newToken.data;
      } catch (reason) {
        this.clear();
        console.error(reason);
        // @ts-ignore
        toastReject(reason);
      }
    },
  },
  getters: {
    isLoggedIn(): boolean {
      return !!this.user && this.isAuthTokenValid;
    },
    isAuthTokenValid(): boolean {
      return isAuthTokenValid(this.authToken);
    },
  },
});
