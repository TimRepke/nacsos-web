<template>
  <div>
    <label for="news-title">Subject</label>
    <input id="news-title" class="form-control mb-2" type="text" v-model="title" />

    <label for="news-message">Message</label>
    <textarea id="news-message" class="form-control" rows="12" v-model="message"></textarea>

    <div>
      <strong class="me-2">Is active:</strong>
      <div class="form-check form-check-inline">
        <input class="form-check-input" type="radio" name="isActive" id="isActive1" :value="null" v-model="isActive" />
        <label class="form-check-label" for="isActive1">All</label>
      </div>
      <div class="form-check form-check-inline">
        <input class="form-check-input" type="radio" name="isActive" id="isActive2" :value="true" v-model="isActive" />
        <label class="form-check-label" for="isActive2">Yes</label>
      </div>
      <div class="form-check form-check-inline">
        <input class="form-check-input" type="radio" name="isActive" id="isActive3" :value="false" v-model="isActive" />
        <label class="form-check-label" for="isActive3">No</label>
      </div>
    </div>

    <div>
      <strong class="me-2">Is subscribed:</strong>
      <div class="form-check form-check-inline">
        <input
          class="form-check-input"
          type="radio"
          name="isSubscribed"
          id="isSubscribed1"
          :value="null"
          v-model="isSubscribed"
        />
        <label class="form-check-label" for="isSubscribed1">All</label>
      </div>
      <div class="form-check form-check-inline">
        <input
          class="form-check-input"
          type="radio"
          name="isSubscribed"
          id="isSubscribed2"
          :value="true"
          v-model="isSubscribed"
        />
        <label class="form-check-label" for="isSubscribed2">Yes</label>
      </div>
      <div class="form-check form-check-inline">
        <input
          class="form-check-input"
          type="radio"
          name="isSubscribed"
          id="isSubscribed3"
          :value="false"
          v-model="isSubscribed"
        />
        <label class="form-check-label" for="isSubscribed3">No</label>
      </div>
    </div>

    <confirmation-button @accepted="send" btn-style="btn-outline-primary btn-sm mt-2 mb-2" :disabled="sending">
      <font-awesome-icon :icon="['far', 'paper-plane']" />
      Send message
    </confirmation-button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { API, toastReject } from "@/plugins/api";
import ConfirmationButton from "@/components/ConfirmationButton.vue";

export default defineComponent({
  name: "NewsletterView",
  components: { ConfirmationButton },
  data() {
    return {
      isSubscribed: true,
      isActive: true,
      message: "",
      title: "",
      recipients: [],
      sending: false,
    };
  },
  methods: {
    send() {
      if (!this.sending) {
        this.sending = true;
        API.mailing
          .newsMailApiMailNewsPost({
            isActive: this.isActive,
            isSubscribed: this.isSubscribed,
            requestBody: {
              subject: this.title,
              body: this.message,
            },
          })
          .then((res) => {
            this.recipients = res.data;
          })
          .catch(toastReject);
      }
    },
  },
});
</script>

<style scoped></style>
