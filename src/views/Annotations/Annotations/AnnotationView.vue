<template>
  <div class="row g-0 text-start">
    <template v-if="!assignments">
      Error loading data.
    </template>
    <template v-else>
      <div class="col-12 col-md overflow-auto h-md-100">
        <div class="row g-0">
          <ul class="d-flex list-unstyled">
            <li v-for="assignmentLI in assignments" :key="assignmentLI.assignment_id"
                class="me-0 assignments-step flex-fill"
                :class="[assignmentLI.status, (assignmentLI.assignment_id === assignment.assignment_id) ? 'current' :'']"
                type="button"
                @click="saveAndGoto(assignmentLI.assignment_id)">
            </li>
          </ul>
        </div>
        <div class="row g-0">
          <TwitterItemComponent :tweet="item"/>
        </div>
      </div>
      <div class="col border-start p-2 overflow-auto h-md-100 position-relative" :class="sidebarWidthClass">
        <div class="position-fixed bottom-0 border border-end-0 rounded-start text-muted text-center"
             style="margin-left: -1.325rem; width: 0.75rem; font-size: 0.75rem;"
             @click="(sidebarWidth<12) && sidebarWidth++">
          <font-awesome-icon :icon="['fas', 'caret-left']"/>
        </div>
        <div class="position-fixed bottom-0 border border-start-0 rounded-end text-muted text-center"
             style="margin-left: -.5rem; width: 0.75rem; font-size: 0.75rem;"
             @click="(sidebarWidth>0) && sidebarWidth--">
          <font-awesome-icon :icon="['fas', 'caret-right']"/>
        </div>

        <div class="row g-0">
          <h3>Annotation Panel</h3>
          <div class="collapsible">
            <input id="annotation-description" class="toggle" type="checkbox">
            <label for="annotation-description" class="lbl-toggle" role="button">Show task description</label>
            <div class="collapsible-content">
              <div class="content-inner">
                <strong>Annotation task:</strong> {{ task.name }}
                <p v-html="markdown(task.description)"></p>
                <strong>Assignment scope:</strong> {{ scope.name }}
                <p v-html="markdown(scope.description)"></p>
              </div>
            </div>
          </div>
        </div>
        <div class="row g-0">
          <AnnotationLabels :labels="labels" :assignment="assignment"/>
        </div>
        <div class="row g-0 border-top pt-2">
          <div class="col text-start">
            <button class="btn btn-outline-secondary" @click="saveAndPrevious()">Save & Previous</button>
          </div>
          <div class="col text-end">
            <button class="btn btn-primary" @click="saveAndNext()">Save & Next</button>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import { marked } from 'marked';
import {
  callNextOpenAnnotationItemEndpoint,
  callNextAnnotationItemEndpoint,
  callSaveAnnotationEndpoint,
  callAnnotationItemEndpoint,
  callScopeAssignmentsEndpoint, AnnotationItemResponse,
} from '@/plugins/api/annotations';
import { TwitterItem } from '@/types/items/twitter.d';
import TwitterItemComponent from '@/components/items/TwitterItem.vue';
import AnnotationLabels from '@/components/annotations/AnnotationLabels.vue';
import { AnnotationTaskLabel } from '@/types/annotation.d';
import { useRoute } from 'vue-router';

export default {
  name: 'AnnotationView',
  components: { AnnotationLabels, TwitterItemComponent },
  data() {
    return {
      item: undefined,
      assignment: undefined,
      assignments: undefined,
      task: undefined,
      scope: undefined,
      sidebarWidth: 5,
      labels: undefined,
    };
  },
  async created() {
    const route = useRoute();
    const assignmentScopeId = route.params.scope_id as string;
    const currentAssignmentId = route.params.assignment_id as string;

    const response = (currentAssignmentId)
      ? await callAnnotationItemEndpoint({ assignmentId: currentAssignmentId })
      : await callNextOpenAnnotationItemEndpoint({ assignmentScopeId });

    if (response.payload) {
      await this.setCurrentAssignment(response.payload);
    }
  },
  methods: {
    markdown(md: string) {
      return marked(md);
    },
    populateEmptyAnnotations(labels: AnnotationTaskLabel[]) {
      return labels.map((label: AnnotationTaskLabel) => {
        if (!label.annotation) {
          // eslint-disable-next-line no-param-reassign
          label.annotation = {
            assignment_id: this.assignment.assignment_id,
            user_id: this.assignment.user_id,
            item_id: this.assignment.item_id,
            task_id: this.assignment.task_id,
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
      const task = JSON.parse(JSON.stringify(this.task));

      // first, remove all empty annotations again
      const removeEmptyAnnotations = (subLabels: AnnotationTaskLabel[]) => subLabels.map((label: AnnotationTaskLabel) => {
        if (label.annotation?.value_int === undefined
          && label.annotation?.value_str === undefined
          && label.annotation?.value_bool === undefined
          && label.annotation?.value_float === undefined) {
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
      task.labels = removeEmptyAnnotations(labels);

      // Send data to the server
      const payload = {
        task,
        assignment: this.assignment,
      };
      await callSaveAnnotationEndpoint(payload);
    },
    async setCurrentAssignment(annotationItem: AnnotationItemResponse) {
      // update all the data
      this.assignment = annotationItem.assignment;
      this.task = annotationItem.task;
      this.scope = annotationItem.scope;
      this.item = annotationItem.item;
      this.labels = this.populateEmptyAnnotations(this.task.labels);

      // update the assignments progress bar
      this.assignments = (await callScopeAssignmentsEndpoint({
        assignmentScopeId: annotationItem.scope.assignment_scope_id as string,
      })).payload;

      // update the URL
      await this.$router.push({
        name: 'project-annotate-item',
        params: {
          scope_id: this.scope.assignment_scope_id,
          assignment_id: this.assignment.assignment_id,
        },
      });
    },
    async saveAndGoto(targetAssignmentId: string) {
      await this.save();

      const response = await callAnnotationItemEndpoint({ assignmentId: targetAssignmentId });
      if (response.payload) {
        await this.setCurrentAssignment(response.payload);
      }
    },
    async saveAndPrevious() {
      // TODO implement "previous" endpoint and this function
    },
    async saveAndNext() {
      await this.save();

      const response = await callNextAnnotationItemEndpoint({
        assignmentScopeId: this.assignment.assignment_scope_id,
        currentAssignmentId: this.assignment.assignment_id,
      });

      if (response.payload) {
        await this.setCurrentAssignment(response.payload);
      }
    },
  },
  computed: {
    sidebarWidthClass() {
      return `col-md-${this.sidebarWidth}`;
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

/* Medium devices (tablets, 768px and up) */
@media (min-width: 768px) {
  .h-md-100 {
    height: 100% !important;
  }
}

.assignments-step {
  min-width: 0.2rem;
  max-width: 0.5rem;
  height: 1rem;
  margin: 0.1rem;
  border: .1rem solid gray;
  display: block;
  font-size: 0.3rem;
}

.assignments-step.current {
  border: 0.2rem dashed black;
}

.assignments-step a {
  text-decoration: none;
  height: 100%;
  width: 100%;
  display: block;
}

.assignments-step.FULL {
  background-color: #42b983;
}

.assignments-step.FULL a {
  color: #42b983;
}

.assignments-step.PARTIAL {
  background-color: yellow;
}

.assignments-step.PARTIAL a {
  color: yellow;
}

.assignments-step.OPEN a {
  color: white;
}
</style>
