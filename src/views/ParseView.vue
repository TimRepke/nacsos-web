<template>
  <div>
    <div>Hi</div>
    <textarea v-model="query"></textarea>
    <pre>{{ tree }}</pre>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import parse from "@/util/nql";

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
    // console.log(res);
    return {
      query: "import: abc, 12d, -af3",
    };
  },
  computed: {
    tree() {
      return JSON.stringify(parse(this.query), null, "  ");
    },
  },
});
</script>
