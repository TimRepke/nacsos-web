<template>
  <div>
    <h1>Annotation schemes, assignments, and resolutions</h1>

    <div class="row mb-4" v-for="scheme in projectSchemes" :key="scheme.annotation_scheme_id as string">
      <div class="d-flex flex-row">
        <div class="me-2">
          <h3>{{ scheme.name }}</h3>
        </div>
        <div class="flex-grow-1">
          <router-link
            :to="{
              name: 'config-annotation-scheme-edit',
              params: { annotation_scheme_id: scheme.annotation_scheme_id },
            }"
            class="link-secondary me-1"
          >
            <InlineToolTip info="Edit scheme">
              <font-awesome-icon :icon="['fas', 'pen']" />
            </InlineToolTip>
          </router-link>
          <a
            @click="copyScheme(scheme)"
            tabindex="0"
            aria-label="Copy scheme"
            class="link-secondary me-1"
            role="button"
          >
            <InlineToolTip info="Copy">
              <font-awesome-icon :icon="['far', 'clone']" />
            </InlineToolTip>
          </a>
          <a
            role="button"
            class="link-secondary me-1"
            tabindex="0"
            aria-label="Delete scheme"
            @click="removeScheme(scheme)"
          >
            <InlineToolTip info="Delete">
              <font-awesome-icon :icon="['fas', 'trash-can']" />
            </InlineToolTip>
          </a>
          <router-link
            :to="{ name: 'project-dataset-export' }"
            role="button"
            class="link-secondary me-1"
            tabindex="0"
            aria-label="Export annotations"
          >
            <InlineToolTip info="Export data">
              <font-awesome-icon :icon="['fas', 'file-export']" />
            </InlineToolTip>
          </router-link>
        </div>
        <div>
          <router-link
            role="button"
            class="btn btn-outline-secondary m-2 btn-sm"
            :to="{
              name: 'config-annotation-scheme-scope',
              query: { annotation_scheme_id: scheme.annotation_scheme_id },
            }"
          >
            <font-awesome-icon :icon="['far', 'square-plus']" />
            Add scope to "{{ scheme.name }}"
          </router-link>
        </div>
      </div>

      <table class="table table-hover">
        <thead>
          <tr>
            <th scope="col" class="col-3">Assignment scope</th>
            <th scope="col" class="col-2">Scope created</th>
            <th scope="col" class="col-1 text-start"></th>
            <th scope="col" class="col-auto text-start">Resolutions</th>
          </tr>
        </thead>
        <tbody>
          <template
            v-for="scope in scopesLookup[scheme.annotation_scheme_id as string] || []"
            :key="scope.assignment_scope_id as string"
          >
            <tr style="height: 1px">
              <td class="col-2 text-start p-0" style="height: inherit">
                <div class="d-flex ps-2 align-items-stretch h-100">
                  <pop-over
                    v-if="scope.description"
                    class="d-inline-block me-1"
                    title="Assignment description"
                    :body-m-d="scope.description"
                  />
                  <router-link
                    :to="{ name: 'config-annotation-scheme-scope', params: { scope_id: scope.assignment_scope_id } }"
                    class="link-secondary text-decoration-none flex-grow-1"
                  >
                    {{ scope.name }}
                  </router-link>
                </div>
              </td>
              <td class="col text-muted text-start small">{{ $util.dt2str(scope.time_created) }}</td>
              <td>
                <router-link
                  :to="{
                    name: 'config-annotation-resolve',
                    params: {
                      assignment_scope_id: scope.assignment_scope_id,
                      annotation_scheme_id: scope.annotation_scheme_id,
                    },
                  }"
                  class="link-secondary me-2"
                >
                  <InlineToolTip info="Resolve annotations">
                    <font-awesome-icon :icon="['fas', 'people-arrows']" />
                  </InlineToolTip>
                </router-link>
                <router-link
                  :to="{ name: 'config-annotation-scheme-scope', params: { scope_id: scope.assignment_scope_id } }"
                  class="link-secondary me-2"
                >
                  <InlineToolTip info="View and set up assignments">
                    <font-awesome-icon :icon="['fas', 'screwdriver-wrench']" />
                  </InlineToolTip>
                </router-link>
                <a
                  role="button"
                  class="link-secondary me-1"
                  tabindex="0"
                  aria-label="Delete assignment scope"
                  @click="removeScope(scope)"
                >
                  <InlineToolTip info="Delete">
                    <font-awesome-icon :icon="['fas', 'trash-can']" />
                  </InlineToolTip>
                </a>
              </td>
              <td>
                <template v-if="(resolutionLookup[scope.assignment_scope_id as string] || []).length > 0">
                  <div
                    class="d-flex flex-row border border-secondary rounded-2 p-1 m-1 mt-0"
                    v-for="resolution in resolutionLookup[scope.assignment_scope_id as string]"
                    :key="resolution.bot_annotation_metadata_id as string"
                  >
                    <router-link
                      :to="{
                        name: 'config-annotation-resolve',
                        params: { bot_annotation_metadata_id: resolution.bot_annotation_metadata_id },
                      }"
                      class="text-decoration-none flex-grow-1 d-flex text-black"
                      custom
                      v-slot="{ navigate }"
                    >
                      <span @click.stop="navigate" role="button" class="me-3 ms-2">
                        {{ resolution.name }}
                      </span>
                      <span class="text-muted small me-3 ms-auto" @click.stop="navigate" role="button">
                        {{ $util.dt2str(resolution.time_created) }}
                      </span>
                    </router-link>
                    <div>
                      <a
                        role="button"
                        class="link-secondary me-1"
                        tabindex="0"
                        aria-label="Delete resolutions"
                        @click="removeResolution(resolution)"
                      >
                        <InlineToolTip info="Delete resolution" placement="left">
                          <font-awesome-icon :icon="['fas', 'trash-can']" />
                        </InlineToolTip>
                      </a>
                    </div>
                  </div>
                </template>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>

    <router-link
      role="button"
      class="btn btn-outline-primary m-2 btn-sm"
      :to="{ name: 'config-annotation-scheme-edit' }"
    >
      <font-awesome-icon :icon="['far', 'square-plus']" />
      Create new annotation scheme
    </router-link>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { currentProjectStore } from "@/stores";
