import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { HighlighterModel } from "@/plugins/api/spec";

// --- mocks -------------------------------------------------------------------
// The store module pulls in the pinia store registry, the generated API client
// and the event bus at import time. Mock all of them so the highlighter logic
// can be tested in isolation.

vi.mock("@/plugins/api", async () => {
  const { createApiMock } = await import("../fixtures/mockApi");
  return createApiMock();
});

vi.mock("@/plugins/events", () => ({
  EventBus: { on: vi.fn(), emit: vi.fn(), off: vi.fn() },
}));

vi.mock("@/plugins/events/events/projects", () => ({
  CurrentProjectSetEvent: class CurrentProjectSetEvent {},
}));

vi.mock("@/stores", async () => {
  const { reactive } = await import("vue");
  return {
    default: {},
    currentProjectStore: reactive({ projectId: null as string | null | undefined }),
    interfaceSettingsStore: reactive({
      highlighters: {
        enabled: true,
        active: {} as Record<string, string[]>,
      },
    }),
  };
});

// --- imports under test (after mocks) ----------------------------------------
import { useProjectHighlighters } from "@/stores/CurrentProjectStore/highlighters";
import { currentProjectStore, interfaceSettingsStore } from "@/stores";
import { getProjectHighlighters } from "../fixtures/mockApi";
import {
  ADDITIONAL_ID,
  PROJECT_ID,
  QUERY_ID,
  RESTRICTING_ID,
  STUDY_ID,
  allHighlighterIds,
  highlightersWithInvalid,
  highlightersWithMaliciousStyle,
  projectHighlighters,
} from "../fixtures/highlighters";
import {
  interfaceSettingsAllSelected,
  interfaceSettingsDisabled,
  interfaceSettingsNoSelection,
  interfaceSettingsSomeSelected,
} from "../fixtures/interfaceSettings";

// --- helpers ------------------------------------------------------------------

/**
 * Build a highlighter store, load the given highlighters through the (mocked)
 * API and activate the given highlighter ids for the current project.
 */
async function newStore(highlighters: HighlighterModel[], activeIds: string[] = allHighlighterIds) {
  getProjectHighlighters.mockResolvedValue({ data: highlighters });
  const store = useProjectHighlighters();
  await store.reload();
  interfaceSettingsStore.highlighters.active = { [PROJECT_ID]: [...activeIds] };
  return store;
}

function countSpans(html: string | null): number {
  return (html?.match(/<span\b/g) ?? []).length;
}

// --- tests ---------------------------------------------------------------------

