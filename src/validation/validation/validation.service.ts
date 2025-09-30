import { Injectable } from '@nestjs/common';
import z, { ZodType } from 'zod';

@Injectable()
export class ValidationService {
  validate<T>(schema: ZodType<T>, data: T): T {
    return schema.parse(data);
  }

  validateFirstName(firstName: string) {
    const schema = z.string().min(3).max(100);
    return this.validate(schema, firstName);
  }

  validateLastName(lastName?: string) {
    const schema = z.string().min(3).max(100).optional();
    return this.validate(schema, lastName);
  }
}
