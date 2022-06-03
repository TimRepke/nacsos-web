import { Endpoint, EndpointFunction, ResponseReason } from '@/plugins/api/types.d';
import { callEndpointFactory } from '@/plugins/api/index';
import { AnnotationTask } from '@/types/annotation.d';
import { BaseItem } from '@/types/items/index.d';
import { TwitterItem } from '@/types/items/twitter.d';

export const AnnotationTaskLabelKinds = ['bool', 'str', 'int', 'float', 'single', 'multi'];

export interface TaskDefinitionRequestPayload {
  taskId: string;
}

export interface ProjectTasksRequestPayload {
  projectId: string;
}

export interface NextAnnotationItemRequestPayload {
  projectId: string;
}

export interface AnnotationItemResponse {
  task: AnnotationTask;
  item: TwitterItem | BaseItem;
}

const TaskDefinitionEndpoint: Endpoint<ResponseReason, AnnotationTask> = {
  method: 'GET',
  path: '/annotations/tasks/definition/{taskId}',
  paramsEncoding: 'PATH',
  transformResponse: (response) => {
    if (response.data) {
      return ['SUCCESS', 'SUCCESS', response.data];
    }
    return ['FAILED', 'POSTPROCESSING_FAILED'];
  },
};

const ProjectTasksEndpoint: Endpoint<ResponseReason, AnnotationTask[]> = {
  method: 'GET',
  path: '/annotations/tasks/list/{projectId}',
  paramsEncoding: 'PATH',
  transformResponse: (response) => {
    if (response.data) {
      return ['SUCCESS', 'SUCCESS', response.data];
    }
    return ['FAILED', 'POSTPROCESSING_FAILED'];
  },
};

const NextAnnotationItemEndpoint: Endpoint<ResponseReason, AnnotationItemResponse> = {
  method: 'GET',
  path: '/annotations/annotate/next/{projectId}',
  paramsEncoding: 'PATH',
  transformResponse: (response) => {
    if (response.data) {
      return ['SUCCESS', 'SUCCESS', response.data];
    }
    return ['FAILED', 'POSTPROCESSING_FAILED'];
  },
};

export const callTaskDefinitionEndpoint:
  EndpointFunction<TaskDefinitionRequestPayload, ResponseReason, AnnotationTask> = callEndpointFactory(TaskDefinitionEndpoint);

export const callProjectTasksEndpoint:
  EndpointFunction<ProjectTasksRequestPayload, ResponseReason, AnnotationTask[]> = callEndpointFactory(ProjectTasksEndpoint);

export const callNextAnnotationItemEndpoint:
  EndpointFunction<NextAnnotationItemRequestPayload,
    ResponseReason,
    AnnotationItemResponse> = callEndpointFactory(NextAnnotationItemEndpoint);
