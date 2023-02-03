/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $Filter = {
  properties: {
    condition: {
      type: 'all-of',
      contains: [{
        type: 'Condition',
      }],
    },
    type: {
      type: 'Enum',
      isRequired: true,
    },
    field: {
      type: 'Field',
      isRequired: true,
    },
    query: {
      type: 'string',
      isRequired: true,
    },
    value: {
      type: 'number',
      isRequired: true,
    },
    transformer: {
      type: 'all-of',
      contains: [{
        type: 'StrTransformerType',
      }],
    },
    sign: {
      type: 'all-of',
      contains: [{
        type: 'IntFilterSign',
      }],
    },
  },
} as const;
