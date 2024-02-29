<template>
  <div class="">
    <div class="row">
      <div class="col small">
        <a
          href="https://apsis.mcc-berlin.net/nacsos-docs/user/data-queries/"
          target="_blank"
          class="link-secondary"
          style="text-decoration: none"
          rel="noopener noreferrer"
        >
          <font-awesome-icon :icon="['fas', 'circle-question']" />
          Help</a
        >
      </div>
      <div class="col text-end">
        <span class="border rounded-2 rounded-bottom-0 border-bottom-0 p-2">
          <span role="button" tabindex="-1" class="text-muted me-2" @click="mode = 'txt'">
            <font-awesome-icon :icon="['fas', 'align-left']" />
          </span>
          <span role="button" tabindex="-1" class="text-muted me-2" @click="mode = 'ind'">
            <font-awesome-icon :icon="['fas', 'indent']" />
          </span>
          <span role="button" tabindex="-1" class="text-muted" @click="mode = 'vis'">
            <font-awesome-icon :icon="['fas', 'tags']" />
          </span>
        </span>
      </div>
    </div>

    <!-- TEXT MODE -->
    <div v-if="mode === 'txt'" class="row">
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

    <!-- INDENT MODE -->
    <div class="row border rounded-2 p-2 mt-1" v-else-if="mode === 'ind'">Parsed view not implemented, yet.</div>

    <!-- VISUAL MODE -->
    <div class="row border rounded-2 p-2 mt-1" v-else-if="mode === 'vis'">
      Visual query builder view not implemented, yet.
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { type Filter, parse } from "@/util/nql";
import { isNone } from "@/util";

type Mode = "txt" | "ind" | "vis";

export default defineComponent({
  name: "NQLBox",
  components: { FontAwesomeIcon },
  emits: ["update:query", "update:query-parsed"],
  props: {
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
  },
  data() {
    return {
      mode: "txt" as Mode,
      queryStr: this.query,
      queryParsed: [] as Filter[],
      grammar: "",
      log: [] as Array<string>,
    };
  },
  mounted() {
    if (!isNone(this.queryStr) && this.queryStr.length > 0) {
      this.parseQuery(this.queryStr);
    }
  },
  computed: {
    isValid(): boolean {
      return this.queryStr.length === 0 || (this.queryStr.length > 0 && this.queryParsed.length > 0);
    },
  },
  methods: {
    parseQuery(query: string) {
      const queryParsed = parse(query.trim());
      this.queryParsed = queryParsed;
      this.$emit("update:query-parsed", queryParsed);
      return queryParsed;
    },
  },
  watch: {
    queryStr(newQuery: string) {
      return this.parseQuery(newQuery);
    },
  },
});
</script>

<style scoped></style>
