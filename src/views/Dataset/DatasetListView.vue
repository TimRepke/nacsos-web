<template>
  <div>
    <div class="row g-0">
      <!-- Search sidebar -->
      <div class="col-12 col-lg-3 order-lg-last overflow-auto text-start searchbar" v-show="showSearchBar">
        <div class="row m-2">
          <h3>Search options</h3>
        </div>
        <div class="row m-2 mt-0 small text-muted">
          Number of documents:
          <template v-if="queryNumItems !== null">
            {{ queryNumItems.toLocaleString('en') }} /
          </template>
          {{ totalNumItems.toLocaleString('en') }}
        </div>
        <div class="row m-2 mt-0">
          <n-q-l-box v-model:query="query" />
        </div>
        <div class="row m-2 mt-0">
          <div class="col">
            <button type="button" @click="runQuery" class="btn btn-outline-primary">Query</button>
          </div>
          <div class="col">
            <button type="button" @click="resetQuery" class="btn btn-outline-danger">Reset</button>
          </div>
        </div>
      </div>

      <div class="col">
        <div class="d-flex flex-column flex-shrink-1 item-container">
          <!-- Item viewer container -->
          <div class="d-flex flex-row flex-wrap p-2 overflow-auto border-bottom">
            <template v-if="itemList && itemList.length > 0">
              <AnyItemComponent
                v-for="(item) in itemList"
                :key="item.item_id"
                :item="item" />
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
      class="btn btn-outline-secondary position-fixed top-0 end-0 m-2 me-3"
      @click="showSearchBar = !showSearchBar">
      <font-awesome-icon :icon="['fas', 'filter']" />
    </button>
  </div>
</template>

<script lang="ts">
import { currentProjectStore } from '@/stores';
import AnyItemComponent from '@/components/items/AnyItem.vue';
import { useOffsetPagination } from '@vueuse/core';
import type { UseOffsetPaginationReturn } from '@vueuse/core';
import { defineComponent, reactive } from 'vue';
import type { AnyItem } from '@/types/items.d';
import { API, toastReject } from '@/plugins/api';
import NQLBox from '@/components/NQLBox.vue';

export default defineComponent({
  name: 'ProjectDataView',
  components: { NQLBox, AnyItemComponent },
  data() {
    return {
      query: '',
      projectType: currentProjectStore.project?.type,
      itemList: [] as AnyItem[],
      showSearchBar: true,
      navPagesWindowSize: 3,
      totalNumItems: 0,
      queryNumItems: null as number | null,
      pagination: reactive(useOffsetPagination({ total: 0 })),
    };
  },
  async mounted() {
    API.core.project.countProjectItemsApiProjectItemsCountGet({
      xProjectId: currentProjectStore.projectId as string,
    })
      .then((response) => {
        this.totalNumItems = response.data;
        this.pagination = reactive(
          useOffsetPagination({
            total: this.totalNumItems,
            page: this.$route.query.page || 1,
            pageSize: this.$route.query.pageSize || 20,
            onPageChange: this.fetchData,
            onPageSizeChange: this.fetchData,
          }),
        );
        this.fetchData(this.pagination);
      })
      .catch(toastReject);
  },
  methods: {
    fetchData({ currentPage, currentPageSize }: UseOffsetPaginationReturn): void {
      API.core.project.listProjectDataPagedApiProjectItemsItemTypeListPagePageSizeGet({
        xProjectId: currentProjectStore.projectId as string,
        page: this.pagination.currentPage,
        pageSize: this.pagination.currentPageSize,
        itemType: currentProjectStore.project!.type,
      })
        .then((response) => {
          this.itemList = response.data;
          this.$router.push({ query: { page: currentPage, pageSize: currentPageSize } });
        })
        .catch(toastReject);
    },
    runQuery(): void {
      API.core.search.nqlQueryApiSearchNqlQueryGet({
        xProjectId: currentProjectStore.projectId as string,
        query: this.query,
        limit: 20,
      })
        .then((response) => {
          const { data } = response;
          this.itemList = data.docs;
          this.queryNumItems = data.n_docs;
        })
        .catch(toastReject);
    },
    resetQuery(): void {
      this.fetchData(this.pagination);
      this.query = '';
      this.queryNumItems = null;
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
});
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
