import { vi } from "vitest";

/**
 * Shared mock for "@/plugins/api".
 *
 * Usage in a spec (the factory may not reference top-level variables of the
 * spec file, so the mock state lives here and is imported for assertions):
 *
 *   vi.mock("@/plugins/api", async () => {
 *     const { createApiMock } = await import("../fixtures/mockApi");
 *     return createApiMock();
 *   });
 *
 *   import { getProjectHighlighters } from "../fixtures/mockApi";
 */

/** Mock of API.highlighters.getProjectHighlightersApiHighlightersProjectGet */
export const getProjectHighlighters = vi.fn();

export function createApiMock() {
  return {
    API: {
      highlighters: {
        getProjectHighlightersApiHighlightersProjectGet: getProjectHighlighters,
      },
    },
    OpenAPI: { setToken: vi.fn() },
    ErrorLevel: { error: "error", warn: "warn", info: "info", success: "success" },
    ignore: (e: unknown) => e,
    toastReject: (e: unknown) => e,
  };
}
