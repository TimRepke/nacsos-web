/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type ImportConfigJSONL = {
  filenames: Array<string>;
  line_type: ImportConfigJSONL.line_type;
};

export namespace ImportConfigJSONL {

  export enum line_type {
    DB_TWITTER_ITEM = 'db-twitter-item',
    TWITTER_API_PAGE = 'twitter-api-page',
    DB_BASIC_ITEM = 'db-basic-item',
    DB_ACADEMIC_ITEM = 'db-academic-item',
    DB_PATENT_ITEM = 'db-patent-item',
  }


}

