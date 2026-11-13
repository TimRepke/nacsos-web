<template>
  <template v-if="!isLoggedIn && $route.name !== 'about'">
    <LoginView />
  </template>
  <template v-else>
    <TopBar v-if="viewNeedsTopNav" />

    <div class="d-flex flex-row" :class="{ 'w-100': !viewNeedsTopNav, 'h-100': !viewNeedsTopNav }">
      <SideBar v-if="viewNeedsSidebar" style="height: calc(100vh - var(--topnav-height))" />

      <router-view
        v-slot="{ Component }"
        class="col overflow-auto p-2 ps-md-3 pe-md-4 pb-3 text-start"
        :class="{ 'pt-4': !viewNeedsSidebar }"
        :style="{ height: viewNeedsTopNav ? 'calc(100vh - var(--topnav-height))' : undefined }"
      >
        <template v-if="Component">
          <Transition mode="out-in">
            <KeepAlive>
              <Suspense>
                <!-- main content -->
                <component :is="Component" />

                <!-- loading state -->
                <!--                <template #fallback>-->
                <!--                  Loading...<br />-->
                <!--                  If this takes longer than expected, something might be wrong.-->
                <!--                </template>-->
              </Suspense>
            </KeepAlive>
          </Transition>
        </template>
      </router-view>
    </div>

    <ToastsViewer />
    <ConfirmationModal />
  </template>
</template>

<script lang="ts" setup>
import { computed, defineAsyncComponent, onMounted } from "vue";
import { useRoute } from "vue-router";
import TopBar from "@/components/topbar/TopBar.vue";
import SideBar from "@/components/SideBar.vue";
import ToastsViewer from "@/components/ToastsViewer.vue";
import ConfirmationModal from "@/components/ConfirmationModal.vue";
import { currentProjectStore, currentUserStore } from "@/stores";
import { isOnRoute } from "@/util";
const LoginView = defineAsyncComponent(() => import("@/views/User/LoginView.vue"));

const route = useRoute();

onMounted(async () => {
  await currentProjectStore.highlighters.reload();
});

const viewNeedsSidebar = computed<boolean>(() => {
  return (
    currentProjectStore.projectSelected &&
    currentUserStore.isLoggedIn &&
    !(isOnRoute(route, "admin") || isOnRoute(route, "user") || route.name === "project-list" || route.name === "about")
  );
});
const viewNeedsTopNav = computed<boolean>(() => {
  return currentUserStore.isLoggedIn;
});
const isLoggedIn = computed<boolean>(() => {
  return currentUserStore.isLoggedIn;
});
</script>

<style lang="scss">
:root {
  --logo-size: 4rem;
  --topnav-height: 3rem;
  --body-height: calc(100vh - var(--topnav-height));
  --bs-break-xs: 0;
  --bs-break-sm: 576px;
  --bs-break-md: 768px;
  --bs-break-lg: 992px;
  --bs-break-xl: 1200px;
  --bs-break-xxl: 1400px;
}

#nacsos-logo {
  width: var(--logo-size);
  height: var(--logo-size);
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
