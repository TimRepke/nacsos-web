<template>
  <div class="card p-3">
    <div class="row gy-3 gx-4">
      <div
        v-for="(hint, setting) in hints"
        :key="setting"
        class="col-lg-3">
        <div>
          <code>{{ setting }}</code>
          <font-awesome-icon
            :icon="[(permissions[setting]) ? 'fas' : 'far', (permissions[setting]) ? 'circle-check' : 'circle-xmark']"
            class="ms-2" />
        </div>
        <div class="text-muted small">
          {{ hint }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { PropType } from 'vue';
import { ProjectPermissionsModel } from '@/plugins/api/api-core';
import { PermissionKeys, ProjectPermissionHints } from '@/types/permissions';

export default {
  name: 'PermissionSettingsCardReadOnly',
  props: {
    permissions: {
      type: Object as PropType<ProjectPermissionsModel>,
      required: true,
    },
  },
  data() {
    return {
      hints: ProjectPermissionHints as Record<PermissionKeys, string>,
    };
  },
};
</script>
