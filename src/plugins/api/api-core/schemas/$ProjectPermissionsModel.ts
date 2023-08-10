/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $ProjectPermissionsModel = {
  description: `
  ProjectPermissions allows to define fine-grained project-level permission management.
  Once such an entry exists, the user is assumed to have very basic access to the respective project.
  A user may become "owner" of a project, which will allow them to do everything and effectively ignoring the
  other more fine-grained permission settings.

  It is assumed, that a user can always see and edit their own contributions (e.g. annotations) but
  by giving them permission to view annotations, they can also see other users' annotations.
  `,
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
  },
} as const;
