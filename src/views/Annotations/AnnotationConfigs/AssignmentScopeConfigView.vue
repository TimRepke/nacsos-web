<template>
  <div class="text-start p-2">
    <div class="mb-3 pb-3 border-bottom">
      <h1 v-if="newScope">Create new assignment scope</h1>
      <h1 v-else>Monitor assignment scope</h1>
      <h6>
        The assignment scope for an annotation task is used to annotate in multiple
        batches or subsets and keep track of that reference.
      </h6>
    </div>
    <div class="mb-3 pb-3 border-bottom">
      <h4>General settings</h4>
      <div class="mb-3">
        <label for="scopeName" class="form-label">Scope Name</label>
        <input type="text" class="form-control" id="scopeName" placeholder="Name for this scope"
               v-model="annotationScope.name"/>
      </div>
      <div>
        <label for="scopeDescription" class="form-label">Scope description</label>
        <textarea class="form-control" id="scopeDescription" rows="3" v-model="annotationScope.description"></textarea>
      </div>
    </div>
    <div class="mb-3 pb-3 border-bottom">
      <h4>User pool</h4>
      <div class="row">
        <div class="col-lg-5 col-md-7">
          <template v-if="users && users.length > 0">
            <label for="userSearch" class="visually-hidden">Search for users</label>
            <input type="text" class="form-control mb-1" id="userSearch" placeholder="Search" v-model="userSearch"/>
            <ul style="max-height: 15rem" class="list-group overflow-auto">
              <li v-for="user in searchFilteredUsers" :key="user.user_id"
                  class="list-group-item d-flex justify-content-between align-items-start"
                  :class="{'list-group-item-info': selectedUserIds.indexOf(user.user_id) >= 0 }">
                <div class="me-auto">
                  {{ user.full_name }}
                  <span class="text-muted ms-2"
                        style="font-size: calc(0.876*var(--bs-body-font-size))">
                    {{ user.affiliation }} | {{ user.email }} | {{ user.username }}
                  </span>
                </div>
                <span role="button" class="link-secondary" tabindex="0" @click="selectUser(user)">
                  <font-awesome-icon :icon="['fas', 'user-plus']"/>
                </span>
              </li>
            </ul>
          </template>
          <template v-else>
            <button class="btn btn-outline-secondary btn-sm" @click="loadListOfUsers()">
              <font-awesome-icon v-if="users === undefined" :icon="['fas', 'spinner']" class="fa-pulse"/>
              <font-awesome-icon v-else :icon="['fas', 'arrows-down-to-people']"/>
              Load list of users
            </button>
          </template>
        </div>
        <div class="col-md-5 mt-2 mt-md-0" v-if="selectedUsers.length > 0">
          <strong>Selected users</strong>
          <div v-for="user in selectedUsers" :key="user.user_id" class="ms-2">
            {{ user.username }}
            <span role="button" class="link-secondary" tabindex="0" @click="unselectUser(user)">
              <font-awesome-icon :icon="['fas', 'user-minus']"/>
            </span>
          </div>
        </div>
      </div>
    </div>
    <div class="mb-3 pb-3 border-bottom">
      <h4>Assignment strategy settings</h4>
      <label for="strategyConfigPicker" class="visually-hidden">Strategy Config Option</label>
      <select id="strategyConfigPicker" v-model="strategyConfigComponent">
        <option disabled :value="undefined">Select strategy</option>
        <option value="RandomAssignmentConfig">Random assignment</option>
      </select><br/>
      <component :is="strategyConfigComponent"></component>
      <button class="btn btn-outline-secondary"
              v-show="strategyConfigComponent !== undefined"
              :disabled="scopeIsActive"
              @click="createAssignments">Make assignments
      </button>
    </div>
    <div class="mb-3">
      <h4>Results</h4>
      TODO: for each user, show num assignments and progress<br/>
      TODO: some basic stats<br/>
      TODO: a few export buttons<br/>
    </div>
    <button class="btn btn-success position-fixed" style="top: 4rem; right: 1rem;" @click="save()">Save</button>
  </div>
</template>

<script lang="ts">
// import { callProjectTasksEndpoint, callTaskDefinitionEndpoint } from '@/plugins/api/annotations';
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import RandomAssignmentConfig from '@/components/annotations/assignments/RandomAssignmentConfig.vue';
import { EventBus } from '@/plugins/events';
import { ConfirmationRequestEvent } from '@/plugins/events/events/confirmation';
import { AssignmentScope } from '@/types/annotation.d';
import { User } from '@/types/user.d';
import { callUsersListEndpoint } from '@/plugins/api/users';

export default {
  name: 'AssignmentScopeConfigView',
  components: { RandomAssignmentConfig },
  async setup() {
    const route = useRoute();
    const scopeId = route.params.scope_id;
    const taskId = route.query.task_id;

    let scope: AssignmentScope;
    if (scopeId) {
      // TODO load current scope config
      // const response = await callAssignmentScopeEndpoint({ scopeId: currentAssignmentScopeId });
      scope = {
        assignment_scope_id: scopeId as string,
        task_id: taskId as string,
        time_created: undefined,
        name: '',
        description: '',
      };
    } else if (taskId) {
      scope = {
        assignment_scope_id: undefined,
        task_id: taskId as string,
        time_created: undefined,
        name: '',
        description: '',
      };
    } else {
      throw Error('Something went wrong. Please tell the admin how you got here.');
    }

    return {
      newScope: !scopeId && taskId,
      annotationScope: ref(scope),
    };
  },
  data() {
    return {
      userSearch: '',
      users: [] as User[],
      selectedUsers: [] as User[],
      scopeIsActive: false, // indicates whether assignments were already performed in this scope
      strategyConfigComponent: undefined, // the component for configuring the assignment strategy
    };
  },
  methods: {
    createAssignments() {
      if (!this.scopeIsActive) {
        EventBus.emit(new ConfirmationRequestEvent(
          'Once you create and send out assignments, you cannot make any further changes.\n\n'
          + 'Are you sure you want to proceed?',
          (response) => {
            if (response === 'ACCEPT') {
              this.scopeIsActive = true;
              // TODO implement trigger for assigning tasks
            }
          },
          'Create assignments',
        ));
      }
    },
    async loadListOfUsers() {
      this.users = undefined;
      this.users = (await callUsersListEndpoint()).payload;
    },
    selectUser(user: User) {
      this.selectedUsers.push(user);
    },
    unselectUser(user: User) {
      const userIndex = this.selectedUserIds.indexOf(user.user_id);
      this.selectedUsers.splice(userIndex, 1);
    },
  },
  computed: {
    searchFilteredUsers() {
      if (this.users) {
        // TODO make the search more sophisticated
        //      e.g. by including institution, email, username, substring matches
        return this.users.filter((user: User) => user.full_name.toLowerCase().startsWith(this.userSearch.toLowerCase()));
      }
      return this.users;
    },
    selectedUserIds() {
      if (this.selectedUsers && this.selectedUsers.length > 0) {
        return this.selectedUsers.map((user: User) => user.user_id);
      }
      return [];
    },
  },
};
</script>

<style scoped>

</style>
