import { defineStore } from "pinia";
import { useStorage } from "@vueuse/core";
import type { RemovableRef } from "@vueuse/core";
import Serializer from "@/types/serializer";
import { API } from "@/plugins/api";
import type { ProjectModel, ProjectPermissionsModel } from "@/plugins/api/spec/types.gen";
import { type Users, useProjectUsers } from "@/stores/CurrentProjectStore/users";
import { type ProjectHighlighterStore, useProjectHighlighters } from "@/stores/CurrentProjectStore/highlighters";
import { EventBus } from "@/plugins/events";
import { CurrentProjectSetEvent } from "@/plugins/events/events/projects";
import { ScopesStore, useScopesStore } from "@/stores/CurrentProjectStore/scopes";
import { ProjectAnnotationSchemesStore, useProjectAnnotationSchemesStore } from "@/stores/CurrentProjectStore/schemes";
import { ComputedGetter, computed } from "vue";

const ProjectSerializer = Serializer<ProjectModel | null, null>(null);
const ProjectPermissionSerializer = Serializer<ProjectPermissionsModel | null, null>(null);

export type CurrentProjectStoreType = {
  projectId: RemovableRef<string | undefined>;
  project: RemovableRef<ProjectModel | undefined>;
  permissions: RemovableRef<ProjectPermissionsModel | undefined>;
  users: Users;
  highlighters: ProjectHighlighterStore;
  scopes: ScopesStore;
  schemes: ProjectAnnotationSchemesStore;
  hasRunningImport: ComputedGetter<boolean>;
};

export const useCurrentProjectStore = defineStore("CurrentProjectStore", () => {
  const projectId = useStorage<string>("nacsos:ProjectStore:currentProjectId", null, undefined);
  const project = useStorage<ProjectModel | null>("nacsos:ProjectStore:currentProject", null, undefined, {
    serializer: ProjectSerializer,
  });
  const permissions = useStorage<ProjectPermissionsModel | null>(
    "nacsos:ProjectStore:currentProjectPermissions",
    null,
    undefined,
    { serializer: ProjectPermissionSerializer },
  );

  const users = useProjectUsers();
  const highlighters = useProjectHighlighters();
  const scopes = useScopesStore();
  const schemes = useProjectAnnotationSchemesStore();

  const projectSelected = computed<boolean>(() => !!project.value && !!projectId.value && !!permissions.value);
  const hasRunningImport = computed<boolean>(() => !!project.value?.import_mutex);
  const userCanResetImportMutex = computed<boolean>(() => !!permissions.value?.imports_edit && hasRunningImport.value);

  function clear() {
    projectId.value = undefined;
    project.value = undefined;
    permissions.value = undefined;
    highlighters.clear();
    users.clear();
    scopes.clear();
    schemes.clear();
  }

  async function refreshInfo(): Promise<ProjectModel | undefined> {
    if (projectId.value) {
      const { data } = await API.project.getProjectApiProjectInfoGet({ headers: { "x-project-id": projectId.value } });
      project.value = data;
      return data;
    }
    return undefined;
  }

  async function refreshPermissions(): Promise<ProjectPermissionsModel | undefined> {
    if (projectId.value) {
      const { data } = await API.project.getProjectPermissionsCurrentUserApiProjectPermissionsMeGet({
        headers: { "x-project-id": projectId.value },
      });
      permissions.value = data;
      return data;
    }
    return undefined;
  }

  async function unsetImportMutex() {
    if (projectId.value) {
      await API.project.resetImportMutexApiProjectImportMutexPut({ headers: { "x-project-id": projectId.value } });
      await refreshInfo();
    }
  }

  async function load(newProjectId: string) {
    // clear the current project from the store temporarily to prevent side effects
    clear();
    // set the projectId first, so it can be used during the following requests
    projectId.value = newProjectId;

    const project = await refreshInfo();
    const permissions = await refreshPermissions();
    if (permissions && project) {
      users.ensureLoaded();
      highlighters.ensureLoaded();

      // These are on-demand, so no need to load it here
      // this.scopes.reload();
      // this.schemes.reload();

      EventBus.emit(new CurrentProjectSetEvent(project, permissions));
    }
  }

  return {
    projectId,
    project,
    permissions,
    users,
    highlighters,
    schemes,
    scopes,
    projectSelected,
    hasRunningImport,
    userCanResetImportMutex,
    refreshInfo,
    refreshPermissions,
    unsetImportMutex,
    load,
    clear,
  };
});
