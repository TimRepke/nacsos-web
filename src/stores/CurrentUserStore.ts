import { defineStore } from "pinia";
import type { RemovableRef } from "@vueuse/core";
import { useStorage } from "@vueuse/core";
import Serializer from "@/types/serializer";
import type { AuthTokenModel, UserModel } from "@/plugins/api/spec/types.gen";
import { API, toastReject, OpenAPI } from "@/plugins/api";
import { EventBus } from "@/plugins/events";
import { AuthFailedEvent, LoginSuccessEvent, LogoutSuccessEvent } from "@/plugins/events/events/auth";

const UserSerializer = Serializer<UserModel | null, null>(null);
const AuthtokenSerializer = Serializer<AuthTokenModel | null, null>(null);

export type CurrentUserStoreType = {
  user: RemovableRef<UserModel | null>;
  authToken: RemovableRef<AuthTokenModel | null>;
};

function isAuthTokenValid(token: AuthTokenModel | null | undefined): boolean {
  return !!token && !!token.valid_till && new Date(token.valid_till) >= new Date();
}

export const useCurrentUserStore = defineStore("CurrentUserStore", {
  state(): CurrentUserStoreType {
    const user = useStorage<UserModel | null>("nacsos:UserStore:currentUser", null, undefined, {
      serializer: UserSerializer,
    });
    const authToken = useStorage<AuthTokenModel | null>("nacsos:UserStore:authToken", null, undefined, {
      serializer: AuthtokenSerializer,
    });

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
        const token = await API.oauth.loginForAccessTokenApiLoginTokenPost({ body: { username, password } });
        this.setAuthToken(token.data);
        const me = await API.oauth.readUsersMeApiLoginMeGet();
        this.setUser(me.data);
        EventBus.emit(new LoginSuccessEvent(me.data));
      } catch (reason) {
        this.clear();
        console.error(reason);
        // @ts-ignore
        EventBus.emit(new AuthFailedEvent(reason.error?.detail));
      }
    },
    async loginWithAuthToken(token: string) {
      OpenAPI.setToken(token);
      try {
        const userTokens = (await API.oauth.readTokensMeApiLoginMyTokensGet()).data;
        if (userTokens[0].token_id === token) {
          this.setAuthToken(userTokens[0]);
          const me = await API.oauth.readUsersMeApiLoginMeGet();
          this.setUser(me.data);
          EventBus.emit(new LoginSuccessEvent(me.data));
        } else {
          throw Error("Invalid token!");
        }
      } catch (reason) {
        this.clear();
        console.error(reason);
        // @ts-ignore
        EventBus.emit(new AuthFailedEvent(reason.error?.detail));
      }
    },
    async logout() {
      try {
        if (this.authToken) {
          await API.oauth.logoutApiLoginLogoutGet();
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
      OpenAPI.unsetToken();
    },
    setAuthToken(authToken: AuthTokenModel) {
      this.authToken = authToken;
      OpenAPI.setToken(authToken.token_id);
    },
    setUser(user: UserModel) {
      this.user = user;
    },
    async extendAuthTokenValidity() {
      try {
        if (this.authToken) {
          const newToken = await API.oauth.refreshTokenApiLoginTokenTokenIdPut({
            path: { token_id: this.authToken.token_id },
          });
          this.authToken = newToken.data;
        }
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
    isSudo(): boolean {
      return !!this.user && this.user.is_superuser && this.user.is_active;
    },
  },
});
