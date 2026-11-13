<template>
  <div>
    <div v-if="user.is_superuser && user.is_active">
      <router-view />
    </div>
    <div v-else>Unfortunately, you don't have permission to access this page.</div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { currentUserStore } from "@/stores";
import type { UserModel } from "@/plugins/api/spec/types.gen";

defineOptions({ name: "AdminContainer" });

const user = ref<UserModel>(currentUserStore.user as UserModel);
</script>

<style scoped></style>
