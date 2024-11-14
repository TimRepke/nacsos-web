<template>
  <div>
    <h1>Project statistics</h1>
    <div class="row g-2">
      <!-- Basic stats -->
      <div class="col-md-4">
        <div v-if="basic" class="card">
          <div class="card-body">
            <h5 class="card-title">
              <font-awesome-icon :icon="['fas', 'cubes-stacked']" class="me-2" />
              Core stats
            </h5>
            <p class="card-text">
              This project contains {{ basic.num_items }} items imported via {{ basic.num_imports }} imports. There are
              {{ basic.num_schemes }} annotation schemes and {{ basic.num_scopes }} assignment scopes amounting to a
              total of {{ basic.num_labels }} labels for
              {{ basic.num_labeled_items }}
              <span class="fst-italic">({{ ((basic.num_labeled_items / basic.num_items) * 100).toFixed(2) }}%)</span>
              unique documents.
            </p>
          </div>
        </div>
      </div>

      <!-- Leaderboard -->
      <div class="col-md-4">
        <div v-if="leaderboard" class="card">
          <div class="card-body">
            <h5 class="card-title">
              <font-awesome-icon :icon="['fas', 'ranking-star']" class="me-2" />
              Annotator Leaderboard
            </h5>
            <ol>
              <li v-for="entry in leaderboard" :key="entry.user_id">
                <strong>{{ entry.full_name }}:</strong>&nbsp;
                <span class="fst-italic"> {{ entry.num_labels }} labels for {{ entry.num_labeled_items }} items </span>
              </li>
            </ol>
          </div>
        </div>
      </div>

      <!-- Label counts -->
      <div class="col-md-4">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">
              <font-awesome-icon :icon="['fas', 'tags']" class="me-2" />
              Number of items per label
            </h5>
            <LabelStats />
          </div>
        </div>
      </div>

      <!-- Histogram over years -->
      <div class="col-md-4">
        <div v-if="histogramChart" class="card">
          <div class="card-body">
            <h5 class="card-title">
              <font-awesome-icon :icon="['fas', 'calendar-week']" class="me-2" />
              Histogram
            </h5>
            <Bar id="publication-year-chart" :options="histogramChart.chartOptions" :data="histogramChart.chartData" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { Bar } from "vue-chartjs";
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from "chart.js";
import { API, ignore } from "@/plugins/api";
import { currentProjectStore } from "@/stores";
import type { BasicProjectStats, HistogramEntry, RankEntry } from "@/plugins/api/types";
import LabelStats from "@/components/annotations/LabelStats.vue";

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const basic = ref<BasicProjectStats | null>(null);
const leaderboard = ref<Array<RankEntry> | null>(null);
const histogramYears = ref<Array<HistogramEntry> | null>(null);

const histogramChart = computed(() => {
  if (!histogramYears.value) return null;
  return {
    chartData: {
      labels: histogramYears.value.map((entry: HistogramEntry) => entry.bucket.substring(0, 4)),
      datasets: [{ data: histogramYears.value.map((entry: HistogramEntry) => entry.num_items), label: "Items" }],
    },
    chartOptions: {
      responsive: true,
    },
  };
});
onMounted(() => {
  API.stats
    .getBasicStatsApiStatsBasicsGet({ xProjectId: currentProjectStore.projectId as string })
    .then((response) => {
      basic.value = response.data;
    })
    .catch(ignore);
  API.stats
    .getAnnotatorRankingApiStatsRankGet({ xProjectId: currentProjectStore.projectId as string })
    .then((response) => {
      leaderboard.value = response.data;
    })
    .catch(ignore);
  API.stats
    .getPublicationYearHistogramApiStatsHistogramYearsGet({ xProjectId: currentProjectStore.projectId as string })
    .then((response) => {
      histogramYears.value = response.data;
    })
    .catch(ignore);
});
</script>

<style scoped></style>
