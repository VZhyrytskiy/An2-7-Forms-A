import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { checkServiceLevel } from './checkServiceLevel.function';

// rxjs
import { Observable } from 'rxjs';

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

  static emailMatcher(c: AbstractControl): ValidationErrors | null {
    const emailControl = c.get('email')!;
    const emailConfirmControl = c.get('confirmEmail')!;

    if (emailControl.pristine || emailConfirmControl.pristine) {
      return null;
    }

    if (emailControl.value === emailConfirmControl.value) {
      return null;
    }

    return { emailMatch: true };
  }

  static asyncEmailPromiseValidator(
    c: AbstractControl
  ):
    | Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
    const email = c.value;

    return new Promise(resolve => {
      setTimeout(() => {
        if (email === 'existsemail@example.com') {
          resolve({
            asyncEmailInvalid: true
          });
        } else {
          resolve(null);
        }
      }, 2000);
    });
  }
}

