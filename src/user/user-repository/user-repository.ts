import { Inject, Injectable } from '@nestjs/common';
import { User } from 'generated/prisma';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PrismaService } from 'src/prisma/prisma/prisma.service';
import { ValidationService } from 'src/validation/validation/validation.service';
import { Logger } from 'winston';

@Injectable()
export class UserRepository {
  constructor(
    private prismaService: PrismaService,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private validation: ValidationService,
  ) {}

  async getAll(search?: string): Promise<User[]> {
    this.logger.info('Get all users');
    if (search) {
      return await this.prismaService.user.findMany({
        where: {
          OR: [
            { first_name: { contains: search, mode: 'insensitive' } },
            { last_name: { contains: search, mode: 'insensitive' } },
          ],
        },
      });
    }
    return await this.prismaService.user.findMany();
  }

  async getById(id: number): Promise<User | null> {
    this.logger.info(`Find user by id ${id}`);
    return await this.prismaService.user.findUnique({
      where: { id },
    });
  }

  async save(first_name: string, last_name?: string): Promise<User> {
    const validatedFirstName = this.validation.validateFirstName(first_name);
    const validatedLastName = this.validation.validateLastName(last_name);

    this.logger.info(
      `Create user with firstName ${first_name}${last_name ? ` and lastName ${last_name}` : ''}`,
    );
    return await this.prismaService.user.create({
      data: { first_name: validatedFirstName, last_name: validatedLastName },
    });
  }
}
