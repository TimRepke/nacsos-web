<template>
  <div class="text-start">
    <h1>Annotation Schemes and Assignment Scopes</h1>
    <!-- TODO make pretty -->
    <ul>
      <li v-for="scheme in projectSchemes" :key="scheme.annotation_scheme_id">
        {{ scheme.name }}
        <router-link :to="{ name:'config-annotation-scheme-edit', params: { annotation_scheme_id: scheme.annotation_scheme_id } }"
                     class="link-secondary me-1">
          <InlineToolTip info="Edit scheme">
            <font-awesome-icon :icon="['fas', 'pen']"/>
          </InlineToolTip>
        </router-link>
        <a @click="copyScheme(scheme)" tabindex="0" aria-label="Copy scheme" class="link-secondary me-1" role="button">
          <InlineToolTip info="Copy">
            <font-awesome-icon :icon="['far', 'clone']"/>
          </InlineToolTip>
        </a>
        <a @click="removeScheme(scheme)" tabindex="0" aria-label="Delete scheme" class="link-secondary me-1" role="button">
          <InlineToolTip info="Delete">
            <font-awesome-icon :icon="['fas', 'trash-can']"/>
          </InlineToolTip>
        </a>
        <a @click="exportData(scheme)" tabindex="0" aria-label="Export annotations" class="link-secondary me-1"
           role="button">
          <InlineToolTip info="Export data">
            <font-awesome-icon :icon="['fas', 'file-export']"/>
          </InlineToolTip>
        </a>
        <ul>
          <li v-for="scope in (scopesLookup[scheme.annotation_scheme_id] || [])"
              :key="scope.assignment_scope_id">
            {{ scope.name }}
            <router-link :to="{ name:'config-annotation-scheme-scope', params: { scope_id: scope.assignment_scope_id } }"
                         class="link-secondary me-1">
              <InlineToolTip info="View and set up assignments">
                <font-awesome-icon :icon="['fas', 'screwdriver-wrench']"/>
              </InlineToolTip>
            </router-link>
            <a @click="removeScope(scope)" tabindex="0" aria-label="Delete assignment scope" class="link-secondary me-1"
               role="button">
              <InlineToolTip info="Delete">
                <font-awesome-icon :icon="['fas', 'trash-can']"/>
              </InlineToolTip>
            </a>
          </li>
        </ul>

        <router-link :to="{ name:'config-annotation-scheme-scope', query: { annotation_scheme_id: scheme.annotation_scheme_id } }"
                     role="button" class="btn btn-outline-secondary m-2 btn-sm">
          <font-awesome-icon :icon="['far', 'square-plus']"/>
          Add scope to "{{ scheme.name }}"
        </router-link>
      </li>
    </ul>
    <router-link :to="{ name:'config-annotation-scheme-edit' }"
                 role="button" class="btn btn-outline-primary m-2 btn-sm">
      <font-awesome-icon :icon="['far', 'square-plus']"/>
      Create new annotation scheme
    </router-link>
  </div>
</template>

<script lang="ts">
import {
  callProjectScopesEndpoint,
  callProjectSchemesEndpoint,
  callRemoveAnnotationSchemeEndpoint,
  callRemoveAssignmentScopeEndpoint,
  callSaveAnnotationSchemeEndpoint,
} from '@/plugins/api/annotations';
import { AnnotationScheme, AssignmentScope } from '@/types/annotation.d';
import { currentProjectStore } from '@/stores';
import { EventBus } from '@/plugins/events';
import { ConfirmationRequestEvent } from '@/plugins/events/events/confirmation';
import InlineToolTip from '@/components/InlineToolTip.vue';
import { ToastEvent } from '@/plugins/events/events/toast';

export default {
  name: 'AnnotationConfigListView',
  components: { InlineToolTip },
  data() {
    return {
      projectSchemes: [] as AnnotationScheme[],
      projectScopes: [] as AssignmentScope[],
    };
  },
  async mounted() {
    const { projectId } = currentProjectStore;
    this.projectSchemes = (await callProjectSchemesEndpoint({ projectId })).payload;
    this.projectScopes = (await callProjectScopesEndpoint()).payload;
  },
  methods: {
    copyScheme(scheme: AnnotationScheme) {
      const copy: AnnotationScheme = JSON.parse(JSON.stringify(scheme));
      copy.annotation_scheme_id = undefined;
      copy.name = `[COPY] ${scheme.name}`;
      callSaveAnnotationSchemeEndpoint(copy)
        .then(() => {
          EventBus.emit(new ToastEvent('SUCCESS', `Created copy of the annotation scheme "${scheme.name}".`));
          callProjectSchemesEndpoint({ projectId: currentProjectStore.projectId })
            .then((res) => { this.projectSchemes = res.payload; })
            .catch(() => { EventBus.emit(new ToastEvent('ERROR', 'Failed to refresh data, try reloading the page.')); });
        })
        .catch(() => { EventBus.emit(new ToastEvent('ERROR', `Failed to copy annotation scheme "${scheme.name}".`)); });
    },
    exportData(scheme: AnnotationScheme) {
      // TODO
      console.log(scheme);
      EventBus.emit(new ToastEvent('WARN', 'Not implemented yet, sorry.'));
    },
    removeScheme(scheme: AnnotationScheme) {
      EventBus.emit(new ConfirmationRequestEvent(
        'Do you really want to **permanently delete**  the following annotation scheme?\n'
        + `- "${scheme.name}"\n`
        + `- ID: ${scheme.annotation_scheme_id}\n\n`
        + 'This may result in deletion of all associated assignments and annotations or at least make them meaningless!',
        (response) => {
          if (response === 'ACCEPT') {
            callRemoveAnnotationSchemeEndpoint({ annotationSchemeId: scheme.annotation_scheme_id as string })
              .then(() => {
                EventBus.emit(new ToastEvent('SUCCESS', 'Annotation scheme deleted!'));
                const index = this.projectSchemes
                  .findIndex((projectScheme: AnnotationScheme) => projectScheme.annotation_scheme_id === scheme.annotation_scheme_id);
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
    removeScope(scope: AssignmentScope) {
      EventBus.emit(new ConfirmationRequestEvent(
        'Do you really want to **permanently delete**  the following assignment scope?\n'
        + `- "${scope.name}"\n`
        + `- ID: ${scope.assignment_scope_id}\n\n`
        + 'This may result in deletion of all associated assignments and annotations or at least make them meaningless!',
        (response) => {
          if (response === 'ACCEPT') {
            callRemoveAssignmentScopeEndpoint({ assignmentScopeId: scope.assignment_scope_id as string })
              .then(() => {
                EventBus.emit(new ToastEvent('SUCCESS', 'Assignment scope deleted!'));
                const index = this.projectScopes
                  .findIndex((assignmentScope: AssignmentScope) => assignmentScope.assignment_scope_id === scope.assignment_scope_id);
                console.log(index);
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
    scopesLookup(): { [key: string]: AssignmentScope[] } {
      return this.projectScopes.reduce((ret: { [key: string]: AssignmentScope[] }, scope: AssignmentScope) => {
        if (!(scope.annotation_scheme_id in ret)) {
          // eslint-disable-next-line no-param-reassign
          ret[scope.annotation_scheme_id] = [];
        }
        ret[scope.annotation_scheme_id].push(scope);
        return ret;
      }, {});
    },
  },
};
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
