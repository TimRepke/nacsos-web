export interface SerializedArtefact {
  serializer: string;
  dtype: string;
  filename: string;
}

export interface Artefact {
  serializer: string;
  dtype: string;
  filename: string;
  fn_resolved?: boolean;
}

export interface ArtefactReference {
  task_id: string;
  artefact: string;
}

export type ArtefactCallback = (artefactRef: ArtefactReference) => void;

export interface KWARG {
  dtype: string[];
  optional?: boolean;
  default?: number | boolean | string;
  artefact?: SerializedArtefact;
  params?: { [key: string]: KWARG };
  options?: string[];
  generics?: string[];
}

export interface DeletionRequest {
  task_id: string;
  files: string[];
}

export type ArtefactFile = [string, number];
export type ParamsType = { [key: string]: string | number | string[] | number[] | ArtefactReference };
export type KWArgsType = { [key: string]: KWARG };
export type CPULoadClassification = 'VHIGH' | 'HIGH' | 'MEDIUM' | 'LOW' | 'MINIMAL';
export type ExecutionLocation = 'LOCAL' | 'PIK';

export const taskStatusOptions = ['PENDING', 'RUNNING', 'COMPLETED', 'FAILED', 'CANCELLED'] as const;
export type TaskStatus = typeof taskStatusOptions[number];

export interface FunctionInfo {
  module: string;
  function: string;
  kwargs: KWArgsType;
  name: string;
  docstring: string;
  artefacts: { [index: string]: Artefact };
  filepath: string;
  filepath_rel: string;
  tags?: string[];
  est_cpu_load: CPULoadClassification;
  recommended_lifetime?: number;
}

export type NestedLibrary = { [key: string]: NestedLibrary | FunctionInfo };

export interface BaseTask {
  task_id: string;
  function_name: string;
  params?: ParamsType;
  user_id?: string;
  project_id?: string;
  location?: ExecutionLocation;
}

export interface SubmittedTask extends BaseTask {
  force_run: boolean;
  forced_dependencies?: string[];
}

export interface TaskConfig {
  task: SubmittedTask;
  info: FunctionInfo;
}

export interface TaskInDB extends BaseTask {
  fingerprint: str;
  dt_submitted?: string;
  dt_started?: string;
  dt_finished?: string;
  dt_cancelled?: string;
  est_runtime?: number;
  est_memory?: number;
  est_cpu_load: CPULoadClassification;
  rec_expunge?: string;
  dependencies?: string[];
  comment: string;
  status: TaskStatus;
}