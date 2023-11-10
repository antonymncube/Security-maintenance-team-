export class UserFormData {
  id: number = 0;
  username: string = '';
  fullname: string = '';
  description: string = '';
  location: string = '';
  agent: string = '';
  password: string = '';
  email: string = '';
  homephone: string = '';
  mobile: string = '';
  department: string = '';
  status: boolean = true;
  lastUpdated: Date = new Date();
  selectedProducts: string[];
  language: any;

  constructor() {
    this.selectedProducts = [];
  }
}
