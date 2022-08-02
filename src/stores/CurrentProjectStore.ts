import { defineStore } from 'pinia';
import { useStorage, RemovableRef } from '@vueuse/core';
import { Project, ProjectPermissions } from '@/types/project.d';
import Serializer from '@/types/serializer';

const ProjectSerializer = Serializer<Project>();
const ProjectPermissionSerializer = Serializer<ProjectPermissions>();

export type CurrentProjectStoreType = {
  projectId: RemovableRef<string>,
  project: RemovableRef<Project>,
  projectPermissions: RemovableRef<ProjectPermissions>,
}

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
        useStorage<Project>(
          'currentProject',
          null,
          undefined,
          { serializer: ProjectSerializer },
        ),
      projectPermissions:
        useStorage<ProjectPermissions>(
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
