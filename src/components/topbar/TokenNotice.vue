<script setup lang="ts">
import { ref } from "vue";
import { currentUserStore } from "@/stores";

const tokenNeedsExtension = ref<boolean>(false);

function checkTokenNeedsExtension() {
  // 24 * 60 * 60 * 1000 = 86400000 (1 day in ms)
  const valid = currentUserStore.authToken?.valid_till;
  if (valid && new Date(valid).getTime() - Date.now() - 86400000 < 0) {
    tokenNeedsExtension.value = true;
  }
}

// Run initially on creation
checkTokenNeedsExtension();
// Once a minute, check if `tokenNeedsExtension` needs to be updated
setInterval(checkTokenNeedsExtension, 60 * 1000);
</script>

<template>
  <div class="pe-4 text-warning-emphasis" v-if="tokenNeedsExtension">
    <router-link :to="{ name: 'user-profile' }" class="nav-link d-inline-block">
      <font-awesome-icon
        class="me-1 mb-1 clickable-icon"
        style="vertical-align: middle"
        :icon="['fas', 'unlock-keyhole']"
      />
      Consider extending login token.
    </router-link>
  </div>
</template>
