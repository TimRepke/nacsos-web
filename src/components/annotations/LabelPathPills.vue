<template>
  <div
    v-for="skey in labelPath"
    :key="skey.key"
    class="nacsos-tooltip label-pill d-flex flex-nowrap justify-content-end"
  >
    <span>{{ skey.key }}</span>
    <span v-if="skey.value !== null && skey.value !== undefined" class="text-muted small"> ({{ skey.value }}) </span>
    <span>{{ skey.repeat }}</span>
    <template v-if="schemeLookup && schemeLookup[skey.key]">
      <div
        class="nacsos-tooltiptext popover bs-popover-auto show bg-light p-0"
        style="position: absolute; right: 0; margin: 0.5rem 0 0 0"
        role="tooltip"
        data-popper-placement="bottom"
      >
        <div class="popover-arrow" style="position: absolute; right: 0; transform: translateX(-30px)" />
        <h3 class="popover-header text-dark">{{ schemeLookup[skey.key].name }}</h3>
        <div class="popover-body">
          Type: {{ schemeLookup[skey.key].kind }}
          <template v-if="hasChoices(labelChoices)">
            <ul class="list-unstyled">
              <li v-for="choice in schemeLookup[skey.key].choices" :key="choice.value">
                <strong>{{ choice.value }}:</strong> {{ choice.name }}
              </li>
            </ul>
          </template>
        </div>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import type { PropType } from "vue";
import type { FlatLabelChoice, Label } from "@/plugins/api/types";
import { FlatLabel, FlattenedAnnotationSchemeLabel } from "@/plugins/api/types";

export default defineComponent({
  name: "LabelPathPills",
  props: {
    label: {
      type: Object as PropType<FlatLabel | Label[]>,
      required: true,
    },
    schemeLookup: {
      type: Object as PropType<Record<string, FlattenedAnnotationSchemeLabel>>,
      required: false,
      default: undefined,
    },
  },
  methods: {
    hasChoices(value: FlatLabelChoice[] | undefined | null) {
      return value !== undefined && value !== null && Array.isArray(value) && value.length > 0;
    },
  },
  computed: {
    labelPath(): Label[] {
      if ("path" in this.label) return this.label.path.slice().reverse();
      return this.label;
    },
    labelChoices(): Array<FlatLabelChoice> | null {
      if ("choices" in this.label && this.label.choices) return this.label.choices;
      return null;
    },
  },
});
</script>

<style scoped>
.label-pill {
  /*display: block !important;*/
}

.label-pill > span {
  font-weight: normal;
  font-size: 0.7em;
  border-top: 1px solid var(--bs-gray-500);
  border-bottom: 1px solid var(--bs-gray-500);
  padding-top: 0.2em;
  padding-bottom: 0.2em;
}

.label-pill > span:first-child {
  border: 1px solid var(--bs-gray-500);
  border-right: 0;
  border-top-left-radius: var(--bs-border-radius-pill);
  border-bottom-left-radius: var(--bs-border-radius-pill);
  padding-left: 0.5em;
  padding-right: 0.1em;
}

.label-pill > span:last-of-type {
  border: 1px solid var(--bs-gray-500);
  border-top-right-radius: var(--bs-border-radius-pill);
  border-bottom-right-radius: var(--bs-border-radius-pill);
  background-color: var(--bs-gray-300);
  padding-left: 0.2em;
  padding-right: 0.5em;
}
</style>
