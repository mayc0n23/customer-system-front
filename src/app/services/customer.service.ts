import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MinimalCustomer } from '../views/customer-list/models/minimal-customer.model';
import { Customer } from '../views/customer-list/models/customer.model';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  private url: string = 'https://customer-system-api-504287ecedf2.herokuapp.com/api/v1/customers';

  constructor(private httpClient: HttpClient) { }

  public getAllCustomers(): Observable<MinimalCustomer[]> {
    return this.httpClient.get<MinimalCustomer[]>(this.url);
  }

  public deleteCustomer(customerId: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.url}/${customerId}`);
  }

  public getCustomerById(id: number): Observable<Customer> {
    return this.httpClient.get<Customer>(`${this.url}/${id}`);
  }

  public createCustomer(customer: Customer): Observable<Customer> {
    return this.httpClient.post<Customer>(this.url, customer);
  }

  public updateCustomer(customer: Customer): Observable<Customer> {
    return this.httpClient.put<Customer>(`${this.url}/${customer.id}`, customer);
  }

}
