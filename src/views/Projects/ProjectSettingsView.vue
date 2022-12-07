<template>
  <div>
    <div class="row pb-2 mb-2 border-bottom g-0">
      <div class="col-md-8">
        <h1>Project settings</h1>
        <h6>
          On this page, you can configure the basic settings for the project and who receives what level of access.
          There are no checks for plausibility, meaning you can possibly corrupt the data for this project,
          so please make sure you know what you do.
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
            <input type="text" class="form-control" id="projectName" placeholder="Project name" v-model="project.name">
          </div>
          <div class="col-3">
            <label for="projectType" class="form-label">Project type</label>
            <select id="projectType" class="form-select" v-model="project.type">
              <option value="generic">generic</option>
              <option value="twitter">Twitter</option>
              <option value="academic">Academic (abstracts)</option>
              <option value="patents">Patents</option>
            </select>
          </div>
        </div>
        <div class="row g-2">
          <div class="col">
            <label for="projectDescription" class="form-label">Project description</label>
            <textarea class="form-control" id="projectDescription" rows="4" v-model="project.description" />
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
        <li
          v-for="permission in permissions"
          :key="permission.project_permission_id"
          class="mb-3">
          <ExpandableBox :initially-open="false">
            <template v-slot:head>
              <strong>{{ permission.user.username }}</strong>&nbsp;
              <span class="text-muted">
                ({{ permission.user.full_name }}&nbsp;|
                <span class="font-monospace">{{ permission.user.email }}</span>)
              </span>
            </template>
            <template v-slot:body>
              <div class="d-flex justify-content-end mb-3">
                <div class="me-2">
                  <div class="dropdown">
                    <button
                      class="btn btn-secondary dropdown-toggle btn-sm"
                      type="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false">
                      Apply preset
                    </button>
                    <ul class="dropdown-menu">
                      <li v-for="(preset, presetName) in presets" :key="presetName">
                        <button class="dropdown-item" type="button" @click="applyPreset(permission, preset)">
                          {{ presetName }}
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>
                <div class="me-2">
                  <button
                    type="button"
                    class="btn btn-danger btn-sm"
                    @click="removeUser(permission.project_permission_id)">
                    <font-awesome-icon :icon="['fas', 'trash-can']" />
                    Remove
                  </button>
                </div>
                <div>
                  <button type="button" class="btn btn-success btn-sm" @click="saveUser(permission)">
                    <font-awesome-icon :icon="['fas', 'floppy-disk']" />
                    Save
                  </button>
                </div>
              </div>
              <div class="row gy-3 gx-4">
                <div
                  v-for="(hint, setting) in hints"
                  :key="setting"
                  class="col-lg-3">
                  <div class="form-check form-switch">
                    <input
                      :id="`toggle-${setting}-${permission.project_permission_id}`"
                      type="checkbox"
                      role="switch"
                      class="form-check-input"
                      v-model="permission[setting]"
                      aria-checked="mixed">
                    <label
                      class="form-check-label"
                      :for="`toggle-${setting}-${permission.project_permission_id}`">
                      <code>{{ setting }}</code>
                    </label>
                  </div>
                  <div class="text-muted small">
                    {{ hint }}
                  </div>
                </div>
              </div>
            </template>
          </ExpandableBox>
        </li>
      </ul>
      <div class="row">
        <div class="col-md-4">
          <div class="m-0">
            <input
              type="text"
              class="form-control mb-1"
              placeholder="Search user to add..."
              v-model="usernameSearch"
              aria-label="Search for users" />
          </div>
          <ul style="max-height: 10rem" class="list-group overflow-auto">
            <li
              v-for="user in searchResults"
              :key="user.user_id"
              class="list-group-item d-flex justify-content-between align-items-start text-muted">
              <div class="me-auto">
                {{ user.name }}
              </div>
              <span
                role="button"
                class="link-secondary"
                tabindex="0"
                @click="addUser(user.user_id)">
                <font-awesome-icon :icon="['fas', 'user-plus']" />
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ProjectModel, UserBaseModel, UserPermission } from '@/plugins/api/api-core';
import { currentProjectStore } from '@/stores';
import { API } from '@/plugins/api';
import ExpandableBox from '@/components/ExpandableBox.vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { EventBus } from '@/plugins/events';
import { ToastEvent } from '@/plugins/events/events/toast';
import { ConfirmationRequestEvent } from '@/plugins/events/events/confirmation';
import { PermissionKeys, Permissions, ProjectPermissionHints, PermissionPresets } from '@/types/permissions';

type SettingsData = {
  project: ProjectModel | undefined;
  permissions: Array<UserPermission>;
  presets: Record<string, Permissions>;
  hints: Record<PermissionKeys, string>;
  users: Array<UserBaseModel>;
  usernameSearch: string;
};

