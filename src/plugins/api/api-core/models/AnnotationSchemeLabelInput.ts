/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { AnnotationModelInput } from './AnnotationModelInput';
import type { AnnotationSchemeLabelChoiceInput } from './AnnotationSchemeLabelChoiceInput';

export type AnnotationSchemeLabelInput = {
  name: string;
  key: string;
  hint?: (string | null);
  max_repeat?: number;
  required?: boolean;
  dropdown?: boolean;
  kind?: AnnotationSchemeLabelInput.kind;
  choices?: (Array<AnnotationSchemeLabelChoiceInput> | null);
  annotation?: (AnnotationModelInput | null);
};

export namespace AnnotationSchemeLabelInput {

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

