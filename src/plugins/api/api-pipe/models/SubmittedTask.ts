/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ArtefactReference } from './ArtefactReference';

export type SubmittedTask = {
  task_id?: string;
  function_name: string;
  params?: (Record<string, (number | string | ArtefactReference)> | string);
  user_id?: string;
  project_id?: string;
  comment?: string;
  location?: SubmittedTask.location;
  force_run?: boolean;
  forced_dependencies?: Array<string>;
};

export namespace SubmittedTask {

  export enum location {
    LOCAL = 'LOCAL',
    PIK = 'PIK',
  }


}

