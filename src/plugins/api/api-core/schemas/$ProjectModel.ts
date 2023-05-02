/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $ProjectModel = {
  description: `Project is the basic structural and conceptual place around which all functionality evolves.
  It is essentially a container for a logically connected set of analyses, e.g. all work for a paper.

  Although Items (and subsequently their type-specific extensions) live outside the scope of a project,
  they way they are augmented by annotations and analysis outcomes is always constrained to the scope
  of a Project.`,
  properties: {
    project_id: {
      type: 'any-of',
      contains: [{
        type: 'string',
      }, {
        type: 'string',
        format: 'uuid',
      }],
    },
    name: {
      type: 'string',
      isRequired: true,
    },
    description: {
      type: 'string',
    },
    type: {
      type: 'any-of',
      contains: [{
        type: 'Enum',
      }, {
        type: 'ItemType',
      }],
      isRequired: true,
    },
    setting_motivational_quotes: {
      type: 'boolean',
    },
  },
} as const;
