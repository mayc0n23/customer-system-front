import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-customer-modal',
  templateUrl: './delete-customer-modal.component.html',
  styleUrls: ['./delete-customer-modal.component.css']
})
export class DeleteCustomerModalComponent {
  constructor(
    public dialogRef: MatDialogRef<DeleteCustomerModalComponent>,
    @Inject(MAT_DIALOG_DATA) public fullName: string
  ) {}
}
