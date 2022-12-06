<template>
  <div>
    bla
  </div>
</template>

<script lang="ts">
import { currentProjectStore } from '@/stores';
import { marked } from 'marked';

type UserManagementViewData = {
  tmp: string;
};

export default {
  name: 'UserProfileView',
  data(): UserManagementViewData {
    return {
      tmp: '',
    };
  },
  mounted() {
    // clear current project when user enters this page
    // among other things, this makes the sidebar go away
    currentProjectStore.clear();
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
