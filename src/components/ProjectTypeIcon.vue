<template>
  <inline-tool-tip :info="`Project type: ${projectType}`">
    <font-awesome-icon :icon="icon" />
  </inline-tool-tip>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import type { PropType } from "vue";
import InlineToolTip from "@/components/InlineToolTip.vue";

defineOptions({ name: "ProjectTypeIcon" });

type ProjectType = "generic" | "twitter" | "academic" | "lexis" | "patents";

const props = defineProps({
  projectType: {
    type: String as PropType<ProjectType>,
    default: () => "generic",
  },
});

const icon = computed(() => {
  if (props.projectType === "generic") {
    return ["fas", "book-atlas"];
  }
  if (props.projectType === "twitter") {
    return ["fab", "twitter"];
  }
  if (props.projectType === "academic") {
    return ["fas", "flask-vial"];
  }
  if (props.projectType === "patents") {
    return ["fas", "scale-balanced"];
  }
  if (props.projectType === "lexis") {
    return ["fas", "newspaper"];
  }
  return ["fas", "question"];
});
</script>
