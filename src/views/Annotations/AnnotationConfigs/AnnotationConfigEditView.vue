<template>
  <div>
    <h1>Annotation scheme</h1>

    <div class="alert alert-primary d-flex align-items-center me-5" role="alert">
      <ul class="list-unstyled m-0">
        <li>
          <font-awesome-icon icon="circle-exclamation" class="me-2" />
          Only use positive numbers for choice values (zero included).
        </li>
        <li>
          <font-awesome-icon icon="circle-exclamation" class="me-2" />
          Make sure to only use <strong>unique</strong> label keys—ideally short.
        </li>
        <li>
          <font-awesome-icon icon="circle-exclamation" class="me-2" />
          Only use letters, single dashes, or underscores in label keys.
        </li>
        <li>
          <font-awesome-icon icon="circle-exclamation" class="me-2" />
          Existing assignments/annotations or anything using this annotation scheme will not be updated. Editing the
          scheme later may lead to database inconsistencies.
        </li>
      </ul>
    </div>

    <div v-if="!keysUnique" class="alert alert-danger d-flex align-items-center me-5" role="alert">
      <font-awesome-icon icon="circle-exclamation" class="me-2" />
      Label keys are not unique.
    </div>
    <div v-if="!keysValid" class="alert alert-danger d-flex align-items-center me-5" role="alert">
      <font-awesome-icon icon="circle-exclamation" class="me-2" />
      Some keys look like they contain invalid characters.
    </div>

    <!-- Annotation Scheme Name -->
    <div class="form-floating me-5 mb-2">
      <input type="text" class="form-control" id="resolve-name" v-model="scheme.name" placeholder="Name" />
      <label for="resolve-name">Descriptive name for this annotation scheme</label>
    </div>

    <div class="form-floating me-5 mb-2">
      <input
        type="text"
        class="form-control"
        id="incl-rule"
        v-model="scheme.inclusion_rule"
        placeholder="Inclusion rule"
      />
      <label for="incl-rule">Inclusion rule</label>
    </div>

    <!-- Annotation Scheme Description -->
    <template v-if="descriptionEditMode">
      <div class="hstack align-items-start w-75">
        <div class="form-floating flex-grow-1">
          <textarea
            id="floatingTextarea2"
            class="form-control"
            style="height: 100px"
            placeholder="Leave a comment here"
            v-model="scheme.description"
          />
          <label for="floatingTextarea2">Comments</label>
        </div>
        <button type="button" id="button-addon2" class="btn btn-outline-secondary" @click="descriptionEditMode = false">
          <font-awesome-icon :icon="['fas', 'circle-check']" />
        </button>
      </div>
    </template>
    <template v-else>
      <div class="hstack mb-2 ms-1 align-items-start">
        <div class="w-lg-50" v-html="htmlDescription" />
        <span role="button" tabindex="0" @click="descriptionEditMode = true">
          <font-awesome-icon class="fs-6" :icon="['fas', 'pen']" />
        </span>
      </div>
    </template>

    <!-- Annotation Scheme Labels (root level) -->
    <AnnotationSchemeLabelsEditor :labels="scheme.labels" />
    <button type="button" class="btn btn-success position-fixed" style="top: 4rem; right: 1rem" @click="save()">
      Save
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { marked } from "marked";
import { EventBus } from "@/plugins/events";
import { ToastEvent } from "@/plugins/events/events/toast";
import { ConfirmationRequestEvent } from "@/plugins/events/events/confirmation";
import { currentProjectStore } from "@/stores";
import AnnotationSchemeLabelsEditor from "@/components/annotations/AnnotationSchemeLabelsEditor.vue";
import type {
  AnnotationSchemeLabel,
  AnnotationSchemeLabelChoice,
  AnnotationSchemeModel,
} from "@/plugins/api/spec/types.gen";
import { API } from "@/plugins/api";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

export default defineComponent({
  name: "AnnotationConfigEditView",
  components: { FontAwesomeIcon, AnnotationSchemeLabelsEditor },
  data() {
    const { projectId } = currentProjectStore;
    const annotationSchemeId = this.$route.params.annotation_scheme_id as string | undefined;

    return {
      annotationSchemeId,
      isNewScheme: !annotationSchemeId,
      nameEditMode: false,
      descriptionEditMode: false,
      scheme: ref({
        project_id: projectId,
        name: "New annotation scheme",
        description: "Description for new scheme.",
        inclusion_rule: "",
        labels: [],
      } as AnnotationSchemeModel),
    };
  },
  async mounted() {
    if (!this.isNewScheme) {
      API.annotations
        .getSchemeDefinitionApiAnnotationsSchemesDefinitionAnnotationSchemeIdGet({
          query: { flat: false },
          path: { annotation_scheme_id: this.annotationSchemeId as string },
          headers: { "x-project-id": currentProjectStore.projectId as string },
        })
        .then((response) => {
          this.scheme = ref(response.data as AnnotationSchemeModel);
        })
        .catch(() => {
          EventBus.emit(new ToastEvent("ERROR", "Failed to load assignment scope info. Please try reloading."));
          throw Error("Something went wrong. Please tell the admin how you got here.");
        });
    }
  },
  methods: {
    save() {
      EventBus.emit(
        new ConfirmationRequestEvent(
          "Editing the annotation scheme after assignment scopes, assignments, or annotations already exist for it " +
            "can lead to very unexpected behaviour. Are you sure you want to proceed?",
          (response) => {
            if (response === "ACCEPT") {
              API.annotations
                .putAnnotationSchemeApiAnnotationsSchemesDefinitionPut({
                  headers: { "x-project-id": currentProjectStore.projectId as string },
                  body: this.scheme,
                })
                .then((res) => {
                  EventBus.emit(new ToastEvent("SUCCESS", `Saved annotation scheme.  \n**ID:** ${res.data}`));
                  if (this.isNewScheme) {
                    this.isNewScheme = false;
                    this.$router.replace({
                      name: "config-annotation-scheme-edit",
                      params: { annotation_scheme_id: res.data },
                    });
                  }
                })
                .catch((res) => {
                  EventBus.emit(new ToastEvent("ERROR", `Failed to save the annotation scheme. (${res.reason})`));
                });
            } else {
              EventBus.emit(new ToastEvent("WARN", "Did not save the annotation scheme."));
            }
          },
          "Save annotation scheme",
          "Yes, save!",
          "Nope!",
        ),
      );
    },
  },
  computed: {
    htmlDescription() {
      if (!this.scheme.description) return "";
      return marked(this.scheme.description);
    },
    labelKeys(): string[] {
      function recurse(labels: AnnotationSchemeLabel[]) {
        return labels.flatMap((label) => {
          if (label.choices) {
            return [label.key].concat(
              label.choices.flatMap((choice: AnnotationSchemeLabelChoice): string[] => {
                if (choice.children) {
                  return recurse(choice.children);
                }
                return [];
              }),
            );
          }
          return [label.key];
        });
      }

      return recurse(this.scheme.labels);
    },
    keysUnique(): boolean {
      // console.debug(this.labelKeys);
      return this.labelKeys.length === new Set(this.labelKeys).size;
    },
    keysValid(): boolean {
      const reg = new RegExp("^[a-zA-Z_\-]+$");
      return this.labelKeys.every((key: string) => {
        return reg.test(key);
      });
    },
  },
});
</script>

<style scoped></style>
