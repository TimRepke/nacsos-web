/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $Body_upload_files_api_artefacts_files_upload_many_post = {
  properties: {
    file: {
      type: 'array',
      contains: {
        type: 'binary',
        format: 'binary',
      },
      isRequired: true,
    },
  },
} as const;
