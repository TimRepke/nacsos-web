<template>
  <div class="text-start p-3 position-relative">
    <!--    <span class="text-warning">-->
    <!--      <font-awesome-icon :icon="['fas', 'triangle-exclamation']"/>-->
    <!--      Please note that editing the scheme may break the database if assignments and/or annotations were already made.-->
    <!--      <font-awesome-icon :icon="['fas', 'triangle-exclamation']"/>-->
    <!--    </span>-->

    <!-- Annotation Scheme Name -->
    <template v-if="nameEditMode">
      <div class="input-group mb-3 w-lg-50">
        <input type="text" class="form-control" placeholder="Annotation Scheme Name" aria-label="Annotation Scheme Name"
               aria-describedby="button-addon2" v-model="scheme.name">
        <button class="btn btn-outline-secondary" type="button" id="button-addon2" @click="nameEditMode=false">
          <font-awesome-icon :icon="['fas', 'circle-check']"/>
        </button>
      </div>
    </template>
    <template v-else>
      <h1>
        {{ scheme.name }}
        <sup style="top:-0.8em; left: 0.2em" role="button" tabindex="0" @click="nameEditMode=true">
          <font-awesome-icon class="fs-6" :icon="['fas', 'pen']"/>
        </sup>
      </h1>
    </template>

    <!-- Annotation Scheme Description -->
    <template v-if="descriptionEditMode">
      <div class="hstack  align-items-start">
        <div class="form-floating w-lg-50">
        <textarea class="form-control" placeholder="Leave a comment here" id="floatingTextarea2"
                  style="height: 100px" v-model="scheme.description"></textarea>
          <label for="floatingTextarea2">Comments</label>
        </div>
        <button class="btn btn-outline-secondary" type="button" id="button-addon2" @click="descriptionEditMode=false">
          <font-awesome-icon :icon="['fas', 'circle-check']"/>
        </button>
      </div>
    </template>
    <template v-else>
      <div class="hstack mb-2 align-items-start">
        <div class="w-lg-50" v-html="htmlDescription"></div>
        <span role="button" tabindex="0" @click="descriptionEditMode=true">
          <font-awesome-icon class="fs-6" :icon="['fas', 'pen']"/>
        </span>
      </div>
    </template>

    <!-- Annotation Scheme Labels (root level) -->
    <AnnotationSchemeLabelsEditor :labels="scheme.labels"/>
    <button class="btn btn-success position-fixed" style="top: 4rem; right: 1rem;" @click="save()">Save</button>
  </div>
</template>

<script lang="ts">
import {
  callSaveAnnotationSchemeEndpoint,
  callSchemeDefinitionEndpoint,
} from '@/plugins/api/annotations';
import { marked } from 'marked';
import { AnnotationScheme } from '@/types/annotation.d';
import { EventBus } from '@/plugins/events';
import { ToastEvent } from '@/plugins/events/events/toast';
import { ConfirmationRequestEvent } from '@/plugins/events/events/confirmation';
import { currentProjectStore } from '@/stores';
import { ref } from 'vue';
import AnnotationSchemeLabelsEditor from '@/components/annotations/AnnotationSchemeLabelsEditor.vue';

export default {
  name: 'AnnotationConfigEditView',
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
        name: 'New annotation scheme',
        description: 'Description for new scheme.',
        labels: [],
      } as AnnotationScheme),
    };
  },
  async mounted() {
    if (!this.isNewScheme) {
      const result = await callSchemeDefinitionEndpoint({ annotationSchemeId: this.annotationSchemeId });
      if (result.status === 'SUCCESS' && result.payload) {
        this.scheme = ref(result.payload);
      } else {
        EventBus.emit(new ToastEvent('ERROR', 'Failed to load assignment scope info. Please try reloading.'));
        throw Error('Something went wrong. Please tell the admin how you got here.');
      }
    }
  },
  methods: {
    save() {
      EventBus.emit(new ConfirmationRequestEvent(
        'Editing the annotation scheme after assignment scopes, assignments, or annotations already exist for it '
        + 'can lead to very unexpected behaviour. Are you sure you want to proceed?',
        (response) => {
          if (response === 'ACCEPT') {
            callSaveAnnotationSchemeEndpoint(this.scheme)
              .then((res) => {
                EventBus.emit(new ToastEvent(
                  'SUCCESS',
                  `Saved annotation scheme.  \n**ID:** ${res.payload}`,
                ));
                if (this.isNewScheme) {
                  this.isNewScheme = false;
                  this.$router.replace({ name: 'config-annotation-scheme-edit', params: { annotation_scheme_id: res.payload } });
                }
              })
              .catch((res) => {
                EventBus.emit(new ToastEvent(
                  'ERROR',
                  `Failed to save the annotation scheme. (${res.reason})`,
                ));
              });
          } else {
            EventBus.emit(new ToastEvent('WARN', 'Did not save the annotation scheme.'));
          }
        },
        'Save annotation scheme',
        'Yes, save!',
        'Nope!',
      ));
    },
  },
  computed: {
    htmlDescription() {
      return marked(this.scheme.description);
    },
  },
};
</script>

<style scoped>
</style>
