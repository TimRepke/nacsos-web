import type { EnumLiteral } from '@/util';

export * from "./spec/types.gen";
export * from "./spec/enums.gen";

export enum AssignmentScopeBaseConfigTypesEnum {
  RANDOM = "random",
  RANDOM_EXCLUSION = "random_exclusion",
  RANDOM_NQL = "random_nql",
}

export type AssignmentScopeBaseConfigTypes = EnumLiteral<AssignmentScopeBaseConfigTypesEnum>;
