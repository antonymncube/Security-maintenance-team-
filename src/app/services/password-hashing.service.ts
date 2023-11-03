import { Injectable } from '@angular/core';
import * as bcrypt from 'bcryptjs';



@Injectable({
  providedIn: 'root'
})
export class PasswordHashingService {

  constructor() { }

  async hashPassword(password: string): Promise<string> {

    const hashedPassword = await bcrypt.hash(password, 10);
    return hashedPassword;
  }

  async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {

    const isMatch = await bcrypt.compare(password, hashedPassword);
    return isMatch;
  }
}
