/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 *
 * The SerializedArtefact is the interface definition on how references to artefacts
 * are communicated. It is essentially just a proxy for `Artefact`.
 *
 */
export type SerializedArtefact = {
  serializer: string;
  dtype: string;
  filename: (string | null);
  filenames: (string | Array<string> | null);
};

