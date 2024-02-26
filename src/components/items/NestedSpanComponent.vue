<template>
  <span
      :style="bitStyle"
     :class="{ inFocus: focus && focus === bit?.ref }">
    <template v-if="isLeaf && bit">{{ bit.txt }}</template>
    <NestedSpanComponent
      v-if="!isLeaf && nestedBits"
      :nested-bits="nestedBits.slice(1)"
      :depth="currentDepth"
      :focus="focus"
    />
  </span>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import type { PropType } from "vue";
import type { TextBit } from "@/types/items";
import { isNone } from "@/util";

export default defineComponent({
  name: "NestedSpanComponent",
  props: {
    nestedBits: {
      type: Object as PropType<TextBit[]>,
      required: true,
    },
    depth: {
      type: Number,
      required: false,
      default: undefined,
    },
    focus: {
      type: String,
      required: false,
      default: undefined,
    },
  },
  data() {
    return {};
  },
  computed: {
    bitStyle(): string | undefined {
      if (this.bit) {
        const levelDiff = this.bit.openLevel - 1;
        console.log(this.bit.openLevel, this.currentDepth, levelDiff, this.bit.txt);
        let addStyle = "";
        if (levelDiff >= 0) {
          const pad = (levelDiff + 1) * 4;
          addStyle = `padding: ${pad}px 0 ${pad}px 0;`;

        }
        if (this.bit.style) {
          return this.bit.style + addStyle;
        }
        return addStyle;
      }
      return undefined;
    },
    bit(): TextBit | undefined {
      if (!this.nestedBits || this.nestedBits.length < 1) return undefined;
      return this.nestedBits[0];
    },
    isLeaf(): boolean {
      return this.nestedBits && this.nestedBits.length <= 1;
    },
    currentDepth(): number {
      if (!this.nestedBits) return 0;
      if (isNone(this.depth)) return this.nestedBits.length;
      return this.depth;
    },
  },
});
</script>

<style scoped>
.inFocus {
  /*box-shadow: 0 2px 0 0 red;*/
  border-top: 2px dashed red;
  border-bottom: 2px dashed red;
}
</style>
