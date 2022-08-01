import { Endpoint, EndpointFunction, ResponseReason } from '@/plugins/api/types.d';
import { callEndpointFactory } from '@/plugins/api';
import { ProjectTypeLiteral } from '@/types/project.d';
import { AnyItem } from '@/types/items/index.d';

export interface ProjectDataListRequestPayload {
  projectId: string;
  itemType: ProjectTypeLiteral;
}

export interface ProjectDataPagedListRequestPayload {
  projectId: string;
  page: number;
  pageSize: number;
  itemType: ProjectTypeLiteral;
}

export interface ProjectDataDetailRequestPayload {
  projectId: string;
  itemId: string;
  itemType: ProjectTypeLiteral;
}

export interface ProjectDataCountRequestPayload {
  projectId: string;
}

const ProjectDataListEndpoint: Endpoint<ResponseReason, AnyItem[]> = {
  method: 'GET',
  path: '/project/{projectId}/items/{itemType}/list',
  paramsEncoding: 'PATH',
};

const ProjectDataPagedListEndpoint: Endpoint<ResponseReason, AnyItem[]> = {
  method: 'GET',
  path: '/project/{projectId}/items/{itemType}/list/{page}/{pageSize}',
  paramsEncoding: 'PATH',
};

const ProjectDataDetailsEndpoint: Endpoint<ResponseReason, AnyItem> = {
  method: 'GET',
  path: '/project/{projectId}/items/{itemType}/detail/{itemId}',
  paramsEncoding: 'PATH',
};

const ProjectItemCountEndpoint: Endpoint<ResponseReason, number> = {
  method: 'GET',
  path: '/project/{projectId}/items/count',
  paramsEncoding: 'PATH',
  transformResponse: (response) => {
    if (response.data || response.data === 0) {
      return ['SUCCESS', 'SUCCESS', response.data];
    }
    return ['FAILED', 'POSTPROCESSING_FAILED'];
  },
};

export const callProjectDataListEndpoint:
  EndpointFunction<ProjectDataListRequestPayload, ResponseReason, AnyItem[]> = callEndpointFactory(ProjectDataListEndpoint);

export const callProjectDataPagedListEndpoint:
  EndpointFunction<ProjectDataPagedListRequestPayload, ResponseReason, AnyItem[]> = callEndpointFactory(ProjectDataPagedListEndpoint);

export const callProjectDataDetailsEndpoint:
  EndpointFunction<ProjectDataDetailRequestPayload, ResponseReason, AnyItem> = callEndpointFactory(ProjectDataDetailsEndpoint);

export const callProjectItemCountEndpoint:
  EndpointFunction<ProjectDataCountRequestPayload, ResponseReason, number> = callEndpointFactory(ProjectItemCountEndpoint);
