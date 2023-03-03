/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $Event = {
  properties: {
    event: {
      type: 'Enum',
      isRequired: true,
    },
    payload: {
      type: 'any-of',
      contains: [{
        type: 'ExampleSubEvent',
      }, {
        type: 'ExampleEvent',
      }],
      isRequired: true,
    },
  },
} as const;
