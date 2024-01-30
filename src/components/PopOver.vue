<template>
  <div class="position-relative">
    <font-awesome-icon
      :icon="['fas', 'circle-question']"
      class="text-muted"
      @mouseover="visible = true"
      @mouseleave="visible = false"
    />
    <div
      v-show="visible"
      class="popover bs-popover-auto fade show"
      role="tooltip"
      style="position: absolute; inset: 0 auto auto 0; margin: 0; transform: translate(30px, -20px)"
      data-popper-placement="right"
    >
      <div class="popover-arrow" style="position: absolute; top: 0; transform: translate(0px, 20px)"></div>
      <h3 class="popover-header" v-if="title">{{ title }}</h3>

      <div class="popover-body" v-if="body" v-html="body" />
      <div class="popover-body" v-else>
        <slot />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { marked } from "marked";

export default defineComponent({
  name: "PopOver",
  props: {
    title: {
      type: String,
      required: false,
      default: undefined,
    },
    bodyMD: {
      type: String,
      required: false,
      default: undefined,
    },
  },
  data() {
    return {
      body: this.bodyMD ? marked(this.bodyMD) : null,
      visible: false,
    };
  },
});
</script>

<style scoped>
.popover {
  min-width: 250px;
  max-width: 500px;
}
</style>
