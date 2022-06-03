/* eslint no-use-before-define: ["off"] */

export interface AnnotationTaskLabelChoice {
  name: string;
  hint?: string;
  value: number;
  children?: AnnotationTaskLabel[];
}

// export const AnnotationTaskLabelKinds = ['bool', 'str', 'int', 'float', 'single', 'multi'] as const;
// export type AnnotationTaskLabelKind = typeof AnnotationTaskLabelKinds[string];
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
  task_id: string;
  name: string;
  description?: string;
}

export interface Assignment {
  assignment_id?: string;
  assignment_scope_id: string;
  user_id: string;
  item_id: string;
  task_id: string;
  order: int;
}

export interface Annotation {
  annotation_id?: string;
  time_created?: string; // TODO datetime
  time_updated?: string; // TODO datetime
  assignment_id?: string;
  user_id: string;
  item_id: string;
  task_id: string;
  key: string;
  repeat: number;
  value_int?: number;
  value_bool?: boolean;
  value_float?: number;
  value_str?: string;
  text_offset_start?: number;
  text_offset_stop?: number;
}
