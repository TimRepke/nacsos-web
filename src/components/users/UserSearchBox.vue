<template>
  <div>
    <div class="m-0">
      <input
        type="text"
        class="form-control mb-1"
        placeholder="Search user to add..."
        v-model="search"
        aria-label="Search for users"
      />
    </div>
    <ul style="max-height: 10rem" class="list-group overflow-auto">
      <li
        v-for="user in searchResults"
        :key="user.user_id"
        class="list-group-item d-flex justify-content-between align-items-start text-muted"
      >
        <div class="me-auto">
          {{ user.name }}
        </div>
        <span
          role="button"
          class="link-secondary"
          tabindex="0"
          @click="$emit('userSelected', userLookup[user.user_id])"
        >
          <font-awesome-icon :icon="['fas', 'user-plus']" />
        </span>
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from "vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import type { UserBaseModel } from "@/plugins/api/types";
import { currentProjectStore } from "@/stores";
import { API } from "@/plugins/api";
import { EventBus } from "@/plugins/events";
import { ToastEvent } from "@/plugins/events/events/toast";

defineOptions({ name: "UserSearchBox" });

defineEmits(["userSelected"]);

const props = defineProps({
  projectId: {
    // undefined: search will include all users on the platform
    // otherwise add project_id and search is constrained to users in the project
    type: String,
    required: false,
    default: () => undefined,
  },
});

const users = ref<UserBaseModel[]>([]);
const search = ref("");

onMounted(() => {
  if (props.projectId) {
    API.users
      .getProjectUsersApiUsersListProjectProjectIdGet({
        headers: { "x-project-id": currentProjectStore.projectId as string },
        path: { project_id: currentProjectStore.projectId as string },
      })
      .then((response) => {
        users.value = response.data;
      })
      .catch(() => {
        EventBus.emit(new ToastEvent("WARN", "Failed to load list of users."));
      });
  } else {
    API.users
      .getAllUsersApiUsersListAllGet()
      .then((response) => {
        users.value = response.data;
      })
      .catch(() => {
        EventBus.emit(new ToastEvent("WARN", "Failed to load list of users."));
      });
  }
});

const usernames = computed((): Array<{ name: string; user_id: string }> => {
  return users.value.map((user: UserBaseModel) => ({
    name: `${user.username} (${user.full_name} | ${user.email} | ${user.affiliation})`,
    user_id: user.user_id as string,
  }));
});
const userLookup = computed((): Record<string, UserBaseModel> => {
  return Object.fromEntries(users.value.map((user: UserBaseModel) => [user.user_id, user]));
});
const searchResults = computed((): Array<{ name: string; user_id: string }> => {
  if (search.value.length < 1) return [];
  return usernames.value.filter(
    (user: { name: string; user_id: string }) => user.name.toLowerCase().indexOf(search.value) >= 0,
  );
});
</script>
