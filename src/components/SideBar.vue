<template>
  <div class="col-8 col-md-2 sidebar"
       :class="{ 'd-none': !isOpen }"
       :style="logoSize">
    <router-link to="/" class="text-decoration-none text-nowrap position-absolute d-inline-block mt-1 top-0"
                 style="z-index: 2000; left:1rem;">
      <NacsosLogo class="mt-0"/>
    </router-link>
    <div class="list-group rounded-0" v-if="projectPermissions">
      <router-link to="/project/overview" class="list-group-item list-group-item-action border-end-0"
                   active-class="active">Overview
      </router-link>
      <router-link to="/project/imports" class="list-group-item list-group-item-action border-end-0"
                   active-class="active" v-if="projectPermissions.imports_read"> Imports
      </router-link>
      <router-link to="/project/dataset" class="list-group-item list-group-item-action border-end-0"
                   active-class="active" v-if="projectPermissions.dataset_read"> Dataset
      </router-link>
      <router-link to="/project/annotate" class="list-group-item list-group-item-action border-end-0"
                   active-class="active" v-if="projectPermissions.annotations_read"> Annotation
      </router-link>
      <router-link to="/project/artefacts" class="list-group-item list-group-item-action border-end-0"
                   active-class="active" v-if="projectPermissions.artefacts_read"> Artefacts
      </router-link>
      <router-link to="/project/pipelines" class="list-group-item list-group-item-action border-end-0"
                   active-class="active" v-if="projectPermissions.pipelines_read"> Pipelines
      </router-link>
      <router-link to="/project/pipelines/setup"
                   class="list-group-item list-group-item-action list-group-item-info border-end-0 sub-link"
                   active-class="active" v-if="projectPermissions.annotations_read && isActive('project-pipelines')">
        Task Configuration
      </router-link>
      <router-link to="/project/pipelines/presets"
                   class="list-group-item list-group-item-action list-group-item-info border-end-0 sub-link"
                   active-class="active" v-if="projectPermissions.annotations_read && isActive('project-pipelines')">
        Presets
      </router-link>
      <router-link to="/project/config/annotations" class="list-group-item list-group-item-action border-end-0"
                   active-class="active" v-if="projectPermissions.annotations_edit">
        <font-awesome-icon icon="gear"/>
        Annotations
      </router-link>
      <router-link to="/project/config/project" class="list-group-item list-group-item-action border-end-0"
                   active-class="active" v-if="projectPermissions.owner">
        <font-awesome-icon icon="gear"/>
        Project
      </router-link>
    </div>
  </div>
  <a id="sidebar-toggle" class="border border-start-0 rounded-end col-auto mt-4"
     aria-label="test"
     @click="toggleVisibility()" @keypress="toggleVisibility()">
    <font-awesome-icon :icon="iconButton"/>
  </a>
</template>

<script lang="ts">
import NacsosLogo from '@/components/NacsosLogo.vue';
import { currentProjectStore } from '@/stores';
import { ProjectPermissions } from '@/types/project.d';
import { RouteLocationMatched } from 'vue-router';

export default {
  name: 'SideBar',
  components: { NacsosLogo },
  data(): object {
    return {
      projectPermissions: currentProjectStore.projectPermissions as ProjectPermissions,
      visible: undefined,
      windowWidth: window.innerWidth,
      logoSize: {
        '--logo-size': '4rem',
      },
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
  },
  methods: {
    isActive(parentName: string): boolean {
      return this.$router.currentRoute.value.matched.some((route: RouteLocationMatched) => route.name === parentName);
    },
    toggleVisibility(): void {
      this.visible = (this.visible === undefined) ? false : !this.visible;
    },
    setVisibility(newState: boolean): void {
      this.visible = newState;
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
:root {
  --logo-size: 4rem;
}

#nacsos-logo {
  width: var(--logo-size);
  height: var(--logo-size);
}

.sidebar {
  border-right: 1px solid gray;
  height: 100vh;
  margin-top: -3rem;
  padding-top: calc(var(--logo-size) + 1rem);
  margin-right: 0 !important;
  overflow-x: hidden;
  overflow-y: auto;
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
