<template>
  <div :id="containerId" />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import type { PropType } from "vue";
import embed from "vega-embed";
import type { TopLevelSpec as VlSpec } from "vega-lite";

interface Point {
  x: number;
  y: number;
}

export default defineComponent({
  name: "BuscarChart",
  props: {
    buscar: {
      type: Object as PropType<Array<Point>>,
      required: false,
      default: null,
    },
    recall: {
      type: Object as PropType<Array<Point>>,
      required: false,
      default: null,
    },
    labels: {
      type: Object as PropType<Array<Array<number>>>,
      required: false,
      default: null,
    },
  },
  data() {
    return {
      containerId: `vega-${crypto.randomUUID()}`,
      // view: null as null | vega.View,
    };
  },
  mounted() {
    const elem = document.getElementById(this.containerId);
    if (elem) {
      embed(elem, this.vegaConfig);
    }
  },
  computed: {
    flatLabels(): Array<number> | null {
      if (!this.labels) return null;
      return this.labels.flatMap((labels: Array<number>) => labels);
    },
    batchBorders(): Array<number> | null {
      if (!this.labels) return null;
      let counter = 0;
      return this.labels.map((labels: Array<number>) => {
        counter += labels.length;
        return counter;
      });
    },
    nRelDocs(): Array<number> {
      if (this.flatLabels) {
        let counter = 0;
        return this.flatLabels.map((value: number) => {
          counter += value;
          return counter;
        });
      }
      return [];
    },
    vegaConfig(): VlSpec | null {
      const spec: VlSpec = {
        $schema: "https://vega.github.io/schema/vega-lite/v5.json",
        description: "Plot",
        height: 200,
        width: 500,
        data: null,
        encoding: {
          x: {
            type: "quantitative",
            field: "x",
            title: "Number of samples",
          },
        },
        layer: [
          {
            mark: "rule",
            encoding: {
              color: {
                condition: { value: "green", test: { field: "rel", equal: 1 } },
                value: "red",
              },
              strokeWidth: { value: 10 },
              opacity: { value: 0.2 },
            },
            transform: [],
          },
          {
            encoding: {
              y: {
                type: "quantitative",
                field: "nRel",
                title: "Number of relevant documents",
                axis: { titleColor: "#ea7b7b" },
              },
            },
            layer: [
              { mark: { type: "line", interpolate: "monotone", color: "#ea7b7b" } },
              { transform: [{ filter: { param: "hover", empty: false } }], mark: { type: "point", color: "#ea7b7b" } },
            ],
          },
          {
            encoding: {
              y: {
                type: "quantitative",
                field: "buscar",
                title: "Stopping criterion (Buscar)",
                scale: { domain: [0, 1] },
                axis: { titleColor: "#85A9C5" },
              },
            },
            layer: [
              { mark: { stroke: "#85A9C5", type: "line", interpolate: "monotone" } },
              { transform: [{ filter: { param: "hover", empty: false } }], mark: "point" },
            ],
          },
          {
            mark: "rule",
            encoding: {
              opacity: {
                condition: { value: 0.3, param: "hover", empty: false },
                value: 0,
              },
              tooltip: [
                { field: "x", type: "quantitative", title: "Number of seen documents" },
                { field: "nRel", type: "quantitative", title: "Number of relevant documents seen" },
                { field: "buscar", type: "quantitative", title: "Buscar score" },
              ],
            },
            params: [
              {
                name: "hover",
                select: {
                  type: "point",
                  fields: ["x"],
                  nearest: true,
                  on: "mouseover",
                  clear: "mouseout",
                },
              },
            ],
          },
        ],
        resolve: { scale: { y: "independent" } },
      };

      // Populate dataframe with cumulative number of relevant docs and relevance annotation
      // Also add buscar scores to dataframe, fill empty values with the last seen value
      const buscarLookup = Object.fromEntries(this.buscar ?? []);
      let lastBuscar: number | undefined = undefined;
      const data = Object.fromEntries(
        this.nRelDocs.map((entry: number, idx: number) => {
          if (buscarLookup[idx] !== null && buscarLookup[idx] !== undefined) {
            lastBuscar = buscarLookup[idx];
          }
          return [idx + 1, { x: idx + 1, nRel: entry, rel: this.flatLabels[idx], buscar: lastBuscar }];
        }),
      );

      spec.data = { values: Object.values(data) };

      // Add rules for where the batches are
      this.batchBorders?.forEach((boundary: number) => {
        spec.layer.push({
          mark: {
            type: "rule",
            color: "black",
            strokeWidth: 1,
          },
          encoding: {
            x: {
              datum: boundary,
              type: "quantitative",
            },
            x2: { datum: boundary },
            y: {
              datum: 0,
              type: "quantitative",
            },
            y2: { datum: 1 },
          },
        });
      });

      return spec;
    },
  },
});
</script>

<style scoped></style>
