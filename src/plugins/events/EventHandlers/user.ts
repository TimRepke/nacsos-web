import { EventBus } from '@/plugins/events';
import { AuthFailedEvent, LoggedOutEvent, UserLoginEvent } from '@/plugins/events/events/auth';
import { currentUserStore } from '@/stores';

export default () => {
  EventBus.on(UserLoginEvent, async (event: UserLoginEvent) => {
    const { username, password } = event;
    await currentUserStore.login(username, password);
  });

  EventBus.on(AuthFailedEvent, () => {
    currentUserStore.clear();
  });

  EventBus.on(LoggedOutEvent, () => {
    currentUserStore.clear();
  });
};
