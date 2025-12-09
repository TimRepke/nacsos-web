<script setup lang="ts">
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { type Filter, parse } from "@/util/nql";
import { isNone, notNone } from "@/util";
import { computed, onMounted, ref, watch } from "vue";
import RefreshIcon from "@/components/RefreshIcon.vue";
import { API } from "@/plugins/api";
import { currentProjectStore } from "@/stores";
import { EventBus } from "@/plugins/events";
import { ToastEvent } from "@/plugins/events/events/toast";

type Mode = "txt" | "ind" | "vis";

const emit = defineEmits(["update:query", "update:query-parsed"]);
const props = defineProps({
  query: {
    type: String,
    required: true,
    default: "",
  },
  rows: {
    type: Number,
    required: false,
    default: 5,
  },
  editable: {
    type: Boolean,
    required: false,
    default: true,
  },
});
const mode = ref<Mode>("txt");
const queryStr = ref<string>(props.query);
const queryParsed = ref<Filter[]>([]);
const count = ref<number | null>(null);
// const grammar = ref<string>("");
// const log = ref<string[]>([]);

const isValid = computed<boolean>(
  () => queryStr.value.length === 0 || (queryStr.value.length > 0 && queryParsed.value.length > 0),
);

function parseQuery(query: string) {
  queryParsed.value = parse(query.trim());
  emit("update:query-parsed", queryParsed.value);
  return queryParsed.value;
}

async function getCount() {
  // title:"towards"
  try {
    count.value = (
      await API.search.nqlQueryCountApiSearchNqlCountPost({
        headers: { "x-project-id": currentProjectStore.projectId as string },
        body: queryParsed.value[0],
      })
    ).data;
  } catch {
    EventBus.emit(new ToastEvent("WARN", "Did not receive an item count."));
    throw Error();
  }
}

watch(queryStr, (newQuery) => {
  return parseQuery(newQuery);
});

onMounted(() => {
  if (!isNone(queryStr.value) && queryStr.value.length > 0) {
    parseQuery(queryStr.value);
  }
});
</script>

<template>
  <div>
    <div class="row">
      <div class="col">
        <RefreshIcon :refresh="getCount" icon="calculator" class="ms-1" />
        <span v-if="notNone(count)" class="small text-muted ms-2">{{ count.toLocaleString() }}</span>
      </div>
      <div class="col text-end">
        <a
          href="https://apsis.mcc-berlin.net/nacsos-docs/user/data-queries/"
          target="_blank"
          class="link-secondary me-2"
          style="text-decoration: none"
          rel="noopener noreferrer"
        >
          <font-awesome-icon :icon="['fas', 'circle-question']" />
          NQL Help</a
        >
        <!--        <span class="border rounded-2 rounded-bottom-0 border-bottom-0 p-2">-->
        <!--          <span role="button" tabindex="-1" class="text-muted me-2" @click="mode = 'txt'">-->
        <!--            <font-awesome-icon :icon="['fas', 'align-left']" />-->
        <!--          </span>-->
        <!--          <span role="button" tabindex="-1" class="text-muted me-2" @click="mode = 'ind'">-->
        <!--            <font-awesome-icon :icon="['fas', 'indent']" />-->
        <!--          </span>-->
        <!--          <span role="button" tabindex="-1" class="text-muted" @click="mode = 'vis'">-->
        <!--            <font-awesome-icon :icon="['fas', 'tags']" />-->
        <!--          </span>-->
        <!--        </span>-->
      </div>
    </div>

    <!-- TEXT MODE -->
    <div v-if="mode === 'txt'" class="row g-0">
      <div class="col">
        <textarea
          v-model="queryStr"
          @input="$emit('update:query', $event.target.value)"
          aria-label="NQL query"
          class="form-control text-muted"
          style="font-family: monospace"
          :class="{ 'is-invalid': !isValid }"
          :disabled="!editable"
          :rows="rows"
        />
        <div class="invalid-feedback">This is not a valid NQL query (yet).</div>
      </div>
    </div>

    <!-- INDENT MODE -->
    <div class="row border rounded-2 p-2 mt-1" v-else-if="mode === 'ind'">Parsed view not implemented, yet.</div>

    <!-- VISUAL MODE -->
    <div class="row border rounded-2 p-2 mt-1" v-else-if="mode === 'vis'">
      Visual query builder view not implemented, yet.
    </div>
  </div>
</template>
