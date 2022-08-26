import { ArtefactReference, FunctionInfo, TaskInDB } from '@/plugins/client-pipe';

export type ArtefactCallback = (artefactRef: ArtefactReference) => void;

export type ParamsType = { [key: string]: string | number | string[] | number[] | ArtefactReference };

export type NestedLibrary = { [key: string]: NestedLibrary | FunctionInfo };

export interface BaseTask {
  task_id: string;
  function_name: string;
  params?: ParamsType;
  user_id?: string;
  project_id?: string;
  location?: TaskInDB.location;
}

export interface SubmittedTask extends BaseTask {
  force_run: boolean;
  forced_dependencies?: string[];
}

export interface TaskConfig {
  task: SubmittedTask;
  info: FunctionInfo;
}
