<template>
  <div>
    <template v-if="!text">
      <p class="text-warning">
        <font-awesome-icon :icon="['fas', 'notdef']" class="me-2" />
        {{ missingText }}
      </p>
    </template>
    <template v-else>
      <p>
        <NestedSpanComponent
          v-for="bits in textBits"
          :nested-bits="bits"
          :focus="focus"
          @click.stop="focus = bits[0].ref"
        />
        <!--        <span v-for="bit in textBits" :style="bit.style">{{ bit.txt }}</span>-->
      </p>
      <hr />
      <p class="card-text text-muted" :style="columnStyle" v-html="htmlText" />
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import type { PropType } from "vue";
import type { HighlighterModel } from "@/plugins/api/api-core";
import { interfaceSettingsStore } from "@/stores";
import { marked } from "marked";
import { isNone } from "@/util";
import type { OpenTextSpan, TextBit, TextSpan, TextSpanI } from "@/types/items";
import NestedSpanComponent from "@/components/items/NestedSpanComponent.vue";

export default defineComponent({
  name: "TextComponent",
  components: { NestedSpanComponent },
  props: {
    text: {
      type: String,
      required: false,
      default: null,
    },
    html: {
      type: String,
      required: false,
      default: null,
    },
    highlighters: {
      type: Object as PropType<Array<HighlighterModel>>,
      required: false,
      default: undefined,
    },
    missingText: {
      type: String,
      required: false,
      default: "[Text missing]",
    },
  },
  data() {
    return {
      showRaw: false,
      focus: undefined as undefined | string,
    };
  },
  computed: {
    textBits(): TextBit[][] {
      const txt = this.text || "";
      const hlSpans = this.getHighlightSpans(txt);
      const boundaryIndex = this.buildBoundaryIndex(hlSpans);

      const boundaries = Object.keys(boundaryIndex).map(Number);
      boundaries.sort(function (a, b) {
        return a - b;
      });

      if (boundaries && boundaries.length > 0) {
        const openSpans: OpenTextSpan[] = [];
        const ret: TextBit[][] = [];
        let lastCursor = 0;
        if (boundaries[0] > 0) {
          ret.push([{ txt: txt.substring(0, boundaries[0]), openLevel: 0 }]);
        }
        boundaries.forEach((cursor) => {
          if (openSpans.length === 0) {
            ret.push([{ txt: txt.substring(lastCursor, cursor), openLevel: 0 }]);
          } else {
            ret.push(openSpans.map((openSpan) => ({ txt: txt.substring(lastCursor, cursor), ...openSpan })));
          }
          lastCursor = cursor;
          boundaryIndex[cursor].forEach((span) => {
            if (span.type === "start") {
              openSpans.unshift({ openLevel: openSpans.length, ...span });
              // openSpans.sort((a,b) => a.end - b.end)
            } else {
              openSpans.splice(
                openSpans.findIndex((a) => a.ref === span.ref),
                1,
              );
            }
          });
        });
        ret.push([{ txt: txt.substring(lastCursor), openLevel: 0 }]);
        return ret;
      } else {
        return [{ txt: txt, openLevel: 0 }];
      }
    },

    htmlText() {
      if (this.html) return this.html;

      let txt = this.text || "";

      txt = txt.replaceAll("`", "'");
      txt = marked.parse(txt);
      txt = this.applyHighlighters(txt);
      return txt.replaceAll("\n", "<br />");
    },
    columnStyle(): Record<string, string> {
      return interfaceSettingsStore.itemColumnStyle;
    },
  },
  methods: {
    buildBoundaryIndex(spans: TextSpan[]) {
      const index: Record<number, TextSpanI[]> = {};
      spans.forEach(function (span, i) {
        if (!(span.start in index)) index[span.start] = [];
        if (!(span.end in index)) index[span.end] = [];

        const entry = { di: i, ...span };
        index[span.start].push({ type: "start", ...entry });
        index[span.end].push({ type: "end", ...entry });
      });
      let boundary;
      for (boundary in index) {
        index[boundary].sort(function (a, b) {
          if (a.type === "start" && b.type === "start" && !isNone(a.end) && !isNone(b.end)) return b.end - a.end;
          if (a.type === "end" && b.type === "start") return -1;
          if (a.type === "start" && b.type === "end") return 1;
          return 0;
        });
      }
      return index;
    },
    getHighlightSpans(txt: string): TextSpan[] {
      const spans = [] as TextSpan[];
      if (this.highlighters) {
        this.highlighters.forEach((highlighter: HighlighterModel) => {
          try {
            const regex = new RegExp(highlighter.keywords.join("|"), "gid");
            let array;

            while ((array = regex.exec(txt)) !== null) {
              spans.push({
                kind: "hl",
                start: array.indices[0][0],
                end: array.indices[0][1],
                ot: array[0],
                style: highlighter.style,
                ref: crypto.randomUUID(),
              });
            }
          } catch (e) {
            console.warn("Ignoring illegal regex!");
            console.error(e);
          }
        });
      }
      return spans;
    },

    replaceWhitespaces(snippet: string) {
      return snippet
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;")
        .replace(/ /g, '<span class="special-char">·</span>')
        .replace(/\n/g, '<span class="special-char">⤶</span><br />');
    },
    applyHighlighters(txt: string) {
      if (this.highlighters) {
        this.highlighters.forEach((highlighter: HighlighterModel) => {
          try {
            const regex = new RegExp(highlighter.keywords.join("|"), "gi");
            txt = txt.replaceAll(regex, `<span style="${highlighter.style}">$&</span>`);
          } catch (e) {
            console.warn("Ignoring illegal regex!");
            console.error(e);
          }
        });
      }
      return txt;
    },
    iterateColumns() {
      if (!interfaceSettingsStore.itemDisplay.columns) {
        interfaceSettingsStore.itemDisplay.columns = 0;
      }
      interfaceSettingsStore.itemDisplay.columns += 1;

      if (interfaceSettingsStore.itemDisplay.columns > 4) {
        interfaceSettingsStore.itemDisplay.columns = 1;
      }
    },
  },
});
</script>

<style scoped />
