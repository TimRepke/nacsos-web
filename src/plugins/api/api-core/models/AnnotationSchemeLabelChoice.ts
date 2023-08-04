/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { AnnotationSchemeLabel } from './AnnotationSchemeLabel';

export type AnnotationSchemeLabelChoice = {
  name: string;
  hint?: (string | null);
  value: number;
  children?: (Array<AnnotationSchemeLabel> | null);
};

