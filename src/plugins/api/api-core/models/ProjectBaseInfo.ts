/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { LabelOptions } from './LabelOptions';
import type { ProjectBaseInfoEntry } from './ProjectBaseInfoEntry';
import type { ProjectBaseInfoScopeEntry } from './ProjectBaseInfoScopeEntry';

export type ProjectBaseInfo = {
  users: Array<ProjectBaseInfoEntry>;
  scopes: Array<ProjectBaseInfoScopeEntry>;
  bot_scopes: Array<ProjectBaseInfoEntry>;
  labels: Record<string, LabelOptions>;
  fields: Array<string>;
};

