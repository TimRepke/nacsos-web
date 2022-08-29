/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ArtefactReference } from './ArtefactReference';

export type TaskInDB = {
  task_id?: string;
  function_name: string;
  params?: (Record<string, (number | string | ArtefactReference)> | string);
  user_id?: string;
  project_id?: string;
  comment?: string;
  location?: TaskInDB.location;
  fingerprint: string;
  dt_submitted?: string;
  dt_started?: string;
  dt_finished?: string;
  dt_cancelled?: string;
  est_runtime?: number;
  est_memory?: number;
  est_cpu_load?: TaskInDB.est_cpu_load;
  rec_expunge?: string;
  dependencies?: Array<string>;
  status?: TaskInDB.status;
};

export namespace TaskInDB {

  export enum location {
    LOCAL = 'LOCAL',
    PIK = 'PIK',
  }

  export enum est_cpu_load {
    VHIGH = 'VHIGH',
    HIGH = 'HIGH',
    MEDIUM = 'MEDIUM',
    LOW = 'LOW',
    MINIMAL = 'MINIMAL',
  }

  export enum status {
    PENDING = 'PENDING',
    RUNNING = 'RUNNING',
    COMPLETED = 'COMPLETED',
    FAILED = 'FAILED',
    CANCELLED = 'CANCELLED',
  }


}

