<template>
  <div>
    <button type="button" class="btn" :class="btnStyle" @click="confirming = true" :disabled="disabled || confirming">
      <slot />
    </button>
    <template v-if="confirming">
      <span class="ms-2 me-2" role="button" @click="accept">Yes</span>
      <span class="me-2" role="button" @click="reject">No</span>
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "ConfirmationButton",
  emits: ["cancelled", "accepted"],
  props: {
    disabled: {
      type: Boolean,
      default: false,
      required: false,
    },
    btnStyle: {
      type: String,
      default: "btn-outline-primary",
      required: false,
    },
  },
  data() {
    return {
      confirming: false,
    };
  },
  methods: {
    accept() {
      this.confirming = false;
      this.$emit("accepted");
    },
    reject() {
      this.confirming = false;
      this.$emit("cancelled");
    },
  },
});
</script>

<style scoped>
.pill-text > .btn-close {
  font-size: 0.5em;
}

.pill-text {
  vertical-align: middle;
  display: inline-block;
  /*height: 1.3em;*/
}

/*
.badge {
  --bs-badge-padding-y: 0.15em;
  --bs-badge-font-size: 0.7em;
  --bs-badge-font-weight: 500;
}
*/
</style>
