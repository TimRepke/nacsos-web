<template>
  <div class="row h-md-100">
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
              @click="showStatusBarModal = true"
            />
          </div>

          <div class="col align-items-center">
            <div v-if="assignmentIndicatorsNeedBirdseye" class="assignments-birdseye">
              <div
                v-for="assignmentLI in assignmentIndicators"
                :key="assignmentLI.assignmentId"
                class="assignments-birdseye-step"
                :class="[assignmentLI.inHighlight ? 'assignments-birdseye-step-inview' : '', assignmentLI.status]"
                type="button"
                @click="saveAndGoto(assignmentLI.assignmentId)"
              />
            </div>
            <div class="assignments align-items-center h-100">
              <div
                v-for="assignmentLI in assignmentIndicatorsHighlighted"
                :key="assignmentLI.assignmentId"
                class="assignments-step"
                :class="{ current: assignmentLI.assignmentId === assignment?.assignment_id }"
                type="button"
                :style="{ 'background-color': assignmentLI.colour }"
                @click="saveAndGoto(assignmentLI.assignmentId)"
              >
                <div class="rounded-circle border border-secondary p-1 bg-light mt-2">
                  {{ assignmentLI.identifier }}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="row g-0">
          <AnyItemComponent :item="item" :highlighters="highlighters" />
        </div>
      </div>

      <div
        class="col border-start p-2 overflow-auto h-md-100 position-relative border-top border-md-top"
        :class="sidebarWidthClass"
      >
        <div
          class="position-fixed bottom-0 border border-end-0 rounded-start text-muted text-center"
          style="margin-left: -1.325rem; width: 0.75rem; font-size: 0.75rem"
          @click="widenSidebar"
        >
          <font-awesome-icon :icon="['fas', 'caret-left']" />
        </div>
        <div
          class="position-fixed bottom-0 border border-start-0 rounded-end text-muted text-center"
          style="margin-left: -0.5rem; width: 0.75rem; font-size: 0.75rem"
          @click="shrinkSidebar"
        >
          <font-awesome-icon :icon="['fas', 'caret-right']" />
        </div>

        <div class="row g-0">
          <h3>Annotation Panel</h3>
          <div class="collapsible">
            <input id="annotation-description" class="toggle" type="checkbox" />
            <label for="annotation-description" class="lbl-toggle" role="button">Show scheme description</label>
            <div class="collapsible-content">
              <div class="content-inner" v-if="scheme && scope">
                <strong>Annotation scheme:</strong> {{ scheme.name }}
                <p v-if="scheme.description" v-html="markdown(scheme.description)" />
                <strong>Assignment scope:</strong> {{ scope.name }}
                <p v-if="scope.description" v-html="markdown(scope.description)" />
              </div>
            </div>
          </div>
        </div>
        <div class="row g-0">
          <AnnotationLabels :labels="labels" :assignment="assignment" :key="rerenderCounter" ref="labelsComponents" />
        </div>
        <div class="row g-0 border-top pt-2">
          <div class="col text-start">
            <button type="button" class="btn btn-outline-secondary" @click="saveAndPrevious()">Save & Previous</button>
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
                  @click="showStatusBarModal = false"
                />
              </div>
              <div class="modal-body text-start ps-4 pe-4">
                <div class="row mb-3 g-2 text-muted">
                  These settings allow you to choose how the colour for the items in the indicator bar is chosen. Please
                  note, that this is a "global" setting, so you may have to manually adjust it for other assignment
                  scopes.
                </div>
                <div class="row mb-3 g-2">
                  <label for="progressBarLabelKey" class="form-label">
                    Which label to use to colour document indicators
                  </label>
                  <select
                    :value="progressBarLabelKey"
                    @input="updateProgressBarLabelKey($event.target.value)"
                    id="progressBarLabelKey"
                    class="form-select"
                  >
                    <option v-for="label in availableIndicatorLabels" :key="label.key" :value="label.key">
                      {{ label.name }}
                    </option>
                  </select>
                </div>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-success" @click="showStatusBarModal = false">Done.</button>
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
import { defineComponent } from "vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { marked } from "marked";
import AnyItemComponent from "@/components/items/AnyItem.vue";
import AnnotationLabels from "@/components/annotations/AnnotationLabels.vue";
import { EventBus } from "@/plugins/events";
import { ToastEvent } from "@/plugins/events/events/toast";
import type {
  AnnotationItem,
  AnnotationSchemeModel,
  AssignmentInfo,
  AssignmentModel,
  AssignmentScopeEntry,
  AssignmentScopeModel,
  HighlighterModel,
} from "@/plugins/api/api-core";
import { AssignmentStatus, AnnotationSchemeLabel } from "@/plugins/api/api-core";
import type { AnyItem } from "@/types/items.d";
import { API, ignore } from "@/plugins/api";
import { currentProjectStore, currentUserStore, interfaceSettingsStore } from "@/stores";
import { lookupMakerBool, lookupMakerChoice, lookupMakerStatus } from "@/types/colours";

