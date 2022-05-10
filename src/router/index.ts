import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import { currentUserStore } from '@/stores';
import HomeView from '../views/HomeView.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue'),
  },
  {
    path: '/login',
    name: 'login',
    component: () => import(/* webpackChunkName: "about" */ '../views/LoginView.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
router.beforeEach(async (to, from) => {
  if (
    // check, whether user is authenticated
    !currentUserStore.isLoggedIn
    // prevent infinite redirects if user isn't logged in
    && to.name !== 'login'
  ) {
    // redirect to login page
    return { name: 'login' };
  }
  // otherwise, navigation is valid, so continue
  return true;
});

export default router;
