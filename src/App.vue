<template>
  <div>
    <TopBar v-if="userStore.isLoggedIn" />
    <div class="row g-0">
      <template v-if="projectStore.projectSelected && userStore.isLoggedIn">
        <SideBar />
      </template>

      <RouterView v-slot="{ Component }" class="col router-wrapper">
        <template v-if="Component">
          <Transition mode="out-in">
            <KeepAlive>
              <Suspense>
                <!-- main content -->
                <component :is="Component" />

                <!-- loading state -->
                <template #fallback>
                  Loading...<br />
                  If this takes longer than expected, something might be wrong.
                </template>
              </Suspense>
            </KeepAlive>
          </Transition>
        </template>
      </RouterView>

      <!--router-view class="col router-wrapper"/-->
    </div>
    <ToastsViewer />
    <ConfirmationModal />
  </div>
</template>

<script lang="ts">
import TopBar from '@/components/TopBar.vue';
import SideBar from '@/components/SideBar.vue';
import ToastsViewer from '@/components/ToastsViewer.vue';
import ConfirmationModal from '@/components/ConfirmationModal.vue';
import { currentProjectStore, currentUserStore } from '@/stores';

export default {
  components: {
    ConfirmationModal,
    SideBar,
    TopBar,
    ToastsViewer,
  },
  data() {
    return {
      projectStore: currentProjectStore,
      userStore: currentUserStore,
    };
  },
};
</script>

<style lang="scss">
:root {
  --topnav-height: 3rem;
  --body-height: calc(100vh - var(--topnav-height));
  --bs-break-xs: 0;
  --bs-break-sm: 576px;
  --bs-break-md: 768px;
  --bs-break-lg: 992px;
  --bs-break-xl: 1200px;
  --bs-break-xxl: 1400px;
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
