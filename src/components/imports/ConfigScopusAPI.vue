<script lang="ts" setup>
import { PropType, ref, watch } from "vue";
import { ImportConfigEnum, ScopusApiImport } from "@/plugins/api/types";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import axios from "axios";
import { API } from "@/plugins/api";
import { currentProjectStore } from "@/stores";
import { pyDTNow } from "@/util";

const emits = defineEmits<{ configChanged: [config: ScopusApiImport]; requestingSave: [] }>();
const props = defineProps({
  existingConfig: {
    type: Object as PropType<ScopusApiImport>,
    required: false,
    default: null,
  },
  projectId: {
    type: String,
    required: false,
    default: null,
  },
  importId: {
    type: String,
    required: false,
    default: null,
  },
  editable: {
    type: Boolean,
    default: true,
  },
});

const config = ref<ScopusApiImport | null>(null);
const apiKey = ref<string>("");
const progress = ref({
  running: false,
  done: false,
  fetched: false,
  upload: "PENDING",
  uploadPercentage: -1,
  rateLimit: -1,
  rateRemaining: -1,
  rateReset: 0,
  nResults: -1,
  currentPage: 0,
  nRetrievedAbstracts: 0,
});

if (!props.existingConfig || props.existingConfig.kind !== ImportConfigEnum.SCOPUS_API) {
  config.value = {
    query: "TITLE-ABS(...)",
    date: "1990-2025",
    file: "",
    file_date: "",
    kind: "scopus-api",
  };
  emits("configChanged", config.value as ScopusApiImport);
} else {
  config.value = props.existingConfig;
}

watch(
  config.value,
  (newValue: ScopusApiImport) => {
    if (newValue) emits("configChanged", newValue);
  },
  { deep: true },
);

watch(props.existingConfig, (newValue: ScopusApiImport) => (config.value = newValue), { deep: true });
// watch(props, (newValue) => {
//   if (config.value && config.value.import_id !== newValue.importId) config.value.import_id = newValue.importId;
// });

async function fetchData() {
  const abstracts = await scopusAPI();
  await upload(abstracts);
  emits("requestingSave");
}

// https://dev.elsevier.com/documentation/ScopusSearchAPI.wadl
// https://dev.elsevier.com/documentation/AbstractRetrievalAPI.wadl
async function scopusAPI() {
  progress.value.running = true;
  progress.value.currentPage = 0;

  let nextCursor = "*";
  let page;
  const abstracts = [];
  while (true) {
    page = await axios.get("https://api.elsevier.com/content/search/scopus", {
      headers: { Accept: "application/json", "X-ELS-APIKey": apiKey.value },
      params: {
        query: config.value?.query,
        cursor: nextCursor,
        view: "COMPLETE",
        date: config.value?.date,
      },
    });
    nextCursor = page.data["search-results"].cursor["@next"];
    progress.value.currentPage += 1;
    progress.value.nResults = page.data["search-results"]["opensearch:totalResults"];
    if (!page.data["search-results"].entry || page.data["search-results"].entry.length === 0) break;
    for await (const entry of page.data["search-results"].entry) {
      abstracts.push(entry);
      progress.value.nRetrievedAbstracts += 1;
    }

    // Scopus doesn't set Access-Control-Allow-Headers, hence we can't read the following :-\
    progress.value.rateLimit = page.headers["x-ratelimit-limit"];
    progress.value.rateRemaining = page.headers["x-ratelimit-remaining"];
    progress.value.rateReset = page.headers["x-ratelimit-reset"];
  }
  progress.value.fetched = true;
  return abstracts;
}

function upload(abstracts: any[]) {
  const folder = crypto.randomUUID();
  const jsn = JSON.stringify(abstracts);
  const blob = new Blob([jsn], { type: "application/json" });
  const file = new File([blob], "scopus-dump.json");

  return new Promise((resolve, reject) => {
    progress.value.upload = "UPLOADING";
    API.pipes
      .uploadFileApiPipesArtefactsFilesUploadPost(
        {
          headers: { "x-project-id": currentProjectStore.projectId as string },
          folder,
          formData: { file },
        },
        {
          onUploadProgress: (event: { loaded: number; total?: number }) => {
            progress.value.uploadPercentage = Math.round(100 * (event.loaded / (event.total || 1)));
          },
        },
      )
      .then((response) => {
        if (config.value) {
          progress.value.upload = "SUCCESS";
          config.value.file = response.data;
          config.value.file_date = pyDTNow();
          resolve(response.data);
        }
      })
      .catch(() => {
        progress.value.upload = "FAILED";
        reject();
      });
  });
}

