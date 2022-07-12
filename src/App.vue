<template>
  <!-- FIXME change v-if to state == logged-in-->
  <TopBar v-if="$router.currentRoute.value.path !== '/login'"/>
  <div class="row g-0">
    <!-- FIXME change v-if to state == logged-in-->
    <SideBar v-if="$router.currentRoute.value.path !== '/login'"/>

    <RouterView v-slot="{ Component }" class="col router-wrapper">
      <template v-if="Component">
        <Transition mode="out-in">
          <KeepAlive>
            <Suspense>
              <!-- main content -->
              <component :is="Component"></component>

              <!-- loading state -->
              <template #fallback>
                Loading...<br/>
                If this takes longer than expected, something might be wrong.
              </template>
            </Suspense>
          </KeepAlive>
        </Transition>
      </template>
    </RouterView>

    <!--router-view class="col router-wrapper"/-->
  </div>
  <ToastsViewer/>
  <ConfirmationModal/>
</template>

<script>
import TopBar from '@/components/TopBar.vue';
import SideBar from '@/components/SideBar.vue';
import ToastsViewer from '@/components/ToastsViewer.vue';
import ConfirmationModal from '@/components/ConfirmationModal.vue';

export default {
  components: { ConfirmationModal, SideBar, TopBar, ToastsViewer },
};
</script>

<style lang="scss">
:root {
  --topnav-height: 3rem;
  --body-height: calc(100vh - var(--topnav-height));
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
