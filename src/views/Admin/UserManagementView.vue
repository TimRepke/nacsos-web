<template>
  <div>
    <ul class="list-group">
      <li v-for="user in users" :key="user.user_id" class="list-group-item p-4">
        <div class="row">
          <div class="col">
            <div class="mb-2 d-flex justify-content-start">
              <div class="me-4">
                <strong>{{ user.username }}</strong>
              </div>
              <div class="me-auto">
                <code>{{ user.user_id }}</code>
              </div>
              <div class="me-2">
                <div class="form-check-reverse form-switch">
                  <label class="form-check-label" :for="`sa-${user.user_id}`">
                    <font-awesome-icon :icon="['fas', 'user-gear']" />
                    Super-user permissions</label
                  >
                  <input
                    class="form-check-input"
                    type="checkbox"
                    role="switch"
                    :aria-checked="undefined"
                    :id="`sa-${user.user_id}`"
                    v-model="user.is_superuser"
                  />
                </div>
              </div>
              <div>
                <div class="form-check-reverse form-switch">
                  <label class="form-check-label" :for="`active-${user.user_id}`">
                    <font-awesome-icon :icon="['fas', 'users-viewfinder']" />
                    Active</label
                  >
                  <input
                    class="form-check-input"
                    type="checkbox"
                    role="switch"
                    :aria-checked="undefined"
                    :id="`active-${user.user_id}`"
                    v-model="user.is_active"
                  />
                </div>
              </div>
            </div>
            <div class="row mb-2" v-if="user.hasNewPassword">
              <div class="col">
                <div><strong>Temporary password:</strong> {{ user.password }}</div>
                <div class="text-muted small">(Only valid after saved)</div>
              </div>
            </div>
            <div class="row mb-2" v-if="user.isNew">
              <div class="col">
                <label :for="`user-${user.user_id}`" class="form-label">Username</label>
                <input
                  :id="`user-${user.user_id}`"
                  class="form-control form-control-sm"
                  type="text"
                  v-model="user.username"
                />
              </div>
              <div class="col">
                <label :for="`passwd-${user.user_id}`" class="form-label">Password</label>
                <input
                  :id="`passwd-${user.user_id}`"
                  class="form-control form-control-sm"
                  type="text"
                  disabled
                  v-model="user.password"
                />
              </div>
              <div class="col align-bottom align-text-bottom">
                <button type="button" class="btn btn-outline-primary btn-sm me-2 mt-2" @click="sendWelcome(user)">
                  <font-awesome-icon :icon="['fas', 'paper-plane']" />
                  Send welcome (save first!)
                </button>
              </div>
            </div>
            <div class="row">
              <div class="col">
                <label :for="`username-${user.user_id}`" class="form-label">Full name</label>
                <input
                  :id="`username-${user.user_id}`"
                  class="form-control form-control-sm"
                  type="text"
                  v-model="user.full_name"
                />
              </div>
              <div class="col">
                <label :for="`email-${user.user_id}`" class="form-label">Email address</label>
                <input
                  :id="`email-${user.user_id}`"
                  class="form-control form-control-sm"
                  type="email"
                  v-model="user.email"
                />
              </div>
              <div class="col">
                <label :for="`affil-${user.user_id}`" class="form-label">Affiliation (short)</label>
                <input
                  :id="`affil-${user.user_id}`"
                  class="form-control form-control-sm"
                  type="text"
                  v-model="user.affiliation"
                />
              </div>
            </div>
          </div>
          <div class="col-2 ms-auto align-content-end justify-content-end d-flex flex-wrap">
            <button type="button" class="btn btn-outline-success btn-sm me-2 mt-2" @click="saveUser(user)">
              <font-awesome-icon :icon="['fas', 'floppy-disk']" />
              Save
            </button>
            <button type="button" class="btn btn-outline-danger btn-sm me-2 mt-2 disabled" @click="deleteUser(user)">
              <font-awesome-icon :icon="['fas', 'trash-can']" />
              Delete
            </button>
            <button type="button" class="btn btn-outline-primary btn-sm me-2 mt-2" @click="resetPassword(user)">
              <font-awesome-icon :icon="['fas', 'key']" />
              Reset password
            </button>
            <button type="button" class="btn btn-outline-primary btn-sm me-2 mt-2" @click="resetPasswordMail(user)">
              <font-awesome-icon :icon="['fas', 'paper-plane']" />
              Password reset mail
            </button>
          </div>
        </div>
      </li>
    </ul>
    <button type="button" class="btn btn-outline-primary btn-sm mt-2 mb-2" @click="addUser">
      <font-awesome-icon :icon="['far', 'square-plus']" />
      Create user
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { API, toastReject } from "@/plugins/api";
import { EventBus } from "@/plugins/events";
import { ToastEvent } from "@/plugins/events/events/toast";
import type { UserBaseModel } from "@/plugins/api/api-core";

