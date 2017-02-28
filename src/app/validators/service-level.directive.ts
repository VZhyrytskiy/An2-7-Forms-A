import { Directive } from '@angular/core';
import { Validator, AbstractControl, NG_VALIDATORS } from '@angular/forms';

@Directive({
  selector: '[appServiceLevelValidator]',
  providers: [{
      provide: NG_VALIDATORS,
      useExisting: ServiceLevelDirective,
      multi: true
  }]
})
export class ServiceLevelDirective implements Validator {

  validate(c: AbstractControl): { [key: string]: boolean } | null {
    console.log(c.value);
    if (c.value !== undefined && (Number.isNaN(c.value) || c.value < 1 || c.value > 3)) {
      return {
        'serviceLevel': true
      };
    }
    return null;
  }
}
