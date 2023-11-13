export class UserFormData {
  id: string = '';
  username: string = '';
  fullname: string = '';
  description: string = '';
  password: string = '';
  department: string = '';
  email: string = '';
  homephone: string = '';
  mobile: string = '';
  agent: string = '';
  status: boolean = true;
  lastUpdated: Date = new Date();
  language: string = '';
  location: string = '';
  selectedProducts: string[];

  constructor() {
    this.selectedProducts = [];
  }
}
