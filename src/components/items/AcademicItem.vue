<template>
  <div class="card m-2 p-0 text-start w-100">
    <div class="card-body">
      <h5 class="card-title">{{ item.title }}</h5>
      <h6 class="card-subtitle">{{ item.publication_year }}</h6>
      {{ item.text }}
    </div>
    <div class="card-footer d-flex justify-content-between">
      <small class="text-muted">
        <ul class="list-unstyled">
          <li v-for="author in item.authors" :key="author.name"><font-awesome-icon :icon="['fas', 'user-large']" class="me-2" />{{ author.name }}</li>
        </ul>
      </small>
    </div>
  </div>
</template>

<script lang="ts">
import { PropType } from 'vue';
import { AcademicItemModel } from '@/plugins/api/api-core';

export default {
  name: 'AcademicItem',
  props: {
    item: {
      type: Object as PropType<AcademicItemModel>,
      required: true,
      default: null,
    },
  },
  computed: {
    renderedStatus() {
      return this.item.text;
    },
  },
};
</script>

<style scoped>
/deep/ a {
  text-decoration: none !important;
}
</style>
