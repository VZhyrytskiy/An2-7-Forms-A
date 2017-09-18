import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { ValidatorsModule } from './validators/validators.module';

import { AppComponent } from './app.component';
import { SignupFormComponent } from './template-driven-forms/signup-form';
import { SignupReactiveFormComponent } from './reactive-forms/signup-reactive-form/signup-reactive-form.component';


@NgModule({
  declarations: [
    AppComponent,
    SignupFormComponent,
    SignupReactiveFormComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    ValidatorsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
