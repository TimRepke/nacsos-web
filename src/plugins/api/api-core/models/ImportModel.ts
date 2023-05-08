/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ImportConfigJSONL } from './ImportConfigJSONL';
import type { ImportConfigScopus } from './ImportConfigScopus';
import type { ImportConfigTwitter } from './ImportConfigTwitter';
import type { ImportConfigWoS } from './ImportConfigWoS';
import type { ImportType } from './ImportType';

export type ImportModel = {
  import_id?: string;
  user_id?: string;
  project_id: string;
  pipeline_task_id?: string;
  name: string;
  description: string;
  type: ('ris' | 'csv' | 'jsonl' | 'wos' | 'scopus' | 'ebsco' | 'jstor' | 'ovid' | 'pop' | 'twitter' | 'script' | ImportType);
  time_created?: string;
  time_started?: string;
  time_finished?: string;
  config?: (ImportConfigTwitter | ImportConfigJSONL | ImportConfigWoS | ImportConfigScopus);
};

