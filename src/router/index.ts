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
    component: () => import(/* webpackChunkName: "LoginView" */ '../views/LoginView.vue'),
  },
  {
    path: '/project-list',
    name: 'project-list',
    component: () => import(/* webpackChunkName: "ProjectListView" */ '../views/Projects/ProjectListView.vue'),
  },
  {
    path: '/project/overview',
    name: 'project-overview',
    component: () => import(/* webpackChunkName: "ProjectOverviewView" */ '../views/Projects/ProjectOverviewView.vue'),
  },
  {
    path: '/project/dataset',
    name: 'project-dataset',
    component: () => import(/* webpackChunkName: "ProjectDataView" */ '../views/Projects/ProjectDataView.vue'),
  },
  {
    path: '/project/annotate',
    name: 'project-annotate',
    component: () => import(/* webpackChunkName: "AnnotationView" */ '../views/Annotations/AnnotationView.vue'),
  },
  {
    path: '/project/config/annotations/list',
    name: 'config-annotation-task-list',
    component: () => import(/* webpackChunkName: "AnnotationConfigListView" */ '../views/Annotations/AnnotationConfigListView.vue'),
  },
  {
    path: '/project/config/annotations/edit/:task_id',
    name: 'config-annotation-task-edit',
    component: () => import(/* webpackChunkName: "AnnotationConfigEditView" */ '../views/Annotations/AnnotationConfigEditView.vue'),
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
