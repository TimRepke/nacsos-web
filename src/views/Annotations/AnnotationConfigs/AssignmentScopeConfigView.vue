<template>
  <div>
    <div class="row pb-2 mb-2 border-bottom g-0">
      <div class="col-md-8">
        <h1 v-if="isNewScope">Create new assignment scope</h1>
        <h1 v-else>Monitor assignment scope</h1>
        <h6>
          The assignment scope for an annotation scheme is used to annotate in multiple batches or subsets and keep
          track of that reference.
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
            v-model="assignmentScope.name"
          />
        </div>
        <div class="mb-3">
          <label for="scopeDescription" class="form-label">Scope description</label>
          <textarea class="form-control" id="scopeDescription" rows="3" v-model="assignmentScope.description" />
        </div>
        <div class="mb-3">
          <label class="form-label">Highlighters</label>
          <ul class="list-group mt-0 ps-4 pe-4">
            <li v-for="highlighter in projectHighlighters" :key="highlighter.highlighter_id" class="list-group-item">
              <input
                :id="`hl-${highlighter.highlighter_id}`"
                :value="highlighter.highlighter_id"
                v-model="assignmentScope.highlighter_ids"
                class="form-check-input me-1"
                type="checkbox"
              />
              <label :for="`hl-${highlighter.highlighter_id}`" class="form-check-label stretched-link">
                {{ highlighter.name }}
              </label>
            </li>
          </ul>
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
          @click="loadListOfUsers"
        >
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
              aria-label="Search for users"
            />
          </div>
          <ul style="max-height: 15rem" class="list-group overflow-auto">
            <li
              v-for="user in searchFilteredUsers"
              :key="user.user_id as string"
              class="list-group-item d-flex justify-content-between align-items-start"
              :class="{ 'list-group-item-info': isSelected(user) }"
            >
              <div class="me-auto">
                {{ user.full_name }}
                <span class="text-muted ms-2" style="font-size: calc(0.876 * var(--bs-body-font-size))">
                  {{ user.affiliation }} | {{ user.email }} | {{ user.username }}
                </span>
              </div>
              <span
                v-show="!isSelected(user)"
                role="button"
                class="link-secondary"
                tabindex="0"
                @click="selectUser(user)"
              >
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
              <li v-for="user in selectedUsers" :key="user.user_id as string" class="ms-2">
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
            <option value="random_nql">Random assignment with NQL filter</option>
            <option value="random_exclusion">Random assignment with scope exclusion</option>
          </select>
        </div>
        <div class="mb-2" v-if="assignmentScope">
          <RandomAssignmentConfig
            v-if="strategyConfigType === 'random'"
            :existing-config="assignmentScope.config as AssignmentScopeRandomConfig"
            :editable="!scopeHasAssignments"
            @config-changed="updateConfig($event)"
          />
          <RandomAssignmentWithExclusionConfig
            v-if="strategyConfigType === 'random_exclusion'"
            :existing-config="assignmentScope.config as AssignmentScopeRandomWithExclusionConfig"
            :editable="!scopeHasAssignments"
            @config-changed="updateConfig($event)"
          />
          <RandomAssignmentWithNQLConfig
            v-if="strategyConfigType === 'random_nql'"
            :existing-config="assignmentScope.config as AssignmentScopeRandomWithNQLConfig"
            :editable="!scopeHasAssignments"
            @config-changed="updateConfig($event)"
          />
        </div>
        <button
          v-if="strategyConfigType !== undefined && !scopeHasAssignments"
          type="button"
          class="btn btn-outline-secondary"
          :disabled="scopeHasAssignments || isNewScope"
          @click="createAssignments"
        >
          Make assignments
        </button>
      </div>
    </div>
    <div class="row pb-2 mb-2 border-bottom g-0" v-if="scopeHasAssignments">
      <div class="col">
        <h4>Results</h4>
        <div class="text-end">
          <button type="button" class="btn btn-outline-warning" @click="sendReminders">
            <font-awesome-icon :icon="['fas', 'paper-plane']" />
            Remind users per email
          </button>
        </div>
        <ScopeQuality :users="annotators" :scope="assignmentScope" :edit-mode="true" />
      </div>
    </div>
    <button type="button" class="btn btn-success position-fixed" style="top: 4rem; right: 1rem" @click="save()">
      Save
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import RandomAssignmentConfig from "@/components/annotations/assignments/RandomAssignmentConfig.vue";
import RandomAssignmentWithExclusionConfig from "@/components/annotations/assignments/RandomAssignmentWithExclusionConfig.vue";
import { EventBus } from "@/plugins/events";
import { ToastEvent } from "@/plugins/events/events/toast";
import { ConfirmationRequestEvent } from "@/plugins/events/events/confirmation";
import { API, ignore, logReject, toastReject, type ApiResponseReject } from "@/plugins/api";
import type {
  AssignmentCounts,
  AssignmentScopeEntry,
  AssignmentScopeModel,
  HighlighterModel,
  UserModel,
  UserBaseModel,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  AssignmentScopeRandomWithNQLConfig,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  AssignmentScopeRandomWithExclusionConfig,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  AssignmentScopeRandomConfig,
} from "@/plugins/api/spec/types.gen";
import { type AssignmentScopeBaseConfigTypes } from "@/plugins/api/types";
import { currentProjectStore } from "@/stores";
import ScopeQuality from "@/components/annotations/ScopeQuality.vue";
import RandomAssignmentWithNQLConfig from "@/components/annotations/assignments/RandomAssignmentWithNQL.vue";

