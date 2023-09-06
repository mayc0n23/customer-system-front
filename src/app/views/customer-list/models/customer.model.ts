import { Phone } from "./phone.model";

export class Customer {
  id?: number;
  type: string | undefined;
  fullName: string | undefined;
  mainDocument: string | undefined;
  secondaryDocument?: string | undefined;
  active: boolean | undefined;
  registrationDate?: Date;
  phones: Phone[] = [];

  constructor(customer?: Customer) {
    if (customer) {
      Object.assign(this, customer);
    }
  }
}
