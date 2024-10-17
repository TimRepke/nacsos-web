import type { UserPermission } from "@/plugins/api/spec/types.gen";

// https://github.com/typescript-eslint/typescript-eslint/issues/1824
export type PermissionKeys =
  | "owner" // eslint-disable-next-line @typescript-eslint/indent
  | "dataset_read" // eslint-disable-next-line @typescript-eslint/indent
  | "dataset_edit" // eslint-disable-next-line @typescript-eslint/indent
  | "imports_read" // eslint-disable-next-line @typescript-eslint/indent
  | "imports_edit" // eslint-disable-next-line @typescript-eslint/indent
  | "annotations_read" // eslint-disable-next-line @typescript-eslint/indent
  | "annotations_edit" // eslint-disable-next-line @typescript-eslint/indent
  | "pipelines_read" // eslint-disable-next-line @typescript-eslint/indent
  | "pipelines_edit" // eslint-disable-next-line @typescript-eslint/indent
  | "artefacts_read" // eslint-disable-next-line @typescript-eslint/indent
  | "artefacts_edit" // eslint-disable-next-line @typescript-eslint/indent
  | "search_dimensions" // eslint-disable-next-line @typescript-eslint/indent
  | "search_oa" // eslint-disable-next-line @typescript-eslint/indent
  | "import_limit_oa";

export type Permissions = Pick<UserPermission, PermissionKeys>;

export const ProjectPermissionHints: Record<PermissionKeys, string> = {
  owner:
    "The user will have complete and unrestricted access to this project. This includes the ability to update access permissions.",
  dataset_read:
    "The user will be able to search, explore, and export the imported items (e.g. papers) in this project.",
  dataset_edit: "The user will be able to manipulate imported items (e.g. deleting) in this project.",
  imports_read: "The user will be able to see details about import jobs in this project.",
  imports_edit: "The user will be able to import data to this project.",
  annotations_read:
    "The user will be able to see their own annotations made in this project and create/update their annotations.",
  annotations_edit:
    "The user will be able to see all annotations in this project, create annotation schemes, assignments, resolve annotations, and export them.",
  pipelines_read: "The user will be able to see the status of pipelines.",
  pipelines_edit: "The user will be able to trigger pipeline runs.",
  artefacts_read: "The user will be able to see artefacts.",
  artefacts_edit: "The user will be able to clear pipeline runs.",
  search_dimensions: "The user will be able to search Dimensions on the platform.",
  search_oa: "The user will be able to search OpenAlex on the platform.",
  import_limit_oa: "Indicates the maximum number of articles that can be imported from OpenAlex.",
};

export const PermissionPresets: Record<string, Permissions> = {
  Empty: {
    owner: false,
    dataset_read: false,
    dataset_edit: false,
    imports_read: false,
    imports_edit: false,
    annotations_read: false,
    annotations_edit: false,
    pipelines_read: false,
    pipelines_edit: false,
    artefacts_read: false,
    artefacts_edit: false,
    search_dimensions: false,
    search_oa: false,
    import_limit_oa: 0,
  },
  Annotator: {
    owner: false,
    dataset_read: true,
    dataset_edit: false,
    imports_read: false,
    imports_edit: false,
    annotations_read: true,
    annotations_edit: false,
    pipelines_read: false,
    pipelines_edit: false,
    artefacts_read: false,
    artefacts_edit: false,
    search_dimensions: false,
    search_oa: true,
    import_limit_oa: 0,
  },
  "Full Access": {
    owner: false,
    dataset_read: true,
    dataset_edit: true,
    imports_read: true,
    imports_edit: true,
    annotations_read: true,
    annotations_edit: true,
    pipelines_read: true,
    pipelines_edit: true,
    artefacts_read: true,
    artefacts_edit: true,
    search_dimensions: false,
    search_oa: true,
    import_limit_oa: 0,
  },
  Owner: {
    owner: true,
    dataset_read: true,
    dataset_edit: true,
    imports_read: true,
    imports_edit: true,
    annotations_read: true,
    annotations_edit: true,
    pipelines_read: true,
    pipelines_edit: true,
    artefacts_read: true,
    artefacts_edit: true,
    search_dimensions: false,
    search_oa: true,
    import_limit_oa: 0,
  },
};
