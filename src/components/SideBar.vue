<template>
  <div class="col-8 col-md-2 sidebar d-md-block d-none">
    Sidebar<br/>
    Sidebar<br/>
    Sidebar<br/>
    Sidebar<br/>
    Sidebar<br/>
    Sidebar<br/>
    Sidebar<br/>
    Sidebar<br/>
    Sidebar<br/>
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
  props: {
    open: {
      type: Boolean,
      default: true,
    },
  },
  data(): object {
    return {
      visible: this.open as boolean,
    };
  },
  computed: {
    iconButton(): string[] {
      return ['fas', this.visible ? 'caret-left' : 'caret-right'];
    },
  },
  methods: {
    toggleVisibility(): void {
      this.visible = !this.visible;
      this.$router.push({ path: '/about' });
    },
    setVisibility(newState: boolean): void {
      this.visible = newState;
    },
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
