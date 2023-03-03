/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { CPULoadClassification } from './CPULoadClassification';
import type { ExecutionLocation } from './ExecutionLocation';
import type { SerializedArtefactReference } from './SerializedArtefactReference';
import type { TaskStatus } from './TaskStatus';

export type TaskModel = {
  task_id?: string;
  function_name: string;
  params?: (Record<string, (number | string | SerializedArtefactReference)> | string);
  user_id?: string;
  project_id?: string;
  comment?: string;
  location?: ExecutionLocation;
  fingerprint: string;
  time_created?: string;
  time_started?: string;
  time_finished?: string;
  est_runtime?: number;
  est_memory?: number;
  est_cpu_load?: CPULoadClassification;
  rec_expunge?: string;
  dependencies?: Array<string>;
  status?: TaskStatus;
};

