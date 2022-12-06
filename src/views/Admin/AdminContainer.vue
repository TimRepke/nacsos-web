<template>
  <div>
    <div v-if="user.is_superuser && user.is_active">
      <router-view />
    </div>
    <div v-else>
      Unfortunately, you don't have permission to access this page.
    </div>
  </div>
</template>

<script lang="ts">
import { currentUserStore } from '@/stores';
import { UserModel } from '@/plugins/api/api-core';

type AdminContainerData = {
  user: UserModel,
};
export default {
  name: 'AdminContainer',
  data(): AdminContainerData {
    return {
      user: currentUserStore.user as UserModel,
    };
  },
};
</script>

<style scoped>

</style>
