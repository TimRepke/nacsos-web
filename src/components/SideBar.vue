<template>
  <div class="col-8 col-md-2 sidebar"
       :class="{ 'd-none': !isOpen }">
    <div class="list-group rounded-0">
      <!-- TODO: hide items based on permissions -->
      <router-link to="/project/overview" class="list-group-item list-group-item-action border-end-0"
                   active-class="active">Overview
      </router-link>
      <router-link to="/project/queries" class="list-group-item list-group-item-action border-end-0"
                   active-class="active"> Queries
      </router-link>
      <router-link to="/project/dataset" class="list-group-item list-group-item-action border-end-0"
                   active-class="active"> Dataset
      </router-link>
      <router-link to="/project/annotations" class="list-group-item list-group-item-action border-end-0"
                   active-class="active"> Annotations
      </router-link>
      <router-link to="/project/artefacts" class="list-group-item list-group-item-action border-end-0"
                   active-class="active"> Artefacts
      </router-link>
      <router-link to="/project/pipelines" class="list-group-item list-group-item-action border-end-0"
                   active-class="active"> Pipelines
      </router-link>
      <router-link to="/project/config/annotations" class="list-group-item list-group-item-action border-end-0"
                   active-class="active">
        <font-awesome-icon icon="gear"/>
        Annotations
      </router-link>
      <router-link to="/project/config/project" class="list-group-item list-group-item-action border-end-0"
                   active-class="active">
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
  },
  methods: {
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
.sidebar {
  border-right: 1px solid gray;
  height: 100vh;
  margin-top: -3rem;
  padding-top: 5rem;
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
}
</style>
