<template>
  <div class="col-8 col-md-2" :class="{ 'sidebar-hidden': !isOpen }">
    <div class="d-flex" style="height: calc(100vh - var(--topnav-height));">
      <div class="flex-grow-1 border-end overflow-auto" v-if="isOpen">
        <div v-if="projectPermissions" class="list-group rounded-0" style="margin-top: calc(var(--logo-size) / 2)">
          <router-link
            to="/project/overview"
            class="list-group-item list-group-item-action border-end-0"
            active-class="active">Overview
          </router-link>
          <router-link
            v-if="projectPermissions.imports_read"
            to="/project/imports"
            class="list-group-item list-group-item-action border-end-0"
            active-class="active"> Imports
          </router-link>
          <router-link
            v-if="projectPermissions.dataset_read"
            to="/project/dataset"
            class="list-group-item list-group-item-action border-end-0"
            active-class="active"> Dataset
          </router-link>
          <router-link
            v-if="projectPermissions.annotations_read"
            to="/project/annotate"
            class="list-group-item list-group-item-action border-end-0"
            active-class="active"> Annotation
          </router-link>
          <router-link
            v-if="projectPermissions.artefacts_read"
            to="/project/artefacts"
            class="list-group-item list-group-item-action border-end-0"
            active-class="active"> Artefacts
          </router-link>
          <router-link
            v-if="projectPermissions.pipelines_read"
            to="/project/pipelines"
            class="list-group-item list-group-item-action border-end-0"
            active-class="active"> Pipelines
          </router-link>
          <router-link
            v-if="projectPermissions.annotations_read && isActive('project-pipelines')"
            to="/project/pipelines/setup"
            class="list-group-item list-group-item-action list-group-item-info border-end-0 sub-link"
            exact-active-class="active"> Task Configuration
          </router-link>
          <router-link
            v-if="projectPermissions.annotations_read && isActive('project-pipelines')"
            to="/project/pipelines/presets"
            class="list-group-item list-group-item-action list-group-item-info border-end-0 sub-link"
            exact-active-class="active"> Presets
          </router-link>
          <router-link
            v-if="projectPermissions.annotations_edit"
            to="/project/config/annotations"
            class="list-group-item list-group-item-action border-end-0"
            active-class="active">
            <font-awesome-icon icon="gear" />
            Annotations
          </router-link>
          <router-link
            v-if="projectPermissions.annotations_edit && isActive('config-annotation-schemes')"
            to="/project/config/annotations/list"
            class="list-group-item list-group-item-action list-group-item-info border-end-0 sub-link"
            :class="{
              active: anyOf(['config-annotation-scheme-edit',
                             'config-annotation-scheme-scope',
                             'config-annotation-scheme-list']),
            }"> Schemes & Scopes
          </router-link>
          <router-link
            v-if="projectPermissions.annotations_edit && isActive('config-annotation-schemes')"
            to="/project/config/annotations/resolved"
            class="list-group-item list-group-item-action list-group-item-info border-end-0 sub-link"
            :class="{ active: anyOf(['config-annotation-resolve', 'config-resolved-annotations-list']) }">
            Label Centre
          </router-link>
          <router-link
            v-if="projectPermissions.owner"
            to="/project/settings"
            class="list-group-item list-group-item-action border-end-0"
            active-class="active">
            <font-awesome-icon icon="gear" />
            Project
          </router-link>
        </div>
      </div>
      <div
        id="sidebar-toggle"
        class="border border-start-0 rounded-end mt-5">
        <a
          aria-label="test"
          @click="toggleVisibility()"
          @keypress="toggleVisibility()">
          <font-awesome-icon :icon="iconButton" />
        </a>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { currentProjectStore, currentUserStore } from '@/stores';
import { ProjectPermissionsModel, UserModel } from '@/plugins/api/api-core';
import { RouteLocationMatched } from 'vue-router';

export default {
  name: 'SideBar',
  data(): object {
    return {
      visible: undefined,
      windowWidth: window.innerWidth,
    };
  },
  computed: {
    isOpen(): boolean {
      // bootstrap "md" breakpoint is >=768
      if (this.visible !== undefined) {
        return this.visible;
      }
      return this.windowWidth >= 768;
    },
    iconButton(): string[] {
      return ['fas', this.isOpen ? 'caret-left' : 'caret-right'];
    },
    projectPermissions(): ProjectPermissionsModel | {} {
      return currentProjectStore.projectPermissions || {};
    },
    currentUser(): UserModel {
      return currentUserStore.user;
    },
  },
  methods: {
    isActive(parentName: string): boolean {
      return this.$router.currentRoute.value.matched.some((route: RouteLocationMatched) => route.name === parentName);
    },
    anyOf(routeNames: string[]): boolean {
      return routeNames.indexOf(this.$router.currentRoute.value.name) >= 0;
    },
    toggleVisibility(): void {
      this.visible = (this.visible === undefined) ? false : !this.visible;
    },
  },
  mounted() {
    window.onresize = () => {
      this.windowWidth = window.innerWidth;
    };
  },
};
</script>

<style scoped>
.sidebar-hidden {
  width: 0.75rem !important;
}

#sidebar-toggle {
  width: 0.75rem;
  height: 2rem;
  color: gray;
  font-size: 0.75rem;
  font-weight: bold;
  line-height: 2rem;
  cursor: pointer;
  background: white;
}

.sub-link {
  margin-left: 1rem !important;
  width: calc(100% - 1rem) !important;
  border: 0 !important;
}
</style>
