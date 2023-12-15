/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type FieldFilters = {
  field: FieldFilters.field;
  values: Array<string>;
};

export namespace FieldFilters {

  export enum field {
    DOI = 'doi',
    ITEM_ID = 'item_id',
    OPENALEX_ID = 'openalex_id',
  }


}

