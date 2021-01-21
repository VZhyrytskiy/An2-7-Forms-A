import { Component, OnInit, forwardRef, Input, Output, EventEmitter } from '@angular/core';
import {
  FormGroup,
  Validators,
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  AbstractControl,
  ValidationErrors,
  NG_VALIDATORS,
  Validator,
  FormBuilder
} from '@angular/forms';

import { debounceTime } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-address-info',
  templateUrl: './address-info.component.html',
  styleUrls: ['./address-info.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AddressInfoComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => AddressInfoComponent),
      multi: true
    }
  ]
})
export class AddressInfoComponent
  implements OnInit, ControlValueAccessor, Validator {
  addressInfoForm: FormGroup;
  countries: Array<string> = [
    'Ukraine',
    'Armenia',
    'Belarus',
    'Hungary',
    'Kazakhstan',
    'Poland',
    'Russia'
  ];

  validationMessagesMap = new Map([
    ['city', {
      message: '', // <== сформированное сообщение для пользователя
      required: 'Please enter city',
    }]
  ]);


  private sub: Subscription;

  // tslint:disable-next-line: no-input-rename
  @Input('index') i = 0;
  @Output() removeAddress = new EventEmitter<number>();

  get city(): AbstractControl {
    return this.addressInfoForm.get('city');
  }

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.addressInfoForm = this.buildAddress();
    this.watchValueChanges();
  }

  onRemoveAddress(index: number): void {
    this.removeAddress.emit(index);
  }

  onBlur(event) {
    const controlName = event.target.getAttribute('formControlName');
    this.setValidationMessages(controlName);
  }

  private buildAddress(): FormGroup {
    return this.fb.group({
      addressType: 'home',
      country: '',
      city: ['', Validators.required],
      zip: '',
      street1: '',
      street2: ''
    });
  }

  private watchValueChanges() {
    this.sub = this.city.valueChanges
      .pipe(debounceTime(1000))
      .subscribe(value => this.setValidationMessages('city'));
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

  // ****** CONTROL_VALUE_ACCESSOR INTERFACE METHODS ********* /

  public onTouched: () => void = () => {};

  // model => DOM
  writeValue(val: any): void {
    if (val) {
      this.addressInfoForm.setValue(val, { emitEvent: false });
    }
  }

  // DOM => model
  registerOnChange(fn: any): void {
    console.log('on change');
    this.addressInfoForm.valueChanges.subscribe(fn);
  }

  registerOnTouched(fn: any): void {
    console.log('on blur');
    this.onTouched = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    isDisabled ? this.addressInfoForm.disable() : this.addressInfoForm.enable();
  }

  validate(c: AbstractControl): ValidationErrors | null {
    console.log('Adress Info validation', c);
    return this.addressInfoForm.valid
      ? null
      : {
          invalidForm: {
            valid: false,
            message: 'addressInfoForm fields are invalid'
          }
        };
  }
}
