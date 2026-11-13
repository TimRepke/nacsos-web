<template>
  <div>
    <h2>Search OpenAlex (Solr)</h2>

    <div class="row mx-auto">
      <div class="accordion">
        <div class="accordion-item">
          <h2 class="accordion-header">
            <button
              class="accordion-button"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#resolve-config"
              aria-expanded="true"
              aria-controls="resolve-config"
            >
              Query setup
            </button>
          </h2>
          <div id="resolve-config" class="accordion-collapse collapse show">
            <div class="accordion-body">
              <div class="row">
                <div class="col text-end">
                  <textarea v-model="query" class="form-control" aria-label="Query" rows="3" placeholder="Query" />
                  <span role="button" tabindex="-1" class="link-secondary me-2" @click="showTokenExpandModal = true">
                    <font-awesome-icon :icon="['fas', 'arrow-down-a-z']" />Tokens
                  </span>
                  <a
                    href="https://nacsos.pik-potsdam.de/documentation/user/import/openalex/"
                    target="_blank"
                    class="link-secondary"
                    style="text-decoration: none"
                    rel="noopener noreferrer"
                  >
                    <font-awesome-icon :icon="['fas', 'circle-question']" />
                    Help</a
                  >
                </div>
              </div>

              <div class="row" v-if="advanced">
                <div class="col">
                  <textarea
                    v-model="params"
                    class="form-control"
                    aria-label="Params"
                    rows="3"
                    placeholder="Params"
                    :class="{ 'is-invalid': v$.params.$invalid }"
                  />
                  <div class="invalid-feedback d-block" v-if="v$.params.$invalid">
                    {{ errorsToString(v$.params) }}
                  </div>
                </div>
              </div>

              <div class="row mt-2">
                <div class="col-12" :class="{ 'col-sm-8': histogramChart }">
                  <div class="row mt-2">
                    <div class="col-6 col-sm-auto">
                      <label for="op" class="form-label">OP</label>
                      <select class="form-select form-select form-select-sm" v-model="op" id="op">
                        <option value="AND">AND</option>
                        <option value="OR">OR</option>
                      </select>
                    </div>

                    <div class="col-6 col-sm-auto">
                      <label for="qfield" class="form-label">Field</label>
                      <select class="form-select form-select form-select-sm" v-model="field" id="qfield">
                        <option value="title">title</option>
                        <option value="abstract">abstract</option>
                        <option value="title_abstract">title_abstract</option>
                      </select>
                    </div>

                    <div class="col-6 col-sm-auto">
                      <label for="defType" class="form-label">Parser</label>
                      <select class="form-select form-select form-select-sm" v-model="defType" id="defType">
                        <option value="lucene">lucene</option>
                        <option value="dismax">dismax</option>
                        <option value="edismax">edismax</option>
                      </select>
                    </div>

                    <div class="col-6 col-sm-auto">
                      <label for="includeXPAC" class="form-label">Advanced</label>
                      <div class="mb-2">
                        <input id="includeXPAC" v-model="includeXPAC" class="form-check-input me-2" type="checkbox" />
                        <label for="includeXPAC" class="form-check-label">Include XPAC</label>
                      </div>
                      <div class="mb-2">
                        <input id="editParams" v-model="advanced" class="form-check-input me-2" type="checkbox" />
                        <label for="editParams" class="form-check-label">Show override params</label>
                      </div>
                    </div>

                    <div class="col-6 col-sm-auto ms-auto">
                      <label for="limit" class="form-label">Limit</label>
                      <input
                        type="number"
                        class="form-control form-control-sm"
                        placeholder="Limit"
                        aria-label="Limit"
                        id="limit"
                        v-model="limit"
                      />
                    </div>
                    <div class="col-6 col-sm-auto">
                      <label for="offset" class="form-label">Offset</label>
                      <div class="d-flex">
                        <div>
                          <input
                            type="number"
                            class="form-control form-control-sm"
                            placeholder="Offset"
                            aria-label="Offset"
                            id="offset"
                            v-model="offset"
                          />
                        </div>
                        <div class="d-flex flex-column text-muted" style="font-size: 0.7em">
                          <div class="m-auto" role="button" @click="paginate(limit)" tabindex="-1">+{{ limit }}</div>
                          <div class="m-auto" role="button" @click="paginate(-limit)" tabindex="-1">-{{ limit }}</div>
                        </div>
                      </div>
                    </div>
                    <div class="col-6 col-sm-auto">
                      <div class="mb-2">
                        <input id="includeHistogram" v-model="hist" class="form-check-input me-2" type="checkbox" />
                        <label for="includeHistogram" class="form-check-label"> Histogram </label>
                      </div>
                      <div class="d-flex">
                        <input
                          type="number"
                          class="form-control form-control-sm me-1 flex-shrink-0"
                          style="width: 5em"
                          placeholder="Start"
                          aria-label="Histogram start"
                          id="histStart"
                          v-model="histStart"
                        />
                        –
                        <input
                          type="number"
                          class="form-control form-control-sm ms-1 flex-shrink-0"
                          style="width: 5em"
                          placeholder="End"
                          aria-label="Histogram end"
                          id="histEnd"
                          v-model="histEnd"
                        />
                      </div>
                    </div>
                  </div>
                  <div class="row mt-2">
                    <div class="col-auto">
                      <button type="button" class="btn btn-outline-success" @click="runSearch">Query</button>
                    </div>
                    <div class="col-auto text-muted align-text-bottom" v-if="nDocs !== null && qTime !== null">
                      Found {{ nDocs.toLocaleString("en") }} works in {{ qTime }}ms
                    </div>
                  </div>
                </div>
                <div class="col-12 col-md-4 align-content-end" v-if="histogramChart">
                  <Bar
                    id="publication-year-chart"
                    :options="histogramChart.chartOptions"
                    :data="histogramChart.chartData"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="row mt-2">
      <div class="d-flex flex-row flex-wrap p-2 overflow-auto">
        <template v-if="results && results.length > 0">
          <AcademicItemComponent v-for="item in results" :key="item.item_id" :item="item" />
        </template>
        <template v-else> No results (yet).</template>
      </div>
    </div>

    <div v-if="showTokenExpandModal">
      <div class="modal fade show d-block" tabindex="-1">
        <div class="modal-dialog modal-lg">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Token Wildcard Expansion</h5>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                @click="showTokenExpandModal = false"
              />
            </div>
            <div class="modal-body text-start ps-4 pe-4">
              <div class="row mb-3 g-2 text-muted">
                <p>
                  Wildcards (e.g. <code>clim*</code>) are very bad for query performance and add a lot of uncertainty.
                  It is much better to explicitly expand those (e.g. <code>(climate OR climatic)</code>) and in the
                  process exclude false-positives like <code>climb, climax, ...</code><br />
                  Results include term frequency (ttf) and document frequency (df).
                </p>
                <!--<p>
                  Use this token prefix search to find possible matches.
                  Do not include the <code>*</code> and note, that this can only be used for prefixes,
                  not infixes (e.g. <code>cli*te</code>), postfixes (<code>*flux</code>), or n-grams.
                </p>-->
              </div>
              <div class="row mb-3 g-2">
                <div class="input-group mb-3">
                  <input
                    type="text"
                    v-model="tokenSearchPrefix"
                    class="form-control"
                    placeholder="Prefix without the *"
                    aria-label="Prefix without the *"
                    @keyup.enter="expandTokens"
                  />
                  <button
                    class="btn btn-outline-secondary"
                    type="button"
                    id="button-token-search"
                    @click="expandTokens"
                  >
                    <font-awesome-icon :icon="['fas', 'magnifying-glass']" />
                  </button>
                </div>
              </div>

              <div class="row mb-3 g-2">
                <div v-for="token in tokenSearchResult" :key="token.term" class="col-4">
                  <code>{{ token.term }}</code>
                  <span class="text-muted small" style="white-space: nowrap">
                    ({{ token.ttf.toLocaleString("en") }} | {{ token.df.toLocaleString("en") }})
                  </span>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-success" @click="showTokenExpandModal = false">Done.</button>
            </div>
          </div>
        </div>
      </div>
      <div class="modal-backdrop fade show" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, computed, watch } from "vue";
