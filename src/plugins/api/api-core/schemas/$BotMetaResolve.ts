/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $BotMetaResolve = {
  properties: {
    algorithm: {
      type: 'Enum',
      isRequired: true,
    },
    ignore_hierarchy: {
      type: 'boolean',
      isRequired: true,
    },
    ignore_repeat: {
      type: 'boolean',
      isRequired: true,
    },
    snapshot: {
      type: 'array',
      contains: {
        type: 'SnapshotEntry',
      },
      isRequired: true,
    },
    resolutions: {
      type: 'array',
      contains: {
        type: 'ResolutionSnapshotEntry',
      },
      isRequired: true,
    },
  },
} as const;
