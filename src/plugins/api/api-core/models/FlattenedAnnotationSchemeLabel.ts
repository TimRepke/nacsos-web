/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { AnnotationSchemeLabelChoiceFlat } from './AnnotationSchemeLabelChoiceFlat';

export type FlattenedAnnotationSchemeLabel = {
  name: string;
  hint: (string | null);
  key: string;
  required: boolean;
  max_repeat: number;
  implicit_max_repeat: number;
  kind: FlattenedAnnotationSchemeLabel.kind;
  choices: (Array<AnnotationSchemeLabelChoiceFlat> | null);
  parent_label: (string | null);
  parent_choice: (number | null);
};

export namespace FlattenedAnnotationSchemeLabel {

  export enum kind {
    BOOL = 'bool',
    STR = 'str',
    FLOAT = 'float',
    INT = 'int',
    SINGLE = 'single',
    MULTI = 'multi',
    INTEXT = 'intext',
  }


}

