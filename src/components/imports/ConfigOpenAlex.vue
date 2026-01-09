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

<script lang="ts">
import type { PropType } from "vue";
import { defineComponent } from "vue";
import { type OpenAlexSolrImport, DefTypeEnum, OpEnum, SearchFieldEnum, ImportConfigEnum } from "@/plugins/api/types";
import useVuelidate, { type ValidationRule } from "@vuelidate/core";
import { errorsToString } from "@/util/validators";
import { Overwrite } from "@/util";

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
export default defineComponent({
  name: "ConfigOpenAlex",
  emits: ["configChanged"],
  props: {
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
  },
  setup() {
    return { v$: useVuelidate() };
  },
  data() {
    const emptyConfig: StringifiedOpenAlexSolrImport = {
      kind: ImportConfigEnum.OA_SOLR,
      query: "",
      def_type: DefTypeEnum.LUCENE,
      field: SearchFieldEnum.TITLE_ABSTRACT,
      op: OpEnum.AND,
      params: '{ "fq": "is_xpac: false" }',
    };
    if (!this.existingConfig || this.existingConfig.kind !== ImportConfigEnum.OA_SOLR) {
      this.$emit("configChanged", this.parse(emptyConfig));
      return { config: emptyConfig, debounceWatch: false };
    }
    return { config: this.stringify(this.existingConfig), debounceWatch: false };
  },
  methods: {
    errorsToString,
    parse(conf: StringifiedOpenAlexSolrImport): OpenAlexSolrImport {
      const copy = JSON.parse(JSON.stringify(conf));
      copy.params = JSON.parse(copy.params || "");
      return copy;
    },
    stringify(conf: OpenAlexSolrImport): StringifiedOpenAlexSolrImport {
      const copy = JSON.parse(JSON.stringify(conf));
      copy.params = copy.params ? JSON.stringify(copy.params) : null;
      return copy;
    },
  },
  watch: {
    config: {
      handler(newValue: OpenAlexSolrImport) {
        if (this.debounceWatch) {
          // prevent endless recursion
          this.debounceWatch = false;
          return;
        }
        try {
          this.$emit("configChanged", this.parse(newValue));
        } catch {
          console.warn("Not updating config due to invalid json");
        }
      },
      deep: true,
    },
    existingConfig: {
      handler(newValue: OpenAlexSolrImport) {
        this.debounceWatch = true;
        this.config = this.stringify(newValue);
      },
      deep: true,
    },
    importId: {
      handler(newValue: string) {
        this.config.import_id = newValue;
      },
    },
  },
  validations() {
    return {
      config: { isJSON, $autoDirty: true },
    };
  },
});
</script>

<style scoped></style>
