<template>
  <div>
    <h1>Annotation Schemes and Assignment Scopes</h1>
    <!-- TODO make pretty -->
    <ul>
      <li v-for="scheme in projectSchemes" :key="scheme.annotation_scheme_id">
        {{ scheme.name }}
        <router-link
          :to="{ name: 'config-annotation-scheme-edit', params: { annotation_scheme_id: scheme.annotation_scheme_id } }"
          class="link-secondary me-1">
          <InlineToolTip info="Edit scheme">
            <font-awesome-icon :icon="['fas', 'pen']" />
          </InlineToolTip>
        </router-link>
        <a @click="copyScheme(scheme)" tabindex="0" aria-label="Copy scheme" class="link-secondary me-1" role="button">
          <InlineToolTip info="Copy">
            <font-awesome-icon :icon="['far', 'clone']" />
          </InlineToolTip>
        </a>
        <a
          role="button"
          class="link-secondary me-1"
          tabindex="0"
          aria-label="Delete scheme"
          @click="removeScheme(scheme)">
          <InlineToolTip info="Delete">
            <font-awesome-icon :icon="['fas', 'trash-can']" />
          </InlineToolTip>
        </a>
        <a
          role="button"
          class="link-secondary me-1"
          tabindex="0"
          aria-label="Export annotations"
          @click="exportData(scheme)">
          <InlineToolTip info="Export data">
            <font-awesome-icon :icon="['fas', 'file-export']" />
          </InlineToolTip>
        </a>
        <ul>
          <li
            v-for="scope in (scopesLookup[scheme.annotation_scheme_id] || [])"
            :key="scope.assignment_scope_id">
            {{ scope.name }}
            <router-link
              :to="{ name: 'config-annotation-scheme-scope', params: { scope_id: scope.assignment_scope_id } }"
              class="link-secondary me-1">
              <InlineToolTip info="View and set up assignments">
                <font-awesome-icon :icon="['fas', 'screwdriver-wrench']" />
              </InlineToolTip>
            </router-link>
            <a
              role="button"
              class="link-secondary me-1"
              tabindex="0"
              aria-label="Delete assignment scope"
              @click="removeScope(scope)">
              <InlineToolTip info="Delete">
                <font-awesome-icon :icon="['fas', 'trash-can']" />
              </InlineToolTip>
            </a>
          </li>
        </ul>

        <router-link
          role="button"
          class="btn btn-outline-secondary m-2 btn-sm"
          :to="{ name: 'config-annotation-scheme-scope', query: { annotation_scheme_id: scheme.annotation_scheme_id } }">
          <font-awesome-icon :icon="['far', 'square-plus']" />
          Add scope to "{{ scheme.name }}"
        </router-link>
      </li>
    </ul>
    <router-link
      role="button"
      class="btn btn-outline-primary m-2 btn-sm"
      :to="{ name: 'config-annotation-scheme-edit' }">
      <font-awesome-icon :icon="['far', 'square-plus']" />
      Create new annotation scheme
    </router-link>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { currentProjectStore } from '@/stores';
import { EventBus } from '@/plugins/events';
import { ConfirmationRequestEvent } from '@/plugins/events/events/confirmation';
import InlineToolTip from '@/components/InlineToolTip.vue';
import { ToastEvent } from '@/plugins/events/events/toast';
import type { AnnotationSchemeModel, AssignmentScopeModel } from '@/plugins/api/api-core';
import type { ApiResponseReject } from '@/plugins/api';
import { API } from '@/plugins/api';

