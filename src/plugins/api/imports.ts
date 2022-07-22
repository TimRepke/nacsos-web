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
  path: '/imports/import/{importId}/count/',
  paramsEncoding: 'PATH',
  transformResponse: (response) => {
    if (!!response.data || response.data === 0) {
      return ['SUCCESS', 'SUCCESS', response.data];
    }
    return ['FAILED', 'POSTPROCESSING_FAILED'];
  },
};

const ImportDetailsEndpoint: Endpoint<ResponseReason, ImportModel> = {
  method: 'GET',
  path: '/imports/import/{importId}',
  paramsEncoding: 'PATH',
};

const SaveImportEndpoint: Endpoint<ResponseReason, string> = {
  method: 'PUT',
  path: '/imports/import',
  paramsEncoding: 'BODY',
};

const UploadImportFileEndpoint: Endpoint<ResponseReason, string> = { // FIXME type properly
  method: 'POST',
  path: '/imports/files/upload',
  paramsEncoding: 'MULTI',
};

export const callListProjectImportsEndpoint:
  EndpointFunction<never, ResponseReason, ImportModel[]> = callEndpointFactory(ListProjectImportsEndpoint);

export const callImportItemCountEndpoint:
  EndpointFunction<ImportDefinitionRequestPayload, ResponseReason, number> = callEndpointFactory(ImportItemCountEndpoint);

export const callImportDetailsEndpoint:
  EndpointFunction<ImportDefinitionRequestPayload, ResponseReason, ImportModel> = callEndpointFactory(ImportDetailsEndpoint);

export const callSaveImportEndpoint:
  EndpointFunction<ImportModel, ResponseReason, string> = callEndpointFactory(SaveImportEndpoint);

export const callUploadImportFileEndpoint:
  EndpointFunction<File, ResponseReason, string> = callEndpointFactory(UploadImportFileEndpoint);
