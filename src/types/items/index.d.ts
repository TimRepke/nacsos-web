/* eslint no-use-before-define: ["off"] */

import { BaseItem } from '@/types/items/basic.d';
import { TwitterItem } from '@/types/items/twitter.d';

export type AnyItem = BaseItem | TwitterItem;
