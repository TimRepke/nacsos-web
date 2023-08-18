/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { CPULoadClassification } from './CPULoadClassification';
import type { ExecutionLocation } from './ExecutionLocation';
import type { SerializedArtefactReference } from './SerializedArtefactReference';
import type { TaskStatus } from './TaskStatus';

export type TaskModel = {
  task_id?: (string | null);
  function_name: string;
  user_id?: (string | null);
  project_id?: (string | null);
  comment?: (string | null);
  location?: ExecutionLocation;
  params?: (Record<string, (number | string | SerializedArtefactReference)> | string | null);
  fingerprint: string;
  time_created?: (string | null);
  time_started?: (string | null);
  time_finished?: (string | null);
  est_runtime?: (number | null);
  est_memory?: (number | null);
  est_cpu_load?: CPULoadClassification;
  rec_expunge?: (string | null);
  dependencies?: (Array<string> | null);
  status?: TaskStatus;
};

