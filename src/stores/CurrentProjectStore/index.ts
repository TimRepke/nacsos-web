import { defineStore } from "pinia";
import { useStorage } from "@vueuse/core";
import type { RemovableRef } from "@vueuse/core";
import type { ProjectModel, ProjectPermissionsModel } from "@/plugins/api/spec/types.gen";
import Serializer from "@/types/serializer";
import { type ProjectUsers, useProjectUsers } from "@/stores/CurrentProjectStore/projectUsers";
import { API } from "@/plugins/api";
import { type ProjectHighlighterStore, useProjectHighlighters } from "@/stores/CurrentProjectStore/projectHighlighters";

const ProjectSerializer = Serializer<ProjectModel>();
const ProjectPermissionSerializer = Serializer<ProjectPermissionsModel>();

export type CurrentProjectStoreType = {
  projectId: RemovableRef<string | undefined>;
  project: RemovableRef<ProjectModel | undefined>;
  projectPermissions: RemovableRef<ProjectPermissionsModel | undefined>;
  projectUsers: ProjectUsers;
  projectHighlighters: ProjectHighlighterStore;
};

export const useCurrentProjectStore = defineStore("CurrentProjectStore", {
  state(): CurrentProjectStoreType {
    // When a user logs out, also clear the current project to prevent side effects
    // EventBus.on(LoggedOutEvent, this.clear); // FIXME: may not be the desired behaviour
    return {
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
      projectHighlighters: useProjectHighlighters(),
    };
  },
  actions: {
    clear() {
      this.projectId = undefined;
      this.project = undefined;
      this.projectPermissions = undefined;
    },
    async refreshInfo() {
      this.project = (await API.project.getProjectApiProjectInfoGet({ xProjectId: this.projectId })).data;
    },
    async refreshPermissions() {
      this.projectPermissions = (
        await API.project.getProjectPermissionsCurrentUserApiProjectPermissionsMeGet({ xProjectId: this.projectId })
      ).data;
    },
    async unsetImportMutex() {
      await API.project.resetImportMutexApiProjectImportMutexPut({ xProjectId: this.projectId });
      await this.refreshInfo();
    },
  },
  getters: {
    projectSelected: (state): boolean => !!state.project && !!state.projectId && !!state.projectPermissions,
    hasRunningImport: (state): boolean => !!state.project?.import_mutex,

    // FIXME
    // @ts-ignore
    userCanResetImportMutex: (state): boolean => state.projectPermissions?.imports_edit && state.hasRunningImport,
  },
});
