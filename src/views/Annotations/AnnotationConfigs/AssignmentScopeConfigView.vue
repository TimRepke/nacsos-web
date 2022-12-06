<template>
  <div>
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
          <input
            type="text"
            class="form-control"
            id="scopeName"
            placeholder="Name for this scope"
            v-model="assignmentScope.name" />
        </div>
        <div>
          <label for="scopeDescription" class="form-label">Scope description</label>
          <textarea
            class="form-control"
            id="scopeDescription"
            rows="3"
            v-model="assignmentScope.description" />
        </div>
      </div>
    </div>
    <div class="row pb-2 mb-2 border-bottom g-0" v-if="!scopeHasAssignments">
      <h4>User pool</h4>
      <div class="col-lg-5 col-md-7">
        <button
          v-if="!users || users.length === 0"
          type="button"
          class="btn btn-outline-secondary btn-sm"
          @click="loadListOfUsers">
          <font-awesome-icon v-if="users === undefined" :icon="['fas', 'spinner']" class="fa-pulse" />
          <font-awesome-icon v-else :icon="['fas', 'arrows-down-to-people']" />
          Load list of users
        </button>
        <div v-else>
          <div class="m-0">
            <input
              type="text"
              class="form-control mb-1"
              placeholder="Search..."
              v-model="userSearch"
              aria-label="Search for users" />
          </div>
          <ul style="max-height: 15rem" class="list-group overflow-auto">
            <li
              v-for="user in searchFilteredUsers"
              :key="user.user_id"
              class="list-group-item d-flex justify-content-between align-items-start"
              :class="{ 'list-group-item-info': isSelected(user) }">
              <div class="me-auto">
                {{ user.full_name }}
                <span
                  class="text-muted ms-2"
                  style="font-size: calc(0.876*var(--bs-body-font-size))">
                  {{ user.affiliation }} | {{ user.email }} | {{ user.username }}
                </span>
              </div>
              <span
                v-show="!isSelected(user)"
                role="button"
                class="link-secondary"
                tabindex="0"
                @click="selectUser(user)">
                <font-awesome-icon :icon="['fas', 'user-plus']" />
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
                  <font-awesome-icon :icon="['fas', 'user-minus']" />
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
          <RandomAssignmentConfig
            v-if="strategyConfigType === 'random'"
            :existing-config="assignmentScope.config"
            :editable="!scopeHasAssignments"
            @config-changed="updateConfig($event)" />
        </div>
        <button
          v-if="strategyConfigType !== undefined"
          type="button"
          class="btn btn-outline-secondary"
          :disabled="scopeHasAssignments"
          @click="createAssignments">
          Make assignments
        </button>
      </div>
    </div>
    <div class="row pb-2 mb-2 border-bottom g-0" v-if="scopeHasAssignments">
      <div class="col">
        <h4>Results</h4>
        <button
          type="button"
          class="btn btn-sm btn-outline-secondary"
          @click="loadResults">
          <font-awesome-icon :icon="['fas', 'rotate']" />
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
          <AssignmentsVisualiser :assignments="assignments" />
        </template>
        <div class="mt-2 ms-2 text-warning">
          TODO: for each user, show num assignments and progress<br />
          TODO: some basic stats<br />
          TODO: a few export buttons<br />
        </div>
      </div>
    </div>
    <button type="button" class="btn btn-success position-fixed" style="top: 4rem; right: 1rem;" @click="save()">Save
    </button>
  </div>
</template>

<script lang="ts">
import RandomAssignmentConfig from '@/components/annotations/assignments/RandomAssignmentConfig.vue';
import { EventBus } from '@/plugins/events';
import { ConfirmationRequestEvent } from '@/plugins/events/events/confirmation';
import AssignmentsVisualiser from '@/components/annotations/assignments/AssignmentsVisualiser.vue';
import { ToastEvent } from '@/plugins/events/events/toast';
import {
  AssignmentCounts,
  AssignmentModel,
  AssignmentScopeModel,
  AssignmentScopeRandomConfig,
  UserModel,
} from '@/plugins/api/api-core';
import { API, ApiResponseReject } from '@/plugins/api';
import { currentProjectStore } from '@/stores';

type AssignmentScopeConfigData = {
  scopeId: string;
  annotationSchemeId: string;
  // list of all users in the system
  users: UserModel[];
  // search query for filtering list of users
  userSearch: string;
  // users selected to be in the query pool
  selectedUsers: UserModel[];
  // assignment strategy type
  strategyConfigType?: AssignmentScopeRandomConfig.config_type;
  // indicates whether this is (or will be) a newly created scope
  isNewScope: boolean;
  // holds the assignment counts (or undefined if none exist)
  assignmentCounts?: AssignmentCounts;
  assignments: AssignmentModel[];
  assignmentScope: AssignmentScopeModel;
};

