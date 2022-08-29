import { ItemModel, TwitterItemModel } from '@/plugins/api/api-core';

export type BaseItem = ItemModel & { meta: Record<string, unknown> }

export type AnyItem = BaseItem | TwitterItemModel;
