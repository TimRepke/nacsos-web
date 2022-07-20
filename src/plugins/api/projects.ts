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
};

const ProjectInfoEndpoint: Endpoint<ResponseReason, Project> = {
  method: 'GET',
  path: '/project/{projectId}/info/',
  paramsEncoding: 'PATH',
};

const UserProjectPermissionsEndpoint: Endpoint<ResponseReason, ProjectPermissions> = {
  method: 'GET',
  path: '/project/{projectId}/permissions/me',
  paramsEncoding: 'PATH',
};

const ListProjectPermissionsEndpoint: Endpoint<ResponseReason, ProjectPermissions[]> = {
  method: 'GET',
  path: '/project/{projectId}/permissions/list',
  paramsEncoding: 'PATH',
};

const ProjectPermissionsEndpoint: Endpoint<ResponseReason, ProjectPermissions> = {
  method: 'GET',
  path: '/project/{projectId}/permissions/{projectPermissionId}',
  paramsEncoding: 'PATH',
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
