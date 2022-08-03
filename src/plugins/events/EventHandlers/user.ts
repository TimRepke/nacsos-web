import { EventBus } from '@/plugins/events';
import { AuthFailedEvent, LoggedOutEvent, LoginSuccessEvent, UserLoginEvent } from '@/plugins/events/events/auth';
import { callCurrentUserEndpoint, callLoginEndpoint } from '@/plugins/api/login';
import { currentUserStore } from '@/stores';
import { useRouter } from 'vue-router';

export default () => {
  EventBus.on(UserLoginEvent, (event: UserLoginEvent) => {
    const { username, password } = event;
    callLoginEndpoint({
      username,
      password,
    })
      .then(async (response) => {
        if (!response.payload || !response.payload.accessToken) {
          EventBus.emit(new AuthFailedEvent());
        } else {
          currentUserStore.setAccessToken(response.payload.accessToken);

          const currentUserResponse = await callCurrentUserEndpoint();
          if (!currentUserResponse || !currentUserResponse.payload) {
            EventBus.emit(new AuthFailedEvent());
          } else {
            const user = currentUserResponse.payload;
            currentUserStore.setUser(user);
            EventBus.emit(new LoginSuccessEvent(user));
          }
        }
      })
      .catch((reason) => {
        EventBus.emit(new AuthFailedEvent());
        console.error(reason);
      });
  });

  EventBus.on(AuthFailedEvent, () => {
    currentUserStore.clear();
  });

  EventBus.on(LoggedOutEvent, () => {
    currentUserStore.clear();
  });
};
