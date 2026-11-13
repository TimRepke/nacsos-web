<template>
  <template v-if="user === null">
    <div class="row">Loading your profile data...</div>
  </template>

  <template v-else>
    <div class="container-md">
      <div class="row mb-2">
        <div class="col">
          <strong>Unique ID:</strong> <code>{{ user.user_id }}</code
          ><br />
          <strong>Username:</strong> {{ user.username }}
          <span class="fst-italic text-muted">(not editable)</span>
        </div>
      </div>

      <div class="row mb-2">
        <div class="col">
          <strong>Access tokens</strong>
          <ToolTip>
            An authentication/access token is sent with every request, so we don't expose your password. You should keep
            this a secret. Simply showing it, like we do here, here is actually <strong>very</strong> bad practice in
            any system.
          </ToolTip>
          <ul>
            <li v-for="token in tokens" :key="token.token_id">
              <strong>Token </strong>
              <code>{{ token.token_id }}</code>
              is valid till <em>{{ token.valid_till }}</em>
              <button type="button" class="btn btn-outline-success btn-sm ms-2" @click="refresh(token)">
                <font-awesome-icon :icon="['fas', 'spray-can-sparkles']" />
                Extend
              </button>
              <button type="button" class="btn btn-outline-warning btn-sm ms-2" @click="revoke(token)">
                <font-awesome-icon :icon="['fas', 'snowplow']" />
                Revoke
              </button>
            </li>
          </ul>
        </div>
      </div>

      <div class="row mb-2">
        <div class="col">
          <label for="username" class="form-label">Full name</label>
          <input id="username" class="form-control form-control-sm" type="text" v-model="user.full_name" />
        </div>
        <div class="col">
          <label for="email" class="form-label">Email address</label>
          <input id="email" class="form-control form-control-sm" type="email" v-model="user.email" />
        </div>
        <div class="col">
          <label for="affiliation" class="form-label">Affiliation (short)</label>
          <input id="affiliation" class="form-control form-control-sm" type="text" v-model="user.affiliation" />
        </div>
      </div>

      <div class="row mb-2">
        <div class="col text-start">
          <div class="form-switch">
            <input
              class="form-check-input"
              type="checkbox"
              role="switch"
              :aria-checked="undefined"
              id="news-edit"
              v-model="user.setting_newsletter"
            />
            <label class="form-check-label ms-2" for="news-edit">
              I want to receive email updates about the platform
              <font-awesome-icon :icon="['fas', 'message']" />
            </label>
          </div>
        </div>
      </div>

      <div class="row mb-2">
        <div class="col text-start">
          <div class="form-switch">
            <input
              class="form-check-input"
              type="checkbox"
              role="switch"
              :aria-checked="undefined"
              id="pw-edit"
              v-model="editPassword"
            />
            <label class="form-check-label ms-2" for="pw-edit">
              I want to change my password
              <font-awesome-icon :icon="['fas', 'key']" />
            </label>
          </div>
        </div>
      </div>

      <div class="row mb-2" v-if="editPassword">
        <div class="col">
          <label for="password" class="form-label">New password</label>
          <input
            id="password"
            class="form-control form-control-sm"
            :class="{ 'is-invalid': !secure }"
            type="password"
            v-model="user.password"
          />
          <div class="invalid-feedback">
            This is not a good password. Turn your password up to 11 and one of each in
            <code>[A-Z], [a-z], [0-9], [$@!%*#^?&]</code>.
          </div>
        </div>
        <div class="col">
          <label for="password-rep" class="form-label">Repeat password</label>
          <input
            id="password-rep"
            class="form-control form-control-sm"
            :class="{ 'is-invalid': !matching }"
            type="password"
            v-model="passwordRepeat"
          />
          <div class="invalid-feedback">Passwords don't match!</div>
        </div>
        <div class="col" />
      </div>
      <div class="row">
        <div class="col-2 ms-auto align-content-end justify-content-end d-flex flex-wrap">
          <button type="button" class="btn btn-outline-success me-2 mt-2" :disabled="invalidPassword" @click="save()">
            <font-awesome-icon :icon="['fas', 'floppy-disk']" />
            Save
          </button>
        </div>
      </div>
    </div>
  </template>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from "vue";
import { currentProjectStore, currentUserStore } from "@/stores";
import type { AuthTokenModel, UserInDbModel } from "@/plugins/api/types";
import { API, toastReject } from "@/plugins/api";
import ToolTip from "@/components/ToolTip.vue";
import { EventBus } from "@/plugins/events";
import { ToastEvent } from "@/plugins/events/events/toast";

defineOptions({ name: "UserProfileView" });

const editPassword = ref(false);
const passwordRepeat = ref("");
const user = ref<UserInDbModel | null>(null);
const tokens = ref<AuthTokenModel[]>([]);

const matching = computed<boolean>(() => passwordRepeat.value === user.value?.password);
const secure = computed<boolean>(() =>
  /(?=.*[$@!%*#?&^])(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{11,}/.test(user.value!.password || ""),
);
const invalidPassword = computed<boolean>(() => editPassword.value && (!matching.value || !secure.value));

onMounted(() => {
  // clear current project when user enters this page
  // among other things, this makes the sidebar go away
  currentProjectStore.clear();

  // load user data
  API.oauth
    .readUsersMeApiLoginMeGet()
    .then((response) => {
      user.value = response.data;
    })
    .catch(toastReject);

  // load auth tokens
  refreshAuthTokens();
});

function save() {
  if (invalidPassword.value) {
    EventBus.emit(new ToastEvent("WARN", "Something is not right with your password!"));
  } else {
    API.users
      .saveUserSelfApiUsersMyDetailsPut({
        body: user.value!,
      })
      .then((response) => {
        EventBus.emit(new ToastEvent("SUCCESS", `Saved your data for user_id ${response.data}`));

        // reset password edit settings
        editPassword.value = false;
        passwordRepeat.value = "";
        user.value!.password = undefined;
      })
      .catch(toastReject);
  }
}

function refreshAuthTokens() {
  API.oauth
    .readTokensMeApiLoginMyTokensGet()
    .then((response) => {
      tokens.value = response.data;
    })
    .catch(toastReject);
}

function revoke(token: AuthTokenModel) {
  API.oauth
    .revokeTokenApiLoginTokenTokenIdDelete({
      path: { token_id: token.token_id },
    })
    .then(refreshAuthTokens)
    .catch(toastReject);
}

function refresh(token: AuthTokenModel) {
  if (token.token_id === currentUserStore.authToken?.token_id) {
    currentUserStore.extendAuthTokenValidity();
  } else {
    API.oauth
      .refreshTokenApiLoginTokenTokenIdPut({
        path: { token_id: token.token_id },
      })
      .then(refreshAuthTokens)
      .catch(toastReject);
  }
}
</script>

<style scoped></style>
