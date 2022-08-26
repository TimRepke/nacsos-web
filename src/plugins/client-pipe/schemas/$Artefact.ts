/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $Artefact = {
  description: `An Artefact is a reference to a file. A function indicating that it will produce an Artifact
  essentially just "promises" to do so including a reference to how it's serialised and how it will call the file.
  In the context of TaskLibrary.funct(artefact=...) the \`filename\` parameter is to be understood as a relative
  path reference to the directory the Task execution will be referred to.
  During runtime, the \`filename\` parameter contains the actual resolved absolute path.`,
  properties: {
    serializer: {
      type: 'string',
      isRequired: true,
    },
    dtype: {
      type: 'string',
      isRequired: true,
    },
    filename: {
      type: 'string',
    },
    filenames: {
      type: 'any-of',
      contains: [{
        type: 'string',
      }, {
        type: 'array',
        contains: {
          type: 'string',
        },
      }],
    },
    fn_resolved: {
      type: 'boolean',
    },
  },
} as const;
