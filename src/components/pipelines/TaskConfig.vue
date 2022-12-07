<template>
  <div class="card">
    <div class="card-header small d-flex" tabindex="0" role="button" @click="expanded = !expanded">
      <strong class="small">{{ config.task.task_id.slice(0, 6) }}..</strong>&nbsp;
      <code>{{ config.info.module }}.<strong>{{ config.info.function }}(&sdot;)</strong></code>
      <font-awesome-icon
        role="button"
        class="ms-1 text-muted"
        :icon="['fas', 'circle-info']"
        @click.stop="$emit('showInfo', config.info)" />
      <!-- TODO set force_run -->
      <font-awesome-icon class="text-muted ms-2 text-warning" :icon="['fas', 'toggle-off']" />
      <font-awesome-icon class="text-muted ms-auto" :icon="['fas', (expanded) ? 'minus' : 'plus']" />
    </div>

    <div class="card-body" v-if="expanded">
      <div class="row g-2 row-cols-auto">
        <div class="col" v-for="(dtype, key) in config.info.kwargs" :key="key">
          <template v-if="isPrimitiveType(dtype)">
            <label :for="`tk-${key}`" class="border ps-1 w-100 border-bottom-0">
              <code><strong>{{ key }}:</strong><span v-if="!dtype.optional">*</span><br />
                {{ $util.type2str(dtype) }}</code>
              <InlineToolTip v-if="dtype.dtype[0] === 'str'" info="Paste project ID">
                <font-awesome-icon
                  role="button"
                  class="text-muted ms-2 text-warning"
                  :icon="['fas', 'hands-holding-circle']"
                  @click="taskParams[key] = currentProjectId" />
              </InlineToolTip>
              <InlineToolTip v-if="dtype.dtype[0] === 'str'" info="Paste user ID">
                <font-awesome-icon
                  role="button"
                  class="text-muted ms-2 text-warning"
                  :icon="['fas', 'hands-holding-child']"
                  @click="taskParams[key] = currentUserId" />
              </InlineToolTip>
            </label>
            <input
              :type="dtype2input(dtype)"
              :id="`tk-${key}`"
              class="form-control"
              :aria-label="key"
              :class="(dtype2input(dtype) === 'checkbox') ? 'form-check-input' : 'form-control'"
              v-model="taskParams[key]">
            <span v-if="dtype2input(dtype) === 'checkbox'">
              {{ (taskParams[key] === undefined) ? 'None' : taskParams[key] }}
            </span>
          </template>

          <template v-else-if="dtype.artefact">
            <div class="border ps-1 w-100 border-bottom-0">
              <code>
                <strong>{{ key }}:</strong><span v-if="!dtype.optional">*</span><br />{{ $util.type2str(dtype) }}
              </code>
            </div>
            <div class="d-flex flex-row align-items-center border ps-1 border-top-0" style="gap: 1em">
              <font-awesome-icon
                role="button"
                class="btn btn-outline-secondary m-1 btn-sm"
                :icon="['fas', 'crosshairs']"
                @click="pickReference(key, dtype.artefact)" />
              <ul class="list-unstyled small text-muted m-0">
                <li><strong>Task:</strong> {{ taskParams[key]?.task_id || '[REF?]' }}</li>
                <li><strong>Artefact:</strong> {{ taskParams[key]?.artefact || '[REF?]' }}</li>
              </ul>
            </div>
          </template>

          <template v-else-if="isList(dtype)">
            <label :for="`tk-${key}`" class="border ps-1 w-100 border-bottom-0">
              <code><strong>{{ key }}:</strong><span v-if="!dtype.optional">*</span><br />
                {{ $util.type2str(dtype) }}</code>
            </label>
            <ul v-if="!$util.isEmpty(taskParams[key])">
              <li v-for="(val, it) in taskParams[key]" :key="`${it}-${val}`">{{ val }}</li>
            </ul>
            <div class="d-flex flex-row align-items-center">
              <input
                :type="getListInputType(dtype)"
                :id="`tk-${key}`"
                :aria-label="key"
                :class="(getListInputType(dtype) === 'checkbox') ? 'form-check-input' : 'form-control'"
                v-model="taskParams[`__${key}-value`]" />
              <font-awesome-icon
                role="button"
                class="btn btn-sm m-1 text-muted"
                :icon="['far', 'square-plus']"
                @click="addListEntry(key)"
                :class="{ disabled: taskParams[`__${key}-value`] === undefined }" />
            </div>
          </template>

          <template v-else-if="isLiteral(dtype)">
            <label :for="`tk-${key}`" class="border ps-1 w-100 border-bottom-0">
              <code><strong>{{ key }}:</strong><span v-if="!dtype.optional">*</span><br />
                {{ $util.type2str(dtype) }}</code>
            </label>
            <select :id="`tk-${key}`" class="form-select" v-model="taskParams[key]">
              <option v-for="opt in getLiteralOptions(dtype)" :key="opt" :value="opt">{{ opt }}</option>
            </select>
          </template>

          <template v-else> <!-- v-else-if="isComplex(dtype)" -->
            <div class="border ps-1 w-100 border-bottom-0">
              <code>
                <strong>{{ key }}:</strong><span v-if="!dtype.optional">*</span><br />{{ $util.type2str(dtype) }}
              </code>
            </div>
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
  TaskConfig as TaskConfigInterface,
} from '@/types/pipelines.d';
import { isArtefactOrSerializedArtefact, isFunctionInfo } from '@/util/typeChecks';
import { currentProjectStore, currentUserStore } from '@/stores';
import InlineToolTip from '@/components/InlineToolTip.vue';
import { FunctionInfo, SerializedArtefact, KWARG, ArtefactReference } from '@/plugins/api/api-pipe';

