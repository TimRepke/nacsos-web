<template>
  <div class="card">
    <div class="card-header small d-flex" tabindex="0" role="button" @click="expanded=!expanded">
      <strong class="small">{{ config.task.task_id.slice(0, 6) }}..</strong>&nbsp;
      <code>{{ config.info.module }}.<strong>{{ config.info.function }}(&sdot;)</strong></code>
      <font-awesome-icon role="button" class="ms-1 text-muted" :icon="['fas','circle-info']"
                         @click.stop="$emit('showInfo', config.info)"/>
      <!-- TODO set force_run -->
      <font-awesome-icon class="text-muted ms-2 text-warning" :icon="['fas','toggle-off']"/>
      <font-awesome-icon class="text-muted ms-auto" :icon="['fas',(expanded) ? 'minus' : 'plus']"/>
    </div>

    <div class="card-body" v-if="expanded">
      <div class="row g-2 row-cols-auto">
        <div class="col" v-for="(dtype, key) in config.info.kwargs" :key="key">
          <template v-if="isPrimitiveType(dtype)">
            <label :for="`tk-${key}`">
              <code><strong>{{ key }}:</strong> {{ (Array.isArray(dtype)) ? `${dtype[0]}=${dtype[1]}` : dtype }}</code>
            </label>
            <input :type="dtype2input(dtype)" :id="`tk-${key}`" class="form-control" :aria-label="key"
                   :class="(dtype2input(dtype) ==='checkbox') ? 'form-check-input' : 'form-control'"
                   v-model="taskParams[key]">
            <span v-if="dtype2input(dtype)==='checkbox'">
              {{ (taskParams[key] === undefined) ? 'None' : taskParams[key] }}
            </span>
          </template>
          <template v-else-if="$util.isArtefactOrSerializedArtefact(dtype)">
            <code><strong>{{ key }}:</strong> Artefact[{{ dtype.serializer }}, {{ dtype.dtype }}]</code>
            <div class="d-flex flex-row align-items-center" style="gap: 1em">
              <font-awesome-icon role="button" class="btn btn-outline-secondary m-1 btn-sm" :icon="['fas','crosshairs']"
                                 @click="pickReference(key, dtype)"/>
              <ul class="list-unstyled small text-muted m-0">
                <li><strong>Task:</strong> {{ taskParams[key]?.task_id || '[REF?]' }}</li>
                <li><strong>Artefact:</strong> {{ taskParams[key]?.artefact || '[REF?]' }}</li>
              </ul>
            </div>
          </template>
          <template v-else-if="isList(dtype)">
            <label :for="`tk-${key}`">
              <code><strong>{{ key }}:</strong> {{ (Array.isArray(dtype)) ? `${dtype[0]}=${dtype[1]}` : dtype }}</code>
            </label>
            <ul v-if="!$util.isEmpty(taskParams[key])">
              <li v-for="(val, it) in taskParams[key]" :key="`${it}-${val}`">{{ val }}</li>
            </ul>
            <div class="d-flex flex-row align-items-center">
              <input :type="getListInputType(dtype)" :id="`tk-${key}`" :aria-label="key"
                     :class="(getListInputType(dtype) ==='checkbox') ? 'form-check-input' : 'form-control'"
                     v-model="taskParams[`__${key}-value`]">
              <font-awesome-icon role="button" class="btn btn-sm m-1 text-muted" :icon="['far','square-plus']"
                                 @click="addListEntry(key)"
                                 :class="{ disabled: taskParams[`__${key}-value`] === undefined }"/>
            </div>
          </template>
          <template v-else-if="isLiteral(dtype)">
            <label :for="`tk-${key}`">
              <code><strong>{{ key }}:</strong> {{ (Array.isArray(dtype)) ? `${dtype[0]}=${dtype[1]}` : dtype }}</code>
            </label>
            <select :id="`tk-${key}`" class="form-select" v-model="taskParams[key]">
              <option v-for="opt in getLiteralOptions(dtype)" :key="opt" :value="opt">{{ opt }}</option>
            </select>
          </template>
          <template v-else-if="isComplex(dtype)">
            <code><strong>{{ key }}:</strong> {{ dtype.dtype }}<br/>{{ dtype.params }}</code>&nbsp;<br/>
            <span class="text-warning">Complex parameters not implemented yet.</span>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { PropType } from 'vue';
