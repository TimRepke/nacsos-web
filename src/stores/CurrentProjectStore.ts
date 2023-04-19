import { defineStore } from 'pinia';
import { useStorage } from '@vueuse/core';
import type { RemovableRef } from '@vueuse/core';
import type { ProjectModel, ProjectPermissionsModel } from '@/plugins/api/api-core';
import Serializer from '@/types/serializer';

const ProjectSerializer = Serializer<ProjectModel>();
const ProjectPermissionSerializer = Serializer<ProjectPermissionsModel>();

export type CurrentProjectStoreType = {
  projectId: RemovableRef<string | undefined>,
  project: RemovableRef<ProjectModel | undefined>,
  projectPermissions: RemovableRef<ProjectPermissionsModel | undefined>,
};

export const useCurrentProjectStore = defineStore('CurrentProjectStore', {
  state(): CurrentProjectStoreType {
    // When a user logs out, also clear the current project to prevent side effects
    // EventBus.on(LoggedOutEvent, this.clear); // FIXME: may not be the desired behaviour

    return {
      projectId: useStorage<string>(
        'nacsos:ProjectStore:currentProjectId',
        null,
        undefined,
      ),
      project:
        useStorage<ProjectModel>(
          'nacsos:ProjectStore:currentProject',
          null,
          undefined,
          { serializer: ProjectSerializer },
        ),
      projectPermissions:
        useStorage<ProjectPermissionsModel>(
          'nacsos:ProjectStore:currentProjectPermissions',
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
