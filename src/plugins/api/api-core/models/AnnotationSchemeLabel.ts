/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { AnnotationModel } from './AnnotationModel';
import type { AnnotationSchemeLabelChoice } from './AnnotationSchemeLabelChoice';

export type AnnotationSchemeLabel = {
  name: string;
  key: string;
  hint?: string;
  max_repeat?: number;
  required?: boolean;
  dropdown?: boolean;
  kind?: AnnotationSchemeLabel.kind;
  choices?: Array<AnnotationSchemeLabelChoice>;
  annotation?: AnnotationModel;
};

export namespace AnnotationSchemeLabel {

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