import {
  ArtefactCallback,
  ArtefactReference,
  FunctionInfo,
  KWArgEntry,
  SerializedArtefact,
  TaskConfig as TaskConfigInterface,
} from '@/types/pipelines.d';
import { isArtefactOrSerializedArtefact, isFunctionInfo } from '@/util/typeChecks';

export default {
  name: 'TaskConfig',
  emits: {
    showInfo: (info: FunctionInfo) => isFunctionInfo(info),
    pickArtefactReference: (artefact: SerializedArtefact, cb: ArtefactCallback) => isArtefactOrSerializedArtefact(artefact) && !!cb,
  },
  props: {
    config: {
      type: Object as PropType<TaskConfigInterface>,
    },
  },
  data() {
    return {
      expanded: true,
      taskParams: Object.fromEntries(Object.entries(this.config.info.kwargs).map((entry) => {
        const [key, dtype] = entry;
        const dt = this.getType(dtype);
        let defaultValue;
        if (Array.isArray(dtype)) {
          // eslint-disable-next-line prefer-destructuring
          defaultValue = dtype[1];
        }
        if (this.isPrimitiveType(dtype)) return [[key, this.getTypedPrimitive(dt, defaultValue)]];
        if (this.isList(dtype)) {
          return [[key, undefined], [`__${key}-value`, this.getTypedPrimitive(this.getListType(dtype), defaultValue)]];
        }
        return [];
      }).flat(1)),
    };
  },
  methods: {
    getTaskParams() {
      return JSON.parse(JSON.stringify(Object.fromEntries(Object.entries(this.taskParams).filter((entry) => {
        const [key, value] = entry;
        return !key.startsWith('__')
          && !key.endsWith('-value')
          && value !== undefined;
      }))));
    },
    getTypedPrimitive(dt: string, defaultValue: unknown): string | boolean | number {
      if (dt === 'int' || dt === 'float') return defaultValue as number;
      if (dt === 'bool') return defaultValue as boolean;
      // if (dt === 'str')
      return defaultValue as string;
    },
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
    isComplex(dtype: KWArgEntry): boolean {
      return this.$util.isObject(dtype) && 'dtype' in (dtype as object) && 'params' in (dtype as object);
    },
    isLiteral(dtype: KWArgEntry): boolean {
      if (typeof this.getType(dtype) === 'string') {
        return this.getType(dtype).startsWith('Literal');
      }
      return false;
    },
    isList(dtype: KWArgEntry): boolean {
      const dt = this.getType(dtype);
      if (typeof dt === 'string') {
        return dt.startsWith('list') || dt.startsWith('List');
      }
      return false;
    },
    getListType(dtype: KWArgEntry): string {
      let dt = this.getType(dtype);
      if (dt.startsWith('list[')) dt = dt.replace('list[', '');
      if (dt.startsWith('List[')) dt = dt.replace('List[', '');
      dt = dt.replace(']', '');
      return dt;
    },
    getListInputType(dtype: KWArgEntry): string {
      return this.dtype2input(this.getListType(dtype));
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
    addListEntry(key: string) {
      if (this.taskParams[key] === undefined) this.taskParams[key] = [];
      this.taskParams[key].push(this.taskParams[`__${key}-value`]);
      this.taskParams[`__${key}-value`] = undefined;
    },
    pickReference(key: string, artefact: SerializedArtefact) {
      this.$emit('pickArtefactReference', [
        artefact,
        (artefactRef: ArtefactReference) => {
          console.log(artefactRef);
          this.taskParams[key] = artefactRef;
        },
      ]);
    },
  },
};
</script>

<style scoped>
</style>
