import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

import { UserModel } from './../../models/user.model';

@Component({
  selector: 'app-signup-reactive-form',
  templateUrl: './signup-reactive-form.component.html',
  styleUrls: ['./signup-reactive-form.component.css']
})
export class SignupReactiveFormComponent implements OnInit {
  countries: Array<string> = [
    'Ukraine',
    'Armenia',
    'Belarus',
    'Hungary',
    'Kazakhstan',
    'Poland',
    'Russia'
  ];
  // data model
  user: UserModel = new UserModel(
    'Vitaliy',
    'Zhyrytskyy',
    'v.zhiritskiy@gmail.com',
    false
  );

  // form model
  userForm: FormGroup;

  constructor() {}

  ngOnInit() {
    this.createForm();
    // this.setFormValues();
    this.patchFormValues();
  }

  onSave() {
    // Form model
    console.log(this.userForm);
    // Form value w/o disabled controls
    console.log(`Saved: ${JSON.stringify(this.userForm.value)}`);
    // Form value w/ disabled controls
    console.log(`Saved: ${JSON.stringify(this.userForm.getRawValue())}`);
  }

  private createForm() {
    this.userForm = new FormGroup({
      firstName: new FormControl(),
      lastName: new FormControl(),
      email: new FormControl(),
      sendProducts: new FormControl(true)
    });
  }

  private setFormValues() {
    this.userForm.setValue({
      firstName: this.user.firstName,
      lastName: this.user.lastName,
      email: this.user.email,
      sendProducts: this.user.sendProducts
    });
  }

  private patchFormValues() {
    this.userForm.patchValue({
      firstName: this.user.firstName,
      lastName: this.user.lastName
    });
  }
}
