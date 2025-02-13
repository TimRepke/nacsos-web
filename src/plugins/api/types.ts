import type { EnumLiteral } from "@/util";

export * from "./spec/types.gen";
export * from "./spec/enums.gen";

export enum AssignmentScopeBaseConfigTypesEnum {
  RANDOM = "random",
  RANDOM_EXCLUSION = "random_exclusion",
  RANDOM_NQL = "random_nql",
}

export type AssignmentScopeBaseConfigTypes = EnumLiteral<AssignmentScopeBaseConfigTypesEnum>;

export enum AnnotationSchemeLabelKindEnum {
  BOOL = "bool",
  STR = "str",
  FLOAT = "float",
  INT = "int",
  SINGLE = "single",
  MULTI = "multi",
  INTEXT = "intext",
}

export type AnnotationSchemeLabelKindTypes = EnumLiteral<AnnotationSchemeLabelKindEnum>;

export enum ImportConfigEnum {
  WOS = "wos",
  SCOPUS = "scopus",
  SCOPUS_API = "scopus-api",
  ACADEMIC = "academic",
  OA_FILE = "oa-file",
  OA_SOLR = "oa-solr",
}

export type ImportConfigTypes = EnumLiteral<ImportConfigEnum>;

export enum SearchFieldEnum {
  TITLE = "title",
  ABSTRACT = "abstract",
  TITLE_ABSTRACT = "title_abstract",
}

export type SearchFieldType = EnumLiteral<SearchFieldEnum>;

// import type { AssignmentStatusEnum } from "@/plugins/api/spec/enums.gen";
// export type AssignmentStatus = EnumLiteral<AssignmentStatusEnum>;
