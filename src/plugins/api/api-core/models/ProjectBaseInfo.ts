/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { LabelOptionsOutput } from './LabelOptionsOutput';
import type { ProjectBaseInfoEntry } from './ProjectBaseInfoEntry';
import type { ProjectBaseInfoScopeEntry } from './ProjectBaseInfoScopeEntry';

export type ProjectBaseInfo = {
  users: Array<ProjectBaseInfoEntry>;
  scopes: Array<ProjectBaseInfoScopeEntry>;
  bot_scopes: Array<ProjectBaseInfoEntry>;
  labels: Record<string, LabelOptionsOutput>;
  fields: Array<string>;
};

