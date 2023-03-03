/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ExecutionLocation } from './ExecutionLocation';
import type { SerializedArtefactReference } from './SerializedArtefactReference';

export type SubmittedTask = {
  task_id?: string;
  function_name: string;
  params?: (Record<string, (number | string | SerializedArtefactReference)> | string);
  user_id?: string;
  project_id?: string;
  comment?: string;
  location?: ExecutionLocation;
  force_run?: boolean;
  forced_dependencies?: Array<string>;
};

