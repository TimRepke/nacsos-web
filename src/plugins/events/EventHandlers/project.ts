import { EventBus } from '@/plugins/events';
import { CurrentProjectSelectedEvent, CurrentProjectSetEvent } from '@/plugins/events/events/projects';
import { currentProjectStore } from '@/stores';
import { LoggedOutEvent } from '@/plugins/events/events/auth';
import { API } from '@/plugins/api';

export default () => {
  EventBus.on(CurrentProjectSelectedEvent, (event: CurrentProjectSelectedEvent) => {
    const { projectId } = event;

    // clear the current project from the store temporarily to prevent side effects
    currentProjectStore.clear();
    // set the projectId first, so it can be used during the following requests
    currentProjectStore.projectId = projectId;
    Promise
      .allSettled([
        API.core.project.getProjectApiProjectProjectIdInfoGet({ xProjectId: projectId, projectId }),
        API.core.project.getProjectPermissionsCurrentUserApiProjectProjectIdPermissionsMeGet({ xProjectId: projectId }),
      ])
      .then((values) => {
        const [projectInfo, projectPermissions] = values;
        if (
          projectInfo.status === 'fulfilled' && projectInfo.value
          && projectPermissions.status === 'fulfilled' && projectPermissions.value
        ) {
          const project = projectInfo.value.data;
          const projectPerms = projectPermissions.value.data;
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
