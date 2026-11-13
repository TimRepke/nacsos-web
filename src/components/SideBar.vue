<template>
  <div class="col-8 col-md-2" :class="{ 'sidebar-hidden': !isOpen }">
    <div class="d-flex" style="height: calc(100vh - var(--topnav-height))">
      <div class="flex-grow-1 border-end overflow-auto" v-if="isOpen">
        <div v-if="projectPermissions" class="list-group rounded-0" style="margin-top: calc(var(--logo-size) / 2)">
          <div class="d-flex flex-column">
            <template v-for="(entry, ei) in sideMenu" :key="entry.name">
              <div
                v-if="entry.isVisible"
                class="d-flex flex-row p-2 list-group-item list-group-item-action border-end-0"
                :class="{ active: entry.isActive }"
              >
                <div style="width: 1.5em" class="me-1">
                  <font-awesome-icon
                    v-if="(entry.sub || []).length > 0"
                    :icon="entry.isActive || entry.toggleOpen ? 'angle-down' : 'angle-right'"
                    role="button"
                    @click="toggle(ei)"
                  />
                </div>
                <router-link
                  :to="entry.target"
                  v-if="entry.target"
                  role="button"
                  class="flex-grow-1 text-start text-decoration-none"
                  style="color: inherit"
                >
                  <span style="width: 1.5em" class="me-2">
                    <font-awesome-icon v-if="entry.icon" :icon="entry.icon" />
                  </span>
                  <span>{{ entry.name }}</span>
                </router-link>
                <span v-else>{{ entry.name }}</span>
              </div>
              <template v-for="subentry in entry.sub || []" :key="subentry.name">
                <div
                  v-if="subentry.isVisible"
                  class="d-flex flex-row p-2 list-group-item list-group-item-action border-end-0 list-group-item-info sub-link"
                  :class="{ active: subentry.isActive }"
                >
                  <router-link
                    :to="subentry.target"
                    role="button"
                    class="flex-grow-1 text-start text-decoration-none"
                    style="color: inherit"
                  >
                    <span style="width: 1.5em" class="me-2">
                      <font-awesome-icon v-if="subentry.icon" :icon="subentry.icon" />
                    </span>
                    <span>
                      {{ subentry.name }}
                    </span>
                  </router-link>
                </div>
              </template>
            </template>
          </div>
        </div>
      </div>
      <div
        id="sidebar-toggle"
        class="border border-start-0 rounded-end mt-5"
        role="button"
        tabindex="0"
        @click="toggleVisibility()"
        @keypress.enter="toggleVisibility()"
        @keypress.space="toggleVisibility()"
      >
        <a aria-label="test">
          <font-awesome-icon :icon="iconButton" />
        </a>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { currentProjectStore } from "@/stores";
import type { ProjectPermissionsModel } from "@/plugins/api/types";

interface MenuEntry {
  name: string;
  permission: boolean;
  target: string;
  routes: Array<string>;
  icon?: string;
  toggleOpen?: boolean;
  sub?: Array<MenuEntry>;
}

interface SideMenuEntry extends MenuEntry {
  isActive: boolean;
  isVisible: boolean;
  sub?: Array<SideMenuEntry>;
}

defineOptions({ name: "SideBar" });

const router = useRouter();

