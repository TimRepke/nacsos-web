/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type FlattenedAnnotationSchemeLabel = {
  key: string;
  required: boolean;
  max_repeat: number;
  implicit_max_repeat: number;
  kind: FlattenedAnnotationSchemeLabel.kind;
  choices?: Array<number>;
  parent_label?: string;
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