import useVuelidate from "@vuelidate/core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { Bar } from "vue-chartjs";
import { BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title, Tooltip } from "chart.js";
import type { ChartOptions, ChartData } from "chart.js";
import type { AcademicItemModel, TermStats } from "@/plugins/api/types";
import { currentProjectStore } from "@/stores";
import { EventBus } from "@/plugins/events";
import { ToastEvent } from "@/plugins/events/events/toast";
import { API } from "@/plugins/api";
import AcademicItemComponent from "@/components/items/AcademicItem.vue";
import { isJSON, errorsToString } from "@/util/validators";

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

defineOptions({ name: "OpenAlexSearchView" });

interface ChartInfo {
  chartData: ChartData;
  chartOptions: ChartOptions;
}

type DefType = "edismax" | "lucene" | "dismax";
type SearchField = "title" | "abstract" | "title_abstract";
type OpType = "OR" | "AND";

const query = ref("");
const limit = ref(20);
const offset = ref(0);
const op = ref<OpType>("AND");
const defType = ref<DefType>("lucene");
const field = ref<SearchField>("title_abstract");
const hist = ref(false);
const histStart = ref(2000);
const histEnd = ref(2026);
const includeXPAC = ref(false);
const params = ref<string | null>('{ "fq": "is_xpac: false" }');
const advanced = ref(false);
const histogram = ref<Record<string, number> | null | undefined>(null);
const qTime = ref<number | null>(null);
const nDocs = ref<number | null>(null);
const results = ref<Array<AcademicItemModel> | null>(null);
const showTokenExpandModal = ref(false);
const tokenSearchPrefix = ref("");
const tokenSearchLimit = ref(300);
const tokenSearchResult = ref<Array<TermStats>>([]);

