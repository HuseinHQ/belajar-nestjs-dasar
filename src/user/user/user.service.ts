import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  sayHello(firstName: string, lastName: string): string {
    return `Hello ${firstName} ${lastName}`;
  }
}
