import { Endpoint, EndpointFunction, ResponseReason } from '@/plugins/api/types.d';
import { callEndpointFactory } from '@/plugins/api/index';
import { Project, ProjectPermissions } from '@/types/project.d';

export interface ProjectRequestPayload {
  projectId: string;
}

export interface ProjectPermissionRequestPayload {
  projectId: string;
  projectPermissionId: string;
}

const ProjectsListEndpoint: Endpoint<ResponseReason, Project[]> = {
  method: 'GET',
  path: '/projects/list',
  transformResponse: (response) => {
    if (response.data) {
      return ['SUCCESS', 'SUCCESS', response.data];
    }
    return ['FAILED', 'POSTPROCESSING_FAILED'];
  },
};

const ProjectInfoEndpoint: Endpoint<ResponseReason, Project> = {
  method: 'GET',
  path: '/project/{projectId}/info/',
  paramsEncoding: 'PATH',
  transformResponse: (response) => {
    if (response.data) {
      return ['SUCCESS', 'SUCCESS', response.data];
    }
    return ['FAILED', 'POSTPROCESSING_FAILED'];
  },
};

const UserProjectPermissionsEndpoint: Endpoint<ResponseReason, ProjectPermissions> = {
  method: 'GET',
  path: '/project/{projectId}/permissions/me',
  paramsEncoding: 'PATH',
  transformResponse: (response) => {
    if (response.data) {
      return ['SUCCESS', 'SUCCESS', response.data];
    }
    return ['FAILED', 'POSTPROCESSING_FAILED'];
  },
};

const ListProjectPermissionsEndpoint: Endpoint<ResponseReason, ProjectPermissions[]> = {
  method: 'GET',
  path: '/project/{projectId}/permissions/list',
  paramsEncoding: 'PATH',
  transformResponse: (response) => {
    if (response.data) {
      return ['SUCCESS', 'SUCCESS', response.data];
    }
    return ['FAILED', 'POSTPROCESSING_FAILED'];
  },
};

const ProjectPermissionsEndpoint: Endpoint<ResponseReason, ProjectPermissions> = {
  method: 'GET',
  path: '/project/{projectId}/permissions/{projectPermissionId}',
  paramsEncoding: 'PATH',
  transformResponse: (response) => {
    if (response.data) {
      return ['SUCCESS', 'SUCCESS', response.data];
    }
    return ['FAILED', 'POSTPROCESSING_FAILED'];
  },
};

export const callProjectsListEndpoint:
  EndpointFunction<never, ResponseReason, Project[]> = callEndpointFactory(ProjectsListEndpoint);

export const callProjectInfoEndpoint:
  EndpointFunction<ProjectRequestPayload, ResponseReason, Project> = callEndpointFactory(ProjectInfoEndpoint);

export const callListProjectPermissionsEndpoint:
  EndpointFunction<ProjectRequestPayload, ResponseReason, ProjectPermissions[]> = callEndpointFactory(ListProjectPermissionsEndpoint);

export const callUserProjectPermissionsEndpoint:
  EndpointFunction<ProjectRequestPayload, ResponseReason, ProjectPermissions> = callEndpointFactory(UserProjectPermissionsEndpoint);

export const callProjectPermissionsEndpoint:
  EndpointFunction<ProjectPermissionRequestPayload, ResponseReason, ProjectPermissions> = callEndpointFactory(ProjectPermissionsEndpoint);
