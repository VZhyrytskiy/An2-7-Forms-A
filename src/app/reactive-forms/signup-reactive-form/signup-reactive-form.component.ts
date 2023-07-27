import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { UserModel } from './../../models/user.model';
import { COUNTRIES } from 'src/app/data/countries';
import { NgForOf } from '@angular/common';

@Component({
  selector: 'app-signup-reactive-form',
  standalone: true,
  imports: [ReactiveFormsModule, NgForOf],
  templateUrl: './signup-reactive-form.component.html',
  styleUrls: ['./signup-reactive-form.component.css']
})
export class SignupReactiveFormComponent implements OnInit {
  countries: Array<string> = COUNTRIES;
  // data model
  user: UserModel = new UserModel();

  // form model
  userForm = new FormGroup({
    firstName: new FormControl(''),
    lastName: new FormControl(''),
    email: new FormControl(''),
    sendProducts: new FormControl(true)
  });

  constructor() {}

  ngOnInit(): void {
  }

  onSave(): void {
    // Form model
    console.log(this.userForm);
    // Form value w/o disabled controls
    console.log(`Saved: ${JSON.stringify(this.userForm.value)}`);
    // Form value w/ disabled controls
    console.log(`Saved: ${JSON.stringify(this.userForm.getRawValue())}`);
  }


}
