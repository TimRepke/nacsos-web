/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $UserPermission = {
  properties: {
    project_permission_id: {
      type: 'any-of',
      contains: [{
        type: 'string',
      }, {
        type: 'string',
        format: 'uuid',
      }, {
        type: 'null',
      }],
      isRequired: true,
    },
    project_id: {
      type: 'any-of',
      contains: [{
        type: 'string',
      }, {
        type: 'string',
        format: 'uuid',
      }],
      isRequired: true,
    },
    user_id: {
      type: 'any-of',
      contains: [{
        type: 'string',
      }, {
        type: 'string',
        format: 'uuid',
      }],
      isRequired: true,
    },
    owner: {
      type: 'boolean',
      isRequired: true,
    },
    dataset_read: {
      type: 'boolean',
      isRequired: true,
    },
    dataset_edit: {
      type: 'boolean',
      isRequired: true,
    },
    imports_read: {
      type: 'boolean',
      isRequired: true,
    },
    imports_edit: {
      type: 'boolean',
      isRequired: true,
    },
    annotations_read: {
      type: 'boolean',
      isRequired: true,
    },
    annotations_edit: {
      type: 'boolean',
      isRequired: true,
    },
    pipelines_read: {
      type: 'boolean',
      isRequired: true,
    },
    pipelines_edit: {
      type: 'boolean',
      isRequired: true,
    },
    artefacts_read: {
      type: 'boolean',
      isRequired: true,
    },
    artefacts_edit: {
      type: 'boolean',
      isRequired: true,
    },
    search_dimensions: {
      type: 'boolean',
      isRequired: true,
    },
    search_oa: {
      type: 'boolean',
      isRequired: true,
    },
    import_limit_oa: {
      type: 'number',
      isRequired: true,
    },
    user: {
      type: 'UserBaseModel',
      isRequired: true,
    },
  },
} as const;
