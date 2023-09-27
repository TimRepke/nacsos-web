<template>
  <div>
    <!--    <span class="text-warning">-->
    <!--      <font-awesome-icon :icon="['fas', 'triangle-exclamation']"/>-->
    <!--      Please note that editing the scheme may break the database if assignments and/or annotations were already made.-->
    <!--      <font-awesome-icon :icon="['fas', 'triangle-exclamation']"/>-->
    <!--    </span>-->

    <!-- Annotation Scheme Name -->
    <template v-if="nameEditMode">
      <div class="input-group mb-3 w-lg-50">
        <input
          type="text"
          class="form-control"
          placeholder="Annotation Scheme Name"
          aria-label="Annotation Scheme Name"
          aria-describedby="button-addon2"
          v-model="scheme.name"
        />
        <button type="button" class="btn btn-outline-secondary" id="button-addon2" @click="nameEditMode = false">
          <font-awesome-icon :icon="['fas', 'circle-check']" />
        </button>
      </div>
    </template>
    <template v-else>
      <h1>
        {{ scheme.name }}
        <sup role="button" style="top: -0.8em; left: 0.2em" tabindex="0" @click="nameEditMode = true">
          <font-awesome-icon class="fs-6" :icon="['fas', 'pen']" />
        </sup>
      </h1>
    </template>

    <!-- Annotation Scheme Description -->
    <template v-if="descriptionEditMode">
      <div class="hstack align-items-start">
        <div class="form-floating w-lg-50">
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
      <div class="hstack mb-2 align-items-start">
        <div class="w-lg-50" v-html="htmlDescription" />
        <span role="button" tabindex="0" @click="descriptionEditMode = true">
          <font-awesome-icon class="fs-6" :icon="['fas', 'pen']" />
        </span>
      </div>
    </template>

    <!-- Annotation Scheme Labels (root level) -->
    <strong>Note:</strong> Please use positive numbers only for choice values (zero included).
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
import type { AnnotationSchemeModel } from "@/plugins/api/api-core";
import { API } from "@/plugins/api";

export default defineComponent({
  name: "AnnotationConfigEditView",
  components: { AnnotationSchemeLabelsEditor },
  data() {
    const { projectId } = currentProjectStore;
    const annotationSchemeId = this.$route.params.annotation_scheme_id;

    return {
      annotationSchemeId,
      isNewScheme: !annotationSchemeId,
      nameEditMode: false,
      descriptionEditMode: false,
      scheme: ref({
        project_id: projectId,
        name: "New annotation scheme",
        description: "Description for new scheme.",
        labels: [],
      } as AnnotationSchemeModel),
    };
  },
  async mounted() {
    if (!this.isNewScheme) {
      API.core.annotations
        .getSchemeDefinitionApiAnnotationsSchemesDefinitionAnnotationSchemeIdGet({
          annotationSchemeId: this.annotationSchemeId,
          xProjectId: currentProjectStore.projectId as string,
          flat: false,
        })
        .then((response) => {
          this.scheme = ref(response.data);
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
              API.core.annotations
                .putAnnotationSchemeApiAnnotationsSchemesDefinitionPut({
                  xProjectId: currentProjectStore.projectId as string,
                  requestBody: this.scheme,
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
      return marked(this.scheme.description);
    },
  },
});
</script>

<style scoped></style>
