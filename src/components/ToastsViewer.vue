<template>
  <!--  <div aria-live="polite" aria-atomic="true" class="position-absolute top-0 end-0 p-3 pt-5 mh-100 overflow-auto">-->
  <div
    role="alert"
    class="toast-container position-absolute top-0 end-0 p-3 pt-5 mh-100 overflow-auto"
    aria-live="assertive"
    aria-atomic="true"
  >
    <template v-for="toast in toasts" :key="toast.key">
      <div
        role="alert"
        class="toast align-items-center border-0 show mb-2"
        :class="[toast.bg, toast.col]"
        aria-live="assertive"
        aria-atomic="true"
      >
        <div class="d-flex">
          <div class="toast-body text-start" v-html="toast.htmlMessage" />
          <button
            type="button"
            class="btn-close btn-close-white me-2 m-auto"
            aria-label="Close"
            @click="remove(toast.key)"
          />
        </div>
      </div>
    </template>
  </div>
  <!--  </div>-->
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { ToastEvent } from "@/plugins/events/events/toast";
import type { ToastType } from "@/plugins/events/events/toast";
import { md2html } from "@/util";

interface Toast {
  key: number;
  level: ToastType;
  message: string;
  htmlMessage: string;
  bg: string;
  col: string;
}

const backgroundClass = {
  SUCCESS: "bg-success",
  INFO: "bg-info",
  WARN: "bg-warning",
  ERROR: "bg-danger",
};
const textColorClass = {
  SUCCESS: "text-white",
  INFO: "text-dark",
  WARN: "text-dark",
  ERROR: "text-white",
};
export default defineComponent({
  name: "ToastsViewer",
  created() {
    this.$eventBus.on(ToastEvent, (event: ToastEvent) => {
      const toast: Toast = {
        key: this.runningCount,
        level: event.level,
        message: event.message,
        htmlMessage: md2html(event.message),
        bg: backgroundClass[event.level],
        col: textColorClass[event.level],
      };
      // add toast to list
      this.toasts.push(toast);
      // set up timer to automatically remove toast after hangtime
      setTimeout(() => this.remove(toast.key), this.hangtime);
      // increment counter to keep track of unique "IDs" for toasts
      this.runningCount += 1;
    });
  },
  data() {
    return {
      hangtime: 8 * 1000, // time in ms before notification is removed automatically
      runningCount: 0 as number, // used to generate unique "IDs" for toasts
      toasts: [] as Toast[],
    };
  },
  methods: {
    remove(key: number) {
      // find the index corresponding to the key
      const index = this.toasts.map((toast: Toast) => toast.key).indexOf(key);
      if (index >= 0) {
        this.toasts.splice(index, 1);
      }
    },
  },
});
</script>
