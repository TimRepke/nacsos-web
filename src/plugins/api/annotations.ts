import { Endpoint, EndpointFunction, ResponseReason } from '@/plugins/api/types.d';
import { callEndpointFactory } from '@/plugins/api/index';
import {
  AnnotationTask,
  Assignment,
  AssignmentScope,
  AssignmentStatus, RandomAssignmentConfig,
  UserProjectAssignmentScope,
} from '@/types/annotation.d';
import { BaseItem } from '@/types/items/index.d';
import { TwitterItem } from '@/types/items/twitter.d';

export const AnnotationTaskLabelKinds = ['bool', 'str', 'int', 'float', 'single', 'multi'];

export interface TaskDefinitionRequestPayload {
  taskId: string;
}

export interface ProjectTasksRequestPayload {
  projectId: string;
}

export interface AnnotationItemRequestPayload {
  assignmentId: string;
}

export interface NextAnnotationItemRequestPayload {
  assignmentScopeId: string;
  currentAssignmentId?: string;
}

export interface AnnotatedItemRequestPayload {
  task: AnnotationTask;
  assignment: Assignment;
}

export interface AnnotationItemResponse {
  task: AnnotationTask;
  assignment: Assignment;
  scope: AssignmentScope;
  item: TwitterItem | BaseItem;
}

export interface MakeAssignmentsRequestPayload {
  task_id: string;
  scope_id: string;
  config: RandomAssignmentConfig;
  save: boolean;
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

const ProjectUserScopesEndpoint: Endpoint<ResponseReason, UserProjectAssignmentScope[]> = {
  method: 'GET',
  path: '/annotations/annotate/scopes/{projectId}',
  paramsEncoding: 'PATH',
  transformResponse: (response) => {
    if (response.data) {
      return ['SUCCESS', 'SUCCESS', response.data];
    }
    return ['FAILED', 'POSTPROCESSING_FAILED'];
  },
};

const ProjectScopesEndpoint: Endpoint<ResponseReason, AssignmentScope[]> = {
  method: 'GET',
  path: '/annotations/annotate/scopes/',
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

const NextOpenAnnotationItemEndpoint: Endpoint<ResponseReason, AnnotationItemResponse> = {
  method: 'GET',
  path: '/annotations/annotate/next/{assignmentScopeId}',
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
  path: '/annotations/annotate/next/{assignmentScopeId}/{currentAssignmentId}',
  paramsEncoding: 'PATH',
  transformResponse: (response) => {
    if (response.data) {
      return ['SUCCESS', 'SUCCESS', response.data];
    }
    return ['FAILED', 'POSTPROCESSING_FAILED'];
  },
};

const AnnotationItemEndpoint: Endpoint<ResponseReason, AnnotationItemResponse> = {
  method: 'GET',
  path: '/annotations/annotate/assignment/{assignmentId}',
  paramsEncoding: 'PATH',
  transformResponse: (response) => {
    if (response.data) {
      return ['SUCCESS', 'SUCCESS', response.data];
    }
    return ['FAILED', 'POSTPROCESSING_FAILED'];
  },
};

const ScopeAssignmentsEndpoint: Endpoint<ResponseReason, Assignment[]> = {
  method: 'GET',
  path: '/annotations/annotate/assignments/{assignmentScopeId}',
  paramsEncoding: 'PATH',
  transformResponse: (response) => {
    if (response.data) {
      return ['SUCCESS', 'SUCCESS', response.data];
    }
    return ['FAILED', 'POSTPROCESSING_FAILED'];
  },
};

const SaveAnnotationEndpoint: Endpoint<ResponseReason, AssignmentStatus> = {
  method: 'POST',
  path: '/annotations/annotate/save',
  paramsEncoding: 'BODY',
  transformResponse: (response) => {
    if (response.data) {
      return ['SUCCESS', 'SUCCESS', response.data];
    }
    return ['FAILED', 'POSTPROCESSING_FAILED'];
  },
};

const MakeAssignmentsEndpoint: Endpoint<ResponseReason, Assignment[]> = {
  method: 'POST',
  path: '/annotations/config/assignments/',
  paramsEncoding: 'BODY',
  transformResponse: (response) => {
    if (response.data) {
      return ['SUCCESS', 'SUCCESS', response.data];
    }
    return ['FAILED', 'POSTPROCESSING_FAILED'];
  },
};

export const callMakeAssignmentsEndpoint:
  EndpointFunction<MakeAssignmentsRequestPayload, ResponseReason, Assignment[]> = callEndpointFactory(MakeAssignmentsEndpoint);

export const callSaveAnnotationEndpoint:
  EndpointFunction<AnnotatedItemRequestPayload, ResponseReason, AssignmentStatus> = callEndpointFactory(SaveAnnotationEndpoint);

export const callProjectUserScopesEndpoint:
  EndpointFunction<ProjectTasksRequestPayload, ResponseReason,
    UserProjectAssignmentScope[]> = callEndpointFactory(ProjectUserScopesEndpoint);

export const callProjectScopesEndpoint:
  EndpointFunction<null, ResponseReason,
    AssignmentScope[]> = callEndpointFactory(ProjectScopesEndpoint);

export const callTaskDefinitionEndpoint:
  EndpointFunction<TaskDefinitionRequestPayload, ResponseReason, AnnotationTask> = callEndpointFactory(TaskDefinitionEndpoint);

export const callProjectTasksEndpoint:
  EndpointFunction<ProjectTasksRequestPayload, ResponseReason, AnnotationTask[]> = callEndpointFactory(ProjectTasksEndpoint);

export const callScopeAssignmentsEndpoint:
  EndpointFunction<NextAnnotationItemRequestPayload,
    ResponseReason,
    Assignment[]> = callEndpointFactory(ScopeAssignmentsEndpoint);

export const callNextAnnotationItemEndpoint:
  EndpointFunction<NextAnnotationItemRequestPayload,
    ResponseReason,
    AnnotationItemResponse> = callEndpointFactory(NextAnnotationItemEndpoint);

export const callNextOpenAnnotationItemEndpoint:
  EndpointFunction<NextAnnotationItemRequestPayload,
    ResponseReason,
    AnnotationItemResponse> = callEndpointFactory(NextOpenAnnotationItemEndpoint);

export const callAnnotationItemEndpoint:
  EndpointFunction<AnnotationItemRequestPayload,
    ResponseReason,
    AnnotationItemResponse> = callEndpointFactory(AnnotationItemEndpoint);
