/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { BotAnnotationModel } from './BotAnnotationModel';
import type { Label } from './Label';

export type GroupedBotAnnotation = {
  path: Array<Label>;
  annotation: BotAnnotationModel;
};

