/* eslint no-use-before-define: ["off"] */

export interface AnnotationSchemeLabelChoice {
  tmpKey?: string; // only used in GUI as :key reference
  name: string;
  hint?: string;
  value: number;
  children?: AnnotationSchemeLabel[];
}

// export const AnnotationSchemeLabelKinds = ['bool', 'str', 'int', 'float', 'single', 'multi'] as const;
// export type AnnotationSchemeLabelKind = typeof AnnotationSchemeLabelKinds[string];
export type AnnotationSchemeLabelKind = 'bool' | 'str' | 'int' | 'float' | 'single' | 'multi';

export interface AnnotationSchemeLabel {
  tmpKey?: string; // only used in GUI as :key reference
  name: string;
  key: string;
  hint?: string;
  max_repeat: number;
  required: boolean;
  kind: AnnotationSchemeLabelKind;
  choices?: AnnotationSchemeLabelChoice[]; // to be used in single or multi, which are dropdown menus
  annotation?: Annotation;
}

export interface AnnotationScheme {
  annotation_scheme_id?: string;
  project_id?: string;
  name: string;
  description?: string;
  labels: AnnotationSchemeLabel[];
}

export type AssignmentScopeConfigType = 'random';

export interface RandomAssignmentConfig {
  users?: string[];
  config_type: AssignmentScopeConfigType;
  num_items: number;
  min_assignments_per_item: number;
  max_assignments_per_item: number;
  num_multi_coded_items: number;
  random_seed: number;
}

export type AssignmentConfigType = RandomAssignmentConfig;

export interface AssignmentScope {
  assignment_scope_id?: string;
  annotation_scheme_id: string;
  time_created?: string; // TODO datetime
  name: string;
  description?: string;
  config?: AssignmentConfigType;
}

export interface AssignmentScopeCounts {
  num_total: number;
  num_open: number;
  num_partial: number;
  num_full: number;
}

export interface UserProjectAssignmentScope {
  scope: AssignmentScope;
  scheme_name: string;
  scheme_description: string;
  num_assignments: number;
  num_open: number;
  num_partial: number;
  num_completed: number;
}

export type AssignmentStatus = 'FULL' | 'PARTIAL' | 'OPEN' | 'INVALID'

export interface Assignment {
  assignment_id?: string;
  assignment_scope_id: string;
  user_id: string;
  item_id: string;
  annotation_scheme_id: string;
  status: AssignmentStatus;
  order: int;
}

export interface Annotation {
  annotation_id?: string;
  time_created?: string; // TODO datetime
  time_updated?: string; // TODO datetime
  assignment_id?: string;
  user_id: string;
  item_id: string;
  annotation_scheme_id: string;
  key: string;
  repeat: number;
  parent?: string;
  value_int?: number;
  value_bool?: boolean;
  value_float?: number;
  value_str?: string;
  text_offset_start?: number;
  text_offset_stop?: number;
}
