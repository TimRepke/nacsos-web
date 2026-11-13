<template>
  <div>
    <div class="row pb-2 mb-2 border-bottom g-0">
      <div class="col-md-8">
        <h1>Project settings</h1>
        <h6>
          On this page, you can configure the basic settings for the project and who receives what level of access.
          There are no checks for plausibility, meaning you can possibly corrupt the data for this project, so please
          make sure you know what you do.
        </h6>
      </div>
    </div>
    <div class="row pb-2 mb-2 border-bottom g-0">
      <h4>Project information</h4>
      <template v-if="project">
        <div class="d-flex justify-content-between">
          <div class="me-auto font-monospace text-muted">
            {{ project.project_id }}
          </div>
          <div class="me-3">
            <button type="button" class="btn btn-success btn-sm" @click="saveProject">
              <font-awesome-icon :icon="['fas', 'floppy-disk']" />
              Save
            </button>
          </div>
        </div>
        <div class="row g-2">
          <div class="col">
            <label for="projectName" class="form-label">Project name</label>
            <input
              type="text"
              class="form-control"
              id="projectName"
              placeholder="Project name"
              v-model="project.name"
            />
          </div>
          <div class="col-3">
            <label for="projectType" class="form-label">Project type</label>
            <select id="projectType" class="form-select" v-model="project.type">
              <option value="generic">generic</option>
              <option value="twitter">Twitter</option>
              <option value="academic">Academic (abstracts)</option>
              <!--<option value="patents">Patents</option>-->
              <option value="lexis">LexisNexis</option>
            </select>
          </div>
        </div>
        <div class="row g-2">
          <div class="col">
            <label for="projectDescription" class="form-label">Project description</label>
            <textarea class="form-control" id="projectDescription" rows="4" v-model="project.description" />
          </div>
        </div>
        <div class="row g-2">
          <div class="col-3">
            <div class="form-check form-switch">
              <input
                v-model="project.setting_motivational_quotes"
                :aria-checked="project.setting_motivational_quotes"
                id="settingsMotivationalQuotes"
                class="form-check-input"
                type="checkbox"
                role="switch"
              />
              <label class="form-check-label" for="settingsMotivationalQuotes">
                Motivational quotes during annotation
              </label>
            </div>
          </div>
        </div>
      </template>
      <template v-else>
        <font-awesome-icon :icon="['fas', 'circle-notch']" class="fa-spin" />
        Loading...
      </template>
    </div>
    <div class="row pb-2 mb-2 g-0">
      <h4>User permissions</h4>
      <ul class="list-unstyled">
        <li v-for="permission in permissions" :key="permission.project_permission_id as string" class="mb-3">
          <PermissionSettingsCard :user-permission="permission" @user-deleted="removeUser($event)" />
        </li>
      </ul>
      <div class="row">
        <UserSearchBox class="col-md-4" @user-selected="addUser($event)" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import type { ProjectModel, UserBaseModel, UserPermission } from "@/plugins/api/types";
import { currentProjectStore } from "@/stores";
import { API, logReject } from "@/plugins/api";
import { EventBus } from "@/plugins/events";
import { ToastEvent } from "@/plugins/events/events/toast";
import PermissionSettingsCard from "@/components/users/PermissionSettingsCard.vue";
import UserSearchBox from "@/components/users/UserSearchBox.vue";
import type { Permissions } from "@/types/permissions";
import { PermissionPresets } from "@/types/permissions";

defineOptions({ name: "ProjectSettingsView" });

const project = ref<ProjectModel | undefined>(undefined);
const permissions = ref<UserPermission[]>([]);
const presets: Record<string, Permissions> = PermissionPresets;

onMounted(() => {
  API.project
    .getProjectApiProjectInfoGet({ headers: { "x-project-id": currentProjectStore.projectId as string } })
    .then((response) => {
      const { data } = response;
      project.value = data;
    })
    .catch(logReject);
  API.project
    .getAllUserPermissionsApiProjectPermissionsListUsersGet({
      headers: { "x-project-id": currentProjectStore.projectId as string },
    })
    .then((response) => {
      const { data } = response;
      permissions.value = data;
    })
    .catch(logReject);
});

function addUser(user: UserBaseModel) {
  // make sure this user isn't already in the list
  if (permissions.value.filter((perm: UserPermission) => perm.user_id === user.user_id).length > 0) {
    EventBus.emit(new ToastEvent("WARN", "This user appears to already have access."));
  } else {
    const newPermission: UserPermission = {
      ...JSON.parse(JSON.stringify(presets.Annotator)),
      project_id: currentProjectStore.projectId,
      project_permission_id: crypto.randomUUID(),
      user_id: user.user_id,
      user,
    };
    permissions.value.push(newPermission);
    EventBus.emit(new ToastEvent("INFO", "Please remember to adjust settings and then save."));
  }
}

function removeUser(userPermission: UserPermission) {
  // remove from the page so it's hidden
  const rmIdx: number = permissions.value.findIndex(
    (permission: UserPermission) => permission.project_permission_id === userPermission.project_permission_id,
  );
  console.log(rmIdx);
  if (rmIdx >= 0) {
    permissions.value.splice(rmIdx, 1);
  }
}

function saveProject() {
  if (project.value !== undefined) {
    API.project
      .saveProjectApiProjectInfoPut({
        body: project.value,
        headers: { "x-project-id": currentProjectStore.projectId as string },
      })
      .then(() => {
        EventBus.emit(new ToastEvent("SUCCESS", "Saved!"));
      })
      .catch(() => {
        EventBus.emit(new ToastEvent("ERROR", "Failed to save."));
      });
  } else {
    // Should never happen (unless data is still loading and user clicked button)
    EventBus.emit(new ToastEvent("WARN", "Something is very wrong. Please reload and try again."));
  }
}
</script>
