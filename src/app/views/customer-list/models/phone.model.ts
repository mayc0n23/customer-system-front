export class Phone {
  id?: number;
  code: string | undefined;
  number: string | undefined;

  constructor(phone?: Phone) {
    if (phone) {
      Object.assign(this, phone);
    }
  }
}
