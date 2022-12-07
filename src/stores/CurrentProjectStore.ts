import { defineStore } from 'pinia';
import { useStorage, RemovableRef } from '@vueuse/core';
import { ProjectModel, ProjectPermissionsModel } from '@/plugins/api/api-core';
import Serializer from '@/types/serializer';

const ProjectSerializer = Serializer<ProjectModel>();
const ProjectPermissionSerializer = Serializer<ProjectPermissionsModel>();

export type CurrentProjectStoreType = {
  projectId: RemovableRef<string>,
  project: RemovableRef<ProjectModel>,
  projectPermissions: RemovableRef<ProjectPermissionsModel>,
};

export const useCurrentProjectStore = defineStore('CurrentProjectStore', {
  state(): CurrentProjectStoreType {
    // When a user logs out, also clear the current project to prevent side effects
    // EventBus.on(LoggedOutEvent, this.clear); // FIXME: may not be the desired behaviour

    return {
      projectId: useStorage<string>(
        'currentProjectId',
        null,
        undefined,
      ),
      project:
        useStorage<ProjectModel>(
          'currentProject',
          null,
          undefined,
          { serializer: ProjectSerializer },
        ),
      projectPermissions:
        useStorage<ProjectPermissionsModel>(
          'currentProjectPermissions',
          null,
          undefined,
          { serializer: ProjectPermissionSerializer },
        ),
    };
  },
  actions: {
    clear() {
      this.projectId = undefined;
      this.project = undefined;
      this.projectPermissions = undefined;
    },
  },
  getters: {
    projectSelected: (state): boolean => !!state.project && !!state.projectId && !!state.projectPermissions,
  },
});
