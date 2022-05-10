import { defineStore } from 'pinia';
import { useStorage, RemovableRef } from '@vueuse/core';
import { User, UserSerializer } from '@/types/user.model';
import { callLoginEndpoint, callCurrentUserEndpoint } from '@/plugins/api/login';
import { EventBus } from '@/plugins/events';
import { AuthFailedEvent, AuthTokenReceivedEvent, LoginSuccessEvent } from '@/plugins/events/baseEvent';

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
    logout() {
      this.accessToken = undefined;
      this.user = undefined;
      this.$router.push('login');
    },
    login(username: string, password: string) {
      // hook event listener, so that once valid token arrives, additional data is populated
      EventBus.once(AuthTokenReceivedEvent, () => {
        this.populateCurrentUser();
      }, this);

      callLoginEndpoint({ username, password }).then(
        (response) => {
          this.accessToken = response.payload?.accessToken;
        },
        (error) => {
          console.error(error);
          EventBus.emit(new AuthFailedEvent());
        },
      );
    },
    populateCurrentUser() {
      callCurrentUserEndpoint().then(
        (response) => {
          this.user = response.payload;
          EventBus.emit(new LoginSuccessEvent(this.user));
        },
        (error) => {
          console.log(error);
          EventBus.emit(new AuthFailedEvent());
        },
      );
    },
  },
  getters: {
    isLoggedIn: (state): boolean => !!state.user || !!state.accessToken,
  },
});
