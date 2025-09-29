import {
  Body,
  Controller,
  Get,
  Header,
  HttpCode,
  type HttpRedirectResponse,
  Inject,
  Post,
  Query,
  Redirect,
  Req,
  Res,
} from '@nestjs/common';
import type { Response, Request } from 'express';
import { UserService } from './user.service';
import { Connection } from '../connection/connection';
import { MailService } from '../mail/mail.service';
import { UserRepository } from '../user-repository/user-repository';
import { MemberService } from '../member/member.service';
import { User } from 'generated/prisma';

@Controller('/api/users')
export class UserController {
  // Cara ke 1 untuk dependency injection
  constructor(
    private service: UserService,
    private connection: Connection,
    private mailService: MailService,
    @Inject('EmailService') private emailService: MailService,
    private userRepository: UserRepository,
    private memberService: MemberService,
  ) {}
  // Cara ke 2 untuk dependency injection
  // @Inject()
  // private service: UserService;

  @Post('/create')
  async create(
    @Body('first_name') firstName: string,
    @Body('last_name') lastName: string,
  ): Promise<User> {
    return await this.userRepository.save(firstName, lastName);
  }

  @Get('/connection')
  getConnection(): string {
    this.mailService.send();
    this.emailService.send();

    console.info(this.memberService.getConnectionName());
    this.memberService.sendEmail();

    return this.connection.getName();
  }

  @Get('/hello')
  sayHello(
    @Query('first_name') firstName: string,
    @Query('last_name') lastName: string,
  ): string {
    return this.service.sayHello(firstName, lastName);
  }

  @Get('/view/hello')
  viewHello(@Query('name') name: string, @Res() response: Response) {
    response.render('index.html', {
      title: 'Template Engine',
      name,
    });
  }

  @Get('/set-cookie')
  setCookie(@Query('name') name: string, @Res() response: Response) {
    response.cookie('name', name || 'Guest');
    response.status(200).send('Success Set Cookie');
  }

  @Get('/get-cookie')
  getCookie(@Req() request: Request): string {
    return String(request.cookies.name ?? '');
  }

  @Get('/sample-response')
  @Header('Content-Type', 'application/json')
  @HttpCode(200)
  sampleResponse() {
    return { data: 'Hello JSON' };
  }

  @Get('/redirect')
  @Redirect()
  redirect(): HttpRedirectResponse {
    return {
      url: '/api/users/sample-response',
      statusCode: 301,
    };
  }

  @Get('/sample')
  get(): string {
    return 'GET';
  }

  @Get('/:id')
  getById(@Req() request: Request): string {
    return `GET ${request.params.id}`;
  }

  @Post()
  post(): string {
    return 'POST';
  }
}
