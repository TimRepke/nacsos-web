import { Endpoint, EndpointFunction, ResponseReason } from '@/plugins/api/types.d';
import { callEndpointFactory } from '@/plugins/api/index';
import { ImportModel } from '@/types/imports.d';

export interface ImportDefinitionRequestPayload {
  importId: string;
}

export interface ProjectImportsRequestPayload {
  projectId: string;
}

const ListProjectImportsEndpoint: Endpoint<ResponseReason, ImportModel[]> = {
  method: 'GET',
  path: '/imports/list',
  paramsEncoding: 'PATH',
};

const ImportItemCountEndpoint: Endpoint<ResponseReason, number> = {
  method: 'GET',
  path: '/imports/import/{importId}/count',
  paramsEncoding: 'PATH',
};

const ImportDetailsEndpoint: Endpoint<ResponseReason, ImportModel> = {
  method: 'GET',
  path: '/imports/import/{importId}',
  paramsEncoding: 'PATH',
};

const SaveImportEndpoint: Endpoint<ResponseReason, string> = {
  method: 'PUT',
  path: '/imports/import/',
  paramsEncoding: 'BODY',
};

export const callListProjectImportsEndpoint:
  EndpointFunction<never, ResponseReason, ImportModel[]> = callEndpointFactory(ListProjectImportsEndpoint);

export const callImportItemCountEndpoint:
  EndpointFunction<ImportDefinitionRequestPayload, ResponseReason, number> = callEndpointFactory(ImportItemCountEndpoint);

export const callImportDetailsEndpoint:
  EndpointFunction<ImportDefinitionRequestPayload, ResponseReason, ImportModel> = callEndpointFactory(ImportDetailsEndpoint);

export const callSaveImportEndpoint:
  EndpointFunction<ImportModel, ResponseReason, string> = callEndpointFactory(SaveImportEndpoint);
