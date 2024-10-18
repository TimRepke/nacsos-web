<template>
  <div>
    <h1>Project-wide text highlighting</h1>
    <div>
      <p>
        You can configure these highlighters based on a list of regular expressions. Later, you can select a (different)
        highlighter for each
        <router-link :to="{ name: 'config-annotation-scheme-list' }">assignment scope</router-link>
        in this project.
      </p>
      <p>
        Please note, that regular expressions are very powerful and can become very complex. It is strongly recommended
        to just use a list of terms separated by the | symbol. If you need to have more complex highlighters,
        <a href="https://regex101.com/r/im43P2/1" target="_blank" rel="noopener noreferrer">Regex101.com</a>
        is an excellent resource to develop and test expressions.
      </p>
    </div>
    <div class="accordion" id="highlighters">
      <div v-for="highlighter in highlighters" :key="highlighter.highlighter_id" class="accordion-item">
        <h2 class="accordion-header" :id="`header-${highlighter.highlighter_id}`">
          <button
            class="accordion-button collapsed"
            type="button"
            data-bs-toggle="collapse"
            :data-bs-target="`#hl-${highlighter.highlighter_id}`"
            aria-expanded="true"
            :aria-controls="`hl-${highlighter.highlighter_id}`"
          >
            {{ highlighter.name }}
          </button>
        </h2>
        <div
          :id="`hl-${highlighter.highlighter_id}`"
          class="accordion-collapse collapse"
          :aria-labelledby="`header-${highlighter.highlighter_id}`"
          data-bs-parent="#highlighters"
        >
          <div class="accordion-body">
            <div class="text-end">
              <button type="button" class="btn btn-success btn-sm" @click="saveHighlighter(highlighter)">
                <font-awesome-icon :icon="['fas', 'floppy-disk']" />
                Save
              </button>
            </div>
            <div class="row mb-2">
              <label :for="`highlighterName-${highlighter.highlighter_id}`" class="form-label">Highlighter name</label>
              <input
                :id="`highlighterName-${highlighter.highlighter_id}`"
                v-model="highlighter.name"
                type="text"
                class="form-control"
                placeholder="Highlighter name"
              />
            </div>
            <div class="row mb-2">
              <label :for="`tags-${highlighter.highlighter_id}`" class="form-label">Keywords</label>
              <textarea
                v-model="highlighter.keywordsStr"
                @input="onKeywordsStrChange(highlighter)"
                :id="`tags-${highlighter.highlighter_id}`"
                class="form-control"
                rows="3"
              />
              <span class="form-text"> Separate keywords by a pipe symbol (|). </span>
              <p v-if="highlighter.error" class="text-warning mt-2">
                This is not a valid expression.<br />
                <span class="text-danger">{{ highlighter.error }}</span>
              </p>
              <p>
                <ClosablePill
                  v-for="keyword in highlighter.keywords"
                  :key="keyword"
                  @clicked-x="onDropKeyword(highlighter, keyword)"
                  colour="info"
                  class="m-1"
                >
                  {{ keyword }}
                </ClosablePill>
              </p>
            </div>
            <div class="row">
              <label :for="`style-${highlighter.highlighter_id}`" class="form-label">Style</label>
              <input
                :id="`style-${highlighter.highlighter_id}`"
                v-model="highlighter.style"
                type="text"
                class="form-control"
                placeholder="Valid css style"
              />
              <ul class="list-unstyled">
                <li v-for="(template, templateIdx) in styleTemplates" :key="templateIdx" class="list-inline-item">
                  <button
                    type="button"
                    @click="highlighter.style = template"
                    class="btn btn-outline-secondary m-2 btn-sm"
                  >
                    Template {{ templateIdx }}
                  </button>
                </li>
              </ul>
              <p>
                This is a demonstration text with to <span :style="highlighter.style"> demonstrate how the style</span>
                looks like.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div>
      <button type="button" @click="addHighlighter" class="btn btn-outline-secondary m-2 btn-sm">
        <font-awesome-icon :icon="['far', 'square-plus']" />
        Add new highlighter
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { currentProjectStore } from "@/stores";
import { EventBus } from "@/plugins/events";
import { ToastEvent } from "@/plugins/events/events/toast";
import type { HighlighterModel } from "@/plugins/api/types";
import { API, toastReject } from "@/plugins/api";
import ClosablePill from "@/components/ClosablePill.vue";

type Highlighter = HighlighterModel & { keywordsStr: string; error?: string };

export default defineComponent({
  name: "HighlighterView",
  components: { ClosablePill },
  data() {
    return {
      highlighters: [] as Highlighter[],
      styleTemplates: [
        "background-color: #ff9aa2;",
        "background-color: #ffb7b2;",
        "background-color: #ffdac1;",
        "background-color: #ff9aa2; text-decoration: underline;",
        "background-color: #ffb7b2; text-decoration: underline;",
        "background-color: #ffdac1; text-decoration: underline;",
      ],
    };
  },
  async mounted() {
    API.highlighters
      .getProjectHighlightersApiHighlightersProjectGet({
        xProjectId: currentProjectStore.projectId as string,
      })
      .then((result) => {
        this.highlighters = result.data.map(
          (highlighter: HighlighterModel): Highlighter => ({
            ...highlighter,
            keywordsStr: highlighter.keywords.join("|"),
          }),
        );
      })
      .catch(toastReject);
  },
  methods: {
    addHighlighter() {
      this.highlighters.push({
        highlighter_id: crypto.randomUUID(),
        project_id: currentProjectStore.projectId,
        name: "New Highlighter",
        keywords: [],
        keywordsStr: "",
        style: "",
      } as Highlighter);
    },
    saveHighlighter(highlighter: HighlighterModel) {
      const highlighterCopy = JSON.parse(JSON.stringify(highlighter));
      delete highlighterCopy.keywordsStr;
      delete highlighterCopy.error;
      API.highlighters
        .upsertHighlighterApiHighlightersProjectPut({
          xProjectId: currentProjectStore.projectId as string,
          requestBody: highlighter,
        })
        .then((response) => {
          EventBus.emit(new ToastEvent("SUCCESS", `Saved highlighter with ID: ${response.data}`));
        })
        .catch(() => {
          EventBus.emit(new ToastEvent("ERROR", "Failed to save"));
        });
    },
    str2lst(str: string): string[] {
      return [...new Set(str.split("|").map((part: string) => part.trim()))];
    },
    onKeywordsStrChange(highlighter: Highlighter) {
      highlighter.keywords = this.str2lst(highlighter.keywordsStr);
      highlighter.error = undefined;
      try {
        new RegExp(highlighter.keywords.join("|"), "g");
      } catch (e: unknown) {
        highlighter.error = (e as Error).toString();
      }
    },
    onDropKeyword(highlighter: Highlighter, keyword: string) {
      highlighter.keywords = highlighter.keywords.filter((fKeyword: string) => fKeyword !== keyword);
      highlighter.keywordsStr = highlighter.keywords.join("|");
    },
  },
});
</script>

<style scoped></style>
