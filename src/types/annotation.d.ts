/* eslint no-use-before-define: ["off"] */

export interface AnnotationTaskLabelChoice {
  name: string;
  hint?: string;
  value: number;
  child?: AnnotationTaskLabel;
}

export type AnnotationTaskLabelKind = 'bool' | 'str' | 'int' | 'float' | 'single' | 'multi';

export interface AnnotationTaskLabel {
  name: string;
  key: string;
  hint?: string;
  max_repeat: number;
  required: boolean;
  kind: AnnotationTaskLabelKind;
  choices?: AnnotationTaskLabelChoice[]; // to be used in single or multi, which are dropdown menus
}

export interface AnnotationTask {
  annotation_task_id?: string;
  project_id?: string;
  name: string;
  description?: string;
  labels: AnnotationTaskLabel[];
}

export interface AssignmentScope {
  assignment_scope_id?: string;
  task: string;
  name: string;
  description?: string;
}

export interface Assignment {
  assignment_id?: string;
  user: string;
  item: string;
  task: string;
}

export interface Annotation {
  annotation_id?: string;
  time_created?: string; // TODO datetime
  time_updated?: string; // TODO datetime
  assignment_id: string;
  user: string;
  item: string;
  task: string;
  key: string;
  repeat: number;
  value_int?: number;
  value_bool?: boolean;
  value_float?: number;
  value_str?: string;
  text_offset_start?: number;
  text_offset_stop?: number;
}
