import { Directive, Input } from "@angular/core";
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
  @Input() rMin = 1;
  @Input() rMax = 3;

  validate(c: AbstractControl): ValidationErrors | null {
    return checkServiceLevel(c.value, this.rMin, this.rMax);
  }
}
