import { Injectable } from '@nestjs/common';
import { ValidationService } from 'src/validation/validation/validation.service';

@Injectable()
export class UserService {
  constructor(private validation: ValidationService) {}

  sayHello(firstName: string, lastName?: string): string {
    const validatedFirstName = this.validation.validateFirstName(firstName);
    const validatedLastName = this.validation.validateLastName(lastName);
    return `Hello ${validatedFirstName}${validatedLastName ? ' ' + validatedLastName : ''}`;
  }
}