import { EventBus } from "@/plugins/events";
import { ConfirmationRequestEvent } from "@/plugins/events/events/confirmation";
import InlineToolTip from "@/components/InlineToolTip.vue";
import { ToastEvent } from "@/plugins/events/events/toast";
import type {
  AnnotationSchemeModel,
  AssignmentScopeModel,
  BotAnnotationMetaDataBaseModel,
} from "@/plugins/api/spec/types.gen";
import { type ApiResponseReject, API } from "@/plugins/api";
import PopOver from "@/components/PopOver.vue";

export default defineComponent({
  name: "AnnotationConfigListView",
  components: { PopOver, InlineToolTip },
  data() {
    return {
      projectSchemes: [] as AnnotationSchemeModel[],
      projectScopes: [] as AssignmentScopeModel[],
      projectResolutions: [] as BotAnnotationMetaDataBaseModel[],
    };
  },
  async mounted() {
    await this.refreshData();
  },
  methods: {
    async refreshData() {
      try {
        this.projectSchemes = (
          await API.annotations.getSchemeDefinitionsForProjectApiAnnotationsSchemesListProjectIdGet({
            projectId: currentProjectStore.projectId as string,
            xProjectId: currentProjectStore.projectId as string,
          })
        ).data;

        this.projectScopes = (
          await API.annotations.getAssignmentScopesForProjectApiAnnotationsAnnotateScopesGet({
            xProjectId: currentProjectStore.projectId as string,
          })
        ).data;

        this.projectResolutions = (
          await API.annotations.listSavedResolvedAnnotationsApiAnnotationsConfigResolvedListGet({
            xProjectId: currentProjectStore.projectId as string,
          })
        ).data;
      } catch (e) {
        console.error(e);
        const err = e as ApiResponseReject;
        EventBus.emit(
          new ToastEvent("ERROR", `Failed to load data (${err.error.detail?.type}: ${err.error.detail?.message})`),
        );
      }
    },

    async copyScheme(scheme: AnnotationSchemeModel) {
      const copy: AnnotationSchemeModel = JSON.parse(JSON.stringify(scheme));
      copy.annotation_scheme_id = undefined;
      copy.name = `[COPY] ${scheme.name}`;

      try {
        const copyId = await API.annotations.putAnnotationSchemeApiAnnotationsSchemesDefinitionPut({
          xProjectId: currentProjectStore.projectId as string,
          requestBody: copy,
        });
        EventBus.emit(
          new ToastEvent("SUCCESS", `Created copy of the annotation scheme "${scheme.name}" with ID ${copyId.data}.`),
        );

        const schemes = await API.annotations.getSchemeDefinitionsForProjectApiAnnotationsSchemesListProjectIdGet({
          projectId: currentProjectStore.projectId as string,
          xProjectId: currentProjectStore.projectId as string,
        });
        this.projectSchemes = schemes.data;
      } catch (e) {
        EventBus.emit(new ToastEvent("ERROR", "Failed to copy or refresh data, try reloading the page."));
      }
    },
    removeScheme(scheme: AnnotationSchemeModel) {
      EventBus.emit(
        new ConfirmationRequestEvent(
          "Do you really want to **permanently delete**  the following annotation scheme?\n" +
            `- "${scheme.name}"\n` +
            `- ID: ${scheme.annotation_scheme_id}\n\n` +
            "This may result in deletion of all associated assignments and annotations or at least make them meaningless!",
          (confirmationResponse) => {
            if (confirmationResponse === "ACCEPT") {
              API.annotations
                .removeAnnotationSchemeApiAnnotationsSchemesDefinitionSchemeIdDelete({
                  xProjectId: currentProjectStore.projectId as string,
                  annotationSchemeId: scheme.annotation_scheme_id as string,
                })
                .then(() => {
                  EventBus.emit(new ToastEvent("SUCCESS", "Annotation scheme deleted!"));
                  this.refreshData();
                })
                .catch(() => {
                  EventBus.emit(new ToastEvent("ERROR", "Failed to delete annotation scheme!"));
                });
            }
          },
          "Delete annotation scheme",
        ),
      );
    },
    removeScope(scope: AssignmentScopeModel) {
      EventBus.emit(
        new ConfirmationRequestEvent(
          "Do you really want to **permanently delete**  the following assignment scope?\n" +
            `- "${scope.name}"\n` +
            `- ID: ${scope.assignment_scope_id}\n\n` +
            "This may result in deletion of all associated assignments and annotations or at least make them meaningless!",
          (confirmationResponse) => {
            if (confirmationResponse === "ACCEPT") {
              API.annotations
                .removeAssignmentScopeApiAnnotationsAnnotateScopeAssignmentScopeIdDelete({
                  xProjectId: currentProjectStore.projectId as string,
                  assignmentScopeId: scope.assignment_scope_id as string,
                })
                .then(() => {
                  EventBus.emit(new ToastEvent("SUCCESS", "Assignment scope deleted!"));
                  this.refreshData();
                })
                .catch(() => {
                  EventBus.emit(new ToastEvent("ERROR", "Failed to delete assignment scope!"));
                });
            }
          },
          "Delete assignment scope",
        ),
      );
    },
    removeResolution(meta: BotAnnotationMetaDataBaseModel) {
      EventBus.emit(
        new ConfirmationRequestEvent(
          "Do you really want to **permanently delete** all resolved annotations associated to the scope shown below?\n" +
            `- "${meta.name}"\n` +
            `- ID: ${meta.bot_annotation_metadata_id}`,
          (confirmationResponse) => {
            if (confirmationResponse === "ACCEPT") {
              API.annotations
                .deleteSavedResolvedAnnotationsApiAnnotationsConfigResolvedBotAnnotationMetaIdDelete({
                  botAnnotationMetadataId: meta.bot_annotation_metadata_id!,
                  xProjectId: currentProjectStore.projectId as string,
                })
                .then(() => {
                  EventBus.emit(new ToastEvent("SUCCESS", `Deleted ${meta.bot_annotation_metadata_id}`));
                  this.refreshData();
                })
                .catch(() => {
                  EventBus.emit(new ToastEvent("ERROR", `Failed to delete ${meta.bot_annotation_metadata_id}.`));
                });
            }
          },
          "Delete resolved annotations",
        ),
      );
    },
  },
  computed: {
    scopesLookup(): { [key: string]: AssignmentScopeModel[] } {
      return this.projectScopes.reduce(
        (ret: { [key: string]: AssignmentScopeModel[] }, scope: AssignmentScopeModel) => {
          if (!(scope.annotation_scheme_id in ret)) {
            // eslint-disable-next-line no-param-reassign
            ret[scope.annotation_scheme_id] = [];
          }
          ret[scope.annotation_scheme_id].push(scope);
          return ret;
        },
        {},
      );
    },
    resolutionLookup(): { [key: string]: BotAnnotationMetaDataBaseModel[] } {
      return this.projectResolutions.reduce(
        (ret: { [key: string]: BotAnnotationMetaDataBaseModel[] }, bam: BotAnnotationMetaDataBaseModel) => {
          if (!((bam.assignment_scope_id as string) in ret)) {
            // eslint-disable-next-line no-param-reassign
            ret[bam.assignment_scope_id as string] = [];
          }
          ret[bam.assignment_scope_id as string].push(bam);
          return ret;
        },
        {},
      );
    },
  },
});
</script>

<style scoped>
.annotation-sidebar {
  height: var(--body-height);
  overflow-x: hidden;
  overflow-y: auto;
  border: none;
}

@media (min-width: 992px) {
  /*
  FIXME is it possible to import var from bootstrap?
        ideally by overriding border-start.
  */
  .annotation-sidebar {
    border-left: 1px solid #dee2e6 !important;
  }
}
</style>
