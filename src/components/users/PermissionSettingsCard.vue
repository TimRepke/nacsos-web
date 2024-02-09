<template>
  <ExpandableBox :initially-open="false">
    <template v-slot:head>
      <strong>{{ permission.user.username }}</strong
      >&nbsp;
      <span class="text-muted">
        ({{ permission.user.full_name }}&nbsp;| <span class="font-monospace">{{ permission.user.email }}</span
        >)
      </span>
    </template>
    <template v-slot:body>
      <div class="d-flex mb-3">
        <div><span class="text-muted">user_id:</span> <code>{{ userPermission.user_id }}</code>
        <span class="text-muted ms-4">permission_id:</span> <code>{{ userPermission.project_permission_id }}</code></div>
        <div class="ms-auto d-flex flex-row">
          <div class="me-2">
            <div class="dropdown">
              <button
                class="btn btn-secondary dropdown-toggle btn-sm"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Apply preset
              </button>
              <ul class="dropdown-menu">
                <li v-for="(preset, presetName) in presets" :key="presetName">
                  <button class="dropdown-item" type="button" @click="applyPreset(preset)">
                    {{ presetName }}
                  </button>
                </li>
              </ul>
            </div>
          </div>
          <div class="me-2">
            <button type="button" class="btn btn-danger btn-sm" @click="removeUser()">
              <font-awesome-icon :icon="['fas', 'trash-can']" />
              Remove
            </button>
          </div>
          <div>
            <button type="button" class="btn btn-success btn-sm" @click="saveUser()">
              <font-awesome-icon :icon="['fas', 'floppy-disk']" />
              Save
            </button>
          </div>
        </div>
      </div>
      <div class="row gy-3 gx-4">
        <template v-for="(hint, setting) in hints" :key="setting">
          <div v-if="setting !== 'import_limit_oa'" class="col-lg-3">
            <div class="form-check form-switch">
              <input
                :id="`toggle-${setting}-${permission.project_permission_id}`"
                type="checkbox"
                role="switch"
                class="form-check-input"
                v-model="permission[setting]"
                aria-checked="mixed"
              />
              <label class="form-check-label" :for="`toggle-${setting}-${permission.project_permission_id}`">
                <code>{{ setting }}</code>
              </label>
            </div>
            <div class="text-muted small">
              {{ hint }}
            </div>
          </div>
        </template>
        <div class="col-lg-3">
          <label class="form-label" :for="`toggle-oa-limit-${permission.project_permission_id}`">
            <code>import_limit_oa</code>
          </label>
          <input
            :id="`num-oa-limit-${permission.project_permission_id}`"
            type="number"
            class="form-control"
            v-model="permission.import_limit_oa"
          />
          <div class="text-muted small">
            {{ hints.import_limit_oa }}
          </div>
        </div>
      </div>
    </template>
  </ExpandableBox>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import type { PropType } from "vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import type { UserPermission } from "@/plugins/api/api-core";
import ExpandableBox from "@/components/ExpandableBox.vue";
import { ProjectPermissionHints, PermissionPresets } from "@/types/permissions";
import type { Permissions, PermissionKeys } from "@/types/permissions";
import { EventBus } from "@/plugins/events";
import { ToastEvent } from "@/plugins/events/events/toast";
import { currentProjectStore } from "@/stores";
import { API } from "@/plugins/api";
import { ConfirmationRequestEvent } from "@/plugins/events/events/confirmation";

type PermissionSettingsData = {
  permission: UserPermission;
  presets: Record<string, Permissions>;
  hints: Record<PermissionKeys, string>;
};

export default defineComponent({
  name: "PermissionSettingsCard",
  components: { FontAwesomeIcon, ExpandableBox },
  emits: ["userDeleted", "userSaved"],
  props: {
    userPermission: {
      type: Object as PropType<UserPermission>,
      required: true,
    },
  },
  data(): PermissionSettingsData {
    return {
      presets: PermissionPresets,
      hints: ProjectPermissionHints,
      permission: this.userPermission,
    };
  },
  methods: {
    applyPreset(preset: Permissions) {
      Object.entries(preset).forEach(([key, value]) => {
        // eslint-disable-next-line no-param-reassign
        this.permission[key as PermissionKeys] = value;
      });
    },
    saveUser() {
      API.core.project
        .saveProjectPermissionApiProjectPermissionsPermissionPut({
          requestBody: this.permission,
          xProjectId: currentProjectStore.projectId as string,
        })
        .then(() => {
          this.$emit("userSaved", this.permission);
          EventBus.emit(new ToastEvent("SUCCESS", "Saved!"));
        })
        .catch(() => {
          EventBus.emit(new ToastEvent("ERROR", "Failed to save."));
        });
    },
    removeUser() {
      EventBus.emit(
        new ConfirmationRequestEvent(
          "Do you really want to remove access for this user?",
          (confirmationResponse) => {
            if (confirmationResponse === "ACCEPT") {
              API.core.project
                .removeProjectPermissionApiProjectPermissionsPermissionDelete({
                  projectPermissionId: this.permission.project_permission_id as string,
                  xProjectId: currentProjectStore.projectId as string,
                })
                .then(() => {
                  this.$emit("userDeleted", this.permission);
                  EventBus.emit(new ToastEvent("SUCCESS", "Removed permission!"));
                })
                .catch(() => {
                  // Deletion may not only fail on server error but also when the user removes a new permission that wasn't saved yet.
                  EventBus.emit(
                    new ToastEvent(
                      "WARN",
                      "May have failed to remove permission, please reload page if you are unsure.",
                    ),
                  );
                });
            }
          },
          "Remove user permission",
        ),
      );
    },
  },
});
</script>
