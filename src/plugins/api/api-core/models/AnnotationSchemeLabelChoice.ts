/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { AnnotationSchemeLabel } from './AnnotationSchemeLabel';

export type AnnotationSchemeLabelChoice = {
  name: string;
  hint?: string;
  value: number;
  children?: Array<AnnotationSchemeLabel>;
};

