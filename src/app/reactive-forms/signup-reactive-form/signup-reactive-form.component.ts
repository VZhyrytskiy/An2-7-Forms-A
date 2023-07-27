import { Component, OnInit, inject } from '@angular/core';
import { AbstractControl, ReactiveFormsModule, FormGroup, FormControl, FormBuilder, NonNullableFormBuilder, Validators } from '@angular/forms';
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
  placeholder = {
    email: 'Email (required)',
    phone: 'Phone'
  };
  // userForm = new FormGroup({
  //   firstName: new FormControl(''),
  //   lastName: new FormControl(''),
  //   email: new FormControl(''),
  //   sendProducts: new FormControl(true)
  // });

  userForm = this.fb.group({
    firstName: ['', [Validators.required, Validators.minLength(3)]],
    lastName: [
      { value: 'Zhyrytskyy', disabled: false },
      [Validators.required, Validators.maxLength(50)]
    ],
    email: [
      '',
      [
        Validators.required,
        Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+'),
        Validators.email
      ]
    ],
    phone: '',
    notification: 'email',
    sendProducts: true
  })

  get firstName(): AbstractControl {
    return this.userForm.get('firstName')!;
  }

  get lastName(): AbstractControl {
    return this.userForm.get('lastName')!;
  }

  get email(): AbstractControl {
    return this.userForm.get('email')!;
  }

  get phone(): AbstractControl {
    return this.userForm.get('phone')!;
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

  onSetNotification(notifyVia: string): void {
    const phoneControl = this.phone;
    const emailControl = this.email;

    if (notifyVia === 'text') {
      phoneControl.setValidators(Validators.required);
      emailControl.clearValidators();
      this.placeholder.email = 'Email';
      this.placeholder.phone = 'Phone (required)';
    } else {
      emailControl.setValidators([
        Validators.required,
        Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+'),
        Validators.email
      ]);
      phoneControl.clearValidators();
      this.placeholder.email = 'Email (required)';
      this.placeholder.phone = 'Phone';
    }
    phoneControl.updateValueAndValidity();
    emailControl.updateValueAndValidity();
  }

  onReset(): void {
    this.userForm.reset();
  }

  // private setFormValues(): void {
  //   this.userForm.setValue({
  //     firstName: this.user.firstName,
  //     lastName: this.user.lastName,
  //     email: this.user.email,
  //     sendProducts: this.user.sendProducts
  //   });
  // }

  private patchFormValues(): void {
    this.userForm.patchValue({
      firstName: this.user.firstName,
      lastName: this.user.lastName
    });
  }
}
