import { ItemModel, TwitterItemModel, AcademicItemModel } from "@/plugins/api/spec/types.gen";

export type BaseItem = ItemModel & { meta: Record<string, unknown> };

export type AnyItem = BaseItem | TwitterItemModel | AcademicItemModel;
