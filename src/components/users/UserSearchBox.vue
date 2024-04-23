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

<script lang="ts">
import { defineComponent } from "vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import type { UserBaseModel } from "@/plugins/api/types";
import { currentProjectStore } from "@/stores";
import { API } from "@/plugins/api";
import { EventBus } from "@/plugins/events";
import { ToastEvent } from "@/plugins/events/events/toast";

type SearchData = {
  users: Array<UserBaseModel>;
  search: string;
};

export default defineComponent({
  name: "UserSearchBox",
  components: { FontAwesomeIcon },
  emits: ["userSelected"],
  props: {
    projectId: {
      // undefined: search will include all users on the platform
      // otherwise add project_id and search is constrained to users in the project
      type: String,
      required: false,
      default: () => undefined,
    },
  },
  data(): SearchData {
    return {
      users: [] as UserBaseModel[],
      search: "",
    };
  },
  mounted() {
    if (this.projectId) {
      API.users
        .getProjectUsersApiUsersListProjectProjectIdGet({
          xProjectId: currentProjectStore.projectId as string,
          projectId: currentProjectStore.projectId as string,
        })
        .then((response) => {
          this.users = response.data;
        })
        .catch(() => {
          EventBus.emit(new ToastEvent("WARN", "Failed to load list of users."));
        });
    } else {
      API.users
        .getAllUsersApiUsersListAllGet()
        .then((response) => {
          this.users = response.data;
        })
        .catch(() => {
          EventBus.emit(new ToastEvent("WARN", "Failed to load list of users."));
        });
    }
  },
  computed: {
    usernames(): Array<{ name: string; user_id: string }> {
      return this.users.map((user: UserBaseModel) => ({
        name: `${user.username} (${user.full_name} | ${user.email} | ${user.affiliation})`,
        user_id: user.user_id as string,
      }));
    },
    userLookup(): Record<string, UserBaseModel> {
      return Object.fromEntries(this.users.map((user: UserBaseModel) => [user.user_id, user]));
    },
    searchResults(): Array<{ name: string; user_id: string }> {
      if (this.search.length < 1) return [];
      return this.usernames.filter(
        (user: { name: string; user_id: string }) => user.name.toLowerCase().indexOf(this.search) >= 0,
      );
    },
  },
});
</script>
