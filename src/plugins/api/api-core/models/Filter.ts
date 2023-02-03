/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Condition } from './Condition';
import type { Field } from './Field';
import type { IntFilterSign } from './IntFilterSign';
import type { StrTransformerType } from './StrTransformerType';

export type Filter = {
  condition?: Condition;
  type: Filter.type;
  field: Field;
  query: string;
  value: number;
  transformer?: StrTransformerType;
  sign?: IntFilterSign;
};

export namespace Filter {

  export enum type {
    STR = 'str',
    INT = 'int',
  }


}

