<template>
  <div class="m-0 p-0 position-relative">
    <div class="row g-0">
      <!-- Search sidebar -->
      <div class="col-12 col-lg-3 order-lg-last overflow-auto text-start searchbar" v-show="showSearchBar">
        <div class="row m-2">
          <h3>Search options</h3>
        </div>
        <div class="row m-2 mt-0">
          <div class="input-group p-0">
            <input id="search" class="form-control" aria-label="Fulltext search" placeholder="Search..." type="text"
                   style="padding-right: 3rem !important;">
            <i class="btn btn-outline-secondary">
              <font-awesome-icon icon="magnifying-glass-plus"/>
            </i>
          </div>
        </div>
        <div class="row m-2 mt-0">
          TODO: Search by import (aka query)
        </div>
        <div class="row m-2 mt-0">
          TODO: Search by user annotations
        </div>
        <div class="row m-2 mt-0">
          TODO: Search by import (aka query)
        </div>
      </div>

      <div class="col">
        <div class="d-flex flex-column flex-shrink-1 item-container">
          <!-- Item viewer container -->
          <div class="d-flex flex-row flex-wrap p-2 overflow-auto">
            <template v-if="projectType === 'twitter'">
              <TwitterItemComponent
                v-for="(tweet) in itemList"
                :key="tweet.item_id"
                :tweet="tweet"/>
            </template>
          </div>

          <!-- Pagination footer -->
          <nav aria-label="Page navigation" class="d-flex flex-row justify-content-center m-2 p-0">
            <ul class="pagination p-0 m-0">
              <li class="page-item disabled">
                <a class="page-link fw-normal" href="#" aria-label="Previous">
                  <span aria-hidden="true">&laquo;</span>
                </a>
              </li>
              <li class="page-item"><a class="page-link fw-normal" href="#">1</a></li>
              <li class="page-item active"><a class="page-link fw-normal" href="#">2</a></li>
              <li class="page-item"><a class="page-link fw-normal" href="#">3</a></li>
              <li class="page-item">
                <a class="page-link fw-normal" href="#" aria-label="Next">
                  <span aria-hidden="true">&raquo;</span>
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
    <button class="btn btn-outline-secondary position-absolute top-0 end-0 m-2 me-3"
            @click="showSearchBar = !showSearchBar">
      <font-awesome-icon :icon="['fas', 'filter']"/>
    </button>
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
  async setup() {
    const currentProject = currentProjectStore.project;
    const response = await callProjectTweetsListEndpoint({ projectId: currentProject.project_id as string });
    const itemList: TwitterItem[] | BaseItem[] | undefined = response.payload;
    return {
      itemList,
      projectType: currentProject.type,
    };
  },
  data() {
    return {
      showSearchBar: true,
    };
  },
  methods: {},
};
</script>

<style scoped>
/* --bs-break-lg */
@media (min-width: 992px) {
  .searchbar {
    height: var(--body-height);
  }

  .item-container {
    height: var(--body-height);
  }
}

.searchbar {
}

.item-container {
}

.clear-search-icon {
  color: rgb(204, 204, 204);
  z-index: 1000 !important;
  margin-left: -3rem !important;
}
</style>
