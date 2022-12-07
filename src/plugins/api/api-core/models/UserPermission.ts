/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { UserBaseModel } from './UserBaseModel';

/**
 * ProjectPermissions allows to define fine-grained project-level permission management.
 * Once such an entry exists, the user is assumed to have very basic access to the respective project.
 * A user may become "owner" of a project, which will allow them to do everything and effectively ignoring the
 * other more fine-grained permission settings.
 *
 * It is assumed, that a user can always see and edit their own contributions (e.g. annotations) but
 * by giving them permission to view annotations, they can also see other users' annotations.
 */
export type UserPermission = {
  project_permission_id?: string;
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
  user: UserBaseModel;
};

