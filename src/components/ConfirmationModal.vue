<template>
  <div v-if="pendingConfirmationRequests.length > 0">
    <div class="modal fade show" tabindex="-1" style="display: block" data-bs-backdrop="static">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ latestConfirmationRequest.title }}</h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
              @click="resolveConfirmationRequest('IGNORE')"
            />
          </div>
          <div class="modal-body text-start">
            <p v-html="latestConfirmationRequest.htmlBody" />
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-outline-danger"
              data-bs-dismiss="modal"
              @click="resolveConfirmationRequest('REJECT')"
            >
              {{ latestConfirmationRequest.reject }}
            </button>
            <button type="button" class="btn btn-success" @click="resolveConfirmationRequest('ACCEPT')">
              {{ latestConfirmationRequest.accept }}
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="modal-backdrop fade show" />
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";
import { marked } from "marked";
import { EventBus } from "@/plugins/events";
import { ConfirmationRequestEvent } from "@/plugins/events/events/confirmation";
import type { ConfirmationCallback, ConfirmationResponse } from "@/plugins/events/events/confirmation";

defineOptions({ name: "ConfirmationModal" });

type PendingConfirmationRequest = {
  title: string;
  body: string;
  htmlBody: string;
  accept: string;
  reject: string;
  callback: ConfirmationCallback;
};

const pendingConfirmationRequests = ref<PendingConfirmationRequest[]>([]);

// same singleton instance that is exposed as the global $eventBus property
EventBus.on(ConfirmationRequestEvent, (event: ConfirmationRequestEvent) => {
  // pass
  pendingConfirmationRequests.value.push({
    title: event.title,
    body: event.body,
    htmlBody: marked(event.body) as string,
    accept: event.accept,
    reject: event.reject,
    callback: event.callback,
  });
});

const latestConfirmationRequest = computed<PendingConfirmationRequest>(() => {
  return pendingConfirmationRequests.value[pendingConfirmationRequests.value.length - 1];
});

function resolveConfirmationRequest(response: ConfirmationResponse) {
  const latestConfirmationRequest = pendingConfirmationRequests.value.pop();
  latestConfirmationRequest!.callback(response);
}
</script>

<style></style>
