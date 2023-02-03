<template>
  <div>
    <h2>Query builder for OpenAlex</h2>
    <div class="row">
      <div class="col">
        <label for="limit" class="form-label">Limit</label>
        <input type="number" class="form-control" placeholder="Limit" aria-label="Limit" id="limit" :value="limit">
      </div>
      <div class="col">
        <label for="offset" class="form-label">Offset</label>
        <input type="number" class="form-control" placeholder="Offset" aria-label="Offset" id="offset" :value="offset">
      </div>
      <div class="col">
        <label for="db" class="form-label">Database</label>
        <select class="form-select form-select" v-model="database" id="db">
          <option :value="dbs.OPEN_ALEX">OpenAlex</option>
          <option :value="dbs.S2">Semantic Scholar</option>
          <option :value="dbs.CORE">CORE</option>
        </select>
      </div>
    </div>
    <div>
      <query-group-component :subquery="query" />
    </div>
    <div>
      <button @click="getSample" type="button" class="btn btn-outline-success">Query</button>
    </div>
    <div>
      <ul>
        <li v-for="(sampleI, i) in sample" :key="i">
          {{ sampleI }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { API } from '@/plugins/api';
import type { QueryGroup } from '@/plugins/api/api-core';
import {
  AcademicSearchDB,
  Condition,
  Field,
  IntFilterSign,
  StrTransformerType,
} from '@/plugins/api/api-core';
import { currentProjectStore } from '@/stores';
import QueryGroupComponent from '@/components/search/QueryGroup.vue';

const testQuery = {
  condition: Condition.OR,
  members: [{
    type: 'str',
    condition: Condition.OR,
    field: Field.TITLE,
    query: 'climate <-> change | carbon <-> emissions',
    transformer: StrTransformerType.TO_TSQUERY,
  }, {
    condition: Condition.AND,
    members: [
      {
        type: 'int',
        condition: Condition.AND,
        field: Field.PUBLICATION_YEAR,
        sign: IntFilterSign.LEQ,
        value: 2000,
      }, {
        type: 'int',
        condition: Condition.AND,
        field: Field.PUBLICATION_YEAR,
        sign: IntFilterSign.GT,
        value: 2010,
      },
    ],
  },
  ],
} as QueryGroup;

export default defineComponent({
  name: 'ImportSearchView',
  components: { QueryGroupComponent },
  data() {
    return {
      // query: {
      //   members: [],
      // } as QueryGroup,
      query: testQuery,
      limit: 20,
      offset: 0,
      database: 'OpenAlex',
      sample: [] as any[],
      dbs: AcademicSearchDB,
    };
  },
  methods: {
    getSample() {
      API.core.search.searchApiSearchQueryPost({
        requestBody: this.query,
        database: this.database as AcademicSearchDB,
        limit: this.limit,
        offset: this.offset,
        xProjectId: currentProjectStore.projectId as string,
      }).then((response) => {
        this.sample = response.data;
      });
    },
  },
});
</script>

<style scoped>

</style>
