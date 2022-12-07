/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * This is an (unresolved) reference to an artefact of some function.
 * This model is used to save Task parameters in the database and to communicate to/from the frontend.
 *
 * Based on the information provided, the abstract reference can be resolved to a location on disk
 * where the file is (if respective task is completed) or will be.
 */
export type ArtefactReference = {
  task_id: string;
  artefact: string;
};

