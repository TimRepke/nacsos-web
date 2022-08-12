import { Endpoint, EndpointFunction, ResponseReason } from '@/plugins/api/types.d';
import { callEndpointFactory } from '@/plugins/api/index';
import {
  AnnotationScheme,
  Assignment,
  AssignmentConfigType,
  AssignmentScope,
  AssignmentScopeCounts,
  AssignmentStatus,
  UserProjectAssignmentScope,
} from '@/types/annotation.d';
import { AnyItem } from '@/types/items/index.d';

export const AnnotationSchemeLabelKinds = ['bool', 'str', 'int', 'float', 'single', 'multi'] as const;
export type AnnotationSchemeLabelKindsType = typeof AnnotationSchemeLabelKinds[number];

export interface SchemeDefinitionRequestPayload {
  annotationSchemeId: string;
}

export interface ProjectSchemesRequestPayload {
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
  scheme: AnnotationScheme;
  assignment: Assignment;
}

export interface AnnotationItemResponse {
  scheme: AnnotationScheme;
  assignment: Assignment;
  scope: AssignmentScope;
  item: AnyItem;
}

export interface AssignmentScopeRequestPayload {
  assignmentScopeId: string;
}

export interface MakeAssignmentsRequestPayload {
  annotation_scheme_id: string;
  scope_id: string;
  config: AssignmentConfigType;
  save: boolean;
}

const SchemeDefinitionEndpoint: Endpoint<ResponseReason, AnnotationScheme> = {
  method: 'GET',
  path: '/annotations/schemes/definition/{annotationSchemeId}',
  paramsEncoding: 'PATH',
};

const SaveAnnotationSchemeEndpoint: Endpoint<ResponseReason, string> = {
  method: 'PUT',
  path: '/annotations/schemes/definition/',
  paramsEncoding: 'BODY',
};

const RemoveAnnotationSchemeEndpoint: Endpoint<ResponseReason, null> = {
  method: 'DELETE',
  path: '/annotations/schemes/definition/{annotationSchemeId}',
  paramsEncoding: 'PATH',
  transformResponse: (response) => {
    if (response.data) {
      return ['FAILED', 'REQUEST_FAILED', response.data.detail];
    }
    return ['SUCCESS', 'SUCCESS'];
  },
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

const ProjectSchemesEndpoint: Endpoint<ResponseReason, AnnotationScheme[]> = {
  method: 'GET',
  path: '/annotations/schemes/list/{projectId}',
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
  EndpointFunction<ProjectSchemesRequestPayload, ResponseReason,
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

export const callSchemeDefinitionEndpoint:
  EndpointFunction<SchemeDefinitionRequestPayload, ResponseReason, AnnotationScheme> = callEndpointFactory(SchemeDefinitionEndpoint);

export const callSaveAnnotationSchemeEndpoint:
  EndpointFunction<AnnotationScheme, ResponseReason, string> = callEndpointFactory(SaveAnnotationSchemeEndpoint);

export const callRemoveAnnotationSchemeEndpoint:
  EndpointFunction<SchemeDefinitionRequestPayload, ResponseReason, null> = callEndpointFactory(RemoveAnnotationSchemeEndpoint);

export const callProjectSchemesEndpoint:
  EndpointFunction<ProjectSchemesRequestPayload, ResponseReason, AnnotationScheme[]> = callEndpointFactory(ProjectSchemesEndpoint);

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
