<template>
  <div class="card m-2 p-0 text-start w-100">
    <div class="card-body">
      <TextComponent class="card-text" :text="item.text" />
    </div>
    <div class="card-footer d-flex justify-content-between small text-muted" v-if="item.meta">
      <div class="position-absolute end-0">
        <font-awesome-icon :icon="['fas', 'circle-info']" class="me-2" @click="showAll = !showAll" />
      </div>
      <ul class="list-unstyled">
        <template v-for="(value, key) in item.meta" :key="key">
          <li v-if="!key.startsWith('_')">
            <strong>{{ key }}:</strong> {{ value }}
          </li>
        </template>
        <template v-if="showAll">
          <div>
            <strong>Item ID: </strong>
            <code>
              {{ item.item_id }}
            </code>
          </div>
          <template v-for="(value, key) in item.meta" :key="key">
            <li v-if="key.startsWith('_')" class="text-muted small">
              <strong>{{ key }}:</strong> {{ value }}
            </li>
          </template>
        </template>
      </ul>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import type { PropType } from "vue";
import type { BaseItem as BaseItemModel } from "@/types/items.d";
import TextComponent from "@/components/items/TextComponent.vue";

defineOptions({ name: "GenericItem" });

defineProps({
  item: {
    type: Object as PropType<BaseItemModel>,
    required: true,
    default: null,
  },
});

const showAll = ref(false);
</script>

<style scoped></style>
