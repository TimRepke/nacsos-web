import { Endpoint, EndpointFunction, ResponseReason } from '@/plugins/api/types.d';
import { callEndpointFactory } from '@/plugins/api';
import { BaseItem } from '@/types/items/index.d';
import { TwitterItem } from '@/types/items/twitter.d';

export interface ProjectItemsRequestPayload {
  projectId: string;
}

export interface ProjectDetailRequestPayload {
  projectId: string;
  itemId: string;
}

const ProjectItemsListEndpoint: Endpoint<ResponseReason, BaseItem[]> = {
  method: 'GET',
  path: '/project/{projectId}/items/list/items',
  paramsEncoding: 'PATH',
  transformResponse: (response) => {
    if (response.data) {
      return ['SUCCESS', 'SUCCESS', response.data];
    }
    return ['FAILED', 'POSTPROCESSING_FAILED'];
  },
};

const ProjectTweetsListEndpoint: Endpoint<ResponseReason, TwitterItem[]> = {
  method: 'GET',
  path: '/project/{projectId}/items/twitter/list',
  paramsEncoding: 'PATH',
};

const ProjectItemCountEndpoint: Endpoint<ResponseReason, number> = {
  method: 'GET',
  path: '/project/{projectId}/items/count',
  paramsEncoding: 'PATH',
};

const ProjectItemDetailsEndpoint: Endpoint<ResponseReason, TwitterItem | BaseItem> = {
  method: 'GET',
  path: '/project/{projectId}/items/detail/{itemId}',
  paramsEncoding: 'PATH',
};

export const callProjectItemsListEndpoint:
  EndpointFunction<ProjectItemsRequestPayload, ResponseReason, BaseItem[]> = callEndpointFactory(ProjectItemsListEndpoint);

export const callProjectTweetsListEndpoint:
  EndpointFunction<ProjectItemsRequestPayload, ResponseReason, TwitterItem[]> = callEndpointFactory(ProjectTweetsListEndpoint);

export const callProjectItemCountEndpoint:
  EndpointFunction<ProjectItemsRequestPayload, ResponseReason, number> = callEndpointFactory(ProjectItemCountEndpoint);

export const callProjectItemDetailsEndpoint:
  EndpointFunction<ProjectDetailRequestPayload, ResponseReason, TwitterItem | BaseItem> = callEndpointFactory(ProjectItemDetailsEndpoint);
