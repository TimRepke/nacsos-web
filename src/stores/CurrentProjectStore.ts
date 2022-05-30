import { defineStore } from 'pinia';
import { useStorage, RemovableRef } from '@vueuse/core';
import Serializer from '@/types/serializer';
import { callProjectInfoEndpoint, callUserProjectPermissionsEndpoint } from '@/plugins/api/projects';
import { Project, ProjectPermissions } from '@/types/project.d';
import { EventBus } from '@/plugins/events';
import { CurrentProjectSetEvent } from '@/plugins/events/events/projects';

const ProjectSerializer = Serializer<Project>();
const ProjectPermissionSerializer = Serializer<ProjectPermissions>();

export type CurrentProjectStoreType = {
  project?: RemovableRef<Project>,
  projectPermissions?: RemovableRef<ProjectPermissions>,
}

export const useCurrentProjectStore = defineStore('CurrentProjectStore', {
  state: () => ({
    project: useStorage<Project>(
      'currentProject',
      null,
      undefined,
      { serializer: ProjectSerializer },
    ),
    projectPermissions: useStorage<ProjectPermissions>(
      'currentProjectPermissions',
      null,
      undefined,
      { serializer: ProjectPermissionSerializer },
    ),
  } as CurrentProjectStoreType),
  actions: {
    clear() {
      this.project = undefined;
      this.projectPermissions = undefined;
    },
    setProject(projectId: string) {
      Promise
        .allSettled([
          callProjectInfoEndpoint({ projectId }),
          callUserProjectPermissionsEndpoint({ projectId }),
        ])
        .then((values) => {
          const [projectInfo, projectPermissions] = values;
          if (projectInfo.status === 'fulfilled' && projectPermissions.status === 'fulfilled') {
            this.project = projectInfo.value.payload;
            this.projectPermissions = projectPermissions.value.payload;
            EventBus.emit(new CurrentProjectSetEvent(this.project, this.projectPermissions));
          } else {
            console.error(values);
          }
        });
    },
  },
  getters: {
    // TODO
  },
});
