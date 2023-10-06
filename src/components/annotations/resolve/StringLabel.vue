<template>
  <div>
    <textarea
      v-if="notNone(proposalRow)"
      class="form-control"
      :id="`txt-${label.path_key}-${itemId}`"
      :aria-label="label.name"
      rows="3"
      :value="val"
      @change="setBotAnnotation($event.target?.value)"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import type { PropType } from "vue";
import type { FlatLabel, ResolutionCell, BotAnnotationModel } from "@/plugins/api/api-core";
import { is, isNone, notNone } from "@/util";

export default defineComponent({
  name: "StringLabel",
  data() {
    return {
      // set to true when bot annotation was manipulated
      changed: false,
    };
  },
  emits: ["botAnnotationChanged"],
  props: {
    itemId: { type: String, required: true },
    label: {
      type: Object as PropType<FlatLabel>,
      required: true,
    },
    proposalRow: {
      type: Object as PropType<Record<string, ResolutionCell>>,
      required: true,
    },
  },
  methods: {
    notNone,
    annotation2icon(val: boolean | undefined): string {
      if (val === undefined) return "question";
      return val ? "check" : "xmark";
    },
    annotation2classes(val: boolean | undefined): string[] {
      if (val === undefined) return ["bg-light", "text-dark"];
      return val ? ["bg-success", "text-light"] : ["bg-danger", "text-light"];
    },
    setBotAnnotation(value: string | undefined | null) {
      const { resolution } = this.proposalRow[this.label.path_key];
      if (is<BotAnnotationModel>(resolution)) {
        resolution.value_str = value;
        this.$emit("botAnnotationChanged", resolution);
        this.changed = true;
      }
    },
  },
  computed: {
    val(): string | undefined {
      const { resolution } = this.proposalRow[this.label.path_key];
      if (isNone(resolution) || isNone(resolution.value_str)) return undefined;
      return resolution.value_str;
    },
  },
});
</script>
