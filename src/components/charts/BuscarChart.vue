<template>
  <div>
    <div ref="chart" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import type { PropType } from "vue";
import { scaleLinear } from "d3-scale";
import { zoom as d3zoom, D3ZoomEvent } from "d3-zoom";
import { axisBottom, axisLeft } from "d3-axis";
import { create as d3create } from "d3-selection";
import { line } from "d3-shape";
import { notNone } from "@/util";

interface Point {
  x: number;
  y: number;
}

export default defineComponent({
  name: "BuscarChart",
  props: {
    buscar: {
      type: Object as PropType<Array<[number, number]>>,
      required: false,
      default: null,
    },
    recall: {
      type: Object as PropType<Record<number, number>>,
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
    const outerWidth = 400;
    const outerHeight = 200;
    const vPad = 35;
    const hPad = 20;
    const height = outerHeight - vPad;
    const width = outerWidth - hPad;

    const tooltip = d3create("div").style("opacity", 0).attr("class", "chart-tooltip");

    const svg = d3create("svg");
    // svg
    const g = svg.append("g").attr("transform", `translate(${vPad}, 0)`);

    const xScale = scaleLinear().domain([0, 100]).range([0, width]);
    const yScale = scaleLinear().domain([1, 0]).range([height, 0]);
    const yScaleNorm = scaleLinear().domain([0, 1]).range([height, 0]);
    const xAxis = axisBottom(xScale).ticks(10);
    const yAxis = axisLeft(yScale).ticks(10);
    const gX = svg.append("g").attr("class", "axis axis--x").attr("transform", `translate(${vPad}, 0)`).call(xAxis);
    const gY = svg.append("g").attr("class", "axis axis--y").attr("transform", `translate(${vPad}, 0)`).call(yAxis);

    const zoom = d3zoom()
      .scaleExtent([1, 40])
      .filter((event: MouseEvent) => {
        event.preventDefault();
        return (!event.ctrlKey || event.type === "wheel") && !event.button;
      })
      .on("zoom", (event: D3ZoomEvent<SVGSVGElement, undefined>) => this.zoomed(event));
    // @ts-expect-error
    svg.call(zoom);
    // @ts-expect-error
    const gBars = g.append("g").on("mouseover", this.mouseIn).on("mouseleave", this.mouseOut);
    const gIncl = g.append("g");
    const gBus = g.append("g");

    svg
      .append("text")
      .attr("text-anchor", "middle")
      .attr("x", "50%")
      .attr("y", "100%")
      .attr("font-size", "11px")
      .text("Number of screened items");
    svg
      .append("text")
      .attr("text-anchor", "end")
      .attr("x", "0")
      .attr("y", "10")
      .attr("font-size", "11px")
      .attr("transform", "rotate(-90)")
      .text("Number of relevant items");
    return {
      containerId: `buscar-${crypto.randomUUID()}`,
      outerWidth,
      vPad,
      hPad,
      tooltip,
      svg,
      g,
      gBars,
      gIncl,
      gBus,
      gX,
      gY,
      xScale,
      yScale,
      yScaleNorm,
      xAxis,
      yAxis,
    };
  },
  mounted() {
    if (this.$refs.chart) {
      const containerObserver = new ResizeObserver((r) => {
        this.outerWidth = Math.max(0, r[0].contentRect.width);
      });
      containerObserver.observe(this.$refs.chart);
      this.$refs.chart.appendChild(this.svg.node() as SVGSVGElement);
      this.$refs.chart.appendChild(this.tooltip.node() as HTMLDivElement);
    }
  },
  methods: {
    mouseIn(e: MouseEvent) {
      // @ts-expect-error
      if (e.target && e.target.classList.contains("bar")) {
        const pos = this.xScale.invert(e.offsetX - this.vPad).toFixed(0);
        let lastBus = 1;
        for (let run = 0; run < this.buscar.length; run++) {
          // console.log(pos, this.buscar[run][0])
          lastBus = this.buscar[run][1];
          if (pos < this.buscar[run][0]) {
            break;
          }
        }
        this.tooltip
          .style("opacity", 1)
          .html(
            `
            Seen: ${pos}<br/>
            Included: ${this.nRelDocs[pos] ?? ""}<br/>
            buscar: ${lastBus}
            `,
          )
          .style("left", e.pageX + 10 + "px")
          .style("top", e.pageY + 10 + "px");
      }
    },
    mouseOut() {
      this.tooltip.style("opacity", 0);
    },
    zoomed(event: D3ZoomEvent<SVGSVGElement, undefined>) {
      //console.log(event)
      this.g.attr("transform", event.transform);
      this.gX.call(this.xAxis.scale(event.transform.rescaleX(this.xScale)));
      this.gY.call(this.yAxis.scale(event.transform.rescaleY(this.yScale)));
    },
    redraw() {
      this.svg //
        .attr("width", this.outerWidth)
        .attr("height", this.outerHeight)
        .attr("viewBox", [0, 0, this.outerWidth, this.outerHeight]);

      this.xScale.range([0, this.width]).domain([0, this.flatLabels.length]);
      this.yScale.range([this.height, 0]).domain([0, this.totalRelDocs]);
      this.yScaleNorm.range([this.height, 0]);

      this.gX.attr("transform", `translate(${this.vPad}, ${this.height})`).call(this.xAxis);
      this.gY.call(this.yAxis);

      this.gBars
        .selectAll("rect")
        .data(this.flatLabels)
        .join("rect")
        .attr("class", "bar")
        .attr("x", (_: number, i: number) => this.xScale(i) ?? 0)
        .attr("y", 0)
        .attr("width", this.xScale(1) - this.xScale(0) ?? 1)
        .attr("height", this.yScale(0) - this.yScale(this.totalRelDocs))
        .attr("fill", (d: number) => (d > 0 ? "green" : "red"))
        .attr("opacity", 1);

      this.gIncl.selectAll("path").remove();
      this.gIncl
        .append("path")
        .datum(this.nRelDocs)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
        .attr(
          "d",
          line()
            .x((_, i: number) => this.xScale(i))
            // @ts-expect-error
            .y((d: number) => this.yScale(d)),
        );
      this.gBus.selectAll("path").remove();
      // this.gBus
      //   .append("path")
      //   .datum(this.recalls)
      //   .attr("fill", "none")
      //   .attr("stroke", "black")
      //   .attr("stroke-width", 1)
      //   .attr(
      //     "d",
      //     line()
      //       .x((d: Point) => this.xScale(d.x))
      //       .y((d: Point) => this.yScaleNorm(d.y)),
      //   );
      this.gBus
        .append("path")
        .datum(this.buscars)
        .attr("fill", "none")
        .attr("stroke", "black")
        .attr("stroke-width", 3)
        .attr(
          "d",
          line()
            // @ts-expect-error
            .x((d: Point) => this.xScale(d.x))
            // @ts-expect-error
            .y((d: Point) => this.yScaleNorm(d.y)),
        );
    },
  },
  computed: {
    width(): number {
      return this.outerWidth - this.hPad;
    },
    outerHeight(): number {
      return this.width / 2.75;
    },
    height(): number {
      return this.outerHeight - this.vPad;
    },
    flatLabels(): Array<number> {
      if (!this.labels) return [];
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
      let counter = 0;
      return this.flatLabels.map((value: number) => {
        counter += value;
        return counter;
      });
    },
    totalRelDocs(): number {
      if (this.nRelDocs.length === 0) return 1;
      return Math.max(1, this.nRelDocs[this.nRelDocs.length - 1]);
    },
    recalls(): Array<Point> {
      return Object.entries<number>(this.recall)
        .map(([key, value]) => ({ x: Number.parseInt(key), y: value }) as Point)
        .filter((e: Point) => notNone(e.y));
    },
    buscars(): Array<Point> {
      return this.buscar //
        .map((d: [number, number]) => ({ x: d[0], y: d[1] }))
        .filter((e: Point) => notNone(e.y));
    },
  },
  watch: {
    height: {
      immediate: true,
      handler() {
        this.redraw();
      },
    },
    flatLabels: {
      immediate: true,
      handler() {
        this.redraw();
      },
    },
  },
});
</script>

<style>
.chart-tooltip {
  position: absolute;
  background-color: white;
  border: 2px solid;
  border-radius: 5px;
  padding: 5px;
}
</style>
