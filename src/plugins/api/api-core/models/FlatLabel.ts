/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { FlatLabelChoice } from './FlatLabelChoice';
import type { Label } from './Label';

export type FlatLabel = {
  path: Array<Label>;
  repeat: number;
  path_key: string;
  parent_int?: (number | null);
  parent_key?: (string | null);
  parent_value?: (number | null);
  name: string;
  hint?: (string | null);
  key: string;
  required: boolean;
  max_repeat: number;
  kind: FlatLabel.kind;
  choices?: (Array<FlatLabelChoice> | null);
};

export namespace FlatLabel {

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

