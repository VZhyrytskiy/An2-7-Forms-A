import { Directive, Input } from '@angular/core';
import { Validator, AbstractControl, NG_VALIDATORS, ValidationErrors } from '@angular/forms';

import { checkServiceLevel } from './custom.validators';

@Directive({
  selector: '[appServiceLevelValidator]',
  providers: [{
      provide: NG_VALIDATORS,
      useExisting: ServiceLevelDirective,
      multi: true
  }]
})
export class ServiceLevelDirective implements Validator {
  @Input() rMin: number = 1;
  @Input() rMax: number = 3;

  validate(c: AbstractControl): ValidationErrors | null {
    return checkServiceLevel(c.value, this.rMin, this.rMax);
  }
}
