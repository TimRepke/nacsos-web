export type AnnotationValueTuple = [
  v_int: number | undefined,
  v_float: number | undefined,
  v_bool: boolean | undefined,
  v_str: string | undefined,
];

export enum Value {
  V_INT,
  V_FLOAT,
  V_BOOL,
  V_STR,
}