const rules = {
  params: { isJSON, $autoDirty: true },
};
const state = reactive({ params });
const v$ = useVuelidate(rules, state);

watch(includeXPAC, (newValue: boolean) => {
  params.value = !newValue ? '{ "fq": "is_xpac: false" }' : null;
});

const histogramChart = computed<ChartInfo | undefined>(() => {
  if (histogram.value) {
    return {
      chartData: {
        labels: Object.keys(histogram.value),
        datasets: [{ data: Object.values(histogram.value), label: "Works" }],
      },
      chartOptions: {
        responsive: true,
        aspectRatio: 3,
        plugins: {
          legend: {
            display: false,
            position: "right",
          },
        },
      },
    };
  }
  return undefined;
});

function paginate(step: number) {
  offset.value = Math.max(0, offset.value + step);
  // if we already ran the query, run it again with the updated offset
  if (nDocs.value !== null) {
    runSearch();
  }
}

function runSearch() {
  API.search
    .searchOpenalexApiSearchOpenalexSelectPost({
      body: {
        query: query.value,
        limit: limit.value,
        offset: offset.value,
        field: field.value,
        def_type: defType.value,
        histogram: hist.value,
        histogram_from: histStart.value,
        histogram_to: histEnd.value + 1,
        params: JSON.parse(params.value as string),
      },
      headers: { "x-project-id": currentProjectStore.projectId as string },
    })
    .then((response) => {
      const { data } = response;

      results.value = data.docs;
      qTime.value = data.query_time;
      nDocs.value = data.num_found;
      histogram.value = data.histogram;
    })
    .catch(() => {
      EventBus.emit(new ToastEvent("ERROR", "Query failed. Retry or fix your query."));
      results.value = null;
    });
}

function expandTokens() {
  API.search
    .termExpansionApiSearchOpenalexTermsGet({
      headers: { "x-project-id": currentProjectStore.projectId as string },
      query: { term_prefix: tokenSearchPrefix.value, limit: tokenSearchLimit.value },
    })
    .then((response) => {
      const { data } = response;

      tokenSearchResult.value = data;
    })
    .catch(() => {
      EventBus.emit(new ToastEvent("ERROR", "Query failed. Retry or fix your query."));
      tokenSearchResult.value = [];
    });
}
</script>

<style scoped></style>
