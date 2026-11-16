<template>
  <div class="m-2">
    <div class="row">
      <div class="col-xxl-7">
        <h5>OpenAlex import</h5>
        <p class="text-muted">Import directly from our self-hosted OpenAlex solr database.</p>
      </div>
    </div>
    <div class="row">
      <div class="col">
        <textarea v-model="config.query" :disabled="!editable" aria-label="Solr query" class="form-control" rows="5" />
      </div>
    </div>
    <div class="row mt-2">
      <div class="col">
        <label for="op" class="form-label">OP</label>
        <select class="form-select form-select form-select-sm" v-model="config.op" id="op">
          <option value="AND">AND</option>
          <option value="OR">OR</option>
        </select>
      </div>
      <div class="col">
        <label for="qfield" class="form-label">Field</label>
        <select class="form-select form-select form-select-sm" v-model="config.field" id="qfield">
          <option value="title">title</option>
          <option value="abstract">abstract</option>
          <option value="title_abstract">title_abstract</option>
        </select>
      </div>
      <div class="col">
        <label for="defType" class="form-label">Parser</label>
        <select class="form-select form-select form-select-sm" v-model="config.def_type" id="defType">
          <option value="lucene">lucene</option>
          <option value="dismax">dismax</option>
          <option value="edismax">edismax</option>
        </select>
      </div>
    </div>
    <div class="row mt-2">
      <div class="col">
        <textarea
          v-model="config.params"
          :disabled="!editable"
          aria-label="Parameter override"
          placeholder="Parameter override"
          class="form-control"
          rows="5"
          :class="{ 'is-invalid': v$.config.$invalid }"
        />
        <div class="invalid-feedback d-block" v-if="v$.config.$invalid">
          {{ errorsToString(v$.config) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { PropType } from "vue";
import { ref, watch } from "vue";
import { type OpenAlexSolrImport, DefTypeEnum, OpEnum, SearchFieldEnum, ImportConfigEnum } from "@/plugins/api/types";
import useVuelidate, { type ValidationRule } from "@vuelidate/core";
import { errorsToString } from "@/util/validators";
import { Overwrite } from "@/util";

defineOptions({ name: "ConfigOpenAlex" });

type StringifiedOpenAlexSolrImport = Overwrite<OpenAlexSolrImport, { params: string }>;

const isJSON: ValidationRule = {
  $validator(value: StringifiedOpenAlexSolrImport) {
    if (!value.params) return true;
    try {
      JSON.parse(value.params);
      return true;
    } catch {
      return false;
    }
  },
  $message: "Invalid JSON!",
};

const emit = defineEmits(["configChanged"]);
const props = defineProps({
  existingConfig: {
    type: Object as PropType<OpenAlexSolrImport>,
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

function parse(conf: StringifiedOpenAlexSolrImport): OpenAlexSolrImport {
  const copy = JSON.parse(JSON.stringify(conf));
  copy.params = JSON.parse(copy.params || "");
  return copy;
}

function stringify(conf: OpenAlexSolrImport): StringifiedOpenAlexSolrImport {
  const copy = JSON.parse(JSON.stringify(conf));
  copy.params = copy.params ? JSON.stringify(copy.params) : null;
  return copy;
}

const emptyConfig: StringifiedOpenAlexSolrImport = {
  kind: ImportConfigEnum.OA_SOLR,
  query: "",
  def_type: DefTypeEnum.LUCENE,
  field: SearchFieldEnum.TITLE_ABSTRACT,
  op: OpEnum.AND,
  params: '{ "fq": "is_xpac: false" }',
};

const config = ref<StringifiedOpenAlexSolrImport>(emptyConfig);
const debounceWatch = ref(false);
if (!props.existingConfig || props.existingConfig.kind !== ImportConfigEnum.OA_SOLR) {
  emit("configChanged", parse(emptyConfig));
} else {
  config.value = stringify(props.existingConfig);
}

const rules = {
  config: { isJSON, $autoDirty: true },
};
const v$ = useVuelidate(rules, { config });

watch(
  () => config.value,
  (newValue) => {
    if (debounceWatch.value) {
      // prevent endless recursion
      debounceWatch.value = false;
      return;
    }
    try {
      emit("configChanged", parse(newValue));
    } catch {
      console.warn("Not updating config due to invalid json");
    }
  },
  { deep: true },
);
watch(
  () => props.existingConfig,
  (newValue) => {
    debounceWatch.value = true;
    if (!newValue || newValue.kind !== ImportConfigEnum.OA_SOLR) {
      config.value = { ...emptyConfig };
    } else {
      config.value = stringify(newValue);
    }
  },
  { deep: true },
);
watch(
  () => props.importId,
  (newValue) => {
    (config.value as { import_id?: string | null }).import_id = newValue;
  },
);
</script>

<style scoped></style>
