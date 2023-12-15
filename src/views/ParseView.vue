<template>
  <div>
    <div>Hi</div>
    <textarea v-model="query"></textarea>
    <div>{{ count }}</div>
    <button @click="ask">query</button>
    <pre>{{ tree }}</pre>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import parse from "@/util/nql";
import { currentProjectStore } from "@/stores";
import { API, logReject } from "@/plugins/api";

export default defineComponent({
  name: "HomeView",
  data() {
    let res;
    res = parse('title: "hi"');
    // console.log(res);
    res = parse("PY: >2020");
    // console.log(res);
    res = parse('PY: >2020\n  OR\n  title: "carbon"\n');

    res = parse("import: abc, 12d, -af3");

    parse("label: key=3 FROM abc, 12d");
    parse("label: key=3");
    parse("label: key==3,4,5");
    parse("label: key !> 3,4,5");
    parse("label: key !> 3,4,5 FROM abc, -12d");
    parse("label: key <= 5 BY ~cde,123");
    parse("label: key > 2 FROM abc, -12d BY ~cde,123");

    parse('meta: extra LIKE "% test %"');

    parse("meta: extra <= 4");

    parse("(PY:>2000 AND (PY:<2100 OR PY:>2200))");
    parse("PY:>2000 AND PY:<2100 AND PY:>2200");

    // import: 944f2985-503b-4aad-8af1-e48b694eba19

    // 97a715be-7b40-4048-8c50-3c65132ec5ab
    // 4c0e0c43-cc1c-4ff1-95e1-210ab0f1fc72

    // console.log(res);
    return {
      query: "import: abc, 12d, -af3",
      count: -1,
    };
  },
  methods: {
    ask() {
      const query = parse(this.query);
      this.count = -1;
      API.core.search
        .nqlQueryApiSearchNqlQuery2Post({
          projectId: currentProjectStore.projectId,
          requestBody:query[0],
        })
        .then((response) => {
          this.count = response.data;
        })
        .catch(logReject);
    },
  },
  computed: {
    tree() {
      return JSON.stringify(parse(this.query), null, "  ");
    },
  },
});
</script>
