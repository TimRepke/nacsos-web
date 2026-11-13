<template>
  <div>
    <div ref="chart" />
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref, watch } from "vue";
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

defineOptions({ name: "BuscarChart" });

const props = defineProps({
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
});

const chart = ref<HTMLElement | null>(null);

const outerWidth = ref(400);
const vPad = 35;
const hPad = 20;
// initial geometry used to seed the scales, mirroring the original data() locals
const initialOuterHeight = 200;
const initialHeight = initialOuterHeight - vPad;
const initialWidth = outerWidth.value - hPad;

const tooltip = d3create("div").style("opacity", 0).attr("class", "chart-tooltip");

const svg = d3create("svg");
// svg
const g = svg.append("g").attr("transform", `translate(${vPad}, 0)`);

const xScale = scaleLinear().domain([0, 100]).range([0, initialWidth]);
const yScale = scaleLinear().domain([1, 0]).range([initialHeight, 0]);
const yScaleNorm = scaleLinear().domain([0, 1]).range([initialHeight, 0]);
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
  .on("zoom", (event: D3ZoomEvent<SVGSVGElement, undefined>) => zoomed(event));
// @ts-expect-error
svg.call(zoom);
const gBars = g.append("g").on("mouseover", mouseIn).on("mouseleave", mouseOut);
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

onMounted(() => {
  if (chart.value) {
    const containerObserver = new ResizeObserver((r) => {
      outerWidth.value = Math.max(0, r[0].contentRect.width);
    });
    containerObserver.observe(chart.value);
    chart.value.appendChild(svg.node() as SVGSVGElement);
    chart.value.appendChild(tooltip.node() as HTMLDivElement);
  }
});

function mouseIn(e: MouseEvent) {
  // @ts-expect-error
  if (e.target && e.target.classList.contains("bar")) {
    // the original compared/indexed this string value against numbers unchecked
    const pos = xScale.invert(e.offsetX - vPad).toFixed(0) as unknown as number;
    let lastBus = 1;
    for (let run = 0; run < props.buscar.length; run++) {
      // console.log(pos, props.buscar[run][0])
      lastBus = props.buscar[run][1];
      if (pos < props.buscar[run][0]) {
        break;
      }
    }
    tooltip
      .style("opacity", 1)
      .html(
        `
        Seen: ${pos}<br/>
        Included: ${nRelDocs.value[pos] ?? ""}<br/>
        buscar: ${lastBus}
        `,
      )
      .style("left", e.pageX + 10 + "px")
      .style("top", e.pageY + 10 + "px");
  }
}
function mouseOut() {
  tooltip.style("opacity", 0);
}
function zoomed(event: D3ZoomEvent<SVGSVGElement, undefined>) {
  //console.log(event)
  // d3 stringifies the transform value when setting the attribute
  g.attr("transform", event.transform as unknown as string);
  gX.call(xAxis.scale(event.transform.rescaleX(xScale)));
  gY.call(yAxis.scale(event.transform.rescaleY(yScale)));
}
function redraw() {
  svg //
    .attr("width", outerWidth.value)
    .attr("height", outerHeight.value)
    .attr("viewBox", [0, 0, outerWidth.value, outerHeight.value]);

  xScale.range([0, width.value]).domain([0, flatLabels.value.length]);
  yScale.range([height.value, 0]).domain([0, totalRelDocs.value]);
  yScaleNorm.range([height.value, 0]);

  gX.attr("transform", `translate(${vPad}, ${height.value})`).call(xAxis);
  gY.call(yAxis);

  gBars
    .selectAll("rect")
    .data(flatLabels.value)
    .join("rect")
    .attr("class", "bar")
    .attr("x", (_: number, i: number) => xScale(i) ?? 0)
    .attr("y", 0)
    .attr("width", xScale(1) - (xScale(0) ?? 1))
    .attr("height", yScale(0) - yScale(totalRelDocs.value))
    .attr("fill", (d: number) => (d > 0 ? "green" : "red"))
    .attr("opacity", 1);

  gIncl.selectAll("path").remove();
  gIncl
    .append("path")
    .datum(nRelDocs.value)
    .attr("fill", "none")
    .attr("stroke", "steelblue")
    .attr("stroke-width", 1.5)
    .attr(
      "d",
      line()
        .x((_, i: number) => xScale(i))
        // @ts-expect-error
        .y((d: number) => yScale(d)) as unknown as string,
    );
  gBus.selectAll("path").remove();
  // gBus
  //   .append("path")
  //   .datum(recalls.value)
  //   .attr("fill", "none")
  //   .attr("stroke", "black")
  //   .attr("stroke-width", 1)
  //   .attr(
  //     "d",
  //     line()
  //       .x((d: Point) => xScale(d.x))
  //       .y((d: Point) => yScaleNorm(d.y)),
  //   );
  gBus
    .append("path")
    .datum(buscars.value)
    .attr("fill", "none")
    .attr("stroke", "black")
    .attr("stroke-width", 3)
    .attr(
      "d",
      line()
        // @ts-expect-error
        .x((d: Point) => xScale(d.x))
        // @ts-expect-error
        .y((d: Point) => yScaleNorm(d.y)) as unknown as string,
    );
}

const width = computed<number>(() => {
  return outerWidth.value - hPad;
});
const outerHeight = computed<number>(() => {
  return width.value / 2.75;
});
const height = computed<number>(() => {
  return outerHeight.value - vPad;
});
const flatLabels = computed<Array<number>>(() => {
  if (!props.labels) return [];
  return props.labels.flatMap((labels: Array<number>) => labels);
});
const nRelDocs = computed<Array<number>>(() => {
  let counter = 0;
  return flatLabels.value.map((value: number) => {
    counter += value;
    return counter;
  });
});
const totalRelDocs = computed<number>(() => {
  if (nRelDocs.value.length === 0) return 1;
  return Math.max(1, nRelDocs.value[nRelDocs.value.length - 1]);
});
const buscars = computed<Array<Point>>(() => {
  return props.buscar //
    .map((d: [number, number]) => ({ x: d[0], y: d[1] }))
    .filter((e: Point) => notNone(e.y));
});

watch(
  height,
  () => {
    redraw();
  },
  { immediate: true },
);
watch(
  flatLabels,
  () => {
    redraw();
  },
  { immediate: true },
);
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
