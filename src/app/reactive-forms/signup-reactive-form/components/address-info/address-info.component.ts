import { NgClass, NgFor, NgForOf, NgIf } from '@angular/common';
import { Component, OnInit, forwardRef, Input, Output, EventEmitter, inject } from '@angular/core';
import {
  Validators,
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  AbstractControl,
  ValidationErrors,
  NG_VALIDATORS,
  Validator,
  NonNullableFormBuilder,
  ReactiveFormsModule
} from '@angular/forms';

import { COUNTRIES } from 'src/app/data/countries';

@Component({
  selector: 'app-address-info',
  standalone: true,
  imports: [ReactiveFormsModule, NgForOf, NgIf, NgClass],
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
  private fb = inject(NonNullableFormBuilder);

  countries: Array<string> = COUNTRIES;

  validationMessagesMap = new Map([
    ['city', {
      message: '', // <== сформированное сообщение для пользователя
      required: 'Please enter city',
    }]
  ]);

  addressInfoForm = this.buildAddress();

  @Input('index') i = 0;
  @Output() removeAddress = new EventEmitter<number>();

  get city(): AbstractControl {
    return this.addressInfoForm.get('city')!;
  }

  ngOnInit() {
    this.watchValueChanges();
    this.setValidationMessages();
  }

  onRemoveAddress(index: number): void {
    this.removeAddress.emit(index);
  }

  isShowValidationMessage(controlName: string): boolean {
    return this.validationMessagesMap.get(controlName)!.message && (this as {[index: string]: any})[controlName].touched;
  }

  private buildAddress() {
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
    this.city.valueChanges
      .subscribe(value => this.setValidationMessages());
  }

  private setValidationMessages() {
    this.validationMessagesMap.forEach((control, cntrlName) => {
      this.buildValidationMessages(cntrlName);
    });
  }

  private buildValidationMessages(controlName: string) {
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
