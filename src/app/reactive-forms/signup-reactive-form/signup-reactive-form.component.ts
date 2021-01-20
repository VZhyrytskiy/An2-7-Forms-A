import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  AbstractControl,
  FormGroup,
  FormControl,
  FormBuilder,
  Validators,
  AbstractControlOptions
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
  countries: Array<string> = [
    'Ukraine',
    'Armenia',
    'Belarus',
    'Hungary',
    'Kazakhstan',
    'Poland',
    'Russia'
  ];

  rMin = 1;
  rMax = 4;

  // data model
  user: UserModel = new UserModel(
    'Vitaliy',
    'Zhyrytskyy',
    'v.zhiritskiy@gmail.com',
    false
  );

  // form model
  userForm: FormGroup;

  // для удобства меп включает все контроллы,
  // даже если у них нет валидаторов
  validationMessagesMap = new Map([
    ['firstName', {
      message: '', // <== сформированное сообщение для пользователя
      required: 'Please enter your first name.',
      minlength: 'The first name must be longer than 3 characters.'
    }],
    ['lastName', {
      message: '',
      required: 'Please enter your last name.'
    }],
    ['email', {
      message: '',
      required: 'Please enter your email address.',
      pattern: 'Please enter a valid email address.',
      email: 'Please enter a valid email address.',
      asyncEmailInvalid:
        'This email already exists. Please enter other email address.'
    }],
    ['confirmEmail', {
      message: '',
      required: 'Please confirm your email address.'
    }],
    ['emailGroup', {
      message: '',
      emailMatch: 'The confirmation does not match the email address.'
    }],
    ['phone', {
      message: '',
      required: 'Please enter your phone number.'
    }],
    ['serviceLevel', {
      message: '',
      serviceLevel: `Please enter correct number from ${this.rMin} to ${this.rMax}.`
    }],
    ['notification', {
      message: ''
    }],
    ['sendProducts', {
      message: ''
    }]
  ]);

  placeholder = {
    email: 'Email (required)',
    confirmEmail: 'Confirm Email (required)',
    phone: 'Phone'
  };

  private sub: Subscription;


  constructor(private fb: FormBuilder) {}

  get firstName(): AbstractControl {
    return this.userForm.get('firstName');
  }

  get lastName(): AbstractControl {
    return this.userForm.get('lastName');
  }

  get emailGroup(): AbstractControl {
    return this.userForm.get('emailGroup');
  }

  get email(): AbstractControl {
    return this.userForm.get('emailGroup.email');
  }

  get confirmEmail(): AbstractControl {
    return this.userForm.get('emailGroup.confirmEmail');
  }

  get phone(): AbstractControl {
    return this.userForm.get('phone');
  }

  get serviceLevel(): AbstractControl {
    return this.userForm.get('serviceLevel');
  }

  get notification(): AbstractControl {
    return this.userForm.get('notification');
  }

  get sendProducts(): AbstractControl {
    return this.userForm.get('sendProducts');
  }

  ngOnInit() {
    this.buildForm();
    this.watchValueChanges();
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  onSave() {
    // Form model
    console.log(this.userForm);
    // Form value w/o disabled controls
    console.log(`Saved: ${JSON.stringify(this.userForm.value)}`);
    // Form value w/ disabled controls
    console.log(`Saved: ${JSON.stringify(this.userForm.getRawValue())}`);
  }

  // перезапуск валидации контрола на событие blur
  onBlur(event) {
    const controlName = event.target.getAttribute('formControlName');
    this.setValidationMessages(controlName);
  }

  private setNotification(notifyVia: string) {
    const controls = new Map();
    controls.set('phoneControl', this.phone);
    controls.set('emailGroup', this.emailGroup);
    controls.set('emailControl', this.email);
    controls.set('confirmEmailControl', this.confirmEmail);

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

  private buildValidationMessages(controlName: string) {
    // const c: AbstractControl = this.controls.get(controlName);
    const c: AbstractControl = this[controlName]; // вызов гетера
    this.validationMessagesMap.get(controlName).message = '';

    if ((c.touched || c.dirty) && c.invalid && c.errors) {
      this.validationMessagesMap.get(controlName).message = Object.keys(c.errors)
        .map(key => this.validationMessagesMap.get(controlName)[key])
        .join(' ');
    }
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
        updateOn: 'change'
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
        { validator: CustomValidators.emailMatcher } as AbstractControlOptions
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
      // addressType: 'home',
      // country: '',
      // city: '',
      // zip: '',
      // street1: '',
      // street2: ''
      addresses: this.fb.group({
        addressType: 'home',
        country: '',
        city: '',
        zip: '',
        street1: '',
        street2: ''
      })
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

  private setValidationMessages(controlName?: string) {
    // валидация для заданого контрола,
    // например для события blur
    if (controlName) {
      this.buildValidationMessages(controlName);
    }

    // валидация для всех контролов,
    // например при изменении чего-либо на форме
    else {
      this.validationMessagesMap.forEach((control, cntrlName) => {
        this.buildValidationMessages(cntrlName);
      });
    }
  }

  private patchFormValues() {
    this.userForm.patchValue({
      firstName: this.user.firstName,
      lastName: this.user.lastName
    });
  }

  private watchValueChanges() {
    this.sub = this.notification.valueChanges
      // .subscribe(value => console.log(value));
      .subscribe(value => this.setNotification(value));

    const sub = this.userForm.valueChanges
    .pipe(debounceTime(1000) )
    .subscribe(ignorValue =>
        this.setValidationMessages()
    );
    this.sub.add(sub);
  }
}
