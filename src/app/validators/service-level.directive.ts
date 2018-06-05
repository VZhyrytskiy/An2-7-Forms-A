import { Directive } from '@angular/core';
import { Validator, AbstractControl, NG_VALIDATORS } from '@angular/forms';

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

  validate(c: AbstractControl): { [key: string]: boolean } | null {
    return checkServiceLevel(c, 1, 3);
  }
}