export default {
  name: 'TaskConfig',
  components: { InlineToolTip },
  emits: {
    showInfo: (info: FunctionInfo) => isFunctionInfo(info),
    pickArtefactReference: (artefact: SerializedArtefact, cb: ArtefactCallback) => isArtefactOrSerializedArtefact(artefact) && !!cb,
    // TODO remove config from list again
  },
  props: {
    config: {
      type: Object as PropType<TaskConfigInterface>,
      default: null,
    },
  },
  data() {
    return {
      currentProjectId: currentProjectStore.projectId,
      currentUserId: currentUserStore.user.user_id,
      expanded: true,
      taskParams: Object.fromEntries(Object.entries(this.config.info.kwargs).map((entry) => {
        const [key, dtype] = entry as [string, KWARG];
        if (this.isPrimitiveType(dtype)) {
          return [[key, this.getTypedPrimitive(dtype.dtype[0], dtype.default)]];
        }
        if (this.isLiteral(dtype)) {
          return [[key, this.getTypedPrimitive('str', dtype.default)]];
        }
        if (this.isList(dtype)) {
          return [[key, undefined], [`__${key}-value`, this.getTypedPrimitive(this.getListType(dtype), dtype.default)]];
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
      if (dt === 'bool') return !!defaultValue as boolean;
      // if (dt === 'str')
      return defaultValue as string;
    },
    isPrimitiveType(dtype: KWARG): boolean {
      return dtype.dtype.length === 1
        && (
          dtype.dtype[0] === 'int'
          || dtype.dtype[0] === 'float'
          || dtype.dtype[0] === 'str'
          || dtype.dtype[0] === 'bool'
        );
    },
    dtype2input(dtype: KWARG): string {
      if (dtype.dtype[0] === 'int' || dtype.dtype[0] === 'float') return 'number';
      if (dtype.dtype[0] === 'bool') return 'checkbox';
      return 'text';
    },
    isLiteral(dtype: KWARG): boolean {
      return !!dtype.options;
    },
    isList(dtype: KWARG): boolean {
      return dtype.dtype[0] === 'list';
    },
    getListType(dtype: KWARG): string {
      if (!dtype.generics) return 'str';
      return dtype.generics[0];
    },
    getListInputType(dtype: KWARG): string {
      return this.dtype2input({ dtype: [this.getListType(dtype)] });
    },
    getLiteralOptions(dtype: KWARG): string[] {
      if (dtype.options) {
        return dtype.options;
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
          this.taskParams[key] = artefactRef;
        },
      ]);
    },
  },
};
</script>

<style scoped>
</style>
