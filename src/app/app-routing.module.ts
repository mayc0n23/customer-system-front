import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import  { CustomerListComponent } from './views/customer-list/customer-list.component';
import  { CustomerDataComponent } from './views/customer-data/customer-data.component';

const routes: Routes = [{
  path: "",
  component: CustomerListComponent
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
