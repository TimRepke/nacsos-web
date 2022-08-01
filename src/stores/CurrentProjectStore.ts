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
  projectId: RemovableRef<string>,
  project: RemovableRef<Project>,
  projectPermissions: RemovableRef<ProjectPermissions>,
}

export const useCurrentProjectStore = defineStore('CurrentProjectStore', {
  state: () => ({
    projectId: useStorage<string>(
      'currentProjectId',
      null,
      undefined,
    ),
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
      this.projectId = undefined;
      this.project = undefined;
      this.projectPermissions = undefined;
    },
    setProject(projectId: string) {
      this.clear();
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
            this.projectId = projectInfo.value.payload?.project_id;
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
