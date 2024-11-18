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

const ProjectSerializer = Serializer<ProjectModel>();
const ProjectPermissionSerializer = Serializer<ProjectPermissionsModel>();

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
  const project = useStorage<ProjectModel>("nacsos:ProjectStore:currentProject", null, undefined, {
    serializer: ProjectSerializer,
  });
  const permissions = useStorage<ProjectPermissionsModel>(
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
  const hasRunningImport = computed<boolean>(() => !!project.value.import_mutex);
  const userCanResetImportMutex = computed<boolean>(() => !!permissions.value.imports_edit && hasRunningImport.value);

  function clear() {
    projectId.value = undefined;
    project.value = undefined;
    permissions.value = undefined;
    highlighters.clear();
    users.clear();
    scopes.clear();
    schemes.clear();
  }

  async function refreshInfo(): Promise<ProjectModel> {
    const { data } = await API.project.getProjectApiProjectInfoGet({ xProjectId: this.projectId });
    this.project = data;
    return data;
  }

  async function refreshPermissions(): Promise<ProjectPermissionsModel> {
    const { data } = await API.project.getProjectPermissionsCurrentUserApiProjectPermissionsMeGet({
      xProjectId: this.projectId,
    });
    this.projectPermissions = data;
    return data;
  }

  async function unsetImportMutex() {
    await API.project.resetImportMutexApiProjectImportMutexPut({ xProjectId: this.projectId });
    await this.refreshInfo();
  }

  async function load(projectId: string) {
    // clear the current project from the store temporarily to prevent side effects
    this.clear();
    // set the projectId first, so it can be used during the following requests
    this.projectId = projectId;

    const project = await this.refreshInfo();
    const permissions = await this.refreshPermissions();
    this.users.reload();
    this.highlighters.reload();

    // These are on-demand, so no need to load it here
    // this.scopes.reload();
    // this.schemes.reload();

    EventBus.emit(new CurrentProjectSetEvent(project, permissions));
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