beforeEach(() => {
  vi.clearAllMocks();
  // the store logs every compiled regex -> keep test output readable
  vi.spyOn(console, "log").mockImplementation(() => {});
  currentProjectStore.projectId = PROJECT_ID;
  interfaceSettingsStore.highlighters.enabled = true;
  interfaceSettingsStore.highlighters.active = {};
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("loading highlighters", () => {
  it("requests highlighters for the current project", async () => {
    await newStore(projectHighlighters);
    expect(getProjectHighlighters).toHaveBeenCalledWith({
      headers: { "x-project-id": PROJECT_ID },
    });
  });

  it("loads nothing and never calls the API without a project", async () => {
    (currentProjectStore as unknown as { projectId?: string }).projectId = undefined;
    const store = useProjectHighlighters();
    await store.reload();
    expect(getProjectHighlighters).not.toHaveBeenCalled();
    expect(store.value.value).toEqual([]);
    // no highlighters -> text is returned unhighlighted
    expect(store.applyActiveHighlighters("forest area")).toBe("forest area");
  });
});

describe("empty text", () => {
  it("returns null for empty, blank, null and undefined input", async () => {
    const store = await newStore(projectHighlighters, interfaceSettingsAllSelected.active[PROJECT_ID]);
    expect(store.applyActiveHighlighters(null)).toBeNull();
    expect(store.applyActiveHighlighters(undefined)).toBeNull();
    expect(store.applyActiveHighlighters("")).toBeNull();
    expect(store.applyActiveHighlighters("   \n\t ")).toBeNull();
  });
});

describe("text without highlightable text", () => {
  it("returns the text unchanged and without spans", async () => {
    const store = await newStore(projectHighlighters);
    const result = store.applyActiveHighlighters("Nothing in this sentence matches any keyword.");
    expect(result).toBe("Nothing in this sentence matches any keyword.");
    expect(countSpans(result)).toBe(0);
  });
});

describe("highlighting turned off", () => {
  it("returns raw text even when highlighters would match and are selected", async () => {
    const store = await newStore(projectHighlighters, interfaceSettingsAllSelected.active[PROJECT_ID]);
    interfaceSettingsStore.highlighters.enabled = interfaceSettingsDisabled.enabled;
    const result = store.applyActiveHighlighters("urban forest area");
    expect(result).toBe("urban forest area");
    expect(countSpans(result)).toBe(0);
  });
});

describe("no highlighter selected", () => {
  it("returns raw text when the selection for this project is empty", async () => {
    const store = await newStore(projectHighlighters, interfaceSettingsNoSelection.active[PROJECT_ID]);
    expect(interfaceSettingsStore.highlighters.active[PROJECT_ID]).toEqual([]);
    const result = store.applyActiveHighlighters("urban forest area");
    expect(result).toBe("urban forest area");
    expect(countSpans(result)).toBe(0);
  });
});

describe("some highlighters selected", () => {
  it("only applies the selected highlighters", async () => {
    // Query terms only -> Restricting ("urban") must not be highlighted
    const store = await newStore(projectHighlighters, interfaceSettingsSomeSelected.active[PROJECT_ID]);
    const result = store.applyActiveHighlighters("The urban forest area")!;
    expect(result).toContain("urban");
    expect(result).not.toContain("#ff9aa2"); // Restricting not selected
    expect(countSpans(result)).toBe(2); // forest, area
    expect(result).toMatch(/#0cf27b[^>]*>forest<\/span>/i);
    expect(result).toMatch(/#0cf27b[^>]*>area<\/span>/i);
  });
});

describe("text without overlapping highlights", () => {
  it("wraps each match in exactly one span, case-insensitively", async () => {
    const store = await newStore(projectHighlighters, interfaceSettingsAllSelected.active[PROJECT_ID]);
    // Restricting + Query selected, none of their keywords overlap here.
    // Keywords are raw regexes: \bincreas*\b is "increa" + optional "s" and
    // matches neither "increased" nor "increase" -> only two spans.
    const result = store.applyActiveHighlighters("Forest area increased")!;
    expect(countSpans(result)).toBe(2);
    expect(result).toMatch(/#0cf27b[^>]*>Forest<\/span>/i); // original casing kept
    expect(result).toMatch(/#0cf27b[^>]*>area<\/span>/i);
    expect(result).toContain(" increased");
    expect(result).toBe(
      '<span style="background-color: #0cf27b;">Forest</span> ' +
        '<span style="background-color: #0cf27b;">area</span> increased',
    );
  });
});

describe("text where highlighter keywords might overlap", () => {
  it("applies the keyword regexes of the real project highlighters", async () => {
    const store = await newStore(projectHighlighters, interfaceSettingsAllSelected.active[PROJECT_ID]);
    const result = store.applyActiveHighlighters("urban mitigation and forest management")!;
    expect(countSpans(result)).toBe(3);
    expect(result).toMatch(/#ff9aa2[^>]*>urban<\/span>/i); // \burban\b
    expect(result).toMatch(/#0cf27b[^>]*>forest<\/span>/i); // \bforest\b
    expect(result).toMatch(/#ff9aa2[^>]*>management<\/span>/i); // management\b
    // \bmitigat*\b as a regex is "mitiga" + optional "t" -> "mitigation" is NOT matched
    expect(result).not.toMatch(/mitigation<\/span>/i);
  });

  it("honors word boundaries and prefers the earlier alternative inside one highlighter", async () => {
    const store = await newStore(projectHighlighters, [STUDY_ID]);
    const result = store.applyActiveHighlighters("In the study, surveys of China were reviewed.")!;
    expect(countSpans(result)).toBe(3);
    // "the study" (earlier alternative) beats "study"
    expect(result).toMatch(/>the study<\/span>/);
    // \bsurvey*\b ("surve" + optional y) fails on "surveys", the later `surveys\b` matches
    expect(result).toMatch(/>surveys<\/span>/);
    expect(result).toMatch(/>China<\/span>/);
    // \breview\b must NOT match "reviewed" (word boundary)
    expect(result).not.toContain("review</span>");
  });

  it("nests spans when two selected highlighters match the same word (current behavior)", async () => {
    // Both highlighters match "\bagroforestry\b"; highlighters are applied in
    // sequence, so Additional wraps the text again inside Restricting's span.
    const store = await newStore(projectHighlighters, [RESTRICTING_ID, ADDITIONAL_ID]);
    const result = store.applyActiveHighlighters("Agroforestry management")!;
    expect(countSpans(result)).toBe(3); // Agroforestry (x2 nested) + management
    // Additional's span is nested inside Restricting's span
    expect(result).toMatch(/#ff9aa2[^>]*><span[^>]*#0d6efd[^>]*>Agroforestry<\/span><\/span>/i);
    expect(result).toMatch(/>management<\/span>/);
  });

  it.fails("should only keep the first highlighter on an overlapping word", async () => {
    // Intended behavior: the first applied highlighter wins and the word is
    // highlighted exactly once, without nesting the other styles.
    const store = await newStore(projectHighlighters, [RESTRICTING_ID, ADDITIONAL_ID]);
    const result = store.applyActiveHighlighters("Agroforestry management")!;
    expect(countSpans(result)).toBe(2); // Agroforestry once + management
    expect(result).not.toContain("#0d6efd"); // first (Restricting) style wins
    expect(result).toMatch(/#ff9aa2[^>]*>Agroforestry<\/span>/i);
  });

  it("supports real regex features in keywords", async () => {
    const store = await newStore(
      [
        {
          highlighter_id: QUERY_ID,
          project_id: PROJECT_ID,
          name: "Regex keyword",
          keywords: ["colou?r"],
          style: "background-color: #0cf27b;",
        },
      ],
      [QUERY_ID],
    );
    const result = store.applyActiveHighlighters("color and colour")!;
    expect(countSpans(result)).toBe(2);
    expect(result).toMatch(/>color<\/span>/);
    expect(result).toMatch(/>colour<\/span>/);
  });

  it.fails("should treat regex metacharacters in keywords as literals", async () => {
    // BUG: keywords are injected raw into RegExp, so metacharacters act as
    // regex syntax and pathological patterns like "(a+)+$" are possible (ReDoS).
    const store = await newStore(
      [
        {
          highlighter_id: QUERY_ID,
          project_id: PROJECT_ID,
          name: "Dot keyword",
          keywords: ["a.b"],
          style: "background-color: #0cf27b;",
        },
      ],
      [QUERY_ID],
    );
    // "a.b" should only match the literal text "a.b", not "aXb"
    const result = store.applyActiveHighlighters("aXb but not a.b is expected")!;
    expect(countSpans(result)).toBe(0);
  });

  it.fails("should not apply later highlighters to markup inserted by earlier ones", async () => {
    // BUG: highlighters run over the HTML produced by previous highlighters, so
    // a keyword can match inside the inserted `style="background-color: ..."`
    // attributes and corrupt the markup.
    const store = await newStore(
      [
        {
          highlighter_id: QUERY_ID,
          project_id: PROJECT_ID,
          name: "Forest",
          keywords: ["forest"],
          style: "background-color: #0cf27b;",
        },
        {
          highlighter_id: RESTRICTING_ID,
          project_id: PROJECT_ID,
          name: "Matches previous style attr",
          keywords: ["background"],
          style: "background-color: #ff9aa2;",
        },
      ],
      [QUERY_ID, RESTRICTING_ID],
    );
    const result = store.applyActiveHighlighters("the forest")!;
    // the first span's style attribute must survive untouched
    expect(result).toContain('style="background-color: #0cf27b;"');
    expect(result).toContain(">forest</span>");
  });
});

describe("invalid highlighters", () => {
  it("skips highlighters with invalid or empty keywords and keeps the valid ones", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    const store = await newStore(highlightersWithInvalid);
    const result = store.applyActiveHighlighters("forest area")!;
    expect(countSpans(result)).toBe(2); // only the valid Query highlighter applied
    expect(result).toContain("#0cf27b");
    expect(result).not.toContain("#ff9aa2"); // null-keywords highlighter skipped
    expect(result).not.toContain("#fec601"); // empty-keywords highlighter skipped
    expect(warn).toHaveBeenCalledTimes(1); // warned for null keywords only, not for empty list
    warn.mockRestore();
    error.mockRestore();
  });

  it("skips a highlighter containing invalid regex syntax and keeps the others", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    const store = await newStore(
      [
        {
          // the "(" makes the whole joined pattern uncompilable -> the entire
          // highlighter is dropped, not just the bad keyword
          highlighter_id: QUERY_ID,
          project_id: PROJECT_ID,
          name: "Broken regex keyword",
          keywords: ["(", "forest"],
          style: "background-color: #0cf27b;",
        },
        {
          highlighter_id: STUDY_ID,
          project_id: PROJECT_ID,
          name: "Valid",
          keywords: ["\\bstudy\\b"],
          style: "background-color: #fec601;",
        },
      ],
      [QUERY_ID, STUDY_ID],
    );
    const result = store.applyActiveHighlighters("forest study")!;
    expect(result).not.toContain("#0cf27b");
    expect(result).toMatch(/#fec601[^>]*>study<\/span>/i);
    expect(warn).toHaveBeenCalledTimes(1);
    warn.mockRestore();
    error.mockRestore();
  });

  it("escapes and sanitizes a malicious highlighter style", async () => {
    const store = await newStore(highlightersWithMaliciousStyle, [QUERY_ID]);
    const result = store.applyActiveHighlighters("the forest")!;
    // the payload must end up escaped/inert, never as executable markup
    expect(result).not.toMatch(/<(?!\/?span\b)[a-z]/i); // no element besides the highlight span
    expect(result).toContain("&lt;img"); // injection survives only as escaped text
    expect(result).toMatch(/#0cf27b|>forest<\/span>/i);
    expect(result).toContain("forest");
  });
});
