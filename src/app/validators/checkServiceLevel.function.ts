import { ValidationErrors } from "@angular/forms";

export function checkServiceLevel(value: number, min: number = 1, max: number = 5): ValidationErrors | null {
  if (
    value !== undefined &&
    (Number.isNaN(value) || value < min || value > max)
  ) {
    return {
      serviceLevel: true
    };
  }
  return null;
}
