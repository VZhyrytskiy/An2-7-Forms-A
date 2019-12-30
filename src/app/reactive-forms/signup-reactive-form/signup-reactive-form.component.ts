import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  FormGroup,
  FormControl,
  FormArray,
  FormBuilder,
  Validators,
  AbstractControl
} from '@angular/forms';
import { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import { UserModel } from './../../models/user.model';
import { CustomValidators } from './../../validators';

@Component({
  selector: 'app-signup-reactive-form',
  templateUrl: './signup-reactive-form.component.html',
  styleUrls: ['./signup-reactive-form.component.css']
})
export class SignupReactiveFormComponent implements OnInit, OnDestroy {


  rMin = 1;
  rMax = 3;

  // data model
  user: UserModel = new UserModel(
    'Vitaliy',
    'Zhyrytskyy',
    'v.zhiritskiy@gmail.com',
    false
  );

  // form model
  userForm: FormGroup;
  validationMessage: string;
  placeholder = {
    email: 'Email (required)',
    confirmEmail: 'Confirm Email (required)',
    phone: 'Phone'
  };

  private sub: Subscription;
  private validationMessagesMap = {
    email: {
      required: 'Please enter your email address.',
      pattern: 'Please enter a valid email address.',
      email: 'Please enter a valid email address.',
      asyncEmailInvalid:
        'This email already exists. Please enter other email address.'
    }
  };

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.buildForm();
    this.watchValueChanges();
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  get addresses(): FormArray {
    return this.userForm.get('addresses') as FormArray;
  }

  onSave() {
    // Form model
    console.log(this.userForm);
    // Form value w/o disabled controls
    console.log(`Saved: ${JSON.stringify(this.userForm.value)}`);
    // Form value w/ disabled controls
    console.log(`Saved: ${JSON.stringify(this.userForm.getRawValue())}`);
  }

  onAddAddress(): void {
    this.addresses.push(this.buildAddress());
  }

  onBlur() {
    const emailControl = this.userForm.get('emailGroup.email');
    this.setValidationMessage(emailControl, 'email');
  }

  onRemoveAddress(index: number): void {
    this.addresses.removeAt(index);
  }

  private setNotification(notifyVia: string) {
    const controls = new Map();
    controls.set('phoneControl', this.userForm.get('phone'));
    controls.set('emailGroup', this.userForm.get('emailGroup'));
    controls.set('emailControl', this.userForm.get('emailGroup.email'));
    controls.set(
      'confirmEmailControl',
      this.userForm.get('emailGroup.confirmEmail')
    );

    if (notifyVia === 'text') {
      controls.get('phoneControl').setValidators(Validators.required);
      controls.forEach((control, index) => {
        if (index !== 'phoneControl') {
          control.clearValidators();
          control.clearAsyncValidators();
        }
      });

      this.placeholder = {
        phone: 'Phone (required)',
        email: 'Email',
        confirmEmail: 'Confirm Email'
      };
    } else {
      const emailControl = controls.get('emailControl');
      emailControl.setValidators([
        Validators.required,
        Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+'),
        Validators.email
      ]);
      emailControl.setAsyncValidators(
        CustomValidators.asyncEmailPromiseValidator
      );
      controls.get('confirmEmailControl').setValidators([Validators.required]);
      controls.get('emailGroup').setValidators([CustomValidators.emailMatcher]);
      controls.get('phoneControl').clearValidators();

      this.placeholder = {
        phone: 'Phone',
        email: 'Email (required)',
        confirmEmail: 'Confirm Email (required)'
      };
    }
    controls.forEach(control => control.updateValueAndValidity());
  }

  private createForm() {
    this.userForm = new FormGroup({
      firstName: new FormControl('', {
        validators: [Validators.required, Validators.minLength(3)],
        updateOn: 'blur'
      }),
      lastName: new FormControl(),
      email: new FormControl(),
      phone: new FormControl(),
      notification: new FormControl('email'),
      serviceLevel: new FormControl('', {
        validators: [CustomValidators.serviceLevel],
        updateOn: 'blur'
      }),
      sendProducts: new FormControl(true)
    });
  }

  private buildForm() {
    this.userForm = this.fb.group({
      // firstName: ['', [Validators.required, Validators.minLength(3)]],
      // It works!
      firstName: new FormControl('', {
        validators: [Validators.required, Validators.minLength(3)],
        updateOn: 'blur'
      }),
      // It doesn't work!, will work in future (Date: 20 Nov 2017)
      // firstName: this.fb.control('', { validators: [Validators.required, Validators.minLength(3)], updateOn: 'blur' }),
      lastName: [
        { value: 'Zhyrytskyy', disabled: false },
        [Validators.required, Validators.maxLength(50)]
      ],
      emailGroup: this.fb.group(
        {
          email: [
            '',
            [
              Validators.required,
              Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+'),
              Validators.email
            ]
            // [CustomValidators.asyncEmailPromiseValidator]
          ],
          confirmEmail: ['', Validators.required]
        },
        { validator: CustomValidators.emailMatcher }
      ),
      phone: '',
      notification: 'email',
      serviceLevel: [''],
      // serviceLevel: ['', CustomValidators.serviceLevel],
      // serviceLevel: [
      //   '',
      //   CustomValidators.serviceLevelRange(this.rMin, this.rMax)
      // ],
      sendProducts: true,
      addresses: this.fb.array([this.buildAddress()])
    });
  }

  private buildAddress(): FormControl {
    return this.fb.control('');
  }

  private setFormValues() {
    this.userForm.setValue({
      firstName: this.user.firstName,
      lastName: this.user.lastName,
      email: this.user.email,
      sendProducts: this.user.sendProducts
    });
  }

  private setValidationMessage(c: AbstractControl, controlName: string) {
    this.validationMessage = '';

    if ((c.touched || c.dirty) && c.errors) {
      this.validationMessage = Object.keys(c.errors)
        .map(key => this.validationMessagesMap[controlName][key])
        .join(' ');
    }
  }

  private patchFormValues() {
    this.userForm.patchValue({
      firstName: this.user.firstName,
      lastName: this.user.lastName
    });
  }

  private watchValueChanges() {
    this.sub = this.userForm
      .get('notification')
      .valueChanges.subscribe(value => this.setNotification(value));

    const emailControl = this.userForm.get('emailGroup.email');
    const sub = emailControl.valueChanges
      .pipe(debounceTime(1000))
      .subscribe(value => this.setValidationMessage(emailControl, 'email'));
    this.sub.add(sub);

  }
}
