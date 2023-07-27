import { Component, OnInit, inject } from '@angular/core';
import { AbstractControl, ReactiveFormsModule, FormGroup, FormControl, FormBuilder, NonNullableFormBuilder } from '@angular/forms';
import { UserModel } from './../../models/user.model';
import { COUNTRIES } from 'src/app/data/countries';
import { JsonPipe, NgClass, NgIf, NgForOf } from '@angular/common';

@Component({
  selector: 'app-signup-reactive-form',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, NgForOf, NgClass, JsonPipe],
  templateUrl: './signup-reactive-form.component.html',
  styleUrls: ['./signup-reactive-form.component.css']
})
export class SignupReactiveFormComponent implements OnInit {
  private fb = inject(NonNullableFormBuilder);

  countries: Array<string> = COUNTRIES;
  // data model
  user: UserModel = new UserModel(
    'Vitaliy',
    'Zhyrytskyy',
    'v.zhiritskiy@gmail.com',
    false
  );

  // form model
  // userForm = new FormGroup({
  //   firstName: new FormControl(''),
  //   lastName: new FormControl(''),
  //   email: new FormControl(''),
  //   sendProducts: new FormControl(true)
  // });

  userForm = this.fb.group({
    firstName: '',
    lastName: { value: 'Zhyrytskyy', disabled: true },
    email: [''],
    sendProducts: true
  });

  get firstName(): AbstractControl {
    return this.userForm.get('firstName')!;
  }

  get lastName(): AbstractControl {
    return this.userForm.get('lastName')!;
  }

  get email(): AbstractControl {
    return this.userForm.get('email')!;
  }

  ngOnInit(): void {
    // this.setFormValues();
    // this.patchFormValues();
  }

  onSave(): void {
    // Form model
    console.log(this.userForm);
    // Form value w/o disabled controls
    console.log(`Saved: ${JSON.stringify(this.userForm.value)}`);
    // Form value w/ disabled controls
    console.log(`Saved: ${JSON.stringify(this.userForm.getRawValue())}`);
  }

  onReset(): void {
    this.userForm.reset();
  }

  private setFormValues(): void {
    this.userForm.setValue({
      firstName: this.user.firstName,
      lastName: this.user.lastName,
      email: this.user.email,
      sendProducts: this.user.sendProducts
    });
  }

  private patchFormValues(): void {
    this.userForm.patchValue({
      firstName: this.user.firstName,
      lastName: this.user.lastName
    });
  }
}
