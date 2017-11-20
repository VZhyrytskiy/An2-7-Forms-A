import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, FormArray, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/debounceTime';

import { User } from './../../models/user';
import { CustomValidators } from './../../validators';

@Component({
  selector: 'app-signup-reactive-form',
  templateUrl: './signup-reactive-form.component.html',
  styleUrls: ['./signup-reactive-form.component.css']
})
export class SignupReactiveFormComponent implements OnInit, OnDestroy {
  countries: Array<string> = ['Ukraine', 'Armenia', 'Belarus', 'Hungary', 'Kazakhstan', 'Poland', 'Russia'];
  user: User = new User();
  userForm: FormGroup;
  emailMessage: string;

  private sub: Subscription[] = [];
  private validationMessages = {
    required: 'Please enter your email address.',
    pattern: 'Please enter a valid email address.'
  };

  constructor(
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.buildForm();
    this.watchValueChanges();
  }

  ngOnDestroy() {
    this.sub.forEach(sub => sub.unsubscribe());
  }

  get addresses():FormArray {
    return <FormArray>this.userForm.get('addresses');
  }

  save() {
    // Form model
    console.log(this.userForm);
    // Form value
    console.log(`Saved: ${JSON.stringify(this.userForm.value)}`);
  }

  addAddress(): void {
    this.addresses.push(this.buildAddress());
  }

  private setNotification(notifyVia: string) {
    const phoneControl = this.userForm.get('phone');
    const emailControl = this.userForm.get('emailGroup.email');

    if (notifyVia === 'text') {
      phoneControl.setValidators(Validators.required);
      emailControl.clearValidators();
    }
    else {
      emailControl.setValidators([Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+')]);
      phoneControl.clearValidators();
    }
    phoneControl.updateValueAndValidity();
    emailControl.updateValueAndValidity();
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
      firstName: new FormControl('', {validators: [Validators.required, Validators.minLength(3)], updateOn: 'blur'}),
      // It doesn't work!, will work in future (Date: 20 Nov 2017)
      // firstName: this.fb.control('', { validators: [Validators.required, Validators.minLength(3)], updateOn: 'blur' }),
      lastName: [
        { value: 'Zhyrytskyy', disabled: false },
        [Validators.required, Validators.maxLength(50)]
      ],
      emailGroup: this.fb.group({
        email: ['',
          [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+')]
        ],
        confirmEmail: ['', Validators.required],
      }, {validator: CustomValidators.emailMatcher}),
      phone: '',
      notification: 'email',
      serviceLevel: [''],
      sendProducts: true,
      // addresses: this.buildAddress()
      addresses: this.fb.array([this.buildAddress()])
    });
  }

  private buildAddress(): FormGroup {
    return this.fb.group({
      addressType: 'home',
      country: '',
      city: '',
      zip: '',
      street1: '',
      street2: ''
    });
  }

  private setFormValues() {
    this.userForm.setValue({
      firstName: 'Vitaliy',
      lastName: 'Zhyrytskyy',
      email: 'vitaliy_zhyrytskyy@ukr.net',
      sendProducts: false
    });
  }

  private setMessage(c: AbstractControl) {
    this.emailMessage = '';
    if ((c.touched || c.dirty) && c.errors) {
      this.emailMessage = Object
        .keys(c.errors)
        .map(key => this.validationMessages[key])
        .join(' ');
    }
  }

  private patchFormValues() {
    this.userForm.patchValue({
      firstName: 'Vitaliy',
      lastName: 'Zhyrytskyy'
    });
  }

  private watchValueChanges() {
    const sub1 = this.userForm.get('notification').valueChanges
      // .subscribe(value => console.log(value));
      .subscribe(value => this.setNotification(value));
    this.sub.push(sub1);

    const emailControl = this.userForm.get('emailGroup.email');
    const sub2 = emailControl.valueChanges
      .debounceTime(1000)
      .subscribe(value => this.setMessage(emailControl));
    this.sub.push(sub2);

  }


}





