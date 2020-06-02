import { Component, OnInit } from '@angular/core';
import { Customer } from './customer';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';

function emailMatcher(control: AbstractControl): {[key: string]: boolean } | null {
  function inDirty() {
    return control.get('email').dirty || control.get('confirmEmail').dirty;
  }

  function isInvalid() {
    return control.get('email').value !== control.get('confirmEmail').value;
  }
  return isInvalid() ? {match: true} : null;
}

function ratingRangeValidator(minRangeValue: number, maxRangeValue: number): ValidatorFn {
  return (control: AbstractControl): {[key: string]: boolean} | null => {
    function isInvalid() {
      return control.value !== null && (isNaN(control.value) || control.value < minRangeValue || control.value > maxRangeValue);
    }
    return isInvalid() ? {range: true} : null;
  };
}

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent implements OnInit {
  customerForm: FormGroup;
  customer = new Customer();

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.customerForm = this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.minLength(3)]],
      lastName: ['', [Validators.required, Validators.maxLength(50)]],
      emailGroup: this.formBuilder.group({
        email: ['', [Validators.required, Validators.email]],
        confirmEmail: ['', [Validators.required, Validators.email]],
      }),
      phone: '',
      notification: 'email',
      rating: [null, ratingRangeValidator(1, 5)],
      sendCatalog: true
    });
  }

  save() {
    console.log(this.customerForm);
    console.log('Saved: ' + JSON.stringify(this.customerForm.value));
  }

  setNotification(notifyVia: string): void {
    const phoneControl = this.customerForm.get('phone');
    if (notifyVia === 'text') {
      phoneControl.setValidators(Validators.required);
    } else {
      phoneControl.clearValidators();
    }
    phoneControl.updateValueAndValidity();
  }

  isInvalid(formControlName: string): boolean {
    return (this.customerForm.get(formControlName).touched || this.customerForm.get(formControlName).dirty)
      && this.customerForm.get(formControlName).invalid;
  }
}
