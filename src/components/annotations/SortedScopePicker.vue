<script setup lang="ts">
import { computed } from "vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { useScopesStore } from "@/stores/CurrentProjectStore/scopes";

const selectedScopes = defineModel<string[]>({ required: true });

const scopes = useScopesStore();
scopes.ensureLoaded();
scopes.awaitLoaded().then(() => {
  console.log(scopes);
})
const sortedFilteredScopes = computed(() =>
  Object.values(scopes.lookup.value)
    .map((scope) => ({ ...scope, scopeKey: scope.bot?.bot_annotation_metadata_id ?? scope.human?.assignment_scope_id }))
    .filter(
      (scope) =>
        ((scope.bot && scope.bot?.kind === "RESOLVE") || !scope.bot) &&
        selectedScopes.value.indexOf(scope.scopeKey as string) < 0,
    )
    .toSorted((s1, s2) => {
      const n1 = ((s1.bot?.name ?? s1.human?.name) as string).toLowerCase();
      const n2 = ((s2.bot?.name ?? s2.human?.name) as string).toLowerCase();
      return n1 === n2 ? 0 : n1 < n2 ? -1 : 1;
    }),
);

function scopePick(scopeId: string) {
  selectedScopes.value.push(scopeId);
}

function scopeDrop(idx: number) {
  selectedScopes.value.splice(idx, 1);
}

function scopeUp(scopeId: string, idx: number) {
  if (idx > 0) {
    selectedScopes.value[idx] = selectedScopes.value[idx - 1];
    selectedScopes.value[idx - 1] = scopeId;
  }
}

function scopeDown(scopeId: string, idx: number) {
  if (selectedScopes.value.length - idx - 1 > 0) {
    selectedScopes.value[idx] = selectedScopes.value[idx + 1];
    selectedScopes.value[idx + 1] = scopeId;
  }
}
</script>

<template>
  <div class="row">
    <div class="col-6">
      <h5>Training data</h5>
      <div class="card rounded-end-0">
        <ul class="list-group rounded-end-0 overflow-auto" style="max-height: 20.4rem">
          <li v-for="(scope, si) in selectedScopes" :key="`opt-${scope}`" class="list-group-item d-flex text-muted">
            <font-awesome-icon icon="arrow-up" class="me-1 clickable-icon" @click="scopeUp(scope, si)" />
            <font-awesome-icon icon="arrow-down" class="me-2 clickable-icon" @click="scopeDown(scope, si)" />
            <span class="me-auto" :class="{ 'fw-bold': scopes.lookup.value[scope]?.bot }">{{
              scopes.lookup.value[scope]?.bot?.name ?? scopes.lookup.value[scope]?.human?.name
            }}</span>
            <font-awesome-icon :icon="['fas', scopes.lookup.value[scope]?.human ? 'user' : 'user-check']" />
            <font-awesome-icon icon="arrow-right" class="ms-2 clickable-icon" @click="scopeDrop(si)" />
          </li>
        </ul>
      </div>
    </div>
    <div class="col-6">
      <h5>Unused label sources</h5>
      <div class="card rounded-end-0">
        <ul class="list-group rounded-end-0 overflow-auto" style="max-height: 20.4rem">
          <li
            v-for="scope in sortedFilteredScopes"
            :key="`opt-${scope.scopeKey}`"
            class="list-group-item list-group-item-action d-flex text-muted"
            @click="scopePick(scope.scopeKey)"
          >
            <font-awesome-icon icon="arrow-left" class="me-2" />
            <font-awesome-icon :icon="['fas', scope.human ? 'user' : 'user-check']" class="me-auto" />
            <span :class="{ 'fw-bold': scope.bot }">{{ scope.bot?.name ?? scope.human?.name }}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
