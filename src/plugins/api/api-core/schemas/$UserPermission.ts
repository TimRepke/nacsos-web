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
    },
    dataset_read: {
      type: 'boolean',
    },
    dataset_edit: {
      type: 'boolean',
    },
    imports_read: {
      type: 'boolean',
    },
    imports_edit: {
      type: 'boolean',
    },
    annotations_read: {
      type: 'boolean',
    },
    annotations_edit: {
      type: 'boolean',
    },
    pipelines_read: {
      type: 'boolean',
    },
    pipelines_edit: {
      type: 'boolean',
    },
    artefacts_read: {
      type: 'boolean',
    },
    artefacts_edit: {
      type: 'boolean',
    },
    search_dimensions: {
      type: 'boolean',
    },
    search_oa: {
      type: 'boolean',
    },
    import_limit_oa: {
      type: 'number',
    },
    user: {
      type: 'UserBaseModel',
      isRequired: true,
    },
  },
} as const;
