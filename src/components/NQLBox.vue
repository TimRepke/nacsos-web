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
    <div class="row" v-if="mode === 'txt'">
      <textarea
        v-model="queryStr"
        @input="$emit('update:query', $event.target.value)"
        aria-label="NQL query"
        class="form-control"
        :disabled="!editable"
        :rows="rows"
      />
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
import { parse } from "@/util/nql";

type Mode = "txt" | "ind" | "vis";

export default defineComponent({
  name: "NQLBox",
  components: { FontAwesomeIcon },
  emits: ["update:query", "update:query-parsed"],
  props: {
    query: {
      type: String,
      required: true,
      default: null as string | null,
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
      grammar: "",
      log: [] as Array<string>,
    };
  },
  mounted() {
    // pass
  },
  computed: {
    // pass
  },
  methods: {
    // pass
  },
  watch: {
    queryStr(newQuery: string) {
      const queryParsed = parse(newQuery.trim());
      this.$emit("update:query-parsed", queryParsed);
      return queryParsed;
    },
  },
});
</script>

<style scoped></style>
