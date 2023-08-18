/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type OpenAlexImport = {
  func_name: any;
  query: string;
  def_type?: OpenAlexImport.def_type;
  field?: OpenAlexImport.field;
  op?: OpenAlexImport.op;
  project_id?: (string | null);
  import_id?: (string | null);
};

export namespace OpenAlexImport {

  export enum def_type {
    EDISMAX = 'edismax',
    LUCENE = 'lucene',
    DISMAX = 'dismax',
  }

  export enum field {
    TITLE = 'title',
    ABSTRACT = 'abstract',
    TITLE_ABSTRACT = 'title_abstract',
  }

  export enum op {
    OR = 'OR',
    AND = 'AND',
  }


}

