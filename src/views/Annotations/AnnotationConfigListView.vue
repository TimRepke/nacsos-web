<template>
  <div></div>
</template>

<script lang="ts">

export default {
  name: 'AnnotationConfigListView',
  created() {
    this.$router.push({
      name: 'config-annotation-task-edit',
      params: { task_id: '98545fb3-3ed3-48b2-9748-a24015244be0' },
    });
  },
  setup() {
    // noop
  },
};
</script>

<style scoped>
.annotation-sidebar {
  height: var(--body-height);
  overflow-x: hidden;
  overflow-y: auto;
  border: none;
}

@media (min-width: 992px) {
  /*
  FIXME is it possible to import var from bootstrap?
        ideally by overriding border-start.
  */
  .annotation-sidebar {
    border-left: 1px solid #dee2e6 !important;
  }
}
</style>
