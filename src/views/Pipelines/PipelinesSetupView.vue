<template>
  <div class="text-start p-2">
    <h2>Pipeline setup</h2>
    Remember to have event-triggered pipeline configs
    <ul>
      <li v-for="func in library" :key="`${func.module}.${func.name}`">
        {{ func.name }}
        <span class="text-muted small">
          {{ func.module }}.<strong>{{ func.function }}()</strong>
        </span>
        <font-awesome-icon role="button" class="text-muted" :icon="['fas','circle-info']" @click="highlight=func"/>
      </li>
    </ul>
    <div class="card" v-if="highlight !== undefined">
      <div class="card-header">
        {{ highlight.name }}
      </div>
      <div class="card-body">
        <span class="text-muted">
          {{ highlight.module }}.
          <strong>{{ highlight.function }}(</strong>
          <span v-for="(tp, arg) in highlight.kwargs" :key="arg">
            <strong>{{ arg }}:</strong> {{ tp2string(tp) }},
          </span>
          <strong>)</strong>
        </span>
        <div v-html="md2html(highlight.docstring)"></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Artefact, FunctionInfo, SerializedArtefact } from '@/types/pipelines.d';
import { callPipelineLibraryEndpoint, callPipelineRefreshLibraryEndpoint } from '@/plugins/api/pipelines';
import { EventBus } from '@/plugins/events';
import { ToastEvent } from '@/plugins/events/events/toast';
import { marked } from 'marked';

export default {
  name: 'PipelinesSetupView',
  data() {
    return {
      library: [] as FunctionInfo[],
      highlight: undefined as FunctionInfo | undefined,
    };
  },
  async mounted() {
    this.library = (await callPipelineLibraryEndpoint()).payload;
  },
  methods: {
    async reloadLibrary() {
      const numFunctions = (await callPipelineRefreshLibraryEndpoint()).payload;
      this.library = (await callPipelineLibraryEndpoint()).payload;
      EventBus.emit(new ToastEvent('INFO', `Reload of library done, fetched ${numFunctions} functions.`));
    },
    md2html(s: string): string {
      return marked(s);
    },
    tp2string(tp: string | SerializedArtefact | [string, any]): string {
      if (typeof tp === 'string') {
        return tp;
      }
      if (Array.isArray(tp)) {
        const [key, val] = tp;
        return `${key} = ${val}`;
      }
      if ('serializer' in tp && 'dtype' in tp) {
        const { serializer, dtype } = tp;
        return `Artefact[${serializer}, ${dtype}]`;
      }
      return JSON.stringify(tp);
    },
  },
};
</script>

<style scoped>

</style>
