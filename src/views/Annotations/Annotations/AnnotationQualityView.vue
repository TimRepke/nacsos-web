<template>
  <div>
    <h2>Annotation Quality Monitor</h2>

    <template v-for="scheme in schemes" :key="scheme.annotation_scheme_id as string">
      <div class="row mt-4">
        <div class="col">
          <h4>
            <font-awesome-icon :icon="['fas', 'sitemap']" class="me-1" />
            {{ scheme.name }}
          </h4>
        </div>
      </div>
      <template
        v-for="scope in scopesLookup[scheme.annotation_scheme_id as string]"
        :key="scope.assignment_scope_id as string"
      >
        <ScopeQuality :scope="scope" :users="users" />
      </template>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from "vue";
import { API, ignore } from "@/plugins/api";
import type { UserBaseModel, AnnotationSchemeModel, AssignmentScopeModel } from "@/plugins/api/types";
import { currentProjectStore } from "@/stores";
import ScopeQuality from "@/components/annotations/ScopeQuality.vue";

defineOptions({ name: "AnnotationQualityView" });

const schemes = ref<AnnotationSchemeModel[]>([]);
const scopes = ref<AssignmentScopeModel[]>([]);
const users = ref<Record<string, UserBaseModel>>({});

onMounted(() => {
  API.annotations
    .getSchemeDefinitionsForProjectApiAnnotationsSchemesListGet({
      headers: { "x-project-id": currentProjectStore.projectId as string },
    })
    .then((response) => {
      schemes.value = response.data;
    })
    .catch(ignore);
  API.annotations
    .getAssignmentScopesForProjectApiAnnotationsAssignmentsScopesGet({
      headers: { "x-project-id": currentProjectStore.projectId as string },
    })
    .then((response) => {
      scopes.value = response.data;
    })
    .catch(ignore);
  API.users
    .getProjectAnnotatorUsersApiUsersListProjectAnnotatorsProjectIdGet({
      path: { project_id: currentProjectStore.projectId as string },
      headers: { "x-project-id": currentProjectStore.projectId as string },
    })
    .then((response) => {
      users.value = response.data;
    })
    .catch(ignore);
});

const scopesLookup = computed<{ [key: string]: AssignmentScopeModel[] }>(() => {
  const ret: Record<string, AssignmentScopeModel[]> = {};
  scopes.value.forEach((scope: AssignmentScopeModel) => {
    if (!(scope.annotation_scheme_id in ret)) ret[scope.annotation_scheme_id] = [];
    ret[scope.annotation_scheme_id].push(scope);
  });

  return ret;
});
</script>

<style scoped></style>
