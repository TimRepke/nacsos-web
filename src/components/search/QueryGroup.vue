<template>
  <div class="p-2 mb-2">
    <div>
      Group
      <font-awesome-icon :icon="['far', 'square-minus']" role="button" @click="removeGroup" />
    </div>
    <ul class="list-unstyled mb-2 border border-dark rounded-3 p-2">
      <li v-for="(fltr, i) in subquery.members" :key="i" class="mb-2">
        <span class="toggle-radio small me-2">
          <input
            :id="`cond_and_${id}_${i}`"
            type="radio"
            :name="`cond_${id}_${i}`"
            v-model="fltr.condition"
            :disabled="i === 0"
            value="AND">
          <label :for="`cond_and_${id}_${i}`">AND</label>
          <input
            :id="`cond_or_${id}_${i}`"
            type="radio"
            :name="`cond_${id}_${i}`"
            v-model="fltr.condition"
            :disabled="i === 0"
            value="OR">
          <label :for="`cond_or_${id}_${i}`">OR</label>
        </span>
        <template v-if="fltr.sign"> <!-- this is a number filter -->
          <span class="input-group" style="display: inline-flex; width: auto;">
            <span class="me-2">
              <select class="form-select form-select-sm" v-model="fltr.field" aria-label="Filter target">
                <option :value="fields.PUBLICATION_YEAR">Publication Year</option>
              </select>
            </span>
            <span class="me-2">
              <select class="form-select form-select-sm" v-model="fltr.sign" aria-label="Value comparator">
                <option :value="numComps.LT">&lt;</option>
                <option :value="numComps.LEQ">&le;</option>
                <option :value="numComps.GEQ">&ge;</option>
                <option :value="numComps.GT">&gt;</option>
                <option :value="numComps.EQ">=</option>
              </select>
            </span>
            <span class="me-2">
              <input v-model="fltr.value" class="form-control form-control-sm" type="number" aria-label="Query">
            </span>
            <span class="me-2">
              <font-awesome-icon
                :icon="['far', 'square-minus']"
                class="align-bottom"
                role="button"
                @click="removeFilter" />
            </span>
          </span>
        </template>
        <template v-else-if="fltr.transformer"> <!-- this is a string filter -->
          <span class="input-group" style="display: inline-flex; width: auto;">
            <span class="me-2">
              <select class="form-select form-select-sm" v-model="fltr.field" aria-label="Filter target">
                <option :value="fields.TITLE">Title</option>
                <option :value="fields.ABSTRACT">Abstract</option>
                <option :value="fields.TITLE_AND_ABSTRACT">Title &amp; Abstract</option>
              </select>
            </span>
            <span class="me-2">
              <select class="form-select form-select-sm" v-model="fltr.transformer" aria-label="Query transformer">
                <option :value="strTrans.WEBSEARCH_TO_TSQUERY">websearch</option>
                <option :value="strTrans.TO_TSQUERY">ts_query</option>
              </select>
            </span>
            <span class="me-2">
              <input v-model="fltr.query" class="form-control form-control-sm" type="text" aria-label="Query">
            </span>
            <span class="me-2">
              <font-awesome-icon
                :icon="['far', 'square-minus']"
                class="align-bottom"
                role="button"
                @click="removeFilter" />
            </span>
          </span>
        </template>
        <template v-else>
          <query-group :subquery="fltr" />
        </template>
      </li>
    </ul>
    <button type="button" class="btn  btn-outline-secondary btn-sm me-3" @click="addFilter">
      <font-awesome-icon class="me-2" :icon="['fas', 'plus']" />
      Filter
    </button>
    <button type="button" class="btn btn-outline-secondary btn-sm  me-3" @click="addGroup">
      <font-awesome-icon class="me-2" :icon="['fas', 'plus']" />
      Group
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import type { PropType } from 'vue';
import type { QueryGroup } from '@/plugins/api/api-core';
import { Field, IntFilterSign, StrTransformerType } from '@/plugins/api/api-core';

export default defineComponent({
  name: 'QueryGroup',
  props: {
    subquery: {
      type: Object as PropType<QueryGroup>,
      required: true,
    },
  },
  data() {
    return {
      id: crypto.randomUUID(),
      fields: Field,
      strTrans: StrTransformerType,
      numComps: IntFilterSign,
    };
  },
  methods: {
    addFilter() {
      // pass
    },
    addGroup() {
      // pass
    },
    removeFilter() {
      // pass
    },
    removeGroup() {
      // pass
    },
  },
});
</script>

<style scoped>
.toggle-radio {
  background: #f5f5f5;
  border: 1px solid #ccc;
  border-radius: 500px;
  display: inline-flex;
  overflow: hidden;
}

.toggle-radio > input:checked + label {
  background: rgba(85, 85, 85, 0.60);
}

.toggle-radio > input + label:not(:last-of-type) {
  border-right: 1px solid #ccc;
}

.toggle-radio > input[type='radio'] {
  display: none;
}

.toggle-radio > input[disabled] + label {
  opacity: 0.2;
}

.toggle-radio > input[disabled] + label:hover {
  cursor: not-allowed;
}

.toggle-radio > input + label {
  display: inline-block;
  margin-bottom: 0;
  padding: 1px 6px;
  float: left;
  cursor: pointer;
}

</style>
