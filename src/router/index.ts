import { createRouter, createWebHashHistory } from "vue-router";
import type { RouteRecordRaw } from "vue-router";
import { currentProjectStore, currentUserStore } from "@/stores";
import { isOnRoute } from "@/util";
import HomeView from "../views/HomeView.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/password-reset/:token",
    name: "password-reset",
    component: {
      template:
        "<strong>Seems like you would like to set a new password. " +
        "Please wait while I'm loading your information.</strong>",
    },
  },
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/about",
    name: "about",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "AboutView" */ "../views/AboutView.vue"),
  },
  {
    path: "/parse",
    name: "parse",
    alias: ["/nql"],
    component: () => import(/* webpackChunkName: "ParseView" */ "../views/ParseView.vue"),
  },
  {
    path: "/project-list",
    name: "project-list",
    component: () => import(/* webpackChunkName: "ProjectListView" */ "../views/Projects/ProjectsListView.vue"),
  },
  {
    path: "/project/overview",
    name: "project-overview",
    component: () => import(/* webpackChunkName: "ProjectOverviewView" */ "../views/Projects/ProjectOverviewView.vue"),
  },
  {
    path: "/project/artefacts",
    name: "project-artefacts",
    component: () => import(/* webpackChunkName: "ArtefactsContainer" */ "../views/Artefacts/ArtefactsContainer.vue"),
    children: [
      {
        path: "",
        alias: ["", "list"],
        name: "project-artefacts-list",
        component: () => import(/* webpackChunkName: "ArtefactsListView" */ "../views/Artefacts/ArtefactsListView.vue"),
      },
      {
        path: "details/:taskId",
        name: "project-artefacts-details",
        component: () =>
          import(/* webpackChunkName: "ArtefactDetailsView" */ "../views/Artefacts/ArtefactDetailsView.vue"),
      },
    ],
  },
  {
    path: "/project/bot-annotations",
    name: "project-bot-annotations",
    component: () =>
      import(
        /* webpackChunkName: "BotAnnotationsContainer" */ "../views/Annotations/BotAnnotations/BotAnnotationsContainer.vue"
      ),
    children: [
      {
        path: "",
        alias: ["", "list"],
        name: "project-bot-annotations-list",
        component: () =>
          import(
            /* webpackChunkName: "BotAnnotationsListView" */ "../views/Annotations/BotAnnotations/BotAnnotationsListView.vue"
          ),
      },
    ],
  },
  {
    path: "/project/imports",
    name: "project-imports",
    component: () => import(/* webpackChunkName: "ImportsContainer" */ "../views/Imports/ImportsContainer.vue"),
    children: [
      {
        path: "",
        alias: ["", "list"],
        name: "project-imports-list",
        component: () => import(/* webpackChunkName: "ImportsListView" */ "../views/Imports/ImportsListView.vue"),
      },
      {
        path: "details/:import_id?",
        name: "project-imports-details",
        component: () => import(/* webpackChunkName: "ImportDetailsView" */ "../views/Imports/ImportDetailsView.vue"),
      },
      {
        path: "search",
        name: "project-imports-search",
        component: () => import(/* webpackChunkName: "OpenAlexSearchView" */ "../views/Imports/OpenAlexSearchView.vue"),
      },
    ],
  },
  {
    path: "/project/dataset",
    name: "project-dataset",
    component: () => import(/* webpackChunkName: "DatasetContainer" */ "../views/Dataset/DatasetContainer.vue"),
    children: [
      {
        path: "",
        alias: ["", "list"],
        name: "project-dataset-list",
        component: () => import(/* webpackChunkName: "DatasetListView" */ "../views/Dataset/DatasetListView.vue"),
      },
      {
        path: "stats",
        name: "project-dataset-statistics",
        component: () =>
          import(/* webpackChunkName: "DatasetStatisticsView" */ "../views/Dataset/DatasetStatisticsView.vue"),
      },
      {
        path: "export",
        name: "project-dataset-export",
        component: () => import(/* webpackChunkName: "DatasetExportView" */ "../views/Dataset/DatasetExportView.vue"),
      },
    ],
  },
  {
    path: "/project/annotate",
    name: "project-annotate",
    component: () =>
      import(
        /* webpackChunkName: "AnnotationsContainer" */ "../views/Annotations/Annotations/AnnotationsContainer.vue"
      ),
    children: [
      {
        path: "",
        alias: ["", "scopes"],
        name: "project-annotate-assignments",
        component: () =>
          import(
            /* webpackChunkName: "AssignmentScopesView" */ "../views/Annotations/Annotations/AssignmentScopesView.vue"
          ),
      },
      {
        path: "item/:scope_id/:assignment_id?",
        name: "project-annotate-item",
        component: () =>
          import(/* webpackChunkName: "AnnotationsView" */ "../views/Annotations/Annotations/AnnotationsView.vue"),
      },
      {
        path: "quality",
        name: "project-annotate-quality",
        component: () =>
          import(
            /* webpackChunkName: "AnnotationQualityView" */ "../views/Annotations/Annotations/AnnotationQualityView.vue"
          ),
      },
      {
        path: "progress",
        name: "project-annotate-progress",
        component: () =>
          import(
            /* webpackChunkName: "AnnotationProgressView" */ "../views/Annotations/Annotations/AnnotationProgressView.vue"
          ),
      },
    ],
  },
  {
    path: "/project/config/annotations",
    name: "config-annotation-schemes",
    component: () =>
      import(
        /* webpackChunkName: "AnnotationConfigsContainer" */ "../views/Annotations/AnnotationConfigs/AnnotationConfigsContainer.vue"
      ),
    children: [
      {
        path: "",
        alias: ["", "list"],
        name: "config-annotation-scheme-list",
        component: () =>
          import(
            /* webpackChunkName: "AnnotationConfigListView" */ "../views/Annotations/AnnotationConfigs/AnnotationConfigListView.vue"
          ),
      },
      {
        path: "scope/:scope_id?",
        name: "config-annotation-scheme-scope",
        component: () =>
          import(
            /* webpackChunkName: "AssignmentScopeConfigView" */ "../views/Annotations/AnnotationConfigs/AssignmentScopeConfigView.vue"
          ),
      },
      {
        path: "scheme/:annotation_scheme_id?",
        name: "config-annotation-scheme-edit",
        component: () =>
          import(
            /* webpackChunkName: "AnnotationConfigEditView" */ "../views/Annotations/AnnotationConfigs/AnnotationConfigEditView.vue"
          ),
      },
      {
        path: "resolve/:bot_annotation_metadata_id?/scope/:assignment_scope_id?/scheme/:annotation_scheme_id?",
        name: "config-annotation-resolve",
        component: () =>
          import(
            /* webpackChunkName: "AnnotationConfigResolveView" */ "../views/Annotations/AnnotationConfigs/AnnotationConfigResolveView.vue"
          ),
      },
      {
        path: "highlighters",
        name: "config-annotation-highlighters",
        component: () =>
          import(
            /* webpackChunkName: "HighlightersView" */ "../views/Annotations/AnnotationConfigs/HighlightersView.vue"
          ),
      },
    ],
  },
  {
    path: "/project/settings",
    name: "project-settings",
    component: () =>
      import(/* webpackChunkName: "ProjectSettingsContainer" */ "../views/Projects/ProjectSettingsContainer.vue"),
    children: [
      {
        path: "",
        alias: ["", "settings"],
        name: "project-settings-settings",
        component: () =>
          import(/* webpackChunkName: "ProjectSettingsView" */ "../views/Projects/ProjectSettingsView.vue"),
      },
    ],
  },
  {
    path: "/admin",
    name: "admin",
    component: () => import(/* webpackChunkName: "AdminContainer" */ "../views/Admin/AdminContainer.vue"),
    children: [
      {
        path: "",
        alias: ["", "overview"],
        name: "admin-overview",
        component: () => import(/* webpackChunkName: "OverviewView" */ "../views/Admin/OverviewView.vue"),
      },
      {
        path: "users",
        name: "admin-users",
        component: () => import(/* webpackChunkName: "OverviewView" */ "../views/Admin/UserManagementView.vue"),
      },
      {
        path: "projects",
        name: "admin-projects",
        component: () =>
          import(/* webpackChunkName: "ProjectManagementView" */ "../views/Admin/ProjectManagementView.vue"),
      },
      {
        path: "celery",
        name: "admin-celery",
        component: () => import(/* webpackChunkName: "CeleryView" */ "../views/Admin/CeleryView.vue"),
      },
    ],
  },
  {
    path: "/user",
    name: "user",
    component: () => import(/* webpackChunkName: "UserContainer" */ "../views/User/UserContainer.vue"),
    children: [
      {
        path: "login",
        name: "user-login",
        component: () => import(/* webpackChunkName: "LoginView" */ "../views/User/LoginView.vue"),
      },
      {
        path: "profile",
        name: "user-profile",
        component: () => import(/* webpackChunkName: "UserProfileView" */ "../views/User/UserProfileView.vue"),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHashHistory(import.meta.env.VITE_NACSOS_BASE_URL),
  routes,
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
router.beforeEach(async (to) => {
  if (to.name === "password-reset") {
    await currentUserStore.loginWithAuthToken(to.params.token as string);
    return { name: "user-profile" };
  }

  // if user is not authenticated -> redirect to login page
  // prevent infinite redirects if user isn't logged in
  if (!currentUserStore.isLoggedIn && to.name !== "user-login" && to.name !== "about") {
    return { name: "user-login" };
  }

  // if no project is selected (and it isn't on purpose) --> redirect to project selection page
  if (
    !currentProjectStore.projectSelected &&
    currentUserStore.isLoggedIn &&
    !(to.name === "project-list" || to.name === "user-profile" || to.name === "about" || isOnRoute(to, "admin"))
  ) {
    return { name: "project-list" };
  }

  // we are headed to a page where `currentProject` should not exist --> clear the store
  if (to.name === "project-list" || isOnRoute(to, "admin")) {
    currentProjectStore.clear();
  }

  // we are headed to the login page --> make sure `currentUser` is cleared
  if (to.name === "user-login") {
    currentUserStore.clear();
  }

  // otherwise, navigation is valid, so continue
  return true;
});

export default router;