type UserModel = UserBaseModel & {
  password?: string;
  isNew?: boolean;
  hasNewPassword?: boolean;
};

type UserManagementViewData = {
  users: Array<UserModel>;
};

export default defineComponent({
  name: "UserManagementView",
  data(): UserManagementViewData {
    return {
      users: [] as UserModel[],
    };
  },
  mounted() {
    API.core.users
      .getAllUsersApiUsersListAllGet()
      .then((response) => {
        this.users = response.data;
      })
      .catch(() => {
        EventBus.emit(new ToastEvent("WARN", "Failed to load list of users."));
      });
  },
  methods: {
    addUser() {
      this.users.push({
        user_id: crypto.randomUUID(),
        username: "",
        email: "",
        full_name: "",
        affiliation: "",
        is_superuser: false,
        is_active: true,
        password: this.generateRandomPassword(),
        isNew: true,
      });
    },
    deleteUser() {
      EventBus.emit(
        new ToastEvent(
          "WARN",
          "This is not implemented, because it can cause big problems." +
            "Rather consider deactivating the user or ask a DB admin to delete the row in the table.",
        ),
      );
    },
    saveUser(user: UserBaseModel) {
      API.core.users
        .saveUserApiUsersDetailsPut({
          requestBody: user,
        })
        .then((response) => {
          EventBus.emit(new ToastEvent("SUCCESS", `Successfully saved user with id: ${response.data}!`));
        })
        .catch((reason) => {
          console.error(reason);
          EventBus.emit(new ToastEvent("ERROR", "Failed to save user."));
        });
    },
    resetPassword(user: UserModel) {
      // eslint-disable-next-line no-param-reassign
      user.password = this.generateRandomPassword();
      // eslint-disable-next-line no-param-reassign
      user.hasNewPassword = true;
      console.log(user);
    },
    resetPasswordMail(user: UserModel) {
      API.core.mailing
        .resetPasswordApiMailResetPasswordUsernamePost({
          username: user.username as string,
        })
        .then(() => {
          EventBus.emit(new ToastEvent("SUCCESS", "Sent password reset mail to user."));
        })
        .catch(toastReject);
    },
    sendWelcome(user: UserModel) {
      API.core.mailing
        .welcomeMailApiMailWelcomePost({
          username: user.username as string,
          password: user.password as string,
        })
        .then(() => {
          EventBus.emit(new ToastEvent("SUCCESS", "Sent onboarding mail to user."));
        })
        .catch(toastReject);
    },
    generateRandomPassword() {
      return (
        Math.random().toString(36).slice(2) +
        Math.random().toString(36).slice(2) +
        Math.random().toString(36).slice(2) +
        Math.random().toString(36).slice(2) +
        Math.random().toString(36).slice(2) +
        Math.random().toString(36).slice(2)
      );
    },
  },
});
</script>

<style scoped></style>
