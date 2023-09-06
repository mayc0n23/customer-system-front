import { Component, OnDestroy, OnInit } from '@angular/core';
import { CustomerService } from 'src/app/services/customer.service';
import { MinimalCustomer } from './models/minimal-customer.model';
import { Subscription } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { DeleteCustomerModalComponent } from '../components/delete-customer-modal/delete-customer-modal.component';
import { Customer } from './models/customer.model';
import { CustomerFormModalComponent } from '../components/customer-form-modal/customer-form-modal.component';

@Component({
  selector: 'app-home',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.css']
})
export class CustomerListComponent implements OnInit, OnDestroy {

  public subscription: Subscription = new Subscription();

  public customers: MinimalCustomer[] = [];

  public displayedColumns = ['type', 'fullName', 'mainDocument', 'active', 'actions'];

  public dataSource: any;


  constructor(
    private customerService: CustomerService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.getAllCustomers();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public openDeleteDialog(customer: MinimalCustomer): void {
    this.dialog.open(DeleteCustomerModalComponent, {
      width: '350px',
      data: customer.fullName
    }).afterClosed().subscribe(value => {
      if (value) {
        this.deleteCustomer(customer);
      }
    });
  }

  public createOrEditCustomer(id?: number): void {
    let customer = new Customer();
    if (id) {
      this.subscription.add(
        this.customerService.getCustomerById(id)
          .subscribe(response => {
            customer = response;
            this.openFormDialog(customer);
          })
      );
    } else {
      this.openFormDialog(customer);
    }
  }

  private openFormDialog(customer: Customer): void {
    this.dialog.open(CustomerFormModalComponent, {
      width: '700px',
      data: customer
    }).afterClosed().subscribe(value => {
      if (value) {
        this.getAllCustomers();
      }
    });
  }

  public applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    const filteredData = this.customers.filter((customer: MinimalCustomer) => 
        customer.fullName.toLowerCase().includes(filterValue.trim().toLowerCase()));
    
    this.dataSource = new MatTableDataSource(filteredData);
  }

  public getAllCustomers(): void {
    this.subscription.add(
      this.customerService.getAllCustomers()
        .subscribe(response => {
          this.customers = response;
          this.dataSource = new MatTableDataSource(this.customers);
        })
    );
  }

  public deleteCustomer(customer: MinimalCustomer): void {
    this.subscription.add(
      this.customerService.deleteCustomer(customer.id)
        .subscribe(() => this.getAllCustomers())
    );
  }

}
