import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import { currentProjectStore, currentUserStore } from '@/stores';
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
    component: () => import(/* webpackChunkName: "ProjectListView" */ '../views/Projects/ProjectsListView.vue'),
  },
  {
    path: '/project/overview',
    name: 'project-overview',
    component: () => import(/* webpackChunkName: "ProjectOverviewView" */ '../views/Projects/ProjectOverviewView.vue'),
  },
  {
    path: '/project/artefacts',
    name: 'project-artefacts',
    component: () => import(/* webpackChunkName: "ArtefactsContainer" */ '../views/Artefacts/ArtefactsContainer.vue'),
    children: [
      {
        path: '',
        alias: ['', 'list'],
        name: 'project-artefacts-list',
        component: () => import(/* webpackChunkName: "ArtefactsListView" */ '../views/Artefacts/ArtefactsListView.vue'),
      },
    ],
  },
  {
    path: '/project/pipelines',
    name: 'project-pipelines',
    component: () => import(/* webpackChunkName: "PipelinesContainer" */ '../views/Pipelines/PipelinesContainer.vue'),
    children: [
      {
        path: '',
        alias: ['', 'setup'],
        name: 'project-pipelines-setup',
        component: () => import(/* webpackChunkName: "PipelinesSetupView" */ '../views/Pipelines/PipelinesSetupView.vue'),
      },
      {
        path: 'presets',
        name: 'project-pipelines-presets',
        component: () => import(/* webpackChunkName: "PipelinePresetsView" */ '../views/Pipelines/PipelinePresetsView.vue'),
      },
    ],
  },
  {
    path: '/project/imports',
    name: 'project-imports',
    component: () => import(/* webpackChunkName: "ImportsContainer" */ '../views/Imports/ImportsContainer.vue'),
    children: [
      {
        path: '',
        alias: ['', 'list'],
        name: 'project-imports-list',
        component: () => import(/* webpackChunkName: "ImportsListView" */ '../views/Imports/ImportsListView.vue'),
      },
      {
        path: 'details/:import_id?',
        name: 'project-imports-details',
        component: () => import(/* webpackChunkName: "ImportDetailsView" */ '../views/Imports/ImportDetailsView.vue'),
      },
    ],
  },
  {
    path: '/project/dataset',
    name: 'project-dataset',
    component: () => import(/* webpackChunkName: "DatasetContainer" */ '../views/Dataset/DatasetContainer.vue'),
    children: [
      {
        path: '',
        alias: ['', 'list'],
        name: 'project-dataset-list',
        component: () => import(/* webpackChunkName: "DatasetListView" */ '../views/Dataset/DatasetListView.vue'),
      },
    ],
  },
  {
    path: '/project/annotate',
    name: 'project-annotate',
    component: () => import(/* webpackChunkName: "AnnotationsContainer" */ '../views/Annotations/Annotations/AnnotationsContainer.vue'),
    children: [
      {
        path: '',
        alias: ['', 'scopes'],
        name: 'project-annotate-assignments',
        component: () => import(/* webpackChunkName: "AssignmentScopesView" */ '../views/Annotations/Annotations/AssignmentScopesView.vue'),
      },
      {
        path: 'item/:scope_id/:assignment_id?',
        name: 'project-annotate-item',
        component: () => import(/* webpackChunkName: "AnnotationsView" */ '../views/Annotations/Annotations/AnnotationsView.vue'),
      },
    ],
  },
  {
    path: '/project/config/annotations',
    name: 'config-annotation-tasks',
    component: () => import(/* webpackChunkName: "AnnotationConfigsContainer" */ '../views/Annotations/AnnotationConfigs/AnnotationConfigsContainer.vue'),
    children: [
      {
        path: '',
        alias: ['', 'list'],
        name: 'config-annotation-task-list',
        component: () => import(/* webpackChunkName: "AnnotationConfigListView" */ '../views/Annotations/AnnotationConfigs/AnnotationConfigListView.vue'),
      },
      {
        path: 'scope/:scope_id?',
        name: 'config-annotation-task-scope',
        component: () => import(/* webpackChunkName: "AssignmentScopeConfigView" */ '../views/Annotations/AnnotationConfigs/AssignmentScopeConfigView.vue'),
      },
      {
        path: 'task/:task_id?',
        name: 'config-annotation-task-edit',
        component: () => import(/* webpackChunkName: "AnnotationConfigEditView" */ '../views/Annotations/AnnotationConfigs/AnnotationConfigEditView.vue'),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
router.beforeEach(async (to, from) => {
  // if user is not authenticated -> redirect to login page
  // prevent infinite redirects if user isn't logged in
  if (!currentUserStore.isLoggedIn && to.name !== 'login') {
    return { name: 'login' };
  }
  // if no project is selected -> redirect to project selection page
  if (!currentProjectStore.projectSelected && currentUserStore.isLoggedIn && to.name !== 'project-list') {
    return { name: 'project-list' };
  }

  // if we are headed to the project-list page, clear the store
  if (to.name === 'project-list') {
    currentProjectStore.clear();
  }

  // if we are headed to the project-list page, clear the store
  if (to.name === 'login') {
    currentUserStore.clear();
  }

  // otherwise, navigation is valid, so continue
  return true;

  // TODO add "if project set"
});

export default router;
