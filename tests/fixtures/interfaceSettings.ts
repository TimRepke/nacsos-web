import { PROJECT_ID, QUERY_ID, RESTRICTING_ID } from "./highlighters";

export interface InterfaceSettingsFixture {
  enabled: boolean;
  active: Record<string, string[]>;
}

/** Highlighting globally turned off. */
export const interfaceSettingsDisabled: InterfaceSettingsFixture = {
  enabled: false,
  active: {},
};

/** Highlighting on, but no highlighter selected for this project. */
export const interfaceSettingsNoSelection: InterfaceSettingsFixture = {
  enabled: true,
  active: { [PROJECT_ID]: [] },
};

/** Highlighting on, all highlighters selected. */
export const interfaceSettingsAllSelected: InterfaceSettingsFixture = {
  enabled: true,
  active: { [PROJECT_ID]: [RESTRICTING_ID, QUERY_ID] },
};

/** Highlighting on, only some highlighters selected. */
export const interfaceSettingsSomeSelected: InterfaceSettingsFixture = {
  enabled: true,
  active: { [PROJECT_ID]: [QUERY_ID] },
};
