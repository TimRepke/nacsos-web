<template>
  <div class="text-start p-3">
    bla
  </div>
</template>

<script lang="ts">
import { marked } from 'marked';

type UserManagementViewData = {
  tmp: string;
};

export default {
  name: 'UserManagementView',
  data(): UserManagementViewData {
    return {
      tmp: '',
    };
  },
  mounted() {
    // pass
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