type AssignmentScopeConfigData = {
  scopeId?: string;
  annotationSchemeId?: string;
  // list of all users in the system
  users: UserModel[];
  // search query for filtering list of users
  userSearch: string;
  // users selected to be in the query pool
  selectedUsers: UserModel[];
  // assignment strategy type
  strategyConfigType?: AssignmentScopeBaseConfigTypes;
  // indicates whether this is (or will be) a newly created scope
  isNewScope: boolean;
  // holds the assignment counts (or undefined if none exist)
  assignmentCounts?: AssignmentCounts;
  assignments: AssignmentScopeEntry[];
  assignmentScope: AssignmentScopeModel;
  projectHighlighters: Partial<HighlighterModel>[];
  annotators: Record<string, UserBaseModel>;
};

export default defineComponent({
  name: "AssignmentScopeConfigView",
  components: {
    RandomAssignmentWithNQLConfig,
    ScopeQuality,
    RandomAssignmentWithExclusionConfig,
    RandomAssignmentConfig,
  },
  data(): AssignmentScopeConfigData {
    const scopeId = this.$route.params.scope_id as string | undefined;
    const annotationSchemeId = this.$route.query.annotation_scheme_id as string | undefined;

    return {
      scopeId,
      annotationSchemeId,
      users: [],
      userSearch: "",
      selectedUsers: [],
      strategyConfigType: undefined,
      // indicates whether this is (or will be) a newly created scope
      isNewScope: !scopeId && !!annotationSchemeId,
      // holds the assignment counts (or undefined if none exist)
      assignmentCounts: undefined as undefined | AssignmentCounts,
      assignments: [],
      assignmentScope: {
        assignment_scope_id: undefined,
        annotation_scheme_id: annotationSchemeId,
        time_created: undefined,
        name: "",
        description: "",
        highlighter_ids: [] as string[],
      } as AssignmentScopeModel,
      projectHighlighters: [],
      annotators: {} as Record<string, UserBaseModel>,
    };
  },
  async mounted() {
    API.highlighters
      .getProjectHighlightersApiHighlightersProjectGet({
        xProjectId: currentProjectStore.projectId as string,
      })
      .then((response) => {
        this.projectHighlighters = response.data;
      })
      .catch(() => {
        // pass
      });
    if (!this.isNewScope) {
      Promise.allSettled([
        API.annotations.getAssignmentScopeApiAnnotationsAnnotateScopeAssignmentScopeIdGet({
          xProjectId: currentProjectStore.projectId as string,
          assignmentScopeId: this.scopeId as string,
        }),
        API.annotations.getNumAssignmentsForScopeApiAnnotationsAnnotateScopeCountsAssignmentScopeIdGet({
          xProjectId: currentProjectStore.projectId as string,
          assignmentScopeId: this.scopeId as string,
        }),
      ]).then(([scopePromise, countsPromise]) => {
        if (scopePromise.status === "fulfilled" && countsPromise.status === "fulfilled") {
          this.assignmentScope = scopePromise.value.data;
          this.assignmentCounts = countsPromise.value.data;

          if (!this.assignmentScope.highlighter_ids) {
            this.assignmentScope.highlighter_ids = [];
          }
        } else {
          EventBus.emit(new ToastEvent("ERROR", "Failed to load assignment scope info. Please try reloading."));
        }

        if ((this.assignmentScope.config?.users || []).length > 0) {
          this.strategyConfigType = this.assignmentScope.config!.config_type;
          API.users
            .getUsersByIdsApiUsersDetailsGet({
              xProjectId: currentProjectStore.projectId as string,
              userId: this.assignmentScope.config!.users as string[],
            })
            .then((response) => {
              this.selectedUsers = response.data;
            })
            .catch(() => {
              EventBus.emit(new ToastEvent("ERROR", "Failed to load list of users. Please try reloading."));
            });
        }
      });
    }
  },
  methods: {
    createAssignments() {
      if (!this.assignmentScope.config) {
        EventBus.emit(new ToastEvent("WARN", "You have to configure the assignment strategy first!"));
      } else if (!this.selectedUsers || this.selectedUsers.length === 0) {
        EventBus.emit(new ToastEvent("WARN", "You have to select users who should receive assignments!"));
      } else if (this.scopeHasAssignments) {
        EventBus.emit(new ToastEvent("WARN", "This assignment scope already has assignments!"));
      } else if (this.isNewScope) {
        EventBus.emit(new ToastEvent("WARN", "You have to first save the assignment scope!"));
      } else {
        EventBus.emit(
          new ConfirmationRequestEvent(
            "Once you create and send out assignments, you cannot make any further changes.\n\n" +
              "Are you sure you want to proceed?",
            (response) => {
              if (response === "ACCEPT") {
                const payload = {
                  annotation_scheme_id: this.assignmentScope.annotation_scheme_id as string,
                  scope_id: this.assignmentScope.assignment_scope_id as string,
                  save: true,
                  config: JSON.parse(JSON.stringify(this.assignmentScope.config)),
                };
                payload.config.users = this.selectedUserIds;

                API.annotations
                  .makeAssignmentsApiAnnotationsConfigAssignmentsPost({
                    xProjectId: currentProjectStore.projectId as string,
                    requestBody: payload,
                  })
                  .then((res) => {
                    EventBus.emit(new ToastEvent("SUCCESS", `Successfully created ${res.data.length} assignments.`));
                    this.scopeHasAssignments = true;
                    this.loadResults();
                  })
                  .catch((res) => {
                    EventBus.emit(new ToastEvent("ERROR", "Something failed while creating assignments."));
                    if (res.error?.detail && typeof res.error?.detail === "string") {
                      EventBus.emit(new ToastEvent("WARN", res.error?.detail));
                    }
                    console.error(res);
                  });
              }
            },
            "Create assignments",
          ),
        );
      }
    },
    save() {
      EventBus.emit(
        new ConfirmationRequestEvent(
          "Saving the scope does not create or change assignments.",
          (response) => {
            if (response === "ACCEPT") {
              const scope = JSON.parse(JSON.stringify(this.assignmentScope)); // clone the object
              if (scope.config) {
                scope.config.users = this.selectedUserIds;
              }
              if (!scope.highlighter_ids || scope.highlighter_ids.length === 0) {
                scope.highlighter_ids = undefined;
              }
              API.annotations
                .putAssignmentScopeApiAnnotationsAnnotateScopePut({
                  xProjectId: currentProjectStore.projectId as string,
                  requestBody: scope,
                })
                .then((res) => {
                  EventBus.emit(new ToastEvent("SUCCESS", `Save assignment scope details.  \n**ID:** ${res.data}`));
                  if (this.isNewScope) {
                    this.isNewScope = false;
                    this.assignmentScope.assignment_scope_id = res.data;
                    this.$router.replace({ name: "config-annotation-scheme-scope", params: { scope_id: res.data } });
                  }
                })
                .catch((res) => {
                  const err = res as ApiResponseReject;
                  EventBus.emit(
                    new ToastEvent("ERROR", `Failed to save assignment scope details. (${err.error?.detail?.type})`),
                  );
                });
            } else {
              EventBus.emit(new ToastEvent("WARN", "Did not save the assignment scope details."));
            }
          },
          "Save assignment scope",
          "Ok, save.",
          "Don´t save yet.",
        ),
      );
    },
    loadResults() {
      if (this.assignmentScope.assignment_scope_id) {
        API.annotations
          .getNumAssignmentsForScopeApiAnnotationsAnnotateScopeCountsAssignmentScopeIdGet({
            xProjectId: currentProjectStore.projectId as string,
            assignmentScopeId: this.assignmentScope.assignment_scope_id,
          })
          .then((result) => {
            this.assignmentCounts = result.data;
          })
          .catch(() => {
            EventBus.emit(new ToastEvent("ERROR", "Failed to load assignment counts."));
          });

        API.annotations
          .getAssignmentIndicatorsForScopeApiAnnotationsAnnotateAssignmentProgressAssignmentScopeIdGet({
            xProjectId: currentProjectStore.projectId as string,
            assignmentScopeId: this.assignmentScope.assignment_scope_id,
          })
          .then(async (response) => {
            this.assignments = response.data;
          })
          .catch(toastReject);

        API.users
          .getProjectAnnotatorUsersApiUsersListProjectAnnotatorsProjectIdGet({
            projectId: currentProjectStore.projectId as string,
            xProjectId: currentProjectStore.projectId as string,
          })
          .then((response) => {
            this.annotators = response.data;
          })
          .catch(ignore);
      }
    },
    async loadListOfUsers() {
      this.users = [];
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
    },
    async sendReminders() {
      EventBus.emit(new ToastEvent("INFO", "Please only click the button once. Sending emails may take a while."));
      API.mailing
        .remindUsersAssigmentApiMailAssignmentReminderPost({
          assignmentScopeId: this.assignmentScope.assignment_scope_id as string,
          xProjectId: currentProjectStore.projectId as string,
        })
        .then((response) => {
          EventBus.emit(new ToastEvent("SUCCESS", `Sent emails to ${response.data}`));
        })
        .catch(logReject);
    },
    selectUser(user: UserModel) {
      if (!this.isSelected(user)) {
        this.selectedUsers.push(user);
      }
    },
    unselectUser(user: UserModel) {
      const userIndex = this.selectedUserIds.indexOf(user.user_id as string);
      this.selectedUsers.splice(userIndex, 1);
    },
    updateConfig(eventPayload: string | undefined) {
      // FIXME
      // @ts-ignore FIXME
      this.assignmentScope.config = eventPayload;
    },
    isSelected(user: UserModel) {
      return this.selectedUserIds.indexOf(user.user_id as string) >= 0;
    },
  },
  computed: {
    searchFilteredUsers(): UserModel[] {
      if (this.users) {
        // TODO make the search more sophisticated
        //      e.g. by including institution, email, username, substring matches
        return this.users.filter((user: UserModel) =>
          user.full_name?.toLowerCase().startsWith(this.userSearch.toLowerCase()),
        );
      }
      return this.users;
    },
    selectedUserIds(): string[] {
      if (this.selectedUsers && this.selectedUsers.length > 0) {
        return this.selectedUsers.map((user: UserModel) => user.user_id as string);
      }
      return [];
    },
    statsLoaded(): boolean {
      return (this.assignments || []).length > 0 && this.assignmentCounts !== undefined;
    },
    // indicates whether assignments were already performed in this scope
    scopeHasAssignments(): boolean {
      return !!this.assignmentCounts && this.assignmentCounts.num_total > 0;
    },
  },
});
</script>

<style scoped></style>
