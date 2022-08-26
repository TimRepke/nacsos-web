/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $ContextAnnotation = {
  description: `Flattened and reduced version of the context_annotation object
  https://developer.twitter.com/en/docs/twitter-api/annotations/overview

  NOTE: Under the assumption that we could always recover the \`description\`
  of the domain and entity, this information is not stored to save space.`,
  properties: {
    domain_id: {
      type: 'string',
      isRequired: true,
    },
    domain_name: {
      type: 'string',
      isRequired: true,
    },
    entity_id: {
      type: 'string',
      isRequired: true,
    },
    entity_name: {
      type: 'string',
      isRequired: true,
    },
  },
} as const;
