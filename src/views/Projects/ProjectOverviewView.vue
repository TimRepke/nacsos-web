<template>
  <div>
    <div v-if="currentProjectStore.project && currentProjectStore.permissions">
      <h1>{{ currentProjectStore.project.name }}</h1>
      <div class="row mb-3">
        <div class="col">
          Project ID: <code>{{ currentProjectStore.project.project_id }}</code>
        </div>
        <div class="col">Created at {{ currentProjectStore.project.time_created }}</div>
      </div>
      <div class="row mb-3">
        <div class="col" v-html="markdownToHtml(currentProjectStore.project.description)" />
      </div>
      <div class="row mb-3">
        <div class="col">
          <h5>Your permissions</h5>
          <h6>In this project, you have the following permissions</h6>
          <permission-settings-card-read-only :permissions="currentProjectStore.permissions" />
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

<script setup lang="ts">
import { marked } from "marked";
import { currentProjectStore } from "@/stores";
import PermissionSettingsCardReadOnly from "@/components/users/PermissionSettingsCardReadOnly.vue";

function markdownToHtml(txt: string | null | undefined): string {
  return txt ? marked(txt, { async: false }) : "";
}
</script>

<style scoped></style>
