import { beforeEach, describe, expect, it, vi } from "vitest";
import { mount } from "@vue/test-utils";

// Integration test: the component renders against the REAL pinia stores
// (currentProjectStore + interfaceSettingsStore incl. the highlighter store).
// Only the HTTP client is mocked; markdown parsing, highlighting and DOMPurify
// sanitizing run for real.

vi.mock("@/plugins/api", async () => {
  const { createApiMock } = await import("../fixtures/mockApi");
  return createApiMock();
});

import TextComponent from "@/components/items/TextComponent.vue";
import { currentProjectStore, interfaceSettingsStore } from "@/stores";
import { getProjectHighlighters } from "../fixtures/mockApi";
import { allHighlighterIds, projectHighlighters, PROJECT_ID, QUERY_ID } from "../fixtures/highlighters";
import { interfaceSettingsNoSelection } from "../fixtures/interfaceSettings";

function mountText(props: Record<string, unknown>) {
  return mount(TextComponent, {
    props,
    global: { stubs: { "font-awesome-icon": true } },
  });
}

function cardText(wrapper: ReturnType<typeof mountText>) {
  return wrapper.find("p.card-text").html();
}

beforeEach(async () => {
  getProjectHighlighters.mockReset();
  getProjectHighlighters.mockResolvedValue({ data: projectHighlighters });
  currentProjectStore.projectId = PROJECT_ID;
  interfaceSettingsStore.highlighters.enabled = true;
  interfaceSettingsStore.highlighters.active = { [PROJECT_ID]: [...allHighlighterIds] };
  interfaceSettingsStore.itemDisplay.columns = undefined;
  await currentProjectStore.highlighters.reload();
});

describe("TextComponent", () => {
  it("renders markdown and applies the project highlighters", () => {
    const wrapper = mountText({ text: "The **forest** area increased." });
    const html = cardText(wrapper);
    expect(html).toContain("<strong>");
    // highlight spans are inserted around/inside the rendered markdown
    expect(html).toMatch(/<strong><span[^>]*#0cf27b[^>]*>forest<\/span><\/strong>/i);
    expect(html).toMatch(/>area<\/span>/);
    // \bincreas*\b is a regex ("increa" + optional "s") -> "increased" stays plain
    expect(html).toContain(" increased.");
  });

  it("converts newlines to <br>", () => {
    const wrapper = mountText({ text: "first line\nsecond forest" });
    expect(cardText(wrapper)).toContain("<br>");
  });

  it("gives provided html precedence over markdown + highlighting", () => {
    // note: the template gates on `text`, so provided html only renders alongside a text prop
    const wrapper = mountText({ text: "the forest area", html: "<b>forest area</b>" });
    const html = cardText(wrapper);
    expect(html).toContain("<b>forest area</b>");
    expect(html).not.toContain("#0cf27b"); // highlighters are NOT applied to pre-built html
  });

  it("shows the missing text placeholder when no text is given", () => {
    const wrapper = mountText({});
    expect(wrapper.find("p.card-text").exists()).toBe(false);
    expect(wrapper.find("p.text-warning").text()).toContain("[Text missing]");

    const custom = mountText({ text: "", missingText: "nothing here" });
    expect(custom.find("p.text-warning").text()).toContain("nothing here");
  });

  it("renders blank text without crashing (applyActiveHighlighters returns null)", () => {
    const wrapper = mountText({ text: "   ", missingText: "nothing here" });
    // blank text is truthy -> the card branch renders, but must not blow up
    expect(wrapper.find("p.text-warning").exists()).toBe(false);
    expect(wrapper.find("p.card-text").exists()).toBe(true);
    expect(wrapper.find("p.card-text").text()).toBe("");
  });

  it("renders markdown but no highlights when highlighting is turned off", () => {
    interfaceSettingsStore.highlighters.enabled = false;
    const wrapper = mountText({ text: "The **forest** area" });
    const html = cardText(wrapper);
    expect(html).toContain("<strong>forest</strong>");
    expect(html).not.toMatch(/<span[^>]*background-color/i);
  });

  it("renders markdown but no highlights when no highlighter is selected", () => {
    interfaceSettingsStore.highlighters.active = { ...interfaceSettingsNoSelection.active };
    const wrapper = mountText({ text: "The **forest** area" });
    const html = cardText(wrapper);
    expect(html).toContain("<strong>forest</strong>");
    expect(html).not.toMatch(/<span[^>]*background-color/i);
  });

  it("sanitizes injected script from item text", () => {
    const wrapper = mountText({ text: "<script>alert(1)</script>\n\nthe forest" });
    const html = wrapper.html();
    expect(html).not.toMatch(/<script/i);
    expect(html).not.toContain("alert(1)");
    // harmless part is still highlighted
    expect(html).toMatch(/#0cf27b[^>]*>forest<\/span>/i);
  });

  it("sanitizes injected script from provided html", () => {
    const wrapper = mountText({ text: "the forest", html: "<b>ok</b><script>alert(1)</script>" });
    const html = cardText(wrapper);
    expect(html).toContain("<b>ok</b>");
    expect(html).not.toMatch(/<script/i);
  });

  describe("column iteration", () => {
    it("cycles the column setting 1..4 on button clicks", async () => {
      const wrapper = mountText({ text: "some **forest** text" });
      const button = wrapper.find("div[role='button']");
      for (const expected of [1, 2, 3, 4, 1, 2]) {
        await button.trigger("click");
        expect(interfaceSettingsStore.itemDisplay.columns).toBe(expected);
      }
    });

    it("applies the column style from the interface settings to the text", async () => {
      const wrapper = mountText({ text: "some **forest** text" });
      expect(wrapper.find("p.card-text").attributes("style") ?? "").not.toContain("column-count");
      await wrapper.find("div[role='button']").trigger("click"); // -> 1, still single column
      expect(wrapper.find("p.card-text").attributes("style") ?? "").not.toContain("column-count");
      await wrapper.find("div[role='button']").trigger("click"); // -> 2
      expect(wrapper.find("p.card-text").attributes("style")).toContain("column-count: 2;");
    });
  });

  it("picks up a different active highlighter selection per project", async () => {
    interfaceSettingsStore.highlighters.active = {
      [PROJECT_ID]: [QUERY_ID],
      other: [...allHighlighterIds],
    };
    const wrapper = mountText({ text: "Agroforestry forest" });
    const html = cardText(wrapper);
    expect(html).toMatch(/#0cf27b[^>]*>forest<\/span>/i); // Query selected
    expect(html).not.toContain("#ff9aa2"); // Restricting not selected for THIS project
  });
});
