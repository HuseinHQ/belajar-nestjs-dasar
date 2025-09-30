import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from 'generated/prisma';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    super();
    console.info('Create Prisma Service');
  }

  async onModuleInit() {
    console.info('Connect to Prisma Service');
    await this.$connect();
  }

  async onModuleDestroy() {
    console.info('Disconnect from Prisma Service');
    await this.$disconnect();
  }
}
