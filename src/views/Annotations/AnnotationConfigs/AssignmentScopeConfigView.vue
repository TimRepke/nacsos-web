<template>
  <div class="text-start p-2 container-fluid">
    <div class="row pb-2 mb-2 border-bottom g-0">
      <div class="col-md-8">
        <h1 v-if="isNewScope">Create new assignment scope</h1>
        <h1 v-else>Monitor assignment scope</h1>
        <h6>
          The assignment scope for an annotation scheme is used to annotate in multiple
          batches or subsets and keep track of that reference.
        </h6>
      </div>
    </div>
    <div class="row pb-2 mb-2 border-bottom g-0">
      <div class="col-md-6">
        <h4>General settings</h4>
        <div class="mb-3">
          <label for="scopeName" class="form-label">Scope Name</label>
          <input type="text" class="form-control" id="scopeName" placeholder="Name for this scope"
                 v-model="assignmentScope.name"/>
        </div>
        <div>
          <label for="scopeDescription" class="form-label">Scope description</label>
          <textarea class="form-control" id="scopeDescription" rows="3"
                    v-model="assignmentScope.description"></textarea>
        </div>
      </div>
    </div>
    <div class="row pb-2 mb-2 border-bottom g-0" v-if="!scopeHasAssignments">
      <h4>User pool</h4>
      <div class="col-lg-5 col-md-7">
        <button v-if="!users || users.length === 0"
                class="btn btn-outline-secondary btn-sm" @click="loadListOfUsers">
          <font-awesome-icon v-if="users === undefined" :icon="['fas', 'spinner']" class="fa-pulse"/>
          <font-awesome-icon v-else :icon="['fas', 'arrows-down-to-people']"/>
          Load list of users
        </button>
        <div v-else>
          <div class="m-0">
            <input type="text" class="form-control mb-1" placeholder="Search..." v-model="userSearch"
                   aria-label="Search for users"/>
          </div>
          <ul style="max-height: 15rem" class="list-group overflow-auto">
            <li v-for="user in searchFilteredUsers" :key="user.user_id"
                class="list-group-item d-flex justify-content-between align-items-start"
                :class="{'list-group-item-info': isSelected(user) }">
              <div class="me-auto">
                {{ user.full_name }}
                <span class="text-muted ms-2"
                      style="font-size: calc(0.876*var(--bs-body-font-size))">
                    {{ user.affiliation }} | {{ user.email }} | {{ user.username }}
                  </span>
              </div>
              <span role="button" class="link-secondary" tabindex="0"
                    @click="selectUser(user)" v-show="!isSelected(user)">
                  <font-awesome-icon :icon="['fas', 'user-plus']"/>
                </span>
            </li>
          </ul>
        </div>
      </div>
      <div class="col-md-5 mt-2 mt-md-0">
        <div class="row g-0 ms-2">
          <template v-if="!selectedUsers || selectedUsers.length === 0">
            Please use the list on the left to select users that should receive annotation assignments in this scope.
          </template>
          <template v-else>
            <strong>Selected users</strong>
            <ul class="list-unstyled">
              <li v-for="user in selectedUsers" :key="user.user_id" class="ms-2">
                {{ user.username }}
                <span role="button" class="link-secondary" tabindex="0" @click="unselectUser(user)">
                  <font-awesome-icon :icon="['fas', 'user-minus']"/>
                </span>
              </li>
            </ul>
          </template>
        </div>
      </div>
    </div>
    <div class="row pb-2 mb-2 border-bottom g-0">
      <div class="col">
        <h4>Assignment strategy settings</h4>
        <div class="mb-2">
          <select v-model="strategyConfigType" aria-label="Strategy Config Option" :disabled="scopeHasAssignments">
            <option disabled :value="undefined">Select strategy</option>
            <option value="random">Random assignment</option>
          </select>
        </div>
        <div class="mb-2">
          <RandomAssignmentConfig v-if="strategyConfigType === 'random'"
                                  :existing-config="assignmentScope.config"
                                  :editable="!scopeHasAssignments"
                                  @config-changed="updateConfig($event)"/>
        </div>
        <button class="btn btn-outline-secondary"
                v-if="strategyConfigType !== undefined"
                :disabled="scopeHasAssignments"
                @click="createAssignments">
          Make assignments
        </button>
      </div>
    </div>
    <div class="row pb-2 mb-2 border-bottom g-0" v-if="scopeHasAssignments">
      <div class="col">
        <h4>Results</h4>
        <button class="btn btn-sm btn-outline-secondary" @click="loadResults">
          <font-awesome-icon :icon="['fas', 'rotate']"/>
          (Re)load stats
        </button>
        <div class="mt-2 mb-2" v-if="assignmentCounts">
          Assignments: {{ assignmentCounts.num_total }}
          (
          open: <span class="bg-info bg-opacity-50 p-1">{{ assignmentCounts.num_open }}</span> |
          partial: <span class="bg-warning bg-opacity-50 p-1">{{ assignmentCounts.num_partial }}</span> |
          done: <span class="bg-success bg-opacity-50 p-1">{{ assignmentCounts.num_full }}</span>)
        </div>
        <template v-if="statsLoaded">
          <AssignmentsVisualiser :assignments="assignments"/>
        </template>
        <div class="mt-2 ms-2 text-warning">
          TODO: for each user, show num assignments and progress<br/>
          TODO: some basic stats<br/>
          TODO: a few export buttons<br/>
        </div>
      </div>
    </div>
    <button class="btn btn-success position-fixed" style="top: 4rem; right: 1rem;" @click="save()">Save</button>
  </div>
