/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { AnnotationSchemeLabelChoiceFlat } from './AnnotationSchemeLabelChoiceFlat';

export type FlattenedAnnotationSchemeLabel = {
  name: string;
  hint?: string;
  key: string;
  required: boolean;
  max_repeat: number;
  implicit_max_repeat: number;
  kind: FlattenedAnnotationSchemeLabel.kind;
  choices?: Array<AnnotationSchemeLabelChoiceFlat>;
  parent_label?: string;
  parent_choice?: number;
};

export namespace FlattenedAnnotationSchemeLabel {

  export enum kind {
    BOOL = 'bool',
    STR = 'str',
    INT = 'int',
    FLOAT = 'float',
    SINGLE = 'single',
    MULTI = 'multi',
    INTEXT = 'intext',
  }


}

