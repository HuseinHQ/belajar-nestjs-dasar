import { Module } from '@nestjs/common';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { Connection, createConnection } from './connection/connection';
import { mailService, MailService } from './mail/mail.service';
import { MemberService } from './member/member.service';
import { ConfigService } from '@nestjs/config';
import { UserRepository } from './user-repository/user-repository';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [UserController],
  providers: [
    // Class Provider
    UserService,
    // Factory Provider
    {
      provide: Connection,
      useFactory: createConnection,
      inject: [ConfigService],
    },
    // Value Provider
    {
      provide: MailService,
      useValue: mailService,
    },
    // Alias Provider
    {
      provide: 'EmailService',
      useExisting: MailService,
    },
    UserRepository,
    MemberService,
  ],
  exports: [UserService],
})
export class UserModule {}
