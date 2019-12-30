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
  validationMessage: string;
  countries: Array<string> = [
    'Ukraine',
    'Armenia',
    'Belarus',
    'Hungary',
    'Kazakhstan',
    'Poland',
    'Russia'
  ];

  private validationMessagesMap = {
    city: {
      required: 'Please enter city'
    }
  };
  private sub: Subscription;

  // tslint:disable-next-line: no-input-rename
  @Input('index') i = 0;
  @Output() removeAddress = new EventEmitter<number>();

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.addressInfoForm = this.buildAddress();
    this.watchValueChanges();
  }

  onRemoveAddress(index: number): void {
    this.removeAddress.emit(index);
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
    const cityControl = this.addressInfoForm.get('city');

    this.sub = cityControl.valueChanges
      .pipe(debounceTime(1000))
      .subscribe(value => this.setValidationMessage(cityControl, 'city'));
  }

  private setValidationMessage(c: AbstractControl, controlName: string) {
    this.validationMessage = '';

    if ((c.touched || c.dirty) && c.errors) {
      this.validationMessage = Object.keys(c.errors)
        .map(key => this.validationMessagesMap[controlName][key])
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
