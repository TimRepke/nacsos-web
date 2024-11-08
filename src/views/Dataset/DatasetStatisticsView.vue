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

<script lang="ts">
import { defineComponent } from "vue";
import { Bar } from "vue-chartjs";
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from "chart.js";
import { API, ignore } from "@/plugins/api";
import { currentProjectStore } from "@/stores";
import type { BasicProjectStats, HistogramEntry, RankEntry } from "@/plugins/api/types";

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

export default defineComponent({
  name: "DatasetStatisticsView",
  components: { Bar },
  data() {
    return {
      basic: undefined as BasicProjectStats | undefined,
      leaderboard: undefined as Array<RankEntry> | undefined,
      histogramYears: undefined as Array<HistogramEntry> | undefined,
    };
  },
  mounted() {
    API.stats
      .getBasicStatsApiStatsBasicsGet({ xProjectId: currentProjectStore.projectId as string })
      .then((response) => {
        this.basic = response.data;
      })
      .catch(ignore);
    API.stats
      .getAnnotatorRankingApiStatsRankGet({ xProjectId: currentProjectStore.projectId as string })
      .then((response) => {
        this.leaderboard = response.data;
      })
      .catch(ignore);
    API.stats
      .getPublicationYearHistogramApiStatsHistogramYearsGet({ xProjectId: currentProjectStore.projectId as string })
      .then((response) => {
        this.histogramYears = response.data;
      })
      .catch(ignore);
  },
  methods: {
    // pass
  },
  computed: {
    histogramChart() {
      if (this.histogramYears) {
        return {
          chartData: {
            labels: this.histogramYears.map((entry: HistogramEntry) => entry.bucket.substring(0, 4)),
            datasets: [{ data: this.histogramYears.map((entry: HistogramEntry) => entry.num_items), label: "Items" }],
          },
          chartOptions: {
            responsive: true,
          },
        };
      }
      return undefined;
    },
  },
});
</script>

<style scoped></style>
