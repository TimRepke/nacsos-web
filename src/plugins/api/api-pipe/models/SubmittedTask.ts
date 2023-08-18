/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ExecutionLocation } from './ExecutionLocation';
import type { SerializedArtefactReference } from './SerializedArtefactReference';

export type SubmittedTask = {
  task_id?: (string | null);
  function_name: string;
  user_id?: (string | null);
  project_id?: (string | null);
  comment?: (string | null);
  location?: ExecutionLocation;
  params?: (Record<string, (number | string | SerializedArtefactReference)> | string | null);
  force_run?: boolean;
  forced_dependencies?: (Array<string> | null);
};

