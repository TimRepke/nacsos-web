<template>
  <div class="m-0 p-0 position-relative">
    <div class="row g-0">
      <!-- Search sidebar -->
      <div class="col-12 col-lg-3 order-lg-last overflow-auto text-start searchbar" v-show="showSearchBar">
        <div class="row m-2">
          <h3>Search options</h3>
        </div>
        <div class="row m-2 mt-0">
          TODO: Tiny stats of dataset size and applied filters
          <p>
            <ClosablePill class="m-1">contains:Search term</ClosablePill>
            <ClosablePill colour="info" class="m-1">year: 2010-2013</ClosablePill>
            <ClosablePill colour="warning" class="m-1">query: "import 32"</ClosablePill>
            <ClosablePill colour="info" class="m-1">year: 2015-2018</ClosablePill>
          </p>
        </div>
        <div class="row m-2 mt-0">
          <div class="input-group p-0">
            <input
              id="search"
              class="form-control"
              aria-label="Fulltext search"
              placeholder="Search..."
              type="text"
              style="padding-right: 3rem !important;">
            <i class="btn btn-outline-secondary">
              <font-awesome-icon icon="magnifying-glass-plus" />
            </i>
          </div>
        </div>
        <div class="row m-2 mt-0">
          TODO: Search by import (aka query)
        </div>
        <div class="row m-2 mt-0">
          TODO: Search by assignment scopes
        </div>
        <div class="row m-2 mt-0">
          TODO: Search by user assignments
        </div>
        <div class="row m-2 mt-0">
          TODO: Search by user annotations
        </div>
        <div class="row m-2 mt-0">
          TODO: Search by import (aka query)
        </div>
        <div class="row m-2 mt-0">
          TODO: Overlap with other project
        </div>
        <div class="row m-2 mt-0">
          TODO: Search by year (maybe with little histogram?)
        </div>
        <div class="row m-2 mt-0">
          TODO: Search author of paper / user for tweet
        </div>
      </div>

      <div class="col">
        <div class="d-flex flex-column flex-shrink-1 item-container">
          <!-- Item viewer container -->
          <div class="d-flex flex-row flex-wrap p-2 overflow-auto">
            <template v-if="this.itemList && this.itemList.length > 0">
              <template v-if="projectType === 'twitter'">
                <AnyItemComponent
                  v-for="(item) in itemList"
                  :key="item.item_id"
                  :item="item" />
              </template>
              <template v-else>
                This type of data can not be rendered. Sorry.
              </template>
            </template>
            <template v-else>
              No data loaded yet or no data available.
            </template>
          </div>

          <!-- Pagination footer -->
          <nav aria-label="Page navigation" class="d-flex flex-row justify-content-center m-2 p-0">
            <ul class="pagination p-0 m-0">
              <li class="page-item" :class="{ disabled: pagination.isFirstPage }">
                <div
                  role="button"
                  class="page-link fw-normal"
                  aria-label="First page"
                  tabindex="0"
                  @click="pagination.currentPage = 1">
                  <font-awesome-icon :icon="['fas', 'angles-left']" style="font-size: 0.7em" />
                </div>
              </li>
              <li class="page-item" :class="{ disabled: pagination.isFirstPage }">
                <div @click="pagination.prev" role="button" class="page-link fw-normal" aria-label="Previous page">
                  <font-awesome-icon :icon="['fas', 'angle-left']" style="font-size: 0.7em" />
                </div>
              </li>
              <li class="page-item disabled" v-show="pagination.currentPage > navPagesWindowSize">
                <div role="button" class="page-link fw-normal">
                  &hellip;
                </div>
              </li>
              <li
                class="page-item"
                v-for="pageIt in navPages"
                :key="pageIt"
                :class="{ active: pagination.currentPage === pageIt }">
                <div
                  @click="pagination.currentPage = pageIt"
                  role="button"
                  class="page-link fw-normal"
                  tabindex="0"
                  :aria-label="`Page ${pageIt}`">
                  {{ pageIt }}
                </div>
              </li>
              <li
                class="page-item disabled"
                v-show="(pagination.pageCount - pagination.currentPage) > navPagesWindowSize">
                <div role="button" class="page-link fw-normal">
                  &hellip;
                </div>
              </li>
              <li class="page-item" :class="{ disabled: pagination.isLastPage }">
                <div @click="pagination.next" role="button" class="page-link fw-normal" aria-label="Next page">
                  <font-awesome-icon :icon="['fas', 'angle-right']" style="font-size: 0.7em" />
                </div>
              </li>
              <li class="page-item" :class="{ disabled: pagination.isLastPage }">
                <div
                  role="button"
                  class="page-link fw-normal"
                  tabindex="0"
                  aria-label="Last page"
                  @click="pagination.currentPage = pagination.pageCount">
                  <font-awesome-icon :icon="['fas', 'angles-right']" style="font-size: 0.7em" />
                </div>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
    <button
      type="button"
      class="btn btn-outline-secondary position-absolute top-0 end-0 m-2 me-3"
      @click="showSearchBar = !showSearchBar">
      <font-awesome-icon :icon="['fas', 'filter']" />
    </button>
  </div>
</template>

<script lang="ts">
import { currentProjectStore } from '@/stores';
import AnyItemComponent from '@/components/items/AnyItem.vue';
import { useOffsetPagination, UseOffsetPaginationReturn } from '@vueuse/core';
import ClosablePill from '@/components/ClosablePill.vue';
import { reactive } from 'vue';
import { AnyItem } from '@/types/items.d';
import { API, toastReject } from '@/plugins/api';

export default {
  name: 'ProjectDataView',
  components: { ClosablePill, AnyItemComponent },
  data() {
    return {
      projectType: currentProjectStore.project.type,
      itemList: [] as AnyItem[],
      showSearchBar: true,
      navPagesWindowSize: 3,
      totalNumItems: 0,
      pagination: reactive(useOffsetPagination({ total: 0 })),
    };
  },
  async mounted() {
    API.core.project.countProjectItemsApiProjectItemsCountGet({
      xProjectId: currentProjectStore.projectId,
    })
      .then((response) => {
        this.totalNumItems = response.data;
        this.pagination = useOffsetPagination({
          total: this.totalNumItems,
          page: this.$route.query.page || 1,
          pageSize: this.$route.query.pageSize || 20,
          onPageChange: this.fetchData,
          onPageSizeChange: this.fetchData,
        });
        this.fetchData(this.pagination);
      })
      .catch(toastReject);
  },
  methods: {
    fetchData({ currentPage, currentPageSize }: UseOffsetPaginationReturn): void {
      API.core.project.listProjectDataPagedApiProjectItemsItemTypeListPagePageSizeGet({
        xProjectId: currentProjectStore.projectId,
        page: this.pagination.currentPage,
        pageSize: this.pagination.currentPageSize,
        itemType: currentProjectStore.project.type,
      })
        .then((response) => {
          this.itemList = response.data;
          this.$router.push({ query: { page: currentPage, pageSize: currentPageSize } });
        })
        .catch(toastReject);
    },
  },
  computed: {
    navPages(): number[] {
      const start = (this.pagination.currentPage <= this.navPagesWindowSize)
        ? 1
        : this.pagination.currentPage - this.navPagesWindowSize;
      const end = ((this.pagination.pageCount - this.pagination.currentPage) <= this.navPagesWindowSize)
        ? this.pagination.pageCount
        : this.pagination.currentPage + this.navPagesWindowSize;

      return [...this.$util.range(start, end)];
    },
  },
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
</style>
