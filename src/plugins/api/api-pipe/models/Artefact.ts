/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * An Artefact is a reference to a file. A function indicating that it will produce an Artifact
 * essentially just "promises" to do so including a reference to how it's serialised and how it will call the file.
 * In the context of TaskLibrary.funct(artefact=...) the `filename` parameter is to be understood as a relative
 * path reference to the directory the Task execution will be referred to.
 * During runtime, the `filename` parameter contains the actual resolved absolute path.
 */
export type Artefact = {
  serializer: string;
  dtype: string;
  filename?: string;
  filenames?: (string | Array<string>);
  fn_resolved?: boolean;
};

