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
              @click="resolveConfirmationRequest('IGNORE')" />
          </div>
          <div class="modal-body text-start">
            <p v-html="latestConfirmationRequest.htmlBody" />
          </div>
          <div class=" modal-footer">
            <button
              type="button"
              class="btn btn-outline-danger"
              data-bs-dismiss="modal"
              @click="resolveConfirmationRequest('REJECT')">
              {{ latestConfirmationRequest.reject }}
            </button>
            <button
              type="button"
              class="btn btn-success"
              @click="resolveConfirmationRequest('ACCEPT')">
              {{ latestConfirmationRequest.accept }}
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="modal-backdrop fade show" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { marked } from 'marked';
import { ConfirmationRequestEvent } from '@/plugins/events/events/confirmation';
import type { ConfirmationResponse } from '@/plugins/events/events/confirmation';

export default defineComponent({
  name: 'ConfirmationModal',
  created() {
    this.$eventBus.on(ConfirmationRequestEvent, (event: ConfirmationRequestEvent) => {
      // pass
      this.pendingConfirmationRequests.push({
        title: event.title,
        body: event.body,
        htmlBody: marked(event.body),
        accept: event.accept,
        reject: event.reject,
        callback: event.callback,
      });
    });
  },
  data() {
    return {
      pendingConfirmationRequests: [],
    };
  },
  computed: {
    latestConfirmationRequest(): ConfirmationRequestEvent {
      return this.pendingConfirmationRequests[this.pendingConfirmationRequests.length - 1];
    },
  },
  methods: {
    resolveConfirmationRequest(response: ConfirmationResponse) {
      const latestConfirmationRequest = this.pendingConfirmationRequests.pop();
      latestConfirmationRequest.callback(response);
    },
  },
});
</script>

<style>

</style>
