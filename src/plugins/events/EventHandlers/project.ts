import { EventBus } from "@/plugins/events";
import { CurrentProjectSelectedEvent } from "@/plugins/events/events/projects";
import { currentProjectStore } from "@/stores";
import { LoggedOutEvent } from "@/plugins/events/events/auth";

export default () => {
  EventBus.on(CurrentProjectSelectedEvent, (event: CurrentProjectSelectedEvent) => {
    const { projectId } = event;

    currentProjectStore.load(projectId).then().catch();
  });

  EventBus.on(LoggedOutEvent, () => {
    currentProjectStore.clear();
  });
};
