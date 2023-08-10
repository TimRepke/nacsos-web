/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { AnnotationModelOutput } from './AnnotationModelOutput';
import type { AnnotationSchemeLabelChoiceOutput } from './AnnotationSchemeLabelChoiceOutput';

export type AnnotationSchemeLabelOutput = {
  name: string;
  key: string;
  hint: (string | null);
  max_repeat: number;
  required: boolean;
  dropdown: boolean;
  kind: AnnotationSchemeLabelOutput.kind;
  choices: (Array<AnnotationSchemeLabelChoiceOutput> | null);
  annotation: (AnnotationModelOutput | null);
};

export namespace AnnotationSchemeLabelOutput {

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

