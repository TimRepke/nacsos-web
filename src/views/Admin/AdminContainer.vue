<template>
  <div>
    <div v-if="user?.is_superuser && user?.is_active">
      <router-view />
    </div>
    <div v-else>Unfortunately, you don't have permission to access this page.</div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { currentUserStore } from "@/stores";
import type { UserModel } from "@/plugins/api/spec/types.gen";

defineOptions({ name: "AdminContainer" });

// computed so the permission gate reacts to login/logout/refresh instead of a one-time snapshot
const user = computed<UserModel | null>(() => currentUserStore.user as UserModel | null);
</script>

<style scoped></style>
