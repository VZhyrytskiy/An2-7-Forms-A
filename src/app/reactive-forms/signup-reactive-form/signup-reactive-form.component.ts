import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';

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

  private sub: Subscription;

  constructor(
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.buildForm();
    this.watchValueChanges();
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  save() {
    // Form model
    console.log(this.userForm);
    // Form value
    console.log(`Saved: ${JSON.stringify(this.userForm.value)}`);
  }

  setNotification(notifyVia: string) {
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
      firstName: new FormControl(),
      lastName: new FormControl(),
      email: new FormControl(),
      sendProducts: new FormControl(true)
    });
  }

  private buildForm() {
    this.userForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(3)]],
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
      sendProducts: true
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

  private patchFormValues() {
    this.userForm.patchValue({
      firstName: 'Vitaliy',
      lastName: 'Zhyrytskyy'
    });
  }

  private watchValueChanges() {
    this.sub = this.userForm.get('notification').valueChanges.subscribe(value => console.log(value));
  }


}





