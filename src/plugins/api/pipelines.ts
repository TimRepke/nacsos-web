import { Endpoint, EndpointFunction, ResponseReason } from '@/plugins/api/types.d';
import { callPipelineEndpointFactory } from '@/plugins/api';
import { ArtefactFile, FunctionInfo, SubmittedTask, TaskInDB } from '@/types/pipelines.d';

export interface ProjectRequestPayload {
  projectId: string;
}

export interface TaskRequestPayload {
  taskId: string;
}

export interface FunctionRequestPayload {
  funcName: string;
}

export interface FunctionsRequestPayload {
  func_name: string[];
}

export interface ArtefactUploadPayload {
  file: File | File[];
  folder?: string;
}

export interface SearchRequestPayload {
  function_name?: string;
  fingerprint?: string;
  project_id?: string;
  user_id?: string;
  location?: string;
  status?: string;
}

// GET /api/library/list
// GET /api/library/info/{func_name}
// PATCH /api/library/refresh

// GET /api/queue/list
// GET /api/queue/list/{status}
// GET /api/queue/project/{project_id}/list
// GET /api/queue/project/{project_id}/list/{status}
// GET /api/queue/search
// GET /api/queue/status/{task_id}
// POST /api/queue/force-run/{task_id}
// PUT /api/queue/submit/tasks
// PUT /api/queue/submit/task
// PUT /api/queue/cancel/{task_id}
// DELETE /api/queue/task/{task_id}

// GET /api/artefacts/list/{task_id}
// GET /api/artefacts/log/{task_id}
// GET /api/artefacts/file
// GET /api/artefacts/files/{task_id}
// DELETE /api/artefacts/files
// DELETE /api/artefacts/task/{task_id}

const PipelineLibraryEndpoint: Endpoint<ResponseReason, FunctionInfo[]> = {
  method: 'GET',
  path: '/library/list',
  paramsEncoding: 'PATH',
};
const PipelineLibraryFunctionEndpoint: Endpoint<ResponseReason, FunctionInfo> = {
  method: 'GET',
  path: '/library/info/{funcName}',
  paramsEncoding: 'PATH',
};
const PipelineLibraryFunctionsEndpoint: Endpoint<ResponseReason, FunctionInfo[]> = {
  method: 'GET',
  path: '/library/infos',
  paramsEncoding: 'QUERY',
};
const PipelineRefreshLibraryEndpoint: Endpoint<ResponseReason, number> = {
  method: 'PATCH',
  path: '/library/refresh',
  paramsEncoding: 'PATH',
};

const PipelineTaskSearchEndpoint: Endpoint<ResponseReason, TaskInDB[]> = {
  method: 'GET',
  path: '/queue/search',
  paramsEncoding: 'QUERY',
};
const PipelineTasksSubmitEndpoint: Endpoint<ResponseReason, string[]> = {
  method: 'PUT',
  path: '/queue/submit/tasks',
  paramsEncoding: 'BODY',
};

const PipelineTaskArtefactsEndpoint: Endpoint<ResponseReason, ArtefactFile[]> = {
  method: 'GET',
  path: '/artefacts/list/{taskId}',
  paramsEncoding: 'PATH',
};
const UploadUserArtefactEndpoint: Endpoint<ResponseReason, string> = {
  method: 'POST',
  path: '/artefacts/files/upload',
  paramsEncoding: 'MULTI',
};
const UploadUserArtefactsEndpoint: Endpoint<ResponseReason, string[]> = {
  method: 'POST',
  path: '/artefacts/files/upload-many',
  paramsEncoding: 'MULTI',
};

// PIPELINE_API/api/library/*
export const callPipelineLibraryEndpoint:
  EndpointFunction<never, ResponseReason, FunctionInfo[]> = callPipelineEndpointFactory(PipelineLibraryEndpoint);
export const callPipelineLibraryFunctionEndpoint:
  EndpointFunction<FunctionRequestPayload, ResponseReason, FunctionInfo> = callPipelineEndpointFactory(PipelineLibraryFunctionEndpoint);
export const callPipelineLibraryFunctionsEndpoint:
  EndpointFunction<FunctionsRequestPayload, ResponseReason, FunctionInfo[]> = callPipelineEndpointFactory(PipelineLibraryFunctionsEndpoint);
export const callPipelineRefreshLibraryEndpoint:
  EndpointFunction<never, ResponseReason, number> = callPipelineEndpointFactory(PipelineRefreshLibraryEndpoint);

// PIPELINE_API/api/queue/*
export const callPipelineTaskSearchEndpoint:
  EndpointFunction<SearchRequestPayload, ResponseReason, TaskInDB[]> = callPipelineEndpointFactory(PipelineTaskSearchEndpoint);
export const callPipelineTasksSubmitEndpoint:
  EndpointFunction<SubmittedTask[], ResponseReason, string[]> = callPipelineEndpointFactory(PipelineTasksSubmitEndpoint);

// PIPELINE_API/api/artefacts/*
export const callPipelineTaskArtefactsEndpoint:
  EndpointFunction<TaskRequestPayload, ResponseReason, ArtefactFile[]> = callPipelineEndpointFactory(PipelineTaskArtefactsEndpoint);
export const callUploadUserArtefactEndpoint:
  EndpointFunction<ArtefactUploadPayload, ResponseReason, string> = callPipelineEndpointFactory(UploadUserArtefactEndpoint);
export const callUploadUserArtefactsEndpoint:
  EndpointFunction<ArtefactUploadPayload, ResponseReason, string[]> = callPipelineEndpointFactory(UploadUserArtefactsEndpoint);
