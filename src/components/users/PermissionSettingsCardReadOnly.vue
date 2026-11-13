<template>
  <div class="card p-3">
    <div class="row gy-3 gx-4">
      <div v-for="(hint, setting) in hints" :key="setting" class="col-lg-3">
        <div>
          <code>{{ setting }}</code>
          <font-awesome-icon
            :icon="[permissions[setting] ? 'fas' : 'far', permissions[setting] ? 'circle-check' : 'circle-xmark']"
            class="ms-2"
          />
        </div>
        <div class="text-muted small">
          {{ hint }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import type { PropType } from "vue";
import type { ProjectPermissionsModel } from "@/plugins/api/types";
import type { PermissionKeys } from "@/types/permissions";
import { ProjectPermissionHints } from "@/types/permissions";

defineOptions({ name: "PermissionSettingsCardReadOnly" });

defineProps({
  permissions: {
    type: Object as PropType<ProjectPermissionsModel>,
    required: true,
  },
});

const hints = ref(ProjectPermissionHints as Record<PermissionKeys, string>);
</script>
