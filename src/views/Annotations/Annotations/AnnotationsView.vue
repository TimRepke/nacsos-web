<template>
  <div class="row">
    <template v-if="!assignments">
      Loading next assignment for annotation. If this takes longer than expected, something went wrong.
    </template>
    <template v-else>
      <div class="col-12 col-md overflow-auto h-md-100">
        <div class="row g-0">
          <div class="col-auto me-2 d-flex align-items-center">
            <font-awesome-icon
              :icon="['fas', 'gear']"
              class="text-muted"
              role="button"
              @click="showStatusBarModal = true" />
          </div>

          <div class="col align-items-center">
            <div
              v-if="assignmentIndicatorsNeedBirdseye"
              class="assignments-birdseye">
              <div
                v-for="assignmentLI in assignmentIndicators"
                :key="assignmentLI.assignmentId"
                class="assignments-birdseye-step"
                :class="[(assignmentLI.inHighlight) ? 'assignments-birdseye-step-inview' : '', assignmentLI.status]"
                type="button"
                @click="saveAndGoto(assignmentLI.assignmentId)" />
            </div>
            <div class="assignments align-items-center h-100">
              <div
                v-for="assignmentLI in assignmentIndicatorsHighlighted"
                :key="assignmentLI.assignmentId"
                class="assignments-step"
                :class="{ current: assignmentLI.assignmentId === assignment.assignment_id }"
                type="button"
                :style="{ 'background-color': assignmentLI.colour }"
                @click="saveAndGoto(assignmentLI.assignmentId)" />
            </div>
          </div>
        </div>
        <div class="row g-0">
          <AnyItemComponent :item="item" :highlighters="highlighters" />
        </div>
      </div>
      <div class="col border-start p-2 overflow-auto h-md-100 position-relative" :class="sidebarWidthClass">
        <div
          class="position-fixed bottom-0 border border-end-0 rounded-start text-muted text-center"
          style="margin-left: -1.325rem; width: 0.75rem; font-size: 0.75rem;"
          @click="(uiSettings.annotation.sidebarWidth < 12) && uiSettings.annotation.sidebarWidth++">
          <font-awesome-icon :icon="['fas', 'caret-left']" />
        </div>
        <div
          class="position-fixed bottom-0 border border-start-0 rounded-end text-muted text-center"
          style="margin-left: -.5rem; width: 0.75rem; font-size: 0.75rem;"
          @click="(uiSettings.annotation.sidebarWidth > 0) && uiSettings.annotation.sidebarWidth--">
          <font-awesome-icon :icon="['fas', 'caret-right']" />
        </div>

        <div class="row g-0">
          <h3>Annotation Panel</h3>
          <div class="collapsible">
            <input id="annotation-description" class="toggle" type="checkbox">
            <label for="annotation-description" class="lbl-toggle" role="button">Show scheme description</label>
            <div class="collapsible-content">
              <div class="content-inner">
                <strong>Annotation scheme:</strong> {{ scheme.name }}
                <p v-html="markdown(scheme.description)" />
                <strong>Assignment scope:</strong> {{ scope.name }}
                <p v-html="markdown(scope.description)" />
              </div>
            </div>
          </div>
        </div>
        <div class="row g-0">
          <AnnotationLabels :labels="labels" :assignment="assignment" :key="rerenderCounter" />
        </div>
        <div class="row g-0 border-top pt-2">
          <div class="col text-start">
            <button type="button" class="btn btn-outline-secondary" @click="saveAndPrevious()" disabled>Save &
              Previous
            </button>
          </div>
          <div class="col text-end">
            <button type="button" class="btn btn-primary" @click="saveAndNext()">Save & Next</button>
          </div>
        </div>
      </div>

      <div v-if="showStatusBarModal">
        <div class="modal fade show d-block" tabindex="-1">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title">Indicator Setup</h5>
                <button
                  type="button"
                  class="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  @click="showStatusBarModal = false" />
              </div>
              <div class="modal-body text-start ps-4 pe-4">
                <div class="row mb-3 g-2 text-muted">
                  These settings allow you to choose how the colour for the items in the indicator bar is chosen.
                  Please note, that this is a "global" setting, so you may have to manually adjust it for other
                  assignment scopes.
                </div>
                <div class="row mb-3 g-2">
                  <label for="progressBarLabelKey" class="form-label">
                    Which label to use to colour document indicators
                  </label>
                  <select
                    v-model="uiSettings.annotation.progressBarLabelKey"
                    id="progressBarLabelKey"
                    class="form-select">
                    <option
                      v-for="label in availableIndicatorLabels"
                      :key="label.key"
                      :value="label.key">{{ label.name }}
                    </option>
                  </select>
                </div>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-outline-secondary" @click="showStatusBarModal = false">
                  Cancel.
                </button>
                <button type="button" class="btn btn-success" @click="reload()">Save.</button>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-backdrop fade show" />
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import { marked } from 'marked';
import AnyItemComponent from '@/components/items/AnyItem.vue';
import AnnotationLabels from '@/components/annotations/AnnotationLabels.vue';
import { EventBus } from '@/plugins/events';
import { ToastEvent } from '@/plugins/events/events/toast';
import type {
  AnnotationItem,
  AnnotationSchemeLabel,
  AnnotationSchemeModel,
  AssignmentModel,
  AssignmentScopeModel,
  HighlighterModel,
  ProgressIndicator,
} from '@/plugins/api/api-core';
import { AssignmentStatus } from '@/plugins/api/api-core';
import type { AnyItem } from '@/types/items.d';
import { API, ignore } from '@/plugins/api';
import { currentProjectStore, interfaceSettingsStore } from '@/stores';
import type { InterfaceSettingsStoreType } from '@/stores/InterfaceSettingsStore';
import { defineComponent } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { isNotNone } from '@/util';

