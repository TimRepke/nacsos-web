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
      <div class="card-header d-flex">
        <span>{{ highlight.name }}</span>
        <button type="button" class="btn-close ms-auto" aria-label="Close" @click="highlight=undefined"></button>
      </div>
      <div class="card-body">
        <div class="d-flex flex-row flex-wrap">
          <ul class="list-unstyled small text-muted">
            <li>{{ highlight.module }}.<strong>{{ highlight.function }}(&sdot;)</strong></li>
            <li><strong>Parameters:</strong>
              <ul class="list-unstyled ms-2">
                <li v-for="(tp, arg) in highlight.kwargs" :key="arg">
                  <code>{{ arg }}:</code> {{ tp2string(tp) }}
                </li>
              </ul>
            </li>
            <li><strong>Location:</strong> {{ highlight.filepath_rel }}</li>
            <li v-if="highlight.tags"><strong>Tags:</strong> {{ highlight.tags.join(', ') }}</li>
            <li><strong>CPU load:</strong> {{ highlight.est_cpu_load }}</li>
            <li v-if="highlight.recommended_lifetime"><strong>Artefact lifetime:</strong>
              {{ highlight.recommended_lifetime }} days
            </li>
            <li>
              <strong>Produced artefacts:</strong>
              <ul class="list-unstyled ms-2">
                <li v-for="(artefact, aKey) in highlight.artefacts" :key="aKey">
                  <code>{{ aKey }}</code>:
                  Artefact[{{ artefact.serializer }}, {{ artefact.dtype }}] @ "{{ artefact.filename }}"
                </li>
              </ul>
            </li>
          </ul>
          <pre class="card ms-4 p-2 pb-0 flex-fill"><code v-html="md2html(highlight.docstring)"></code></pre>
        </div>
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
