<template>
  <div class="text-start p-3">
    <div v-if="project && permissions">
      <h1>{{ project.name }}</h1>
      <div class="row mb-3">
        <div class="col" v-html="markdownToHtml(project.description)" />
      </div>
      <div class="row mb-3">
        <div class="col">
          <h5>Your permissions</h5>
          <h6>In this project, you have the following permissions</h6>
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
import { ProjectModel, ProjectPermissionsModel } from '@/plugins/api/api-core';
import { currentProjectStore } from '@/stores';
import { marked } from 'marked';
import { PermissionKeys, ProjectPermissionHints } from '@/types/permissions';

type ProjectOverview = {
  project?: ProjectModel;
  permissions?: ProjectPermissionsModel;
  hints: Record<PermissionKeys, string>;
};

export default {
  name: 'ProjectOverviewView',
  data(): ProjectOverview {
    return {
      project: undefined,
      permissions: undefined,
      hints: ProjectPermissionHints,
    };
  },
  mounted() {
    this.project = currentProjectStore.project;
    this.permissions = currentProjectStore.projectPermissions;
  },
  methods: {
    markdownToHtml(txt: string) {
      return marked(txt);
    },
  },
};
</script>

<style scoped>

</style>
