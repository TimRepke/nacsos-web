<template>
  <div>
    <h2>NQL Query parser</h2>

    <NQLBox v-model:query="queryStr" class="m-4 ms-1" />

    <hr />

    <div>
      <div class="form-check form-check-inline">
        <input class="form-check-input" type="radio" name="output" id="out-py" value="python" v-model="output" />
        <label class="form-check-label" for="out-py">Python</label>
      </div>
      <div class="form-check form-check-inline">
        <input
          class="form-check-input"
          type="radio"
          name="output"
          id="out-pyc"
          value="python-compact"
          v-model="output"
        />
        <label class="form-check-label" for="out-pyc">Python (compact)</label>
      </div>
      <div class="form-check form-check-inline">
        <input class="form-check-input" type="radio" name="output" id="out-json" value="json" v-model="output" />
        <label class="form-check-label" for="out-json">JSON</label>
      </div>
    </div>

    <div class="card p-1" style="color: #559e55">
      <pre><code>{{ dump }}</code></pre>
    </div>

    <hr />
    <button @click="ask" class="btn btn-outline-secondary">Test query</button>
    <div>Number of results: {{ count }}</div>

    <hr />
    <h4>Parse table</h4>
    <ul>
      <li v-for="step in table.slice().reverse()" :key="step.index">
        Step {{ step.index }} wants:
        <ul>
          <li v-for="(value, key) in step.wants" :key="key">
            <strong>{{ key }}: </strong> <code>{{ value[0]?.rule }}</code>
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { parse, parseHist, debug } from "@/util/nql";
import { currentProjectStore } from "@/stores";
import { API, logReject } from "@/plugins/api";
import NQLBox from "@/components/NQLBox.vue";

export default defineComponent({
  name: "ParseView",
  components: { NQLBox },
  data() {
    // let res;
    // res = debug('title: "hi"');
    // // console.log(res);
    // res = debug("PY: >2020");
    // // console.log(res);
    // res = debug('PY: >2020\n  OR\n  title: "carbon"\n');
    //
    // res = debug("import: abc, 12d, -af3");
    //
    // debug("label: key=3 FROM abc, 12d");
    // debug("label: key=3");
    // debug("label: key==3,4,5");
    // debug("label: key !> 3,4,5");
    // debug("label: key !> 3,4,5 FROM abc, -12d");
    // debug("label: key <= 5 BY ~cde,123");
    // debug("label: key > 2 FROM abc, -12d BY ~cde,123");
    //
    // debug('meta: extra LIKE "% test %"');
    //
    // debug("meta: extra <= 4");
    //
    // debug("(PY:>2000 AND (PY:<2100 OR PY:>2200))");
    // debug("PY:>2000 AND PY:<2100 AND PY:>2200");

    // import: 944f2985-503b-4aad-8af1-e48b694eba19

    // 97a715be-7b40-4048-8c50-3c65132ec5ab
    // 4c0e0c43-cc1c-4ff1-95e1-210ab0f1fc72

    // console.log(res);
    return {
      queryStr: 'title: "%hi%"',
      count: -1,
      output: "json",
    };
  },
  methods: {
    ask() {
      const query = debug(this.queryStr);
      this.count = -1;
      API.core.search
        .nqlQueryApiSearchNqlQueryPost({
          xProjectId: currentProjectStore.projectId as string,
          requestBody: query[0],
        })
        .then((response) => {
          this.count = response.data.n_docs;
        })
        .catch(logReject);
    },
  },
  computed: {
    dump() {
      const query = parse(this.queryStr);
      if (query.length === 0) {
        return "[No result]";
      }

      if (this.output === "python") {
        return `QUERY = NQLFilterParser.validate_python(json.loads('''\n${JSON.stringify(query[0], null, "  ")}\n'''))`;
      } else if (this.output === "python-compact") {
        return `QUERY = NQLFilterParser.validate_python(json.loads('${JSON.stringify(query[0])}'))`;
      } else if (this.output === "json") {
        return JSON.stringify(query, null, "  ");
      } else {
      }
    },
    table() {
      try {
        const parser = parseHist(this.queryStr);
        if (!parser) return [];
        console.log(parser.table);
        return parser.table;
      } catch (e) {
        return [];
      }
    },
  },
});
</script>
