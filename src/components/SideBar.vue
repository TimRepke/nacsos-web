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
        @click="toggleVisibility()"
        @keypress="toggleVisibility()"
      >
        <a aria-label="test">
          <font-awesome-icon :icon="iconButton" />
        </a>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import type { RouteLocationMatched } from "vue-router";
import { currentProjectStore } from "@/stores";
import type { ProjectPermissionsModel } from "@/plugins/api/api-core";

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

export default defineComponent({
  name: "SideBar",
  data() {
    const perm: ProjectPermissionsModel | Record<string, never> = currentProjectStore.projectPermissions || {};
    return {
      menu: [
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
              routes: ["project-dataset-list"],
            },
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
              name: "Task Configuration",
              icon: "wrench",
              target: "/project/pipelines/setup",
              permission: perm.pipelines_read,
              routes: ["project-pipelines-setup"],
            },
            {
              name: "Presets",
              icon: "timeline",
              target: "/project/pipelines/presets",
              permission: perm.pipelines_read,
              routes: ["project-pipelines-presets"],
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
      ] as Array<MenuEntry>,

      visible: null as boolean | null,
      windowWidth: window.innerWidth,
      opened: {
        import: false,
      },
    };
  },
  computed: {
    isOpen(): boolean {
      // bootstrap "md" breakpoint is >=768
      if (this.visible !== null) {
        return this.visible;
      }
      return this.windowWidth >= 768;
    },
    iconButton(): string[] {
      return ["fas", this.isOpen ? "caret-left" : "caret-right"];
    },
    sideMenu(): Array<SideMenuEntry> {
      return this.menu.map((entry: MenuEntry) => {
        let routes: Array<string> = entry.routes;
        let subEntries: Array<SideMenuEntry> = [];
        let isActive: boolean;
        if (entry.sub && entry.sub.length > 0) {
          routes = entry.sub.reduce((prev: Array<string>, curr: MenuEntry) => prev.concat(curr.routes), routes);
          isActive = this.anyOf(routes);
          subEntries = entry.sub.map((sub: MenuEntry) => {
            return {
              ...sub,
              isActive: this.anyOf(sub.routes),
              isVisible: sub.permission && (isActive || entry.toggleOpen),
            } as SideMenuEntry;
          });
        } else {
          isActive = this.anyOf(routes);
        }
        return { ...entry, isActive: isActive, isVisible: entry.permission, sub: subEntries };
      });
    },
    projectPermissions(): ProjectPermissionsModel | Record<string, never> {
      return currentProjectStore.projectPermissions || {};
    },
  },
  methods: {
    toggle(i: number) {
      this.menu[i].toggleOpen = !this.menu[i].toggleOpen;
    },
    isActive(parentName: string): boolean {
      return this.$router.currentRoute.value.matched.some((route: RouteLocationMatched) => route.name === parentName);
    },
    anyOf(routeNames: string[]): boolean {
      return routeNames.indexOf(this.$router.currentRoute.value.name) >= 0;
    },
    toggleVisibility(): void {
      this.visible = this.visible === null ? false : !this.visible;
    },
  },
  mounted() {
    window.onresize = () => {
      this.windowWidth = window.innerWidth;
    };
  },
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