const motivationalQuotes = [
  "The chase is better than the catch. – Scooter",
  "It's the first page of the second chapter – Scooter",
  // "Let's blow a hole in the bowl – Scooter",
  "Our lyrics fly like birds in the sky – Scooter",
  "It's nice to be important, but it's more important to be nice – Scooter",
  "Before success can manifest. You’ve got to go through the learning process. – Scooter",
  // 'Distraction is the enemy of vision – Kanye West',
  // 'I love sleep; it’s my favorite. – Kanye West',
  // 'Keep squares out yo circle – Kanye West',
  "The bad news is time flies. The good news is you're the pilot. – Michael Altshuler",
  "The best way to get started is to quit talking and begin doing. ― Walt Disney",
  "Act as if what you do makes a difference. It does. – William James",
  "If you can change your mind, you can change your life. – William James",
  "Life is like riding a bicycle. To keep your balance, you must keep moving. – Albert Einstein",
  "If you don't like the road you’re walking, start paving another one. – Dolly Parton",
  "Don't count the days. Make the days count. – Muhammad Ali",
  "Every moment is a fresh beginning. – T.S. Eliot",
  "Believe you can and you're halfway there. – Theodore Roosevelt",
  "You get what you give. – Jennifer Lopez",
  "Your life only gets better when you get better. – Brian Tracy",
  "Happiness is not by chance, but by choice. – Jim Rohn",
  "Change the world by being yourself. – Amy Poehler",
  "Change the game, don't let the game change you. – Macklemore",
  "Your Skepticism Is My Fuel. — Minx",
  "If people are doubting how far you can go, go so far that you can't hear them anymore. — Michele Ruiz",
  "Man kann es so oder so machen. Ich bin für so. — Gerhard Schröder",
  "Now, the door to a new life is opening. That's exciting and inspiring. – Angela Merkel",
  "Zwischendurch einen Moment innehalten, schweigen, nachdenken, Pause machen. – Angela Merkel",
  "It is a matter worth pursuing intensively. – Olaf Scholz",
  "Always forwards, never backwards. – Erich Honecker",
  "In a gentle way, you can shake the world. – Mahatma Gandhi",
  "If opportunity doesn't knock, build a door. – Kurt Cobain",
  "Work hard in silence, let your success be the noise. – Frank Ocean",
  "If everything seems to be under control, you're not going fast enough. – Mario Andretti",
  "The best way to appreciate your job is to imagine yourself without one. – Oscar Wilde",
  "The miracle is not that we do this work, but that we are happy to do it. – Mother Teresa",
  "Make each day your masterpiece. – John Wooden",
  "Dreams don't work unless you do. – John C. Maxwell",
  "Go the extra mile. It's never crowded there. – Wayne Dyer",
  "Today is your opportunity to build the tomorrow you want. – Ken Poirot",
  "If you fall, I'll be there. – Floor",
  "A goal is a dream with a deadline. – Napoleon Hill",
  "The [annotations are] plentiful but the workers are few. – Jesus", // originally "harvest is"
  "Patience is the key to well-being. – Muhammad",
  "Всюди добре де нас нема", // The grass is always greener on the other side of the hill. (Ukrainian proverb)
  "أشد الفاقة عدم العقل", // (Arabic proverb)
  "千 里 之 行 始 于 足 下。--- 老 子", // A journey of a thousand miles must begin with a single step. – Lao Tzu
];
type UserAssignmentInfo = AssignmentInfo & { identifier: number; item_id: string };

type AnnotationsViewData = {
  item?: AnyItem;
  assignment?: AssignmentModel;
  assignments?: AssignmentScopeEntry[];
  scheme?: AnnotationSchemeModel;
  scope?: AssignmentScopeModel;
  labels?: AnnotationSchemeLabel[];
  dirty: number;
  highlighters?: HighlighterModel[];
  rerenderCounter: number; // this is a hack to force-update the AnnotationLabels-component
  showStatusBarModal: boolean;
};

