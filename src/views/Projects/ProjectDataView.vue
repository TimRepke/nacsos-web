<template>
  <div>
    <div class="d-flex flex-row flex-wrap p-2 scrollarea">
      <TwitterItemComponent
        v-for="(tweet) in itemList"
        :key="tweet.item_id"
        :tweet="tweet"/>
    </div>
  </div>
</template>

<script lang="ts">
import { callProjectTweetsListEndpoint } from '@/plugins/api/project/items';
import { BaseItem } from '@/types/items/index.d';
import { TwitterItem } from '@/types/items/twitter.d';
import { currentProjectStore } from '@/stores';
import TwitterItemComponent from '@/components/items/TwitterItem.vue';

export default {
  name: 'ProjectDataView',
  components: { TwitterItemComponent },
  created() {
    // noop
  },
  async setup() {
    const currentProjectId = currentProjectStore.project!.project_id!; // FIXME not cool
    const response = await callProjectTweetsListEndpoint({ projectId: currentProjectId });
    const itemList: TwitterItem[] | BaseItem[] | undefined = response.payload;
    return {
      itemList,
    };
  },
  methods: {},
};
</script>

<style scoped>

</style>
