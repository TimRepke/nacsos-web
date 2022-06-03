<template>
  <div class="row g-0">
    <div class="col">
      <TwitterItemComponent :tweet="item"/> <!-- FIXME: make this flexible based on type -->
    </div>
    <div class="col-lg-6 text-start annotation-sidebar">
      <div class="p-3">
        <h5>{{ task.name }}</h5>
        <p>{{ task.description }}</p>
      </div>
      <div class="list-group rounded-0">
        <div class="list-group-item border-end-0 border-start-0"
             v-for="label in task.labels"
             :key="label.key">
          <div v-if="label.kind==='bool'">
            <div class="form-check form-switch">
              <label class="form-check-label" for="flexSwitchCheckDefault">{{ label.name }}</label>
              <input class="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault"
                     aria-checked="false">
            </div>
          </div>
          <div v-else-if="label.kind==='single'">
            {{ label.name }}
            <div>
              <button v-for="(choice, index) in label.choices" :key="index"
                      type="button" class="btn btn-outline-secondary m-2"
                      @click="selectChoice(label.key, choice.value)">{{ choice.name }}
              </button>
            </div>
          </div>
          <!--AnnotationLabel :label="taskLabel"/-->
        </div>
      </div>
      <pre>
        {{ task }}
      </pre>
    </div>
  </div>
</template>

<script lang="ts">
import { callTaskDefinitionEndpoint } from '@/plugins/api/annotations';
import { currentProjectStore } from '@/stores';

export default {
  name: 'AnnotationConfigView',
  created() {
    // noop
  },
  async setup() {
    const currentProjectId = currentProjectStore.project!.project_id!; // FIXME not cool to use !
    const response = await callTaskDefinitionEndpoint({ taskId: '98545fb3-3ed3-48b2-9748-a24015244be0' });
    const { item, task } = response.payload!;
    return {
      item: (item as TwitterItem), // FIXME: make this somehow flexible based on returned type
      task,
    };
  },
  methods: {
    selectChoice(key: string, value: number) {
      console.log(key, value);
    },
  },
};
</script>

<style scoped>
.annotation-sidebar {
  height: var(--body-height);
  overflow-x: hidden;
  overflow-y: auto;
  border: none;
}

@media (min-width: 992px) {
  /*
  FIXME is it possible to import var from bootstrap?
        ideally by overriding border-start.
  */
  .annotation-sidebar {
    border-left: 1px solid #dee2e6 !important;
  }
}
</style>
