import { defineStore } from "pinia";
import { useStorage } from "@vueuse/core";
import type { RemovableRef } from "@vueuse/core";
import type { ProjectModel, ProjectPermissionsModel } from "@/plugins/api/spec/types.gen";
import Serializer from "@/types/serializer";
import { type ProjectUsers, useProjectUsers } from "@/stores/CurrentProjectStore/projectUsers.ts";

const ProjectSerializer = Serializer<ProjectModel>();
const ProjectPermissionSerializer = Serializer<ProjectPermissionsModel>();

export type CurrentProjectStoreType = {
  projectId: RemovableRef<string | undefined>;
  project: RemovableRef<ProjectModel | undefined>;
  projectPermissions: RemovableRef<ProjectPermissionsModel | undefined>;
  projectUsers: ProjectUsers;
};

export const useCurrentProjectStore = defineStore("CurrentProjectStore", {
  state(): CurrentProjectStoreType {
    // When a user logs out, also clear the current project to prevent side effects
    // EventBus.on(LoggedOutEvent, this.clear); // FIXME: may not be the desired behaviour
    const state = {
      projectId: useStorage<string>("nacsos:ProjectStore:currentProjectId", null, undefined),
      project: useStorage<ProjectModel>("nacsos:ProjectStore:currentProject", null, undefined, {
        serializer: ProjectSerializer,
      }),
      projectPermissions: useStorage<ProjectPermissionsModel>(
        "nacsos:ProjectStore:currentProjectPermissions",
        null,
        undefined,
        { serializer: ProjectPermissionSerializer },
      ),
      projectUsers: useProjectUsers(),
    };

    return state;
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
