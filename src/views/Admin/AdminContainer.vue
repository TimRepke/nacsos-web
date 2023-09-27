<template>
  <div>
    <div v-if="user.is_superuser && user.is_active">
      <router-view />
    </div>
    <div v-else>Unfortunately, you don't have permission to access this page.</div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { currentUserStore } from "@/stores";
import type { UserModel } from "@/plugins/api/api-core";

type AdminContainerData = {
  user: UserModel;
};
export default defineComponent({
  name: "AdminContainer",
  data(): AdminContainerData {
    return {
      user: currentUserStore.user as UserModel,
    };
  },
});
</script>

<style scoped></style>
