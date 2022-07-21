export const importTypes = [
  'ris', 'csv', 'jsonl',
  'wos', 'scopus', 'ebsco', 'jstor', 'ovid', 'pop',
  'twitter', 'script',
] as const;
export type ImportTypeLiteral = typeof importTypes[number];

export interface ImportConfigRIS {
  // TODO
  tmp: string;
}

export interface ImportConfigJSONL {
  // TODO
  tmp: string;
}

export const twitterSortOrder = ['recency', 'relevancy'] as const;
export type TwitterSortOrderLiteral = typeof twitterSortOrder[number];

export interface ImportConfigTwitter {
  query: string;
  max_results?: number;
  next_token?: string;
  since_id?: string;
  until_id?: string;
  sort_order?: TwitterSortOrderLiteral;
  start_time?: string; // TODO make datetime
  end_time?: string; // TODO make datetime
}

export type ImportConfig = ImportConfigRIS | ImportConfigJSONL | ImportConfigTwitter;

export interface ImportModel {
  import_id?: string;
  user_id?: string;
  project_id: string;
  name: string;
  description: string;
  type: ImportTypeLiteral | ImportType;
  time_created?: string; // TODO make datetime
  time_started?: string; // TODO make datetime
  time_finished?: string; // TODO make datetime
  config?: ImportConfig;
}
