import { Directive } from "@angular/core";
import {
  Validator,
  AbstractControl,
  NG_VALIDATORS,
  ValidationErrors,
} from "@angular/forms";
import { checkServiceLevel } from "./checkServiceLevel.function";

@Directive({
  selector: "[appServiceLevelValidator]",
  standalone: true,
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: ServiceLevelDirective,
      multi: true,
    },
  ],
})
export class ServiceLevelDirective implements Validator {
  validate(c: AbstractControl): ValidationErrors | null {
    return checkServiceLevel(c.value, 1, 3);
  }
}
