export type ProjectTypes = 'twitter' | 'academic' | 'patents'

export interface Project {
  project_id?: string;
  name: string;
  description: string;
  type: ProjectTypes;
}

export interface ProjectPermissions {
  project_permission_id?: string;
  project_id: string;
  user_id: string;
  owner: boolean;
  dataset_read: boolean;
  dataset_edit: boolean;
  queries_read: boolean;
  queries_edit: boolean;
  annotations_read: boolean;
  annotations_edit: boolean;
  pipelines_read: boolean;
  pipelines_edit: boolean;
  artefacts_read: boolean;
  artefacts_edit: boolean;
}
