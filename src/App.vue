<template>
  <div class="w-100 h-100 p-0 m-0">
    <template v-if="!isLoggedIn && $route.name !== 'about'">
      <LoginView />
    </template>
    <template v-else>

      <TopBar v-if="viewNeedsTopNav" class="d-flex flex-row vw-100" style="height: var(--topnav-height)" />
      <div class="d-flex flex-row" :class="{ 'w-100': !viewNeedsTopNav, 'h-100': !viewNeedsTopNav }">
        <SideBar
          v-if="viewNeedsSidebar"
          style="height: calc(100vh - var(--topnav-height));" />

        <router-view
          v-slot="{ Component }"
          class="col overflow-auto p-2 ps-md-3 pe-md-4 pb-3 text-start"
          :class="{ 'pt-4': !viewNeedsSidebar }"
          :style="{ height: (viewNeedsTopNav) ? 'calc(100vh - var(--topnav-height))' : undefined }">
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
      <router-link
        v-if="viewNeedsTopNav"
        to="/"
        class="text-decoration-none text-nowrap position-absolute d-inline-block mt-1 top-0"
        style="z-index: 2000; left:1rem;">
        <NacsosLogo class="mt-0" />
      </router-link>
      <ToastsViewer />
      <ConfirmationModal />
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import NacsosLogo from '@/components/NacsosLogo.vue';
import TopBar from '@/components/TopBar.vue';
import SideBar from '@/components/SideBar.vue';
import ToastsViewer from '@/components/ToastsViewer.vue';
import ConfirmationModal from '@/components/ConfirmationModal.vue';
import { currentProjectStore, currentUserStore } from '@/stores';
import { isOnRoute } from '@/util';
import LoginView from '@/views/User/LoginView.vue';

export default defineComponent({
  components: {
    NacsosLogo,
    ConfirmationModal,
    SideBar,
    TopBar,
    ToastsViewer,
    LoginView,
  },
  data() {
    return {
      projectStore: currentProjectStore,
      userStore: currentUserStore,
    };
  },
  computed: {
    viewNeedsSidebar(): boolean {
      return currentProjectStore.projectSelected && currentUserStore.isLoggedIn
        && !(isOnRoute(this.$route, 'admin')
          || isOnRoute(this.$route, 'user')
          || this.$route.name === 'project-list'
          || this.$route.name === 'about');
    },
    viewNeedsTopNav(): boolean {
      return currentUserStore.isLoggedIn;
    },
    isLoggedIn(): boolean {
      return currentUserStore.isLoggedIn;
    },
  },
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

nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
