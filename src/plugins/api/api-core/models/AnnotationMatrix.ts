/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type AnnotationMatrix = {
  scheme_id: string;
  keys: Array<Array<Array<any>>>;
  users: Array<string>;
  matrix: Record<string, Array<Array<(number | boolean | string)>>>;
};

