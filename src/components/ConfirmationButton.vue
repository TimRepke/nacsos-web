<template>
  <div>
    <button type="button" class="btn" :class="btnStyle" @click="confirming = true" :disabled="disabled || confirming">
      <slot />
    </button>
    <template v-if="confirming">
      <span class="ms-2 me-2" role="button" tabindex="0" @click="accept" @keyup.enter="accept" @keyup.space="accept"
        >Yes</span
      >
      <span class="me-2" role="button" tabindex="0" @click="reject" @keyup.enter="reject" @keyup.space="reject"
        >No</span
      >
    </template>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";

defineOptions({ name: "ConfirmationButton" });

const emit = defineEmits(["cancelled", "accepted"]);

defineProps({
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
});

const confirming = ref(false);

function accept() {
  confirming.value = false;
  emit("accepted");
}

function reject() {
  confirming.value = false;
  emit("cancelled");
}
</script>