export default defineComponent({
  name: 'AnnotationConfigListView',
  components: { InlineToolTip },
  data() {
    return {
      projectSchemes: [] as AnnotationSchemeModel[],
      projectScopes: [] as AssignmentScopeModel[],
    };
  },
  async mounted() {
    try {
      this.projectSchemes = (await API.core.annotations.getSchemeDefinitionsForProjectApiAnnotationsSchemesListProjectIdGet({
        projectId: currentProjectStore.projectId as string,
        xProjectId: currentProjectStore.projectId as string,
      })).data;
      this.projectScopes = (await API.core.annotations.getAssignmentScopesForProjectApiAnnotationsAnnotateScopesGet({
        xProjectId: currentProjectStore.projectId as string,
      })).data;
    } catch (e) {
      console.error(e);
      const err = e as ApiResponseReject;
      EventBus.emit(new ToastEvent('ERROR', `Failed to load data (${err.error.type}: ${err.error.message})`));
    }
  },
  methods: {
    async copyScheme(scheme: AnnotationSchemeModel) {
      const copy: AnnotationSchemeModel = JSON.parse(JSON.stringify(scheme));
      copy.annotation_scheme_id = undefined;
      copy.name = `[COPY] ${scheme.name}`;

      try {
        const copyId = await API.core.annotations.putAnnotationSchemeApiAnnotationsSchemesDefinitionPut({
          xProjectId: currentProjectStore.projectId as string,
          requestBody: copy,
        });
        EventBus.emit(new ToastEvent('SUCCESS', `Created copy of the annotation scheme "${scheme.name}" with ID ${copyId.data}.`));

        const schemes = await API.core.annotations.getSchemeDefinitionsForProjectApiAnnotationsSchemesListProjectIdGet({
          projectId: currentProjectStore.projectId as string,
          xProjectId: currentProjectStore.projectId as string,
        });
        this.projectSchemes = schemes.data;
      } catch (e) {
        EventBus.emit(new ToastEvent('ERROR', 'Failed to copy or refresh data, try reloading the page.'));
      }
    },
    exportData(scheme: AnnotationSchemeModel) {
      // TODO
      console.log(scheme);
      EventBus.emit(new ToastEvent('WARN', 'Not implemented yet, sorry.'));
    },
    removeScheme(scheme: AnnotationSchemeModel) {
      EventBus.emit(new ConfirmationRequestEvent(
        'Do you really want to **permanently delete**  the following annotation scheme?\n'
        + `- "${scheme.name}"\n`
        + `- ID: ${scheme.annotation_scheme_id}\n\n`
        + 'This may result in deletion of all associated assignments and annotations or at least make them meaningless!',
        (confirmationResponse) => {
          if (confirmationResponse === 'ACCEPT') {
            API.core.annotations.removeAnnotationSchemeApiAnnotationsSchemesDefinitionSchemeIdDelete({
              xProjectId: currentProjectStore.projectId as string,
              annotationSchemeId: scheme.annotation_scheme_id as string,
            })
              .then(() => {
                EventBus.emit(new ToastEvent('SUCCESS', 'Annotation scheme deleted!'));
                const index = this.projectSchemes
                  .findIndex((projectScheme: AnnotationSchemeModel) => projectScheme.annotation_scheme_id === scheme.annotation_scheme_id);
                if (index >= 0) {
                  this.projectSchemes.splice(index, 1);
                }
              })
              .catch(() => {
                EventBus.emit(new ToastEvent(
                  'ERROR',
                  'Failed to delete annotation scheme!',
                ));
              });
          }
        },
        'Delete annotation scheme',
      ));
    },
    removeScope(scope: AssignmentScopeModel) {
      EventBus.emit(new ConfirmationRequestEvent(
        'Do you really want to **permanently delete**  the following assignment scope?\n'
        + `- "${scope.name}"\n`
        + `- ID: ${scope.assignment_scope_id}\n\n`
        + 'This may result in deletion of all associated assignments and annotations or at least make them meaningless!',
        (confirmationResponse) => {
          if (confirmationResponse === 'ACCEPT') {
            API.core.annotations.removeAssignmentScopeApiAnnotationsAnnotateScopeAssignmentScopeIdDelete({
              xProjectId: currentProjectStore.projectId as string,
              assignmentScopeId: scope.assignment_scope_id as string,
            })
              .then(() => {
                EventBus.emit(new ToastEvent('SUCCESS', 'Assignment scope deleted!'));
                const index = this.projectScopes
                  .findIndex((assignmentScope: AssignmentScopeModel) => assignmentScope.assignment_scope_id === scope.assignment_scope_id);
                if (index >= 0) {
                  this.projectScopes.splice(index, 1);
                }
              })
              .catch(() => {
                EventBus.emit(new ToastEvent(
                  'ERROR',
                  'Failed to delete assignment scope!',
                ));
              });
          }
        },
        'Delete assignment scope',
      ));
    },
  },
  computed: {
    scopesLookup(): { [key: string]: AssignmentScopeModel[] } {
      return this.projectScopes.reduce((ret: { [key: string]: AssignmentScopeModel[] }, scope: AssignmentScopeModel) => {
        if (!(scope.annotation_scheme_id in ret)) {
          // eslint-disable-next-line no-param-reassign
          ret[scope.annotation_scheme_id] = [];
        }
        ret[scope.annotation_scheme_id].push(scope);
        return ret;
      }, {});
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
