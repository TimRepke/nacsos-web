/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Condition } from './Condition';
import type { Filter } from './Filter';

export type QueryGroup = {
  condition?: Condition;
  members: Array<(Filter | QueryGroup)>;
};