// console.log(page)
// break;
// for await (const entry of page.data["search-results"].entry) {
//   abstract = await axios.get(entry["prism:url"], {
//     headers: { Accept: "application/json", "X-ELS-APIKey": apiKey.value },
//     params: {
//       view: "FULL",
//     },
//   });
//   abstracts.push(abstract);
//   progress.value.nRetrievedAbstracts += 1;
// }
</script>

<template>
  <div class="m-2">
    <div class="row">
      <div class="col-xxl-7">
        <h5>Scopus Interactive APIs</h5>
        <p class="text-muted">
          This will fetch data directly from
          <a href="https://dev.elsevier.com/scopus.html#/Scopus_Search" target="_blank">Scopus</a>. You need to provide
          an API key, check the
          <a href="https://dev.elsevier.com/support.html" target="_blank">scopus documentation</a> on how to
          <a href="https://dev.elsevier.com/apikey/manage" target="_blank">get a key</a>. Your key will stay in your
          browser for as long as this tab is open. We will never transfer it to our server or use it for anything else.
        </p>
        <p class="text-muted">Note, that you need to keep this window open until all the data was gathered.</p>
      </div>
    </div>
    <div class="row mb-2" v-if="config?.file_date">
      <div class="col">
        <ul>
          <li><strong>Filename:</strong> {{ config.file }}</li>
          <li><strong>API dump uploaded on:</strong> {{ config.file_date }}</li>
        </ul>
      </div>
    </div>
    <div class="row mb-2" v-if="config">
      <div class="col">
        <label for="apiKey" class="form-label">API key</label>
        <input id="apiKey" class="form-control" type="text" v-model="apiKey" placeholder="Scopus API key" />
      </div>
      <div class="col">
        <label for="date" class="form-label">Date range</label>
        <input id="date" class="form-control" type="text" v-model="config.date" placeholder="Year range" />
      </div>
    </div>
    <div class="row mb-2" v-if="config">
      <div class="col">
        <label for="query" class="form-label">Scopus query</label>
        <textarea
          id="query"
          v-model="config.query"
          :disabled="!editable"
          aria-label="Scopus query"
          class="form-control"
          rows="5"
        />
      </div>
    </div>
    <div class="row" v-if="progress.running">
      <div class="col">
        Do not leave this view or close this tab while this is running! Don't forget to click 'upload' and 'save' once
        this is done! Please note, that this uses up your 'budget', which does reset after a while. Unfortunately, we
        can't show the remaining budget to you because Scopus didn't configure their servers correctly.
        <ul>
          <li><strong>Running:</strong> {{ progress.running }}</li>
          <li><strong>1) Fetched:</strong> {{ progress.fetched }}</li>
          <li><strong>2) Upload:</strong> {{ progress.upload }} -> {{ progress.uploadPercentage }}%</li>
          <li><strong>3) All done!:</strong> {{ progress.done }}</li>
          <li><strong>Expected results:</strong> {{ progress.nResults }}</li>
          <li><strong>Current page:</strong> {{ progress.currentPage }}</li>
          <li><strong>Retrieved abstracts:</strong> {{ progress.nRetrievedAbstracts }}</li>
          <!-- {{ progress.rateLimit }} -->
          <li><strong>X-RateLimit-Limit:</strong> --</li>
          <!-- {{ progress.rateRemaining }} -->
          <li><strong>X-RateLimit-Remaining:</strong> --</li>
          <!-- {{ dt2str(progress.rateReset * 1000)}}} -->
          <li><strong>X-RateLimit-Reset:</strong> --</li>
        </ul>
      </div>
    </div>
    <div class="row" v-else>
      <div class="col">
        <button class="btn btn-outline-secondary" @click="fetchData">
          <font-awesome-icon icon="cart-arrow-down" />
          Fetch data from API
        </button>
      </div>
    </div>
  </div>
</template>
