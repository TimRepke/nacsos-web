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

<script lang="ts" setup>
import { ref } from "vue";
import { API, toastReject } from "@/plugins/api";
import ConfirmationButton from "@/components/ConfirmationButton.vue";

defineOptions({ name: "NewsletterView" });

const isSubscribed = ref(true);
const isActive = ref(true);
const message = ref("");
const title = ref("");
const recipients = ref<string[]>([]);
const sending = ref(false);

function send() {
  if (!sending.value) {
    sending.value = true;
    API.mailing
      .newsMailApiMailNewsPost({
        query: {
          is_active: isActive.value,
          is_subscribed: isSubscribed.value,
        },
        body: {
          subject: title.value,
          body: message.value,
        },
      })
      .then((res) => {
        recipients.value = res.data;
      })
      .catch(toastReject);
  }
}
</script>

<style scoped></style>
