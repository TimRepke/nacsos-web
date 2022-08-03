import { EventBus } from '@/plugins/events';
import { CurrentProjectSelectedEvent, CurrentProjectSetEvent } from '@/plugins/events/events/projects';
import { callProjectInfoEndpoint, callUserProjectPermissionsEndpoint } from '@/plugins/api/projects';
import { currentProjectStore } from '@/stores';
import { LoggedOutEvent } from '@/plugins/events/events/auth';
import { useRouter } from 'vue-router';

export default () => {
  EventBus.on(CurrentProjectSelectedEvent, (event: CurrentProjectSelectedEvent) => {
    const { projectId } = event;

    // clear the current project from the store temporarily to prevent side effects
    currentProjectStore.clear();
    // set the projectId first, so it can be used during the following requests
    currentProjectStore.projectId = projectId;
    Promise
      .allSettled([
        callProjectInfoEndpoint({ projectId }),
        callUserProjectPermissionsEndpoint({ projectId }),
      ])
      .then((values) => {
        const [projectInfo, projectPermissions] = values;
        if (
          projectInfo.status === 'fulfilled' && projectInfo.value.payload
          && projectPermissions.status === 'fulfilled' && projectPermissions.value.payload
        ) {
          const project = projectInfo.value.payload;
          const projectPerms = projectPermissions.value.payload;
          currentProjectStore.project = project;
          currentProjectStore.projectPermissions = projectPerms;
          EventBus.emit(new CurrentProjectSetEvent(project, projectPerms));
        } else {
          console.error(values);
        }
      });
  });

  EventBus.on(LoggedOutEvent, () => {
    currentProjectStore.clear();
  });
};
