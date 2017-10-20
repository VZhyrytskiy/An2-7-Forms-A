import { Directive, forwardRef } from '@angular/core';
import { NG_ASYNC_VALIDATORS, Validator, AbstractControl } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/first';

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[asyncEmailValidator][formControlName], [asyncEmailValidator][ngModel]',
  providers: [
    {
      provide: NG_ASYNC_VALIDATORS,
      useExisting: forwardRef(() => AsyncEmailValidatorDirective), multi: true
    }
  ]
})
export default class AsyncEmailValidatorDirective implements Validator {
  validate(c: AbstractControl): Promise<{ [key: string]: any}>|Observable < {[key: string]: any}> {
    // return this.validateEmailPromise(c.value);
    return this.validateEmailObservable(c.value).debounceTime(1000).distinctUntilChanged().first();
  }

  private validateEmailPromise(email: string) {
    return new Promise(resolve => {
      setTimeout(() => {
        if (email === 'existsemail@example.com') {
          resolve({
            asyncEmailInvalid: true
          })
        } else {
          resolve(null);
        }
      }, 2000);
    });
  }

  private validateEmailObservable(email: string) {
    return new Observable(observer => {
      if (email === 'existsemail@example.com') {
        observer.next({asyncEmailInvalid: true});
      } else {
        observer.next(null);
      }
    });
  }


}
