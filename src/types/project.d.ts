export const projectTypes = ['basic', 'twitter', 'academic', 'patents'] as const;
export type ProjectTypeLiteral = typeof projectTypes[number];

export interface Project {
  project_id?: string;
  name: string;
  description: string;
  type: ProjectTypeLiteral;
}

export interface ProjectPermissions {
  project_permission_id?: string;
  project_id: string;
  user_id: string;
  owner: boolean;
  dataset_read: boolean;
  dataset_edit: boolean;
  imports_read: boolean;
  imports_edit: boolean;
  annotations_read: boolean;
  annotations_edit: boolean;
  pipelines_read: boolean;
  pipelines_edit: boolean;
  artefacts_read: boolean;
  artefacts_edit: boolean;
}
