<template>
  <div>
    <strong>Configure random assignments (with NQL filter)</strong>
    <div class="row g-3 row-cols-auto mb-2">
      <div class="col">
        <label for="num_items">Number of items</label>
        <input
          type="number"
          id="num_items"
          class="form-control"
          aria-label="Number of items"
          placeholder="Number of items"
          v-model="config.num_items"
          :disabled="!editable"
        />
      </div>
      <div class="col">
        <label for="num_multi_coded_items"># multi-coded items</label>
        <input
          type="number"
          id="num_multi_coded_items"
          class="form-control"
          aria-label="# multi-coded items"
          placeholder="# multi-coded items"
          v-model="config.num_multi_coded_items"
          :disabled="!editable"
        />
      </div>
      <div class="col">
        <label for="min_assignments_per_item">Min. # coders per item</label>
        <input
          type="number"
          id="min_assignments_per_item"
          class="form-control"
          aria-label="Min. # coders per item"
          placeholder="Min. # coders per item"
          v-model="config.min_assignments_per_item"
          :disabled="!editable"
        />
      </div>
      <div class="col">
        <label for="max_assignments_per_item">Max. # coders per item</label>
        <input
          type="number"
          id="max_assignments_per_item"
          class="form-control"
          aria-label="Max. # coders per item"
          placeholder="Max. # coders per item"
          v-model="config.max_assignments_per_item"
          :disabled="!editable"
        />
      </div>
      <div class="col">
        <label for="random_seed">Random seed</label>
        <input
          type="number"
          id="random_seed"
          class="form-control"
          aria-label="Random seed"
          placeholder="Random seed"
          v-model="config.random_seed"
          :disabled="!editable"
        />
      </div>
    </div>
    <div class="row pt-2 pb-1">
      <div class="col">
        You can specify which items to randomly sample from. Please check the query in the dataset explorer first! You
        can also click the calculator to get the number of documents for this query.
      </div>
      <div class="col">
        <button type="button" class="btn btn-outline-secondary btn-sm" @click="getCount">
          <font-awesome-icon :icon="['fas', 'calculator']" />
        </button>
        <span class="text-muted ms-3">
          {{ resultCount }}
        </span>
      </div>
    </div>
    <div class="row">
      <NQLBox
        v-model:query="
          // eslint-disable-next-line vue/valid-v-model
          config.query_str as string
        "
        @update:query-parsed="queryObjChanged"
        :editable="editable"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import type { PropType } from "vue";
import {
  AssignmentScopeBaseConfigTypesEnum,
  AssignmentScopeModel,
  AssignmentScopeRandomWithNQLConfig,
} from "@/plugins/api/types";
import { API } from "@/plugins/api";
import { currentProjectStore } from "@/stores";
import NQLBox from "@/components/NQLBox.vue";
import { EventBus } from "@/plugins/events";
import { ToastEvent } from "@/plugins/events/events/toast";

export default defineComponent({
  name: "RandomAssignmentWithNQLConfig",
  components: { NQLBox },
  emits: ["configChanged"],
  props: {
    existingConfig: {
      type: Object as PropType<AssignmentScopeRandomWithNQLConfig>,
      required: false,
      default: null,
    },
    editable: {
      type: Boolean,
    },
  },
  data() {
    const config: AssignmentScopeRandomWithNQLConfig = this.existingConfig
      ? this.existingConfig
      : ({
          config_type: AssignmentScopeBaseConfigTypesEnum.RANDOM_NQL,
          num_items: 50,
          num_multi_coded_items: 50,
          min_assignments_per_item: 2,
          max_assignments_per_item: 2,
          query_parsed: {},
          query_str: "",
          random_seed: 10829,
        } as AssignmentScopeRandomWithNQLConfig);
    if (!this.existingConfig) {
      this.$emit("configChanged", config);
    }
    return {
      config,
      scopes: [] as AssignmentScopeModel[],
      queryStr: "",
      resultCount: undefined as number | undefined,
    };
  },
  methods: {
    getCount() {
      if (this.config.query_parsed)
        API.search
          .nqlQueryCountApiSearchNqlCountPost({
            xProjectId: currentProjectStore.projectId as string,
            requestBody: this.config.query_parsed,
          })
          .then((response) => {
            this.resultCount = response.data;
          })
          .catch(() => {
            EventBus.emit(new ToastEvent("WARN", "Did not receive an item count."));
          });
    },
    queryObjChanged(newQuery: object[]) {
      if (newQuery.length > 0) {
        this.config.query_parsed = newQuery[0];
      }
    },
  },
  mounted() {
    API.annotations
      .getAssignmentScopesForProjectApiAnnotationsAnnotateScopesGet({
        xProjectId: currentProjectStore.projectId as string,
      })
      .then((response) => {
        this.scopes = response.data;
      })
      .catch(() => {
        // ignore
      });
  },
  watch: {
    config: {
      handler(newValue: AssignmentScopeRandomWithNQLConfig) {
        this.$emit("configChanged", newValue);
      },
      deep: true,
    },
  },
});
</script>

<style scoped></style>