export default {
  name: 'ProjectSettingsView',
  components: { FontAwesomeIcon, ExpandableBox },
  data(): SettingsData {
    return {
      project: undefined as ProjectModel | undefined,
      permissions: [] as UserPermission[],
      users: [] as UserBaseModel[],
      usernameSearch: '',
      presets: PermissionPresets,
      hints: ProjectPermissionHints,
    };
  },
  mounted() {
    API.core.project.getProjectApiProjectInfoGet({ xProjectId: currentProjectStore.projectId })
      .then((response) => {
        const { data } = response;
        this.project = data;
      })
      .catch((reason) => {
        console.log(reason);
      });
    API.core.project.getAllUserPermissionsApiProjectPermissionsListUsersGet({
      xProjectId: currentProjectStore.projectId,
    })
      .then((response) => {
        const { data } = response;
        this.permissions = data;
      })
      .catch((reason) => {
        console.log(reason);
      });
    API.core.users.getAllUsersApiUsersListAllGet({ xProjectId: currentProjectStore.projectId })
      .then((response) => {
        const { data } = response;
        this.users = data;
      })
      .catch((reason) => {
        console.log(reason);
      });
  },
  methods: {
    applyPreset(userPermissions: UserPermission, preset: Permissions) {
      Object.entries(preset).forEach(([key, value]) => {
        // eslint-disable-next-line no-param-reassign
        userPermissions[key as PermissionKeys] = value;
      });
    },
    addUser(userId: string) {
      // make sure this user isn't already in the list
      if (this.permissions.filter((perm: UserPermission) => perm.user_id === userId).length > 0) {
        EventBus.emit(new ToastEvent('WARN', 'This user appears to already have access.'));
      } else {
        const newPermission: UserPermission = {
          ...JSON.parse(JSON.stringify(this.presets.Annotator)),
          project_id: currentProjectStore.projectId,
          project_permission_id: crypto.randomUUID(),
          user_id: userId,
          user: this.userLookup[userId],
        };
        this.permissions.push(newPermission);
        EventBus.emit(new ToastEvent('INFO', 'Please remember to adjust settings and then save.'));
      }
    },
    saveUser(permission: UserPermission) {
      API.core.project.saveProjectPermissionApiProjectPermissionsPermissionPut({
        requestBody: permission,
        xProjectId: currentProjectStore.projectId,
      })
        .then(() => {
          EventBus.emit(new ToastEvent('SUCCESS', 'Saved!'));
        })
        .catch(() => {
          EventBus.emit(new ToastEvent('ERROR', 'Failed to save.'));
        });
    },
    removeUser(projectPermissionId: string) {
      EventBus.emit(new ConfirmationRequestEvent(
        'Do you really want to remove access for this user?',
        (confirmationResponse) => {
          if (confirmationResponse === 'ACCEPT') {
            API.core.project.removeProjectPermissionApiProjectPermissionsPermissionDelete({
              projectPermissionId,
              xProjectId: currentProjectStore.projectId,
            })
              .then(() => {
                EventBus.emit(new ToastEvent('SUCCESS', 'Removed permission!'));
              })
              .catch(() => {
                // Deletion may not only fail on server error but also when the user removes a new permission that wasn't saved yet.
                EventBus.emit(new ToastEvent('WARN', 'May have failed to remove permission, please reload page if you are unsure.'));
              });
          }
        },
        'Remove user permission',
      ));

      // remove from the page so it's hidden
      const rmIdx: number = this.permissions
        .findIndex((permission: UserPermission) => permission.project_permission_id === projectPermissionId);
      if (rmIdx >= 0) {
        this.permissions.splice(rmIdx, 1);
      }
    },
    saveProject() {
      if (this.project !== undefined) {
        API.core.project.saveProjectApiProjectInfoPut({
          requestBody: this.project,
          xProjectId: currentProjectStore.projectId,
        })
          .then(() => {
            EventBus.emit(new ToastEvent('SUCCESS', 'Saved!'));
          })
          .catch(() => {
            EventBus.emit(new ToastEvent('ERROR', 'Failed to save.'));
          });
      } else {
        // Should never happen (unless data is still loading and user clicked button)
        EventBus.emit(new ToastEvent('WARN', 'Something is very wrong. Please reload and try again.'));
      }
    },
  },
  computed: {
    usernames(): Array<{ name: string, user_id: string }> {
      return this.users.map((user: UserBaseModel) => ({
        name: `${user.username} (${user.full_name} | ${user.email})`,
        user_id: user.user_id,
      }));
    },
    userLookup(): Record<string, UserBaseModel> {
      return Object.fromEntries(this.users.map((user: UserBaseModel) => [user.user_id, user]));
    },
    searchResults(): Array<{ name: string, user_id: string }> {
      if (this.usernameSearch.length < 1) return [];
      return this.usernames.filter((user: { name: string, user_id: string }) => user.name.toLowerCase().indexOf(this.usernameSearch) >= 0);
    },
  },
};
</script>
