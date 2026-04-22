import type { BaseValidation, ValidationRule } from "@vuelidate/core";

export const isJSON: ValidationRule = {
  $validator(value?: string) {
    if (!value) return true;
    try {
      JSON.parse(value);
      return true;
    } catch {
      return false;
    }
  },
  $message: "Invalid JSON!",
};

export function errorsToString(field: BaseValidation): string {
  return field.$errors
    .concat(field.$silentErrors)
    .map((error) => error.$message)
    .join("; ");
}
