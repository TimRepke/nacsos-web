/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { UserBaseModel } from './UserBaseModel';

export type UserPermission = {
  project_permission_id?: (string | null);
  project_id: string;
  user_id: string;
  owner?: boolean;
  dataset_read?: boolean;
  dataset_edit?: boolean;
  imports_read?: boolean;
  imports_edit?: boolean;
  annotations_read?: boolean;
  annotations_edit?: boolean;
  pipelines_read?: boolean;
  pipelines_edit?: boolean;
  artefacts_read?: boolean;
  artefacts_edit?: boolean;
  search_dimensions?: boolean;
  search_oa?: boolean;
  import_limit_oa?: number;
  user: UserBaseModel;
};

