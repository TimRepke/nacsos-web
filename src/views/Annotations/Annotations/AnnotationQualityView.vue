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

<script lang="ts">
import { defineComponent } from "vue";
import { API, ignore } from "@/plugins/api";
import type { AssignmentCounts, UserBaseModel, AnnotationSchemeModel, AssignmentScopeModel } from "@/plugins/api/types";
import { currentProjectStore } from "@/stores";
import ScopeQuality from "@/components/annotations/ScopeQuality.vue";

export default defineComponent({
  name: "AnnotationQualityView",
  components: { ScopeQuality },
  data() {
    return {
      schemes: [] as AnnotationSchemeModel[],
      scopes: [] as AssignmentScopeModel[],
      counts: {} as Record<string, AssignmentCounts>,
      users: {} as Record<string, UserBaseModel>,
    };
  },
  async mounted() {
    API.annotations
      .getSchemeDefinitionsForProjectApiAnnotationsSchemesListGet({
        xProjectId: currentProjectStore.projectId as string,
      })
      .then((response) => {
        this.schemes = response.data;
      })
      .catch(ignore);
    API.annotations
      .getAssignmentScopesForProjectApiAnnotationsAnnotateScopesGet({
        xProjectId: currentProjectStore.projectId as string,
      })
      .then((response) => {
        this.scopes = response.data;
      })
      .catch(ignore);
    API.users
      .getProjectAnnotatorUsersApiUsersListProjectAnnotatorsProjectIdGet({
        projectId: currentProjectStore.projectId as string,
        xProjectId: currentProjectStore.projectId as string,
      })
      .then((response) => {
        this.users = response.data;
      })
      .catch(ignore);
  },
  methods: {
    // pass
  },
  computed: {
    scopesLookup(): { [key: string]: AssignmentScopeModel[] } {
      const ret: Record<string, AssignmentScopeModel[]> = {};
      this.scopes.forEach((scope: AssignmentScopeModel) => {
        if (!(scope.annotation_scheme_id in ret)) ret[scope.annotation_scheme_id] = [];
        ret[scope.annotation_scheme_id].push(scope);
      });

      return ret;
    },
  },
});
</script>

<style scoped></style>
