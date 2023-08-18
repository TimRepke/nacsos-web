/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { AcademicItemImport } from './AcademicItemImport';
import type { ImportConfigTwitter } from './ImportConfigTwitter';
import type { OpenAlexImport } from './OpenAlexImport';
import type { OpenAlexItemImport } from './OpenAlexItemImport';
import type { ScopusCSVImport } from './ScopusCSVImport';
import type { TwitterAPIFileImport } from './TwitterAPIFileImport';
import type { TwitterDBFileImport } from './TwitterDBFileImport';
import type { WOSImport } from './WOSImport';

export type ImportModel = {
  import_id?: (string | null);
  user_id?: (string | null);
  project_id: string;
  pipeline_task_id?: (string | null);
  name: string;
  description: string;
  type: string;
  time_created?: (string | null);
  time_started?: (string | null);
  time_finished?: (string | null);
  config?: ((TwitterDBFileImport | TwitterAPIFileImport | ImportConfigTwitter | OpenAlexImport | WOSImport | OpenAlexItemImport | AcademicItemImport | ScopusCSVImport) | null);
};

