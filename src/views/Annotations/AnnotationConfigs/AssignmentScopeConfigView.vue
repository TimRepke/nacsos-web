<template>
  <div class="text-start p-2">
    <div class="mb-2">
      <h1>Create and Monitor Assignment Scope</h1>
      <h6>
        The assignment scope for an annotation task is used to annotate in multiple
        batches or subsets and keep track of that reference.
      </h6>
    </div>
    <div class="mb-2">
      <h4>General settings</h4>
      <div class="mb-3">
        <label for="exampleFormControlInput1" class="form-label">Scope Name</label>
        <input type="email" class="form-control" id="exampleFormControlInput1" placeholder="scope name">
      </div>
      <div class="mb-3">
        <label for="exampleFormControlTextarea1" class="form-label">Scope description</label>
        <textarea class="form-control" id="exampleFormControlTextarea1" rows="3"></textarea>
      </div>
    </div>
    <div class="mb-2">
      <h4>User pool</h4>
      TODO: list of selected users<br/>
    </div>
    <div class="mb-2">
      <h4>Assignment strategy settings</h4>
      <select v-model="scopeAssignmentStrategy">
        <option disabled value="">Select strategy</option>
        <option v-for="opt in scopeAssignmentStrategyOptions" :value="opt.value" :key="opt.value">
          {{ opt.display }}
        </option>
      </select><br/>
      <template v-if="scopeAssignmentStrategy==='random'">
        TODO: input for num items per user<br/>
        TODO: input for number of codings per item<br/>
        TODO: input for number of items w/o multi-coding<br/>
      </template>
      <button class="btn btn-outline-secondary">Make assignments</button>
      (deactivate button once assignments were made)
    </div>
    <div class="mb-2">
      <h4>Results</h4>
      TODO: for each user, show num assignments and progress<br/>
      TODO: some basic stats<br/>
      TODO: a few export buttons<br/>
    </div>
  </div>
</template>

<script lang="ts">
// import { callProjectTasksEndpoint, callTaskDefinitionEndpoint } from '@/plugins/api/annotations';
import { useRoute } from 'vue-router';

export default {
  name: 'AssignmentScopeConfigView',
  data() {
    return {
      scopeAssignmentStrategy: '',
      scopeAssignmentStrategyOptions: [
        { display: 'Random assignment', value: 'random' },
      ],
    };
  },
  async setup() {
    const route = useRoute();
    const currentAssignmentScopeId = route.params.scope_id;
    // TODO load current scope config
    // const response = await callAssignmentScopeEndpoint({ scopeId: currentAssignmentScopeId });
    return {
      annotationScope: '', // response.payload as AssignmentScope,
    };
  },
  methods: {
    // none
  },
};
</script>

<style scoped>

</style>
