/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ImportConfigJSONL } from './ImportConfigJSONL';
import type { ImportConfigScopus } from './ImportConfigScopus';
import type { ImportConfigTwitter } from './ImportConfigTwitter';
import type { ImportConfigWoS } from './ImportConfigWoS';
import type { ImportType } from './ImportType';

export type ImportModel = {
  import_id?: (string | null);
  user_id?: (string | null);
  project_id: string;
  pipeline_task_id?: (string | null);
  name: string;
  description: string;
  type: ('ris' | 'csv' | 'jsonl' | 'wos' | 'scopus' | 'ebsco' | 'jstor' | 'ovid' | 'pop' | 'twitter' | 'script' | ImportType);
  time_created?: (string | null);
  time_started?: (string | null);
  time_finished?: (string | null);
  config?: (ImportConfigTwitter | ImportConfigJSONL | ImportConfigWoS | ImportConfigScopus | null);
};

