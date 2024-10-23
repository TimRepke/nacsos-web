<script setup lang="ts">
import { currentProjectStore, interfaceSettingsStore } from "@/stores";
import RefreshIcon from "@/components/RefreshIcon.vue";

if (!interfaceSettingsStore.highlighters.active[currentProjectStore.projectId as string]) {
  // make sure that we at least have an empty list for the project
  interfaceSettingsStore.highlighters.active[currentProjectStore.projectId as string] = [];
}
</script>

<template>
  <li class="dropdown">
    <a
      class="nav-link dropdown-toggle"
      type="button"
      style="line-height: 1.5em"
      data-bs-toggle="dropdown"
      data-bs-auto-close="outside"
      aria-expanded="false"
    >
      <font-awesome-icon class="me-1 mb-1" style="vertical-align: middle" :icon="['fas', 'highlighter']" />
      Highlighters
    </a>
    <ul class="dropdown-menu">
      <li class="dropdown-item">
        <div class="form-check form-switch">
          <input
            class="form-check-input"
            type="checkbox"
            role="switch"
            id="highlighter-switch"
            v-model="interfaceSettingsStore.highlighters.enabled"
          />
          <label class="form-check-label" for="highlighter-switch">Apply highlighters</label>
        </div>
      </li>
      <li class="dropdown-item">
        <RefreshIcon :refresh="currentProjectStore.projectHighlighters.reload" class="me-2" />
        Reload highlighters
      </li>
      <li>
        <hr class="dropdown-divider" />
      </li>
      <li>
        <h6 class="dropdown-header">
          <font-awesome-icon :icon="['fas', 'book-bookmark']" class="me-2" />
          Project highlighters
        </h6>
      </li>
      <li
        class="dropdown-item"
        v-for="hl in currentProjectStore.projectHighlighters.value"
        v-bind:key="hl.highlighter_id"
      >
        <div class="form-check">
          <input
            class="form-check-input"
            type="checkbox"
            v-model="interfaceSettingsStore.highlighters.active[currentProjectStore.projectId]"
            :id="hl.highlighter_id"
            :value="hl.highlighter_id"
          />
          <label class="form-check-label" :for="hl.highlighter_id"> {{ hl.name }} </label>
        </div>
      </li>
    </ul>
  </li>
</template>