const motivationalQuotes = [
  // https://www.howmuchisthefish.de/
  'The chase is better than the catch. – Scooter',
  'It’s the first page of the second chapter – Scooter',
  'Let’s blow a hole in the bowl – Scooter',
  'Our lyrics fly like birds in the sky – Scooter',
  'It’s nice to be important, but it’s more important to be nice – Scooter',
  'Before success can manifest. You’ve got to go through the learning process. – Scooter',
  // https://kanye.rest/
  'Distraction is the enemy of vision – Kanye West',
  'I love sleep; it’s my favorite. – Kanye West',
  'Keep squares out yo circle – Kanye West',
  // https://www.briantracy.com/blog/personal-success/inspirational-quotes/
  'The bad news is time flies. The good news is you’re the pilot. – Michael Altshuler',
  'The best way to get started is to quit talking and begin doing. ― Walt Disney',
  'Act as if what you do makes a difference. It does. – William James',
  'If you can change your mind, you can change your life. – William James',
  'Life is like riding a bicycle. To keep your balance, you must keep moving. – Albert Einstein',
  'If you don’t like the road you’re walking, start paving another one. – Dolly Parton',
  'Don’t count the days. Make the days count. – Muhammad Ali',
  'Every moment is a fresh beginning. – T.S. Eliot',
  'Believe you can and you’re halfway there. – Theodore Roosevelt',
  'You get what you give. – Jennifer Lopez',
  'Your life only gets better when you get better. – Brian Tracy',
  'Happiness is not by chance, but by choice. – Jim Rohn',
  'Change the world by being yourself. – Amy Poehler',
  'Change the game, don’t let the game change you. – Macklemore',
  // https://pypi.org/project/quotes-generator/
  'Your Skepticism Is My Fuel. — Minx',
];

type AnnotationsViewData = {
  item?: AnyItem;
  assignment?: AssignmentModel;
  assignments?: ProgressIndicator[];
  scheme?: AnnotationSchemeModel;
  scope?: AssignmentScopeModel;
  labels?: AnnotationSchemeLabel[];
  highlighters?: HighlighterModel[];
  uiSettings: InterfaceSettingsStoreType;
  rerenderCounter: number; // this is a hack to force-update the AnnotationLabels-component
  showStatusBarModal: boolean;
};

