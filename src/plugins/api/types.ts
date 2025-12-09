import type { EnumLiteral } from "@/util";

export * from "./spec/types.gen";
export * from "./enums";

import type {
  SearchFieldEnum,
  ImportConfigEnum,
  AnnotationSchemeLabelKindEnum,
  AssignmentScopeBaseConfigTypesEnum,
} from "./enums";
export type AssignmentScopeBaseConfigTypes = EnumLiteral<AssignmentScopeBaseConfigTypesEnum>;

export type AnnotationSchemeLabelKindTypes = EnumLiteral<AnnotationSchemeLabelKindEnum>;

export type ImportConfigTypes = EnumLiteral<ImportConfigEnum>;

export type SearchFieldType = EnumLiteral<SearchFieldEnum>;

import {
  SciBertModel as _SciBertModel,
  ClimateBertModel as _ClimateBertModel,
  RegressionModel as _Regressionmodel,
  SvmModel as _SvmModel,
  FieldFilter as _FieldFilter,
  FieldFilters as _FieldFilters,
  LabelFilterMulti as _LabelFilterMulti,
  LabelFilterBool as _LabelFilterBool,
  LabelFilterInt as _LabelFilterInt,
  AssignmentFilter as _AssignmentFilter,
  AnnotationFilter as _AnnotationFilter,
  AbstractFilter as _AbstractFilter,
  ImportFilter as _ImportFilter,
  MetaFilterBool as _MetaFilterBool,
  MetaFilterInt as _MetaFilterInt,
  MetaFilterStr as _MetaFilterStr,
  SubQuery as _SubQuery,
} from "./spec/types.gen";

export type SciBERTModel = _SciBertModel & { conf: "SCIBERT" };
export type ClimateBERTModel = _ClimateBertModel & { conf: "CLIMBERT" };
export type RegressionModel = _Regressionmodel & { conf: "REG" };
export type SvmModel = _SvmModel & { conf: "SVM" };
export type FieldFilter = _FieldFilter & { filter: "field" };
export type FieldFilters = _FieldFilters & { filter: "field_mul" };
export type LabelFilterMulti = _LabelFilterMulti & { filter: "label_multi" };
export type LabelFilterBool = _LabelFilterBool & { filter: "label_bool" };
export type LabelFilterInt = _LabelFilterInt & { filter: "label_int" };
export type AssignmentFilter = _AssignmentFilter & { filter: "assignment" };
export type AnnotationFilter = _AnnotationFilter & { filter: "annotation" };
export type AbstractFilter = _AbstractFilter & { filter: "abstract" };
export type ImportFilter = _ImportFilter & { filter: "import" };
export type MetaFilterBool = _MetaFilterBool & { filter: "meta_bool" };
export type MetaFilterInt = _MetaFilterInt & { filter: "meta_int" };
export type MetaFilterStr = _MetaFilterStr & { filter: "meta_str" };
export type SubQuery = _SubQuery & { filter: "sub" };
