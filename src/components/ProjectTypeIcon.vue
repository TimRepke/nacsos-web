<template>
  <inline-tool-tip :info="`Project type: ${projectType}`">
    <font-awesome-icon :icon="icon" />
  </inline-tool-tip>
</template>

<script lang="ts">
import { PropType } from 'vue';
import InlineToolTip from '@/components/InlineToolTip.vue';

type ProjectType =
  'generic'
  | 'twitter' // eslint-disable-line @typescript-eslint/indent
  | 'academic' // eslint-disable-line @typescript-eslint/indent
  | 'patents'; // eslint-disable-line @typescript-eslint/indent

export default {
  name: 'ProjectTypeIcon',
  components: { InlineToolTip },
  props: {
    projectType: {
      type: String as PropType<ProjectType>,
      default: () => 'generic',
    },
  },
  computed: {
    icon() {
      if (this.projectType === 'generic') {
        return ['fas', 'book-atlas'];
      }
      if (this.projectType === 'twitter') {
        return ['fab', 'twitter'];
      }
      if (this.projectType === 'academic') {
        return ['fas', 'flask-vial'];
      }
      if (this.projectType === 'patents') {
        return ['fas', 'scale-balanced'];
      }
      return ['fas', 'question'];
    },
  },
};
</script>
