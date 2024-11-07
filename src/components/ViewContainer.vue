<script setup lang="ts">
import type { PropType } from "vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { type IconDefinition } from "@fortawesome/fontawesome-svg-core";

defineProps({
  title: String,
  ready: Boolean,
  loadTitle: {
    type: String,
    required: false,
    default: null,
  },
  loadText: {
    type: String,
    required: false,
    default: "Loading data...",
  },
  icon: {
    type: Object as PropType<string[] | string | IconDefinition>,
  },
});
</script>

<template>
  <div>
    <h1 class="mb2">{{ title }}</h1>
    <template v-if="!ready">
      <div class="card mb-3" style="max-width: 540px">
        <div class="row g-0">
          <div class="col-md-2 position-relative">
            <div class="position-absolute top-50 start-50 translate-middle img-fluid text-muted">
              <div class="spinner-border" role="status" v-if="!icon">
                <span class="visually-hidden">Loading...</span>
              </div>
              <font-awesome-icon v-else :icon="icon" style="font-size: 3rem" />
            </div>
          </div>
          <div class="col-md-8">
            <div class="card-body">
              <h5 class="card-title" v-if="loadTitle">{{ loadTitle }}</h5>
              <p class="card-text">{{ loadText }}</p>
            </div>
          </div>
        </div>
      </div>
    </template>
    <template v-else>
      <slot />
    </template>
  </div>
</template>
