import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { checkServiceLevel } from './checkServiceLevel.function';

export class CustomValidators {
  static serviceLevel({ value }: AbstractControl): ValidationErrors | null {
    console.log('Validator: serviceLevel is called');
    return checkServiceLevel(value);
  }

  static serviceLevelRange(min: number, max: number): ValidatorFn {
    return ({ value }: AbstractControl): ValidationErrors | null => {
      return checkServiceLevel(value, min, max);
    };
  }
}