type AssignmentIndicator = {
  assignmentId: string;
  itemId: string;
  status: AssignmentStatus;
  inHighlight: boolean;
  colour: string;
};

export default defineComponent({
  name: 'AnnotationsView',
  components: { FontAwesomeIcon, AnnotationLabels, AnyItemComponent },
  data(): AnnotationsViewData {
    return {
      item: undefined as AnyItem | undefined,
      assignment: undefined as AssignmentModel | undefined,
      assignments: undefined as ProgressIndicator[] | undefined,
      scheme: undefined as AnnotationSchemeModel | undefined,
      scope: undefined as AssignmentScopeModel | undefined,
      labels: undefined as AnnotationSchemeLabel[] | undefined,
      highlighters: undefined as HighlighterModel[] | undefined,
      rerenderCounter: 0,
      uiSettings: interfaceSettingsStore,
      showStatusBarModal: false,
    };
  },
  async mounted() {
    const assignmentScopeId = this.$route.params.scope_id as string;
    const currentAssignmentId = this.$route.params.assignment_id as string;

    try {
      let response: AnnotationItem;
      if (currentAssignmentId) {
        response = (await API.core.annotations.getAssignmentApiAnnotationsAnnotateAssignmentAssignmentIdGet({
          xProjectId: currentProjectStore.projectId as string,
          assignmentId: currentAssignmentId,
        })).data;
      } else {
        response = (await API.core.annotations.getNextOpenAssignmentForScopeForUserApiAnnotationsAnnotateNextAssignmentScopeIdGet({
          xProjectId: currentProjectStore.projectId as string,
          assignmentScopeId,
        })).data;
      }

      API.core.highlighters.getScopeHighlightersApiHighlightersScopeAssignmentScopeIdGet({
        xProjectId: currentProjectStore.projectId as string,
        assignmentScopeId,
      }).then((resp) => {
        this.highlighters = resp.data;
      }).catch(() => {
        // ignore
      });

      await this.setCurrentAssignment(response);
    } catch (e) {
      console.error(e);
    }
  },
  methods: {
    reload() {
      // eslint-disable-next-line no-restricted-globals
      location.reload();
    },
    markdown(md: string) {
      return marked(md);
    },
    populateEmptyAnnotations(labels: AnnotationSchemeLabel[]) {
      return labels.map((label: AnnotationSchemeLabel) => {
        if (!label.annotation && !!this.assignment) {
          // eslint-disable-next-line no-param-reassign
          label.annotation = {
            assignment_id: this.assignment.assignment_id as string,
            user_id: this.assignment.user_id,
            item_id: this.assignment.item_id,
            annotation_scheme_id: this.assignment.annotation_scheme_id,
            key: label.key,
            repeat: 1,
            parent: undefined,
          };
        }
        if (label.choices) {
          label.choices.forEach((choice) => {
            if (choice.children) {
              // eslint-disable-next-line no-param-reassign
              choice.children = this.populateEmptyAnnotations(choice.children);
            }
          });
        }
        return label;
      });
    },
    async save() {
      // copy relevant data to break references
      const labels = JSON.parse(JSON.stringify(this.labels));
      const scheme = JSON.parse(JSON.stringify(this.scheme));

      // first, remove all empty annotations again
      const removeEmptyAnnotations = (subLabels: AnnotationSchemeLabel[]) => subLabels.map((label: AnnotationSchemeLabel) => {
        if (label.annotation?.value_int === undefined
          && label.annotation?.value_str === undefined
          && label.annotation?.value_bool === undefined
          && label.annotation?.value_float === undefined
          && label.annotation?.multi_int === undefined) {
          // eslint-disable-next-line no-param-reassign
          delete label.annotation;
        }
        if (label.choices) {
          label.choices.forEach((choice) => {
            if (choice.children) {
              // eslint-disable-next-line no-param-reassign
              choice.children = removeEmptyAnnotations(choice.children);
            }
          });
        }
        return label;
      });
      scheme.labels = removeEmptyAnnotations(labels);

      // Send data to the server
      API.core.annotations.saveAnnotationApiAnnotationsAnnotateSavePost({
        xProjectId: currentProjectStore.projectId as string,
        requestBody: {
          scheme,
          assignment: this.assignment as AssignmentModel,
        },
      })
        .then((response) => {
          const reason = response.data;
          if (reason === 'PARTIAL') {
            EventBus.emit(new ToastEvent(
              'WARN',
              'This annotation wasn\'t quite done yet...',
            ));
          }
          EventBus.emit(new ToastEvent(
            'SUCCESS',
            'Successfully saved your annotation!',
          ));
        })
        .catch(() => {
          EventBus.emit(new ToastEvent(
            'ERROR',
            'Failed to save your annotation. Sorry. '
            + 'Please try reloading the page and saving again.',
          ));
        })
        .finally(() => {
          if (Math.random() < 0.2) {
            const quoteIndex = Math.floor(Math.random() * (motivationalQuotes.length + 1));
            EventBus.emit(new ToastEvent(
              'INFO',
              motivationalQuotes[quoteIndex],
            ));
          }
        });
    },
    async setCurrentAssignment(annotationItem: AnnotationItem) {
      // update all the data
      this.assignment = annotationItem.assignment;
      this.scheme = annotationItem.scheme;
      this.scope = annotationItem.scope;
      this.item = annotationItem.item;
      this.labels = this.populateEmptyAnnotations(this.scheme.labels);
      this.rerenderCounter += 1;

      // update the assignments progress bar
      API.core.annotations.getAssignmentIndicatorsForScopeForUserApiAnnotationsAnnotateAssignmentProgressAssignmentScopeIdGet({
        xProjectId: currentProjectStore.projectId as string,
        assignmentScopeId: annotationItem.scope.assignment_scope_id as string,
        key: this.uiSettings.annotation.progressBarLabelKey,
        repeat: this.uiSettings.annotation.progressBarLabelRepeat,
      })
        .then(async (response) => {
          this.assignments = response.data;
          // update the URL
          await this.$router.push({
            name: 'project-annotate-item',
            params: {
              scope_id: this.scope!.assignment_scope_id,
              assignment_id: this.assignment!.assignment_id,
            },
          });
        })
        .catch(ignore);
    },
    async saveAndGoto(targetAssignmentId: string) {
      await this.save();

      API.core.annotations.getAssignmentApiAnnotationsAnnotateAssignmentAssignmentIdGet({
        xProjectId: currentProjectStore.projectId as string,
        assignmentId: targetAssignmentId,
      })
        .then((response) => { this.setCurrentAssignment(response.data); })
        .catch(ignore);
    },
    async saveAndPrevious() {
      // TODO implement "previous" endpoint and this function
    },
    async saveAndNext() {
      await this.save();

      API.core.annotations
        .getNextAssignmentForScopeForUserApiAnnotationsAnnotateNextAssignmentScopeIdCurrentAssignmentIdGet({
          xProjectId: currentProjectStore.projectId as string,
          assignmentScopeId: this.assignment!.assignment_scope_id,
          currentAssignmentId: this.assignment!.assignment_id as string,
        })
        .then((response) => { this.setCurrentAssignment(response.data); })
        .catch((reason) => {
          console.log(reason);
          if (reason.error?.detail?.type === 'NoNextAssignmentWarning') {
            EventBus.emit(new ToastEvent(
              'INFO',
              'Seems like you reached the end. My only friend. '
              + 'Would you like to clear all annotations and enjoy this process once again? '
              + 'Please shout "yes" or "no" into your microphone to delete.',
            ));
          }
        });
    },
    assignmentColour(assignment: ProgressIndicator): string {
      if (this.uiSettings.annotationProgressBarUseStatus) {
        switch (assignment.status) {
          case AssignmentStatus.FULL:
            return '#42b983';
          case AssignmentStatus.INVALID:
            return 'red';
          case AssignmentStatus.PARTIAL:
            return 'yellow';
          default: // case AssignmentStatus.OPEN:
            return 'white';
        }
      }
      const colourMap = [
        '#C54B6C', // indian red
        '#F7CE76', // rajah
        '#8DA47E', // dark sea green
        '#FFB347', // pastel orange
        '#B6B6B4', // pastel gray
        '#77DD77', // pastel green
        '#AEC6CF', // pastel blue
        '#FFAEB9', // pastel pink
        '#CFCFC4', // pastel beige
        '#DDBDF1', // pastel purple
        '#FFD1DC', // pastel rose
      ];
      let val = (isNotNone(assignment.value_bool)) ? (+assignment.value_bool) * 2 : assignment.value_int;
      if (val === undefined) {
        return 'white';
      }
      if (val < 0) {
        val = 0;
      }
      return colourMap[val];
    },
  },
  computed: {
    sidebarWidthClass() {
      return `col-md-${interfaceSettingsStore.annotation.sidebarWidth}`;
    },
    assignmentIndicators(): AssignmentIndicator[] | null {
      const WINDOW = 50; // 100/2
      const assignmentId = this.assignment?.assignment_id;
      if (this.assignments && assignmentId) {
        let focus = this.assignments.findIndex((assignment: ProgressIndicator) => assignment.assignment_id === assignmentId);
        focus = Math.min(Math.max(WINDOW, focus), this.assignments.length - WINDOW);
        return this.assignments.map((assignment: ProgressIndicator, index: number): AssignmentIndicator => ({
          assignmentId: assignment.assignment_id as string,
          inHighlight: ((index - WINDOW) <= focus) && (focus <= (index + WINDOW)),
          itemId: assignment.item_id,
          status: assignment.status,
          colour: this.assignmentColour(assignment),
        }));
      }
      return null;
    },
    assignmentIndicatorsHighlighted(): AssignmentIndicator[] | null {
      if (this.assignmentIndicators) {
        return this.assignmentIndicators.filter((assignment: AssignmentIndicator) => assignment.inHighlight);
      }
      return null;
    },
    assignmentIndicatorsNeedBirdseye(): boolean {
      return !!this.assignments && this.assignments.length > 100;
    },
    availableIndicatorLabels(): AnnotationSchemeLabel[] {
      let list = [{
        name: 'Assignment status (always fallback)',
      } as AnnotationSchemeLabel];
      if (this.labels !== undefined) {
        list = list.concat(this.labels.filter((label: AnnotationSchemeLabel) => (label.kind === 'bool' || label.kind === 'single') && (label.annotation?.repeat || 1) === 1));
      }
      return list;
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

/* Medium devices (tablets, 768px and up) */
@media (min-width: 768px) {
  .h-md-100 {
    height: 100% !important;
  }
}

.assignments {
  overflow: hidden;
  display: flex;
  flex-wrap: wrap;
}

.assignments-step {
  flex: 1;
  min-width: 0.2rem;
  max-width: 1rem;
  height: 0.8rem;
  margin: 0.05rem;
  border: .1rem solid gray;
}

.assignments-step.current {
  border: 0.2rem dashed black;
}

.assignments-step.FULL {
  background-color: #42b983;
}

.assignments-step.PARTIAL {
  background-color: yellow;
}

.assignments-birdseye {
  display: flex;
  overflow: hidden;
  height: 0.5rem;
  border: 1px solid gray;
}

.assignments-birdseye-step {
  flex: 1;
  align-items: center;
}

.assignments-birdseye-step:nth-child(10n):not(:last-child) {
  border-right: 1px dotted darkslategrey;
}

.assignments-birdseye-step-inview {
  border-bottom: 2px solid darkslategrey;
}

.assignments-birdseye-step.FULL {
  background-color: #42b983;
}

.assignments-birdseye-step.PARTIAL {
  background-color: yellow;
}

.assignments-birdseye-step.OPEN {
  background-color: white;
}

</style>
