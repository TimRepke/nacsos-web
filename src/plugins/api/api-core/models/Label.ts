/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * Convenience type (corresponding to internal type in db annotation_label).
 * For Annotation or BotAnnotation, this is the combination of their respective key, repeat value.
 *
 * Mainly used during resolving annotations.
 */
export type Label = {
  key: string;
  repeat: number;
  value?: (number | null);
};

