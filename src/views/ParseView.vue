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

    parse("label: key=3 FROM abc, 12d")
    parse("label: key=3")
    parse("label: key==3,4,5")
    parse("label: key !> 3,4,5")
    parse("label: key !> 3,4,5 FROM abc, -12d")
    parse("label: key <= 5 BY ~cde,123")
    parse("label: key > 2 FROM abc, -12d BY ~cde,123")

    parse('meta: extra LIKE "% test %"')

    parse('meta: extra <= 4')

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
