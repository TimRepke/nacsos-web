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

import type {
  SciBertModel as _SciBertModel,
  ClimateBertModel as _ClimateBertModel,
  RegressionModel as _Regressionmodel,
  SvmModel as _SvmModel,
} from "./spec/types.gen";
export type SciBERTModel = _SciBertModel & { conf: "SCIBERT" };
export type ClimateBERTModel = _ClimateBertModel & { conf: "CLIMBERT" };
export type RegressionModel = _Regressionmodel & { conf: "REG" };
export type SvmModel = _SvmModel & { conf: "SVM" };