const perm: ProjectPermissionsModel | Record<string, never> = currentProjectStore.permissions || {};
const menu = ref([
  { name: "Overview", permission: true, target: "/project/overview", routes: ["project-overview"] },
  {
    name: "Import",
    permission: perm.imports_read,
    target: "/project/imports",
    routes: ["project-imports"],
    sub: [
      {
        name: "Imports",
        icon: "file-import",
        permission: perm.imports_read,
        target: "/project/imports/list",
        routes: ["project-imports-list", "project-imports-details"],
      },
      {
        name: "OpenAlex Solr",
        icon: "magnifying-glass",
        permission: perm.imports_read,
        target: "/project/imports/search",
        routes: ["project-imports-search"],
      },
    ],
  },
  {
    name: "Dataset",
    target: "/project/dataset",
    permission: perm.dataset_read,
    routes: ["project-dataset"],
    sub: [
      {
        name: "Explore",
        icon: "map-location-dot",
        target: "/project/dataset/list",
        permission: perm.dataset_read,
        routes: ["project-dataset-list", "project-dataset-item"],
      },
      // {
      //   name: "Item details",
      //   icon: "file-lines",
      //   target: "/project/dataset/item",
      //   permission: perm.dataset_read,
      //   routes: ["project-dataset-item"],
      // },
      {
        name: "Statistics",
        icon: "chart-pie",
        target: "/project/dataset/stats",
        permission: perm.dataset_read,
        routes: ["project-dataset-statistics"],
      },
      {
        name: "Export",
        icon: "file-export",
        target: "/project/dataset/export",
        permission: perm.dataset_read,
        routes: ["project-dataset-export"],
      },
    ],
  },
  {
    name: "Data Annotation",
    target: "/project/annotate/scopes",
    permission: perm.annotations_read,
    routes: ["project-annotate"],
    sub: [
      {
        name: "My Assignments",
        icon: "user-tag",
        target: "/project/annotate/scopes",
        permission: perm.annotations_read,
        routes: ["project-annotate-assignments", "project-annotate-item"],
      },
      {
        name: "Quality Monitor",
        target: "/project/annotate/quality",
        icon: "swatchbook",
        permission: perm.annotations_read,
        routes: ["project-annotate-quality"],
      },
      {
        name: "Progress Monitor",
        icon: "bars-progress",
        target: "/project/annotate/progress",
        permission: perm.annotations_read,
        routes: ["project-annotate-progress"],
      },
      {
        name: "Prioritisation",
        icon: "wand-magic-sparkles",
        target: "/project/config/priority/list",
        permission: perm.annotations_prio,
        routes: ["config-priority", "config-priority-setup", "config-priority-list"],
      },
      {
        name: "Label Manager",
        icon: "tags",
        target: "/project/config/annotations",
        permission: perm.annotations_edit,
        routes: [
          "config-annotation-schemes",
          "config-annotation-scheme-list",
          "config-annotation-scheme-edit",
          "config-annotation-scheme-scope",
          "config-annotation-resolve",
        ],
      },
      {
        name: "Highlighters",
        icon: "highlighter",
        target: "/project/config/annotations/highlighters",
        permission: perm.annotations_edit,
        routes: ["config-annotation-highlighters"],
      },
    ],
  },
  {
    name: "Supplemental data",
    target: null,
    permission: perm.pipelines_read || perm.annotations_read,
    routes: ["project-pipelines"],
    sub: [
      {
        name: "Pipeline artefacts",
        icon: "folder-tree",
        target: "/project/artefacts",
        permission: perm.artefacts_read || perm.pipelines_read,
        routes: ["project-artefacts", "project-artefacts-list", "project-artefacts-details"],
      },
      {
        name: "Bot Annotations",
        icon: "robot",
        target: "/project/bot-annotations",
        permission: perm.annotations_read,
        routes: ["project-bot-annotations", "project-bot-annotations-list"],
      },
    ],
  },
  {
    name: "Project",
    icon: "gear",
    permission: perm.owner,
    target: "/project/settings",
    routes: ["project-settings", "project-settings-settings"],
  },
] as Array<MenuEntry>);

const visible = ref<boolean | null>(null);
const windowWidth = ref(window.innerWidth);

const isOpen = computed<boolean>(() => {
  // bootstrap "md" breakpoint is >=768
  if (visible.value !== null) {
    return visible.value;
  }
  return windowWidth.value >= 768;
});
const iconButton = computed<string[]>(() => {
  return ["fas", isOpen.value ? "caret-left" : "caret-right"];
});
const sideMenu = computed<Array<SideMenuEntry>>(() => {
  return menu.value.map((entry: MenuEntry) => {
    let routes: Array<string> = entry.routes;
    let subEntries: Array<SideMenuEntry> = [];
    let isActive: boolean;
    if (entry.sub && entry.sub.length > 0) {
      routes = entry.sub.reduce((prev: Array<string>, curr: MenuEntry) => prev.concat(curr.routes), routes);
      isActive = anyOf(routes);
      subEntries = entry.sub.map((sub: MenuEntry) => {
        return {
          ...sub,
          isActive: anyOf(sub.routes),
          isVisible: sub.permission && (isActive || entry.toggleOpen),
        } as SideMenuEntry;
      });
    } else {
      isActive = anyOf(routes);
    }
    return { ...entry, isActive: isActive, isVisible: entry.permission, sub: subEntries };
  });
});
const projectPermissions = computed<ProjectPermissionsModel | Record<string, never>>(() => {
  return currentProjectStore.permissions || {};
});

function toggle(i: number) {
  menu.value[i].toggleOpen = !menu.value[i].toggleOpen;
}
function anyOf(routeNames: string[]): boolean {
  return routeNames.indexOf(router.currentRoute.value.name as string) >= 0;
}
function toggleVisibility(): void {
  visible.value = visible.value === null ? false : !visible.value;
}

onMounted(() => {
  window.onresize = () => {
    windowWidth.value = window.innerWidth;
  };
});
</script>

<style scoped>
.sidebar-hidden {
  width: 0.75rem !important;
}

#sidebar-toggle {
  width: 0.75rem;
  height: 2rem;
  color: rgb(128, 128, 128);
  font-size: 0.75rem;
  font-weight: bold;
  line-height: 2rem;
  cursor: pointer;
  background: white;
}

.sub-link {
  margin-left: 1rem !important;
  width: calc(100% - 1rem) !important;
  border: 0 !important;
}
</style>
