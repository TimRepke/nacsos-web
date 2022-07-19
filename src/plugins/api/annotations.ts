import { Endpoint, EndpointFunction, ResponseReason } from '@/plugins/api/types.d';
import { callEndpointFactory } from '@/plugins/api/index';
import {
  AnnotationTask,
  Assignment, AssignmentConfigType,
  AssignmentScope, AssignmentScopeCounts,
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

export interface AssignmentScopeRequestPayload {
  assignmentScopeId: string;
}

export interface MakeAssignmentsRequestPayload {
  task_id: string;
  scope_id: string;
  config: AssignmentConfigType;
  save: boolean;
}

const TaskDefinitionEndpoint: Endpoint<ResponseReason, AnnotationTask> = {
  method: 'GET',
  path: '/annotations/tasks/definition/{taskId}',
  paramsEncoding: 'PATH',
};

const ProjectUserScopesEndpoint: Endpoint<ResponseReason, UserProjectAssignmentScope[]> = {
  method: 'GET',
  path: '/annotations/annotate/scopes/{projectId}',
  paramsEncoding: 'PATH',
};

const ProjectScopesEndpoint: Endpoint<ResponseReason, AssignmentScope[]> = {
  method: 'GET',
  path: '/annotations/annotate/scopes/',
  paramsEncoding: 'PATH',
};

const ScopeEndpoint: Endpoint<ResponseReason, AssignmentScope> = {
  method: 'GET',
  path: '/annotations/annotate/scope/{assignmentScopeId}',
  paramsEncoding: 'PATH',
};

const ScopeCountsEndpoint: Endpoint<ResponseReason, AssignmentScopeCounts> = {
  method: 'GET',
  path: '/annotations/annotate/scope/counts/{assignmentScopeId}',
  paramsEncoding: 'PATH',
};

const ProjectTasksEndpoint: Endpoint<ResponseReason, AnnotationTask[]> = {
  method: 'GET',
  path: '/annotations/tasks/list/{projectId}',
  paramsEncoding: 'PATH',
};

const NextOpenAnnotationItemEndpoint: Endpoint<ResponseReason, AnnotationItemResponse> = {
  method: 'GET',
  path: '/annotations/annotate/next/{assignmentScopeId}',
  paramsEncoding: 'PATH',
};

const NextAnnotationItemEndpoint: Endpoint<ResponseReason, AnnotationItemResponse> = {
  method: 'GET',
  path: '/annotations/annotate/next/{assignmentScopeId}/{currentAssignmentId}',
  paramsEncoding: 'PATH',
};

const AnnotationItemEndpoint: Endpoint<ResponseReason, AnnotationItemResponse> = {
  method: 'GET',
  path: '/annotations/annotate/assignment/{assignmentId}',
  paramsEncoding: 'PATH',
};

const ScopeUserAssignmentsEndpoint: Endpoint<ResponseReason, Assignment[]> = {
  method: 'GET',
  path: '/annotations/annotate/assignments/{assignmentScopeId}',
  paramsEncoding: 'PATH',
};

const ScopeAssignmentsEndpoint: Endpoint<ResponseReason, Assignment[]> = {
  method: 'GET',
  path: '/annotations/annotate/assignments/scope/{assignmentScopeId}',
  paramsEncoding: 'PATH',
};

const SaveAssignmentScopeEndpoint: Endpoint<ResponseReason, string> = {
  method: 'PUT',
  path: '/annotations/annotate/scope/',
  paramsEncoding: 'BODY',
};

const RemoveAssignmentScopeEndpoint: Endpoint<ResponseReason, null> = {
  method: 'DELETE',
  path: '/annotations/annotate/scope/{assignmentScopeId}',
  paramsEncoding: 'PATH',
  transformResponse: (response) => {
    if (response.data) {
      return ['FAILED', 'REQUEST_FAILED', response.data.detail];
    }
    return ['SUCCESS', 'SUCCESS'];
  },
};

const SaveAnnotationEndpoint: Endpoint<ResponseReason, AssignmentStatus> = {
  method: 'POST',
  path: '/annotations/annotate/save',
  paramsEncoding: 'BODY',
};

const MakeAssignmentsEndpoint: Endpoint<ResponseReason, Assignment[]> = {
  method: 'POST',
  path: '/annotations/config/assignments/',
  paramsEncoding: 'BODY',
};

export const callMakeAssignmentsEndpoint:
  EndpointFunction<MakeAssignmentsRequestPayload, ResponseReason, Assignment[]> = callEndpointFactory(MakeAssignmentsEndpoint);

export const callSaveAnnotationEndpoint:
  EndpointFunction<AnnotatedItemRequestPayload, ResponseReason, AssignmentStatus> = callEndpointFactory(SaveAnnotationEndpoint);

export const callProjectUserScopesEndpoint:
  EndpointFunction<ProjectTasksRequestPayload, ResponseReason,
    UserProjectAssignmentScope[]> = callEndpointFactory(ProjectUserScopesEndpoint);

export const callProjectScopesEndpoint:
  EndpointFunction<null, ResponseReason, AssignmentScope[]> = callEndpointFactory(ProjectScopesEndpoint);

export const callScopeEndpoint:
  EndpointFunction<AssignmentScopeRequestPayload, ResponseReason, AssignmentScope> = callEndpointFactory(ScopeEndpoint);

export const callSaveAssignmentScopeEndpoint:
  EndpointFunction<AssignmentScope, ResponseReason, string> = callEndpointFactory(SaveAssignmentScopeEndpoint);

export const callRemoveAssignmentScopeEndpoint:
  EndpointFunction<AssignmentScopeRequestPayload, ResponseReason, null> = callEndpointFactory(RemoveAssignmentScopeEndpoint);

export const callScopeCountsEndpoint:
  EndpointFunction<AssignmentScopeRequestPayload, ResponseReason, AssignmentScopeCounts> = callEndpointFactory(ScopeCountsEndpoint);

export const callTaskDefinitionEndpoint:
  EndpointFunction<TaskDefinitionRequestPayload, ResponseReason, AnnotationTask> = callEndpointFactory(TaskDefinitionEndpoint);

export const callProjectTasksEndpoint:
  EndpointFunction<ProjectTasksRequestPayload, ResponseReason, AnnotationTask[]> = callEndpointFactory(ProjectTasksEndpoint);

export const callScopeAssignmentsEndpoint:
  EndpointFunction<AssignmentScopeRequestPayload, ResponseReason, Assignment[]> = callEndpointFactory(ScopeAssignmentsEndpoint);

export const callScopeUserAssignmentsEndpoint:
  EndpointFunction<AssignmentScopeRequestPayload, ResponseReason, Assignment[]> = callEndpointFactory(ScopeUserAssignmentsEndpoint);

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
