<template>
  <div class="position-relative">
    <div class="row g-0">
      <!-- Search sidebar -->
      <div class="col-12 col-lg-3 order-lg-last overflow-auto text-start searchbar p-2" v-show="showSearchBar">
        <div class="row">
          <div class="col">
            <h3>Search options</h3>
          </div>
        </div>
        <div class="row small text-muted mb-3">
          <div class="col">
            Number of documents:
            <template v-if="queryNumItems !== null"> {{ queryNumItems.toLocaleString("en") }} /</template>
            {{ totalNumItems.toLocaleString("en") }}
          </div>
        </div>
        <div class="row">
          <NQLBox v-model:query="queryStr" @update:query-parsed="updateQuery" />
        </div>
        <div class="row mt-2">
          <div class="col">
            <button
              type="button"
              @click="fetchData({ currentPage: 1, currentPageSize: 30 })"
              class="btn btn-outline-primary btn-sm"
            >
              Query
            </button>
          </div>
          <div class="col text-end">
            <button type="button" @click="resetQuery" class="btn btn-sm btn-outline-danger">Reset</button>
          </div>
        </div>
      </div>

      <div class="col-12 col-lg-9">
        <div class="d-flex flex-column flex-shrink-1 item-container">
          <!-- Item viewer container -->
          <div class="d-flex flex-row flex-wrap p-2 overflow-auto border-bottom">
            <template v-if="itemList && itemList.length > 0">
              <AnyItemComponent v-for="item in itemList" :key="item.item_id" :item="item" />
            </template>
            <template v-else> No data loaded yet or no data available.</template>
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
                  @click="pagination.currentPage = 1"
                >
                  <font-awesome-icon :icon="['fas', 'angles-left']" style="font-size: 0.7em" />
                </div>
              </li>
              <li class="page-item" :class="{ disabled: pagination.isFirstPage }">
                <div @click="pagination.prev" role="button" class="page-link fw-normal" aria-label="Previous page">
                  <font-awesome-icon :icon="['fas', 'angle-left']" style="font-size: 0.7em" />
                </div>
              </li>
              <li class="page-item disabled" v-show="pagination.currentPage > navPagesWindowSize">
                <div role="button" class="page-link fw-normal">&hellip;</div>
              </li>
              <li
                class="page-item"
                v-for="pageIt in navPages"
                :key="pageIt"
                :class="{ active: pagination.currentPage === pageIt }"
              >
                <div
                  @click="pagination.currentPage = pageIt"
                  role="button"
                  class="page-link fw-normal"
                  tabindex="0"
                  :aria-label="`Page ${pageIt}`"
                >
                  {{ pageIt }}
                </div>
              </li>
              <li
                class="page-item disabled"
                v-show="pagination.pageCount - pagination.currentPage > navPagesWindowSize"
              >
                <div role="button" class="page-link fw-normal">&hellip;</div>
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
                  @click="pagination.currentPage = pagination.pageCount"
                >
                  <font-awesome-icon :icon="['fas', 'angles-right']" style="font-size: 0.7em" />
                </div>
              </li>
            </ul>
          </nav>
        </div>
      </div>
      <button
        type="button"
        class="btn btn-outline-secondary position-absolute top-0 end-0"
        style="width: 2.5rem"
        @click="showSearchBar = !showSearchBar"
      >
        <font-awesome-icon :icon="['fas', 'filter']" />
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from "vue";
import { useOffsetPagination } from "@vueuse/core";
import type { UseOffsetPaginationReturn } from "@vueuse/core";
import { currentProjectStore } from "@/stores";
import AnyItemComponent from "@/components/items/AnyItem.vue";
import type { AnyItem } from "@/types/items.d";
import { API, toastReject } from "@/plugins/api";
import NQLBox from "@/components/NQLBox.vue";

export default defineComponent({
  name: "ProjectDataView",
  components: { NQLBox, AnyItemComponent },
  data() {
    return {
      queryStr: "",
      queryParsed: [],
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
    API.project
      .countProjectItemsApiProjectItemsCountGet({
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
    updateQuery(newQuery: object[]) {
      this.queryParsed = newQuery;
    },
    fetchData({ currentPage, currentPageSize }: UseOffsetPaginationReturn): void {
      if (this.queryParsed.length > 0) {
        API.search
          .nqlQueryApiSearchNqlQueryPost({
            xProjectId: currentProjectStore.projectId as string,
            requestBody: this.queryParsed[0],
            limit: this.$route.query.pageSize || 20,
            page: this.$route.query.page || 1,
          })
          .then((response) => {
            const { data } = response;
            this.itemList = data.docs;
            this.queryNumItems = data.n_docs;
            this.$router.push({ query: { page: currentPage, pageSize: currentPageSize } });
          })
          .catch(toastReject);
      } else {
        API.project
          .listProjectDataPagedApiProjectItemsItemTypeListPagePageSizeGet({
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
      }
    },
    resetQuery(): void {
      this.pagination.currentPage = 1;
      this.fetchData(this.pagination);
      this.queryStr = "";
      this.queryParsed = [];
      this.queryNumItems = null;
      //this.$router.push({ query: { page: 1, pageSize: 20 } });
    },
  },
  computed: {
    navPages(): number[] {
      const start =
        this.pagination.currentPage <= this.navPagesWindowSize
          ? 1
          : this.pagination.currentPage - this.navPagesWindowSize;
      const end =
        this.pagination.pageCount - this.pagination.currentPage <= this.navPagesWindowSize
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