export default {
  name: 'AssignmentScopeConfigView',
  components: { AssignmentsVisualiser, RandomAssignmentConfig },
  data(): AssignmentScopeConfigData {
    const scopeId = this.$route.params.scope_id;
    const annotationSchemeId = this.$route.query.annotation_scheme_id;

    return {
      scopeId,
      annotationSchemeId,
      users: [],
      userSearch: '',
      selectedUsers: [],
      strategyConfigType: undefined,
      // indicates whether this is (or will be) a newly created scope
      isNewScope: !scopeId && annotationSchemeId,
      // holds the assignment counts (or undefined if none exist)
      assignmentCounts: undefined,
      assignments: [],
      assignmentScope: {
        assignment_scope_id: undefined,
        annotation_scheme_id: annotationSchemeId,
        time_created: undefined,
        name: '',
        description: '',
      },
    };
  },
  async mounted() {
    if (!this.isNewScope) {
      Promise.allSettled([
        API.core.annotations.getAssignmentScopeApiAnnotationsAnnotateScopeAssignmentScopeIdGet({
          xProjectId: currentProjectStore.projectId,
          assignmentScopeId: this.scopeId,
        }),
        API.core.annotations.getNumAssignmentsForScopeApiAnnotationsAnnotateScopeCountsAssignmentScopeIdGet({
          xProjectId: currentProjectStore.projectId,
          assignmentScopeId: this.scopeId,
        }),
      ])
        .then(([scopePromise, countsPromise]) => {
          if (scopePromise.status === 'fulfilled' && countsPromise.status === 'fulfilled') {
            this.assignmentScope = scopePromise.value.data;
            this.assignmentCounts = countsPromise.value.data;
          } else {
            EventBus.emit(new ToastEvent('ERROR', 'Failed to load assignment scope info. Please try reloading.'));
          }

          if (this.assignmentScope.config?.users?.length > 0) {
            this.strategyConfigType = this.assignmentScope.config.config_type;
            API.core.users.getUsersByIdsApiUsersDetailsGet({
              xProjectId: currentProjectStore.projectId,
              userId: this.assignmentScope.config.users,
            })
              .then((response) => {
                this.selectedUsers = response.data;
              })
              .catch(() => {
                EventBus.emit(new ToastEvent('ERROR', 'Failed to load list of users. Please try reloading.'));
              });
          }
        });
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

              API.core.annotations.makeAssignmentsApiAnnotationsConfigAssignmentsPost({
                xProjectId: currentProjectStore.projectId,
                requestBody: payload,
              })
                .then((res) => {
                  EventBus.emit(new ToastEvent(
                    'SUCCESS',
                    `Successfully created ${res.data.length} assignments.`,
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
            API.core.annotations.putAssignmentScopeApiAnnotationsAnnotateScopePut({
              xProjectId: currentProjectStore.projectId,
              requestBody: scope,
            })
              .then((res) => {
                EventBus.emit(new ToastEvent(
                  'SUCCESS',
                  `Save assignment scope details.  \n**ID:** ${res.data}`,
                ));
                if (this.isNewScope) {
                  this.isNewScope = false;
                  this.$router.replace({ name: 'config-annotation-scheme-scope', params: { scope_id: res.data } });
                }
              })
              .catch((res) => {
                const err = res as ApiResponseReject;
                EventBus.emit(new ToastEvent(
                  'ERROR',
                  `Failed to save assignment scope details. (${err.error?.type})`,
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
        API.core.annotations.getNumAssignmentsForScopeApiAnnotationsAnnotateScopeCountsAssignmentScopeIdGet({
          xProjectId: currentProjectStore.projectId,
          assignmentScopeId: this.assignmentScope.assignment_scope_id,
        })
          .then((result) => { this.assignmentCounts = result.data; })
          .catch(() => { EventBus.emit(new ToastEvent('ERROR', 'Failed to load assignment counts.')); });

        API.core.annotations.getAssignmentsForScopeApiAnnotationsAnnotateAssignmentsScopeAssignmentScopeIdGet({
          xProjectId: currentProjectStore.projectId,
          assignmentScopeId: this.assignmentScope.assignment_scope_id,
        })
          .then((result) => { this.assignments = result.data; })
          .catch(() => { EventBus.emit(new ToastEvent('ERROR', 'Failed to load assignments.')); });
      }
    },
    async loadListOfUsers() {
      this.users = undefined;
      API.core.users.getProjectUsersApiUsersListProjectProjectIdGet({
        xProjectId: currentProjectStore.projectId,
        projectId: currentProjectStore.projectId,
      })
        .then((response) => { this.users = response.data; })
        .catch(() => { EventBus.emit(new ToastEvent('WARN', 'Failed to load list of users.')); });
    },
    selectUser(user: UserModel) {
      if (!this.isSelected(user)) {
        this.selectedUsers.push(user);
      }
    },
    unselectUser(user: UserModel) {
      const userIndex = this.selectedUserIds.indexOf(user.user_id);
      this.selectedUsers.splice(userIndex, 1);
    },
    updateConfig(eventPayload: AssignmentScopeRandomConfig.config_type | undefined) { // FIXME
      this.assignmentScope.config = eventPayload;
    },
    isSelected(user: UserModel) {
      return this.selectedUserIds.indexOf(user.user_id) >= 0;
    },
  },
  computed: {
    searchFilteredUsers(): UserModel[] {
      if (this.users) {
        // TODO make the search more sophisticated
        //      e.g. by including institution, email, username, substring matches
        return this.users.filter((user: UserModel) => user.full_name?.toLowerCase().startsWith(this.userSearch.toLowerCase()));
      }
      return this.users;
    },
    selectedUserIds(): string[] {
      if (this.selectedUsers && this.selectedUsers.length > 0) {
        return this.selectedUsers.map((user: UserModel) => user.user_id);
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
