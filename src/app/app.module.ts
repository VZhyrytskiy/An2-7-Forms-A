import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { SignupFormComponent } from './template-driven-forms/signup-form';
import { SignupReactiveFormComponent } from './reactive-forms/signup-reactive-form/signup-reactive-form.component';
import { ServiceLevelDirective } from './validators/service-level.directive';

@NgModule({
  declarations: [
    AppComponent,
    SignupFormComponent,
    SignupReactiveFormComponent,
    ServiceLevelDirective
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
