<template>
  <template v-if="user === null">
    <div class="row">
      Loading your profile data...
    </div>
  </template>

  <template v-else>
    <div class="container-md">
      <div class="row mb-2">
        <div class="col">
          <strong>Unique ID:</strong> <code>{{ user.user_id }}</code><br />
          <strong>Username:</strong> {{ user.username }}
          <span class="fst-italic text-muted">(not editable)</span>
        </div>
      </div>

      <div class="row mb-2">
        <div class="col">
          <strong>Access tokens</strong>
          <ToolTip>
            An authentication/access token is sent with every request, so we don't expose your password.
            You should keep this a secret.
            Simply showing it, like we do here, here is actually <strong>very</strong> bad practice in any system.
          </ToolTip>
          <ul>
            <li v-for="token in tokens" :key="token.token_id">
              <strong>Token </strong>
              <code>{{ token.token_id }}</code>
              is valid till <em>{{ token.valid_till }}</em>
              <button
                type="button"
                class="btn btn-outline-success btn-sm ms-2"
                @click="refresh(token)">
                <font-awesome-icon :icon="['fas', 'spray-can-sparkles']" />
                Extend
              </button>
              <button
                type="button"
                class="btn btn-outline-warning btn-sm ms-2"
                @click="revoke(token)">
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
          <input
            id="username"
            class="form-control form-control-sm"
            type="text"
            v-model="user.full_name">
        </div>
        <div class="col">
          <label for="email" class="form-label">Email address</label>
          <input
            id="email"
            class="form-control form-control-sm"
            type="email"
            v-model="user.email">
        </div>
        <div class="col">
          <label for="affiliation" class="form-label">Affiliation (short)</label>
          <input
            id="affiliation"
            class="form-control form-control-sm"
            type="text"
            v-model="user.affiliation">
        </div>
      </div>

      <div class="row mb-2">
        <div class="col text-start">
          <div class="form-switch">
            <input
              class="form-check-input"
              type="checkbox"
              role="switch"
              aria-checked="undefined"
              id="pw-edit"
              v-model="editPassword" />
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
            v-model="user.password">
          <div class="invalid-feedback">
            This is not a good password. Turn your password up to 11 and one of each in <code>[A-Z], [a-z], [0-9], [$@!%*#^?&]</code>.
          </div>
        </div>
        <div class="col">
          <label for="password-rep" class="form-label">Repeat password</label>
          <input
            id="password-rep"
            class="form-control form-control-sm"
            :class="{ 'is-invalid': !matching }"
            type="password"
            v-model="passwordRepeat">
          <div class="invalid-feedback">
            Passwords don't match!
          </div>
        </div>
        <div class="col" />
      </div>
      <div class="row">
        <div class="col-2 ms-auto align-content-end justify-content-end d-flex flex-wrap">
          <button
            type="button"
            class="btn btn-outline-success me-2 mt-2"
            :disabled="invalidPassword"
            @click="save()">
            <font-awesome-icon :icon="['fas', 'floppy-disk']" />
            Save
          </button>
        </div>
      </div>
    </div>
  </template>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { currentProjectStore, currentUserStore } from '@/stores';
import type { AuthTokenModel, UserModel } from '@/plugins/api/api-core';
import { API, toastReject } from '@/plugins/api';
import ToolTip from '@/components/ToolTip.vue';
import { EventBus } from '@/plugins/events';
import { ToastEvent } from '@/plugins/events/events/toast';

type UserManagementViewData = {
  editPassword: boolean;
  passwordRepeat: string;
  user: UserModel | null;
  tokens: AuthTokenModel[];
};

export default defineComponent({
  name: 'UserProfileView',
  components: { ToolTip },
  data(): UserManagementViewData {
    return {
      editPassword: false,
      passwordRepeat: '',
      user: null,
      tokens: [],
    };
  },
  mounted() {
    // clear current project when user enters this page
    // among other things, this makes the sidebar go away
    currentProjectStore.clear();

    // load user data
    API.core.oauth.readUsersMeApiLoginMeGet()
      .then((response) => {
        this.user = response.data;
      }).catch(toastReject);

    // load auth tokens
    this.refreshAuthTokens();
  },
  methods: {
    save() {
      if (this.invalidPassword) {
        EventBus.emit(new ToastEvent('WARN', 'Something is not right with your password!'));
      } else {
        API.core.users.saveUserSelfApiUsersMyDetailsPut({
          requestBody: this.user,
        }).then((response) => {
          EventBus.emit(new ToastEvent('SUCCESS', `Saved your data for user_id ${response.data}`));

          // reset password edit settings
          this.editPassword = false;
          this.passwordRepeat = '';
          this.user.password = undefined;
        }).catch(toastReject);
      }
    },
    refreshAuthTokens() {
      API.core.oauth.readTokensMeApiLoginMyTokensGet()
        .then((response) => {
          this.tokens = response.data;
        }).catch(toastReject);
    },
    revoke(token: AuthTokenModel) {
      API.core.oauth
        .revokeTokenApiLoginTokenTokenIdDelete({
          tokenId: token.token_id,
        })
        .then(this.refreshAuthTokens)
        .catch(toastReject);
    },
    refresh(token: AuthTokenModel) {
      if (token.token_id === currentUserStore.authToken?.token_id) {
        currentUserStore.extendAuthTokenValidity();
      } else {
        API.core.oauth
          .refreshTokenApiLoginTokenTokenIdPut({
            tokenId: token.token_id,
          })
          .then(this.refreshAuthTokens)
          .catch(toastReject);
      }
    },
  },
  computed: {
    matching(): boolean {
      return this.passwordRepeat === this.user.password;
    },
    secure(): boolean {
      return (/(?=.*[$@!%*#?&^])(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{11,}/).test(this.user.password || '');
    },
    invalidPassword(): boolean {
      return this.editPassword && (!this.matching || !this.secure);
    },
  },
});
</script>

<style scoped>

</style>
