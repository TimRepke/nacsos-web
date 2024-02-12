/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type FieldFilter = {
  filter?: any;
  field: FieldFilter.field;
  value: (string | number);
  comp?: (string | null);
};

export namespace FieldFilter {

  export enum field {
    TITLE = 'title',
    ABSTRACT = 'abstract',
    PUB_YEAR = 'pub_year',
    DATE = 'date',
    SOURCE = 'source',
  }


}

