<script setup lang="ts">
import { EventBus } from "@/plugins/events";
import { LoggedOutEvent, LogoutSuccessEvent } from "@/plugins/events/events/auth";
import { currentUserStore, interfaceSettingsStore } from "@/stores";
import { useRouter } from "vue-router";
import { ref } from "vue";

const router = useRouter();
function logout() {
  EventBus.emit(new LoggedOutEvent());
  EventBus.once(LogoutSuccessEvent, () => {
    router.push({ name: "user-login" });
  });
}
const isMenuOpenUI = ref(false);

const checkboxOffset = ref(0);
</script>

<template>
  <li class="dropdown">
    <a
      class="nav-link dropdown-toggle"
      href="#"
      role="button"
      data-bs-toggle="dropdown"
      aria-expanded="false"
      data-bs-auto-close="outside"
    >
      <font-awesome-icon class="me-1 mb-1" style="vertical-align: middle" :icon="['fas', 'circle-user']" />
      {{ currentUserStore.user?.username || "Username" }}
    </a>
    <ul class="dropdown-menu dropdown-menu-lg-end">
      <template v-if="currentUserStore.user?.is_superuser">
        <li>
          <h6 class="dropdown-header">
            <font-awesome-icon :icon="['fas', 'toolbox']" class="me-2" />
            Admin Area
          </h6>
        </li>
        <li>
          <router-link to="/admin/news" class="dropdown-item">Message users</router-link>
        </li>
        <li>
          <router-link to="/admin/projects" class="dropdown-item">Manage projects</router-link>
        </li>
        <li>
          <router-link to="/admin/users" class="dropdown-item">Manage users</router-link>
        </li>
        <li>
          <hr class="dropdown-divider" />
        </li>
        <li>
          <router-link to="/admin/celery" class="dropdown-item">Celery</router-link>
        </li>
        <li>
          <a href="http://10.10.13.45:8085/" class="dropdown-item" target="_blank">Dramatiq Dash</a>
        </li>
        <li>
          <hr class="dropdown-divider" />
        </li>
      </template>

      <li>
        <span
          class="dropdown-item d-flex flex-row"
          @click.prevent.stop="isMenuOpenUI = !isMenuOpenUI"
          role="button"
          tabindex="-1"
          :class="{ 'fw-bold': isMenuOpenUI }"
        >
          <font-awesome-icon :icon="['fas', 'message']" class="me-2 d-block" />
          <span class="d-block me-3">Toast Settings</span>
          <font-awesome-icon :icon="['fas', isMenuOpenUI ? 'caret-down' : 'caret-right']" class="ms-auto d-block" />
        </span>
        <ul class="dropdown-menu px-3 py-2 position-relative mb-2" :class="{ show: isMenuOpenUI }" @click.stop>
          <li>
            <div class="form-check my-1 d-flex">
              <!-- eslint-disable-next-line vuejs-accessibility/mouse-events-have-key-events -->
              <input
                id="settingQuotes"
                v-model="interfaceSettingsStore.toasts.showQuotes"
                class="form-check-input"
                type="checkbox"
                :style="{ marginRight: `${checkboxOffset * 5}em` }"
                @mouseenter="checkboxOffset = Math.min(checkboxOffset + 1, 10)"
              />
              <label class="form-check-label text-nowrap ms-1" for="settingQuotes">Show quotes</label>
            </div>
          </li>
          <li>
            <div class="form-check my-1">
              <input
                id="settingInfo"
                v-model="interfaceSettingsStore.toasts.showInfo"
                class="form-check-input"
                type="checkbox"
              />
              <label class="form-check-label text-nowrap ms-1" for="settingInfo">Show infos</label>
            </div>
          </li>
          <li>
            <div class="form-check my-1">
              <input
                id="settingError"
                v-model="interfaceSettingsStore.toasts.showError"
                class="form-check-input"
                type="checkbox"
              />
              <label class="form-check-label text-nowrap ms-1" for="settingError">Show errors</label>
            </div>
          </li>
          <li>
            <div class="form-check my-1">
              <input
                id="settingWarn"
                v-model="interfaceSettingsStore.toasts.showWarn"
                class="form-check-input"
                type="checkbox"
              />
              <label class="form-check-label text-nowrap ms-1" for="settingWarn">Show warnings</label>
            </div>
          </li>
          <li>
            <div class="form-check my-1">
              <input
                id="settingSuccess"
                v-model="interfaceSettingsStore.toasts.showSuccess"
                class="form-check-input"
                type="checkbox"
              />
              <label class="form-check-label text-nowrap ms-1" for="settingSuccess">Show success</label>
            </div>
          </li>
        </ul>
      </li>

      <li>
        <router-link to="/nql" class="dropdown-item">
          <font-awesome-icon :icon="['fas', 'feather']" class="me-2" />
          NQL toolkit
        </router-link>
      </li>
      <li>
        <router-link to="/user/profile" class="dropdown-item">
          <font-awesome-icon :icon="['fas', 'user-pen']" class="me-2" />
          Edit Profile
        </router-link>
      </li>
      <li class="dropdown-item" role="button" tabindex="0" @click="logout" @keyup.enter="logout" @keyup.space="logout">
        <font-awesome-icon :icon="['fas', 'arrow-right-from-bracket']" class="me-2" />
        Log out
      </li>
    </ul>
  </li>
</template>
