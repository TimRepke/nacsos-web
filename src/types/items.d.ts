import { ItemModel, TwitterItemModel } from '@/plugins/client-core';

export type BaseItem = ItemModel & { meta: Record<string, unknown> }

export type AnyItem = BaseItem | TwitterItemModel;