type AssignmentIndicator = {
  assignmentId: string;
  itemId: string;
  status: AssignmentStatus;
  inHighlight: boolean;
  colour: string;
  order: number;
  identifier: number;
};

export default defineComponent({
  name: "AnnotationsView",
  components: { FontAwesomeIcon, AnnotationLabels, AnyItemComponent },
  data(): AnnotationsViewData {
    return {
      item: undefined as AnyItem | undefined,
      assignment: undefined as AssignmentModel | undefined,
      assignments: undefined as AssignmentScopeEntry[] | undefined,
      scheme: undefined as AnnotationSchemeModel | undefined,
      scope: undefined as AssignmentScopeModel | undefined,
      labels: undefined as AnnotationSchemeLabel[] | undefined,
      dirty: 0,
      highlighters: undefined as HighlighterModel[] | undefined,
      rerenderCounter: 0,
      showStatusBarModal: false,
    };
  },
  unmounted() {
    document.removeEventListener("keydown", this.onKeyPress, false);
  },
  async mounted() {
    const assignmentScopeId = this.$route.params.scope_id as string;
    const currentAssignmentId = this.$route.params.assignment_id as string;
    document.addEventListener("keydown", this.onKeyPress, false);
    try {
      let response: AnnotationItem;
      if (currentAssignmentId) {
        response = (
          await API.core.annotations.getAssignmentApiAnnotationsAnnotateAssignmentAssignmentIdGet({
            xProjectId: currentProjectStore.projectId as string,
            assignmentId: currentAssignmentId,
          })
        ).data;
      } else {
        response = (
          await API.core.annotations.getNextOpenAssignmentForScopeForUserApiAnnotationsAnnotateNextAssignmentScopeIdGet(
            {
              xProjectId: currentProjectStore.projectId as string,
              assignmentScopeId,
            },
          )
        ).data;
      }

      await this.setCurrentAssignment(response);

      API.core.highlighters
        .getScopeHighlightersApiHighlightersScopeAssignmentScopeIdGet({
          xProjectId: currentProjectStore.projectId as string,
          assignmentScopeId,
        })
        .then((resp) => {
          const { data } = resp;
          if (data !== null && data !== undefined) {
            this.highlighters = data;
          }
        })
        .catch(ignore);
    } catch (e) {
      console.error(e);
    }
  },
  methods: {
    widenSidebar() {
      if (interfaceSettingsStore.annotation.sidebarWidth < 12) interfaceSettingsStore.annotation.sidebarWidth++;
    },
    shrinkSidebar() {
      if (interfaceSettingsStore.annotation.sidebarWidth > 0) interfaceSettingsStore.annotation.sidebarWidth--;
    },
    updateProgressBarLabelKey(newValue: string) {
      interfaceSettingsStore.annotation.progressBarLabelKey = newValue;
    },
    markdown(md: string) {
      return marked(md);
    },
    onKeyPress(e: KeyboardEvent) {
      if (e !== null && e.target !== null) {
        const target = e.target as Element;
        if (!target.matches("input, textarea") && !e.repeat) {
          switch (e.key) {
            case "ArrowUp":
            case "k":
            case "w":
              // UP => previous label
              this.$refs.labelsComponents?.selectPrevious();
              break;
            case "ArrowDown":
            case "j":
            case "s":
              // DOWN => next label
              this.$refs.labelsComponents?.selectNext();
              break;
            case "0":
            case "1":
            case "2":
            case "3":
            case "4":
            case "5":
            case "6":
            case "7":
            case "8":
            case "9":
            case "+":
            case "-":
            case "Enter":
            case "Backspace":
              this.$refs.labelsComponents?.setValue(e.key);
              break;
            case "ArrowLeft":
            case "h":
            case "a":
              // LEFT => previous assignment
              this.saveAndPrevious();
              break;
            case "ArrowRight":
            case "l":
            case "d":
              // RIGHT => next assignment
              this.saveAndNext();
              break;
            default:
            // pass
          }
        }
      }
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
      if (this.dirty > 0) {
        // copy relevant data to break references
        const labels = JSON.parse(JSON.stringify(this.labels));
        const scheme = JSON.parse(JSON.stringify(this.scheme));

        // first, remove all empty annotations again
        const removeEmptyAnnotations = (subLabels: AnnotationSchemeLabel[]) =>
          subLabels.map((label: AnnotationSchemeLabel) => {
            if (
              label.annotation?.value_int === undefined &&
              label.annotation?.value_str === undefined &&
              label.annotation?.value_bool === undefined &&
              label.annotation?.value_float === undefined &&
              label.annotation?.multi_int === undefined
            ) {
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
        API.core.annotations
          .saveAnnotationApiAnnotationsAnnotateSavePost({
            xProjectId: currentProjectStore.projectId as string,
            requestBody: {
              scheme,
              assignment: this.assignment as AssignmentModel,
            },
          })
          .then((response) => {
            const reason = response.data;
            if (reason === "PARTIAL") {
              EventBus.emit(new ToastEvent("WARN", "This annotation wasn't quite done yet..."));
            }
            EventBus.emit(new ToastEvent("SUCCESS", "Successfully saved your annotation!"));
          })
          .catch(() => {
            EventBus.emit(
              new ToastEvent(
                "ERROR",
                "Failed to save your annotation. Sorry. " + "Please try reloading the page and saving again.",
              ),
            );
          })
          .finally(() => {
            if (currentProjectStore.project?.setting_motivational_quotes && Math.random() < 0.2) {
              const quoteIndex = Math.floor(Math.random() * (motivationalQuotes.length + 1));
              EventBus.emit(new ToastEvent("INFO", motivationalQuotes[quoteIndex]));
            }
          });
      }
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
      API.core.annotations
        .getAssignmentIndicatorsForScopeApiAnnotationsAnnotateAssignmentProgressAssignmentScopeIdGet({
          xProjectId: currentProjectStore.projectId as string,
          assignmentScopeId: annotationItem.scope.assignment_scope_id as string,
        })
        .then(async (response) => {
          this.assignments = response.data;
          // update the URL
          await this.$router.push({
            name: "project-annotate-item",
            params: {
              scope_id: this.scope!.assignment_scope_id,
              assignment_id: this.assignment!.assignment_id,
            },
          });
          this.dirty = 0;
        })
        .catch(ignore);
    },
    async saveAndGoto(targetAssignmentId: string) {
      await this.save();

      API.core.annotations
        .getAssignmentApiAnnotationsAnnotateAssignmentAssignmentIdGet({
          xProjectId: currentProjectStore.projectId as string,
          assignmentId: targetAssignmentId,
        })
        .then((response) => {
          this.setCurrentAssignment(response.data);
        })
        .catch(ignore);
    },
    async saveAndPrevious() {
      if (this.currentAssignmentIndex !== undefined && this.userAssignments) {
        if (this.currentAssignmentIndex > 0) {
          await this.saveAndGoto(this.userAssignments[this.currentAssignmentIndex - 1].assignment_id);
        } else {
          await this.saveAndGoto(this.userAssignments[this.userAssignments.length - 1].assignment_id);
        }
      }
    },
    async saveAndNext() {
      if (this.currentAssignmentIndex !== undefined && this.userAssignments) {
        await this.saveAndGoto(
          this.userAssignments[(this.currentAssignmentIndex + 1) % this.userAssignments.length].assignment_id,
        );
      }
    },
  },
  computed: {
    currentAssignmentIndex(): number | undefined {
      if (this.userAssignments) {
        return this.userAssignments?.findIndex(
          (assi: UserAssignmentInfo) => assi.assignment_id === this.assignment?.assignment_id,
        );
      }
      return undefined;
    },
    sidebarWidthClass() {
      return `col-md-${interfaceSettingsStore.annotation.sidebarWidth}`;
    },
    userAssignments(): UserAssignmentInfo[] | null {
      if (this.assignments) {
        return this.assignments
          .map((entry: AssignmentScopeEntry): UserAssignmentInfo | null => {
            const userAssignments = entry.assignments.filter(
              (assignment: AssignmentInfo) => assignment.user_id === currentUserStore.user?.user_id,
            );
            if (userAssignments.length > 0) {
              return {
                ...userAssignments[0],
                identifier: entry.identifier,
                item_id: entry.item_id,
              } as unknown as UserAssignmentInfo;
            }
            return null;
          })
          .filter((entry: UserAssignmentInfo | null): entry is UserAssignmentInfo => entry !== null)
          .sort((a: UserAssignmentInfo, b: UserAssignmentInfo) => a.order - b.order);
      }
      return null;
    },
    assignmentIndicators(): AssignmentIndicator[] | null {
      const WINDOW = 50; // 100/2
      const assignmentId = this.assignment?.assignment_id;
      if (this.userAssignments && assignmentId) {
        let focus = this.userAssignments.findIndex(
          (assignment: UserAssignmentInfo) => assignment.assignment_id === assignmentId,
        );
        focus = Math.min(Math.max(WINDOW, focus), this.userAssignments.length - WINDOW);
        return this.userAssignments.map(
          (assignment: UserAssignmentInfo, index: number): AssignmentIndicator => ({
            assignmentId: assignment.assignment_id as string,
            inHighlight: index - WINDOW <= focus && focus <= index + WINDOW,
            itemId: assignment.item_id,
            status: assignment.status,
            colour: this.indicatorLabelColourMapper(assignment),
            order: assignment.order,
            identifier: assignment.identifier,
          }),
        );
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
      return !!this.userAssignments && this.userAssignments.length > 100;
    },
    availableIndicatorLabels(): AnnotationSchemeLabel[] {
      let list = [
        {
          name: "Assignment status (always fallback)",
        } as AnnotationSchemeLabel,
      ];
      if (this.labels !== undefined) {
        list = list.concat(
          this.labels.filter(
            (label: AnnotationSchemeLabel) =>
              (label.kind === "bool" || label.kind === "single") && (label.annotation?.repeat || 1) === 1,
          ),
        );
      }
      return list;
    },
    indicatorLabelColourMapper(): (indicator: UserAssignmentInfo) => string {
      // Colour by assignment status is always the fallback, set up respective map and mapper function
      const indicateStatusMapper = lookupMakerStatus<UserAssignmentInfo>(
        (indicator: UserAssignmentInfo): AssignmentStatus => indicator.status,
      );

      // User selected to colour by assignment status
      if (interfaceSettingsStore.annotationProgressBarUseStatus) {
        return indicateStatusMapper;
      }

      const labelKey = this.progressBarLabelKey;
      if (!labelKey) {
        return indicateStatusMapper;
      }

      // User selected a specific label for colouring, try to find it
      const label: AnnotationSchemeLabel | undefined = (this.labels ?? []).find(
        (lab: AnnotationSchemeLabel) => lab.key === labelKey,
      );

      // No corresponding label found in the scheme, return fallback mapper
      if (!label) {
        return indicateStatusMapper;
      }

      if (label.kind === AnnotationSchemeLabel.kind.SINGLE && label.choices) {
        return lookupMakerChoice<UserAssignmentInfo>(
          label.choices,
          false,
          (indicator: UserAssignmentInfo): number | null | undefined => indicator.labels?.[labelKey]?.[0]?.value_int,
        );
      }

      if (label.kind === AnnotationSchemeLabel.kind.BOOL) {
        return lookupMakerBool<UserAssignmentInfo>(
          (indicator: UserAssignmentInfo): boolean | null | undefined => indicator.labels?.[labelKey]?.[0]?.value_bool,
        );
      }

      // fallback to status mapper
      return indicateStatusMapper;
    },
    progressBarLabelKey(): string | undefined | null {
      return interfaceSettingsStore.annotation.progressBarLabelKey;
    },
  },
  watch: {
    labels: {
      deep: true,
      handler() {
        this.dirty += 1;
      },
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

  .border-md-top {
    border-top: none !important;
  }
}

.assignments {
  /* overflow: hidden;*/
  display: flex;
  flex-wrap: wrap;
}

.assignments-step {
  flex: 1;
  min-width: 0.2rem;
  max-width: 1rem;
  height: 0.8rem;
  margin: 0.05rem;
  border: 0.1rem solid #808080;
  position: relative;
}

.assignments-step > div {
  position: absolute;
  left: -1.5ch;
  z-index: -1;
  display: block;
  margin: 0;
  text-decoration: none;
  text-align: center;
  -webkit-transition: 0.2s ease-in-out;
  transition: 0.2s ease-in-out;
  opacity: 0;
  top: 5em;
  width: 4ch;
  /* height: 3em; */
  font-size: 0.8em;
}

.assignments-step:hover > div {
  top: 0.6em;
  opacity: 1;
  z-index: 1000;
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
  border: 1px solid #808080;
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