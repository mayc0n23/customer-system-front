import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Customer } from '../../customer-list/models/customer.model';
import { Phone } from '../../customer-list/models/phone.model';
import { Subscription } from 'rxjs';
import { CustomerService } from 'src/app/services/customer.service';

@Component({
  selector: 'app-customer-form-modal',
  templateUrl: './customer-form-modal.component.html',
  styleUrls: ['./customer-form-modal.component.css']
})
export class CustomerFormModalComponent implements OnInit, OnDestroy {

  public subscription: Subscription = new Subscription();

  public customerFormControl = this.formBuilder.group({
    type: new FormControl('', [Validators.required, Validators.minLength(1)]),
    fullName: new FormControl('', [Validators.required, Validators.minLength(1)]),
    mainDocument: new FormControl('', [Validators.required, Validators.minLength(1)]),
    secondaryDocument: new FormControl(null || ''),
    active: new FormControl(false, Validators.required)
  });

  public activeOptions = [
    {
      'label': 'Sim',
      'value': true
    },
    {
      'label': 'Não',
      'value': false
    }
  ];

  public phoneForm = this.formBuilder.group({
    code: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(2)]],
    number: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(9)]]
  });

  constructor(
    private service: CustomerService,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<CustomerFormModalComponent>,
    @Inject(MAT_DIALOG_DATA) public customer: Customer
  ) { }

  ngOnInit(): void {
    this.insertCustomerForm();
    this.typeSubscribe();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public saveCustomer(): void {
    this.setValues();
    if (this.customer.id) {
      this.updateCustomer();
    } else {
      this.createCustomer();
    }
  }

  private mapCustomerBeforeUpdate(): Customer {
    return {
      id: this.customer.id,
      type: this.customer.type,
      fullName: this.customer.fullName,
      mainDocument: this.customer.mainDocument,
      secondaryDocument: this.customer.secondaryDocument,
      active: this.customer.active,
      phones: this.customer.phones
    };
  }

  private createCustomer(): void {
    this.subscription.add(
      this.service.createCustomer(this.customer)
        .subscribe(() => this.dialogRef.close(true))
    );
  }

  private updateCustomer(): void {
    this.subscription.add(
      this.service.updateCustomer(this.mapCustomerBeforeUpdate())
        .subscribe(() => this.dialogRef.close(true))
    );
  }

  private insertCustomerForm(): void {
    this.customerFormControl.get('fullName')?.setValue(this.customer.fullName ? this.customer.fullName : '');
    this.customerFormControl.get('type')?.setValue(this.customer.type ? this.customer.type : '');
    this.customerFormControl.get('mainDocument')?.setValue(this.customer.mainDocument ? this.customer.mainDocument : '');
    this.customerFormControl.get('active')?.setValue(this.customer.active ? this.customer.active : false);
    this.customerFormControl.get('secondaryDocument')?.setValue(this.customer.secondaryDocument ? this.customer.secondaryDocument : null);
  }


  public setValues(): void {
    this.customer.type = this.customerFormControl.get('type')?.value ?? '';
    this.customer.mainDocument = this.customerFormControl.get('mainDocument')?.value ?? '';
    this.customer.fullName = this.customerFormControl.get('fullName')?.value ?? '';
    this.customer.active = this.customerFormControl.get('active')?.value ?? false;
    this.customer.secondaryDocument = this.customerFormControl.get('secondaryDocument')?.value ?? undefined;
  }

  public typeSubscribe(): void {
    this.subscription.add(
      this.customerFormControl?.controls['type'].valueChanges.subscribe(value => {
        const formGroup = this.customerFormControl?.get('mainDocument');
        if (value === 'PHYSICAL' && formGroup !== null) {
          formGroup?.setValidators([Validators.required, Validators.pattern(/^(?!000\.|00\.0|0\.00)[0-9]{3}\.?[0-9]{3}\.?[0-9]{3}\-?[0-9]{2}$/)]);
          formGroup?.updateValueAndValidity();
        } else if (value === 'LEGAL' && formGroup !== null) {
          formGroup?.setValidators([Validators.required, Validators.pattern(/^(?!00\.000\.000\/0000\-00|11\.111\.111\/1111\-11|22\.222\.222\/2222\-22|33\.333\.333\/3333\-33|44\.444\.444\/4444\-44|55\.555\.555\/5555\-55|66\.666\.666\/6666\-66|77\.777\.777\/7777\-77|88\.888\.888\/8888\-88|99\.999\.999\/9999\-99)[0-9]{2}\.?[0-9]{3}\.?[0-9]{3}\/?[0-9]{4}\-?[0-9]{2}$/)]);
          formGroup?.updateValueAndValidity();
        }
      })
    );
  }

  public addPhone(): void {
    if (this.phoneForm.valid) {
      const phone = this.phoneForm.value;
      let newPhone = new Phone();
      newPhone.code = phone.code ?? '';
      newPhone.number = phone.number ?? '';
      this.customer.phones.push(newPhone);
      this.phoneForm.reset();
    }
  }

  public removePhone(index: number): void {
    this.customer.phones.splice(index, 1);
  }

  public enableButton(): boolean {
    if (this.customerFormControl) {
      return this.customerFormControl.valid && this.customer.phones.length > 0;
    }
    return false;
  }

}
