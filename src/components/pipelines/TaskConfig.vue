<template>
  <div class="card">
    <div class="card-header small d-flex" tabindex="0" role="button" @click="expanded=!expanded">
      <strong class="small">{{ config.task.task_id.slice(0, 4) }}</strong>&nbsp;
      <code>{{ config.info.module }}.<strong>{{ config.info.function }}(&sdot;)</strong></code>
      <font-awesome-icon class="text-muted ms-auto" style="margin-left: -0.3em"
                         :icon="['fas',(expanded) ? 'minus' : 'plus']"/>
    </div>

    <div class="card-body" v-if="expanded">
      <div class="row g-2 row-cols-auto">
        <div class="col" v-for="(dtype, key) in config.info.kwargs" :key="key">
          <template v-if="isPrimitiveType(dtype)">
            <label :for="`tk-${key}`">
              <code>{{ key }}: {{ (Array.isArray(dtype)) ? `${dtype[0]}=${dtype[1]}` : dtype }}</code>
            </label>
            <input :type="dtype2input(dtype)" :id="`tk-${key}`" class="form-control" :aria-label="key">
            <!--                 v-model="config.num_items" :disabled="!editable"-->
          </template>
          <template v-else-if="$util.isArtefactOrSerializedArtefact(dtype)">
            Artefact: {{ key }} | {{ dtype }}
          </template>
          <template v-else-if="isLiteral(dtype)">
            <label :for="`tk-${key}`">
              <code>{{ key }}: {{ (Array.isArray(dtype)) ? `${dtype[0]}=${dtype[1]}` : dtype }}</code>
            </label>
            <select :id="`tk-${key}`" class="form-select">
              <option v-for="opt in getLiteralOptions(dtype)" :key="opt" :value="opt">{{ opt }}</option>
            </select>
          </template>
          <template v-else>
            Else: {{ key }} | {{ dtype }}
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { PropType } from 'vue';
import {
  FunctionInfo,
  KWArgEntry,
  TaskConfig as TaskConfigInterface,
} from '@/types/pipelines.d';

export default {
  name: 'TaskConfig',
  emits: {
    showInfo: (info: FunctionInfo) => info,
    useFunc: (info: FunctionInfo) => info,
  },
  props: {
    config: {
      type: Object as PropType<TaskConfigInterface>,
    },
  },
  data() {
    return {
      expanded: true,
    };
  },
  methods: {
    isPrimitiveType(dtype: KWArgEntry): boolean {
      const dt = this.getType(dtype);
      return dt === 'int' || dt === 'float' || dt === 'str' || dt === 'bool';
    },
    dtype2input(dtype: KWArgEntry): string {
      const dt = this.getType(dtype);
      if (dt === 'int' || dt === 'float') return 'number';
      if (dt === 'bool') return 'checkbox';
      return 'text';
    },
    getType(dtype: KWArgEntry): string {
      return ((Array.isArray(dtype)) ? dtype[0] : dtype) as string;
    },
    isLiteral(dtype: KWArgEntry): boolean {
      if (typeof this.getType(dtype) === 'string') {
        return this.getType(dtype).startsWith('Literal');
      }
      return false;
    },
    getLiteralOptions(dtype: KWArgEntry): string[] | number[] {
      const dt = this.getType(dtype);
      if (dt.startsWith('Literal')) {
        const literals = dt.replace('Literal[', '').replace(']', '').split(',');
        return literals.map((literal: string) => {
          const trimmedLiteral = literal.trim();
          if (trimmedLiteral.startsWith('\'') && trimmedLiteral.endsWith('\'')) {
            return trimmedLiteral.replaceAll('\'', '');
          }
          return parseInt(trimmedLiteral, 10);
        });
      }
      return [];
    },
  },
};
</script>

<style scoped>
</style>
