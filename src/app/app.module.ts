import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { SignupFormComponent } from './template-driven-forms/signup-form/signup-form.component';
import { SignupReactiveFormComponent } from './reactive-forms/signup-reactive-form/signup-reactive-form.component';
import { AddressInfoComponent } from './reactive-forms/signup-reactive-form/components/address-info/address-info.component';
import { AsyncEmailValidatorDirective, ServiceLevelDirective } from './validators';

@NgModule({
  declarations: [
    AppComponent,
    SignupFormComponent,
    SignupReactiveFormComponent,
    AddressInfoComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    ServiceLevelDirective,
    AsyncEmailValidatorDirective
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
