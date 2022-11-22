import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormGroup,
  FormControl,
  AbstractControlOptions,
  NonNullableFormBuilder,
  Validators
} from '@angular/forms';

import { UserModel } from './../../models/user.model';
import { CustomValidators } from './../../validators';

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

  rMin = 1;
  rMax = 4;

  // data model
  user: UserModel = new UserModel(
    'Vitaliy',
    'Zhyrytskyy',
    'v.zhiritskiy@gmail.com',
    false
  );

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


  // userForm = new FormGroup({
  //     firstName: new FormControl('', {
  //       validators: [Validators.required, Validators.minLength(3)],
  //       updateOn: 'blur',
  //       nonNullable: true
  //     }),
  //     lastName: new FormControl(),
  //     email: new FormControl(),
  //     phone: new FormControl(),
  //     notification: new FormControl('email'),
  //     serviceLevel: new FormControl('', {
  //       validators: [CustomValidators.serviceLevel],
  //       updateOn: 'blur'
  //     }),
  //     sendProducts: new FormControl(true)
  //   });

  userForm = this.fb.group({
    // firstName: ['', [Validators.required, Validators.minLength(3)]],
    // It works!
    firstName: new FormControl('', {validators: [Validators.required, Validators.minLength(3)], updateOn: 'blur'}),
    // It works since v7
    // firstName: this.fb.control('', { validators: [Validators.required, Validators.minLength(3)], updateOn: 'blur' }),

    lastName: [
      { value: 'Zhyrytskyy', disabled: false },
      [Validators.required, Validators.maxLength(50)]
    ],
    emailGroup: this.fb.group({
      email: ['',
        [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+'), Validators.email],
// [CustomValidators.asyncEmailPromiseValidator]
      ],
      confirmEmail: ['', Validators.required],
    }, {validator: CustomValidators.emailMatcher} as AbstractControlOptions),
    phone: '',
    notification: 'email',
    serviceLevel: [''],
    sendProducts: true
  });

  constructor(private fb: NonNullableFormBuilder) {}

  get firstName(): AbstractControl {
    return this.userForm.get('firstName')!;
  }

  get lastName(): AbstractControl {
    return this.userForm.get('lastName')!;
  }

  get emailGroup(): AbstractControl {
    return this.userForm.get('emailGroup')!;
  }

  get email(): AbstractControl {
    return this.userForm.get('emailGroup.email')!;
  }

  get confirmEmail(): AbstractControl {
    return this.userForm.get('emailGroup.confirmEmail')!;
  }

  get phone(): AbstractControl {
    return this.userForm.get('phone')!;
  }

  get serviceLevel(): AbstractControl {
    return this.userForm.get('serviceLevel')!;
  }

  get notification(): AbstractControl {
    return this.userForm.get('notification')!;
  }

  get sendProducts(): AbstractControl {
    return this.userForm.get('sendProducts')!;
  }

  // [index: string]: any;

  ngOnInit(): void {
    // this.setFormValues();
    // this.patchFormValues();
    this.watchValueChanges();
    this.setValidationMessages();
  }

  onSave(): void {
    // Form model
    console.log(this.userForm);
    // Form value w/o disabled controls
    console.log(`Saved: ${JSON.stringify(this.userForm.value)}`);
    // Form value w/ disabled controls
    console.log(`Saved: ${JSON.stringify(this.userForm.getRawValue())}`);
  }

  isShowValidationMessage(controlName: string): boolean {
    return this.validationMessagesMap.get(controlName)!.message && (this as {[index: string]: any})[controlName].touched;
  }

  private setNotification(notifyVia: string): void {
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

  private buildValidationMessages(controlName: string): void {
    const c: AbstractControl = (this as {[index: string]: any})[controlName]; // вызов гетера
    this.validationMessagesMap.get(controlName)!.message = '';

    if (c.errors) {
      this.validationMessagesMap.get(controlName)!.message = Object.keys(c.errors)
        .map(key => {
          const value = this.validationMessagesMap.get(controlName)!;
          return (value as {[index: string]: any})[key];
        })
        .join(' ');
    }
  }


  onReset(): void {
    this.userForm.reset();
  }

  // private setFormValues(): void {
  //   this.userForm.setValue({
  //     firstName: this.user.firstName,
  //     lastName: { value: this.user.lastName, disabled: false },
  //     email: this.user.email,
  //     sendProducts: this.user.sendProducts
  //   });
  // }

  private setValidationMessages(): void {
      this.validationMessagesMap.forEach((control, cntrlName) => {
        this.buildValidationMessages(cntrlName);
      });
  }

  private patchFormValues(): void {
    this.userForm.patchValue({
      firstName: this.user.firstName,
      lastName: { value: this.user.lastName, disabled: false }
    });
  }

  // В статье https://indepth.dev/posts/1433/rxjs-why-memory-leaks-occur-when-using-a-subject
  // сказано, что можно не отписываться от valueChanges and statusChanges
  private watchValueChanges(): void {
    this.notification.valueChanges
      // .subscribe(value => console.log(value));
      .subscribe(value => this.setNotification(value));

    const sub = this.userForm.valueChanges.subscribe(ignorValue =>
        this.setValidationMessages()
    );
    this.sub.add(sub);
  }
}