</template>

<script lang="ts">
import RandomAssignmentConfig from '@/components/annotations/assignments/RandomAssignmentConfig.vue';
import { EventBus } from '@/plugins/events';
import { ConfirmationRequestEvent } from '@/plugins/events/events/confirmation';
import {
  Assignment,
  AssignmentScope,
  AssignmentScopeConfigType,
  AssignmentConfigType,
  AssignmentScopeCounts,
} from '@/types/annotation.d';
import { User } from '@/types/user.d';
import {
  callAllProjectUsersListEndpoint,
  callUsersDetailsEndpoint,
} from '@/plugins/api/users';
import {
  callMakeAssignmentsEndpoint,
  callScopeEndpoint,
  callScopeCountsEndpoint,
  callSaveAssignmentScopeEndpoint, callScopeAssignmentsEndpoint,
} from '@/plugins/api/annotations';
import AssignmentsVisualiser from '@/components/annotations/assignments/AssignmentsVisualiser.vue';
import { useCurrentProjectStore } from '@/stores/CurrentProjectStore';
import { ToastEvent } from '@/plugins/events/events/toast';

export default {
  name: 'AssignmentScopeConfigView',
  components: { AssignmentsVisualiser, RandomAssignmentConfig },
  data() {
    const scopeId = this.$route.params.scope_id;
    const annotationSchemeId = this.$route.query.annotation_scheme_id;

    return {
      scopeId,
      annotationSchemeId,
      // list of all users in the system
      users: [] as User[],
      // search query for filtering list of users
      userSearch: '',
      // users selected to be in the query pool
      selectedUsers: [] as User[],
      // assignment strategy type
      strategyConfigType: undefined as AssignmentScopeConfigType | undefined,
      // indicates whether this is (or will be) a newly created scope
      isNewScope: !scopeId && annotationSchemeId,
      // holds the assignment counts (or undefined if none exist)
      assignmentCounts: undefined as AssignmentScopeCounts | undefined,
      assignments: [] as Assignment[],
      assignmentScope: {
        assignment_scope_id: undefined,
        annotation_scheme_id: annotationSchemeId,
        time_created: undefined,
        name: '',
        description: '',
      } as AssignmentScope,
    };
  },
  async mounted() {
    if (!this.isNewScope) {
      const scopeReq = await callScopeEndpoint({ assignmentScopeId: this.scopeId });
      const countsReq = await callScopeCountsEndpoint({ assignmentScopeId: this.scopeId });

      if (scopeReq.status === 'SUCCESS' && scopeReq.payload && countsReq.status === 'SUCCESS' && countsReq.payload) {
        this.assignmentScope = scopeReq.payload;
        this.assignmentCounts = countsReq.payload;

        if (this.assignmentScope.config && this.assignmentScope.config.users && this.assignmentScope.config.users.length > 0) {
          this.strategyConfigType = this.assignmentScope.config.config_type;
          const usersReq = await callUsersDetailsEndpoint({ user_id: this.assignmentScope.config.users });
          if (usersReq.status === 'SUCCESS' && usersReq.payload) {
            this.selectedUsers = usersReq.payload;
          } else {
            EventBus.emit(new ToastEvent('ERROR', 'Failed to load list of users. Please try reloading.'));
          }
        }
      } else {
        EventBus.emit(new ToastEvent('ERROR', 'Failed to load assignment scope info. Please try reloading.'));
      }
    }
  },
  methods: {
    createAssignments() {
      if (!this.assignmentScope.config) {
        EventBus.emit(new ToastEvent('WARN', 'You have to configure the assignment strategy first!'));
      } else if (!this.selectedUsers || this.selectedUsers.length === 0) {
        EventBus.emit(new ToastEvent('WARN', 'You have to select users who should receive assignments!'));
      } else if (this.scopeHasAssignments) {
        EventBus.emit(new ToastEvent('WARN', 'This assignment scope already has assignments!'));
      } else if (this.isNewScope) {
        EventBus.emit(new ToastEvent('WARN', 'You have to first save the assignment scope!'));
      } else {
        EventBus.emit(new ConfirmationRequestEvent(
          'Once you create and send out assignments, you cannot make any further changes.\n\n'
          + 'Are you sure you want to proceed?',
          (response) => {
            if (response === 'ACCEPT') {
              const payload = {
                annotation_scheme_id: this.assignmentScope.annotation_scheme_id,
                scope_id: this.assignmentScope.assignment_scope_id,
                save: true,
                config: JSON.parse(JSON.stringify(this.assignmentScope.config)),
              };
              payload.config.users = this.selectedUserIds;
              callMakeAssignmentsEndpoint(payload)
                .then((res) => {
                  EventBus.emit(new ToastEvent(
                    'SUCCESS',
                    `Successfully created ${res.payload?.length} assignments.`,
                  ));
                  this.scopeHasAssignments = true;
                  this.loadResults();
                })
                .catch((res) => {
                  EventBus.emit(new ToastEvent('ERROR', 'Something failed while creating assignments.'));
                  console.error(res);
                });
            }
          },
          'Create assignments',
        ));
      }
    },
    save() {
      EventBus.emit(new ConfirmationRequestEvent(
        'Saving the scope does not create or change assignments.',
        (response) => {
          if (response === 'ACCEPT') {
            const scope = JSON.parse(JSON.stringify(this.assignmentScope)); // clone the object
            if (scope.config) {
              scope.config.users = this.selectedUserIds;
            }
            callSaveAssignmentScopeEndpoint(scope)
              .then((res) => {
                EventBus.emit(new ToastEvent(
                  'SUCCESS',
                  `Save assignment scope details.  \n**ID:** ${res.payload}`,
                ));
                if (this.isNewScope) {
                  this.isNewScope = false;
                  this.$router.replace({ name: 'config-annotation-scheme-scope', params: { scope_id: res.payload } });
                }
              })
              .catch((res) => {
                EventBus.emit(new ToastEvent(
                  'ERROR',
                  `Failed to save assignment scope details. (${res.reason})`,
                ));
              });
          } else {
            EventBus.emit(new ToastEvent('WARN', 'Did not save the assignment scope details.'));
          }
        },
        'Save assignment scope',
        'Ok, save.',
        'Don´t save yet.',
      ));
    },
    loadResults() {
      if (this.assignmentScope.assignment_scope_id) {
        callScopeCountsEndpoint({ assignmentScopeId: this.assignmentScope.assignment_scope_id })
          .then((result) => { this.assignmentCounts = result.payload; })
          .catch(() => { EventBus.emit(new ToastEvent('ERROR', 'Failed to load assignment counts.')); });
        callScopeAssignmentsEndpoint({ assignmentScopeId: this.assignmentScope.assignment_scope_id })
          .then((result) => { this.assignments = result.payload; })
          .catch(() => { EventBus.emit(new ToastEvent('ERROR', 'Failed to load assignments.')); });
      }
    },
    async loadListOfUsers() {
      this.users = undefined;
      this.users = (await callAllProjectUsersListEndpoint({ projectId: useCurrentProjectStore().projectId })).payload;
    },
    selectUser(user: User) {
      if (!this.isSelected(user)) {
        this.selectedUsers.push(user);
      }
    },
    unselectUser(user: User) {
      const userIndex = this.selectedUserIds.indexOf(user.user_id);
      this.selectedUsers.splice(userIndex, 1);
    },
    updateConfig(eventPayload: AssignmentConfigType | undefined) {
      this.assignmentScope.config = eventPayload;
    },
    isSelected(user: User) {
      return this.selectedUserIds.indexOf(user.user_id) >= 0;
    },
  },
  computed: {
    searchFilteredUsers(): User[] {
      if (this.users) {
        // TODO make the search more sophisticated
        //      e.g. by including institution, email, username, substring matches
        return this.users.filter((user: User) => user.full_name.toLowerCase().startsWith(this.userSearch.toLowerCase()));
      }
      return this.users;
    },
    selectedUserIds(): string[] {
      if (this.selectedUsers && this.selectedUsers.length > 0) {
        return this.selectedUsers.map((user: User) => user.user_id);
      }
      return [];
    },
    statsLoaded(): boolean {
      return this.assignments && this.assignments.length > 0 && this.assignmentCounts;
    },
    // indicates whether assignments were already performed in this scope
    scopeHasAssignments(): boolean {
      return !!this.assignmentCounts && this.assignmentCounts.num_total > 0;
    },
  },
};
</script>

<style scoped>

</style>
