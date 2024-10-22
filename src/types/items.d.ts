import { ItemModel, TwitterItemModel, AcademicItemModel, AcademicItemVariantModel } from "@/plugins/api/spec/types.gen";

export type BaseItem = ItemModel & { meta: Record<string, unknown> };

export type AnyItem = BaseItem | TwitterItemModel | AcademicItemModel;

export type JSONFieldKeys = "keywords" | "meta" | "authors";
export type StringFieldKeys =
  | "title"
  | "text"
  | "publication_year"
  | "source"
  | "doi"
  | "wos_id"
  | "scopus_id"
  | "openalex_id"
  | "s2_id"
  | "pubmed_id"
  | "dimensions_id";
export type AcademicItemVariantStrings = Pick<AcademicItemVariantModel, StringFieldKeys>;
export type AcademicItemVariantJSON = Pick<AcademicItemVariantModel, JSONFieldKeys>;
