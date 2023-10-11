<template>
  <inline-tool-tip :info="`Project type: ${projectType}`">
    <font-awesome-icon :icon="icon" />
  </inline-tool-tip>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import type { PropType } from "vue";
import InlineToolTip from "@/components/InlineToolTip.vue";

type ProjectType =
  | "generic"
  | "twitter" // eslint-disable-line @typescript-eslint/indent
  | "academic" // eslint-disable-line @typescript-eslint/indent
  | "lexis" // eslint-disable-line @typescript-eslint/indent
  | "patents"; // eslint-disable-line @typescript-eslint/indent

export default defineComponent({
  name: "ProjectTypeIcon",
  components: { InlineToolTip },
  props: {
    projectType: {
      type: String as PropType<ProjectType>,
      default: () => "generic",
    },
  },
  computed: {
    icon() {
      if (this.projectType === "generic") {
        return ["fas", "book-atlas"];
      }
      if (this.projectType === "twitter") {
        return ["fab", "twitter"];
      }
      if (this.projectType === "academic") {
        return ["fas", "flask-vial"];
      }
      if (this.projectType === "patents") {
        return ["fas", "scale-balanced"];
      }
      if (this.projectType === "lexis") {
        return ["fas", "newspaper"];
      }
      return ["fas", "question"];
    },
  },
});
</script>
