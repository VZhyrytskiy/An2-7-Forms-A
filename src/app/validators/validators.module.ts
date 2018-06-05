import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ServiceLevelDirective } from './service-level.directive';

@NgModule({
  imports: [CommonModule],
  declarations: [ServiceLevelDirective],
  exports: [ServiceLevelDirective]
})
export class ValidatorsModule {}
