<template>
  <div class="text-start m-2">
    <h4>JSONL import</h4>
    <FilesUploader></FilesUploader>
  </div>
</template>

<script lang="ts">
import FilesUploader from '@/components/imports/FilesUploader.vue';

export default {
  name: 'ConfigJSONL',
  components: { FilesUploader },
  methods: {
    // pass
  },
};
</script>

<style scoped>

</style>
