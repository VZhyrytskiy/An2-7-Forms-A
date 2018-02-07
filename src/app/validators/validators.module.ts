import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AsyncEmailValidatorDirective, ServiceLevelDirective } from '.';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    AsyncEmailValidatorDirective,
    ServiceLevelDirective
  ],
  exports: [
    AsyncEmailValidatorDirective,
    ServiceLevelDirective
  ]
})
export class ValidatorsModule { }
