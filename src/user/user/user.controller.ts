import {
  Body,
  Controller,
  Get,
  Header,
  HttpCode,
  HttpException,
  type HttpRedirectResponse,
  Inject,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Redirect,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import type { Response, Request } from 'express';
import { UserService } from './user.service';
import { Connection } from '../connection/connection';
import { MailService } from '../mail/mail.service';
import { UserRepository } from '../user-repository/user-repository';
import { MemberService } from '../member/member.service';
import { type User } from 'generated/prisma';
import { UserErrors } from 'src/common/constants/errors/user.error';
import {
  LoginUserRequest,
  loginUserRequestValidation,
} from 'src/model/login.model';
import { ValidationPipe } from 'src/validation/validation.pipe';
import { TimeInterceptor } from 'src/time/time.interceptor';
import { Auth } from 'src/auth/auth.decorator';
import { RoleGuard } from 'src/role/role.guard';
import { Roles } from 'src/role/role.decorator';

@Controller('/api/users')
@UseInterceptors(TimeInterceptor)
@UseGuards(RoleGuard)
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

  @Get()
  async getAll(@Query('search') search?: string) {
    const users = await this.userRepository.getAll(search);
    return {
      code: 200,
      data: users,
    };
  }

  @Post('/login')
  @UsePipes(new ValidationPipe(loginUserRequestValidation))
  @Header('Content-Type', 'application/json')
  login(@Body() request: LoginUserRequest) {
    return {
      code: 200,
      data: request,
    };
  }

  @Post('/create')
  // @UseFilters(ZodExceptionFilter)
  async create(
    @Body('first_name') firstName: string,
    @Body('last_name') lastName?: string,
  ): Promise<User> {
    if (!firstName) {
      throw new HttpException(
        {
          code: 400,
          errors: 'First name is required',
        },
        400,
      );
    }
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
  // @UseFilters(ZodExceptionFilter)
  sayHello(
    @Query('first_name') firstName: string,
    @Query('last_name') lastName?: string,
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

  @Get('/current')
  @Roles(['admin', 'operator'])
  current(@Auth() user: User) {
    return {
      code: 200,
      data: user,
    };
  }

  @Get('/:id')
  async getById(@Param('id', ParseIntPipe) id: number) {
    const user = await this.userRepository.getById(id);
    if (!user) throw new HttpException(UserErrors.NOT_FOUND, 404);

    return {
      code: 200,
      data: user,
    };
  }

  @Post()
  post(): string {
    return 'POST';
  }
}
