<template>
  <div>
    <div v-if="project && permissions">
      <h1>{{ project.name }}</h1>
      <div class="row mb-3">
        <div class="col">
          Project ID: <code>{{ project.project_id }}</code>
        </div>
        <div class="col">Created at {{ project.time_created }}</div>
      </div>
      <div class="row mb-3">
        <div class="col" v-html="markdownToHtml(project.description)" />
      </div>
      <div class="row mb-3">
        <div class="col">
          <h5>Your permissions</h5>
          <h6>In this project, you have the following permissions</h6>
          <permission-settings-card-read-only :permissions="permissions" />
        </div>
      </div>
    </div>
    <div v-else>
      Sorry, something failed. Please try one of the following things to resolve the issue:
      <ul>
        <li>Reload the page.</li>
        <li>Wait a little bit.</li>
        <li>Go to project selection page select a project.</li>
        <li>Log out and log back in again.</li>
      </ul>
      If that didn't work, please contact technical support.
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { marked } from "marked";
import type { ProjectModel, ProjectPermissionsModel } from "@/plugins/api/api-core";
import { currentProjectStore } from "@/stores";
import PermissionSettingsCardReadOnly from "@/components/users/PermissionSettingsCardReadOnly.vue";

type ProjectOverview = {
  project?: ProjectModel;
  permissions?: ProjectPermissionsModel;
};

export default defineComponent({
  name: "ProjectOverviewView",
  components: { PermissionSettingsCardReadOnly },
  data(): ProjectOverview {
    return {
      // pass
    };
  },
  computed: {
    project(): ProjectModel | undefined {
      return currentProjectStore.project;
    },
    permissions(): ProjectPermissionsModel | undefined {
      return currentProjectStore.projectPermissions;
    },
  },
  methods: {
    markdownToHtml(txt: string) {
      return marked(txt);
    },
  },
});
</script>

<style scoped></style>
