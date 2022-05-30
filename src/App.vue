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
                Loading...
              </template>
            </Suspense>
          </KeepAlive>
        </Transition>
      </template>
    </RouterView>

    <!--router-view class="col router-wrapper"/-->
  </div>
</template>

<script>
import TopBar from '@/components/TopBar.vue';
import SideBar from '@/components/SideBar.vue';

export default {
  components: { SideBar, TopBar },
};
</script>

<style lang="scss">
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

.router-wrapper {
  height: 100vh;
  /*margin-top: -3rem;*/
  padding-top: 3rem;
  overflow-x: hidden;
  overflow-y: auto;
}
</style>
