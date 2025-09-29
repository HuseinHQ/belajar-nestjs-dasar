import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { NestExpressApplication } from '@nestjs/platform-express';
import mustacheExpress from 'mustache-express';
import { ConfigService } from '@nestjs/config';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.use(cookieParser('RAHASIA'));

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const loggerService = app.get(WINSTON_MODULE_NEST_PROVIDER);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  app.useLogger(loggerService);

  app.set('views', __dirname + '/../views');
  app.set('view engine', 'html');
  app.engine('html', mustacheExpress());

  const configService = app.get(ConfigService);
  await app.listen(String(configService.get('PORT')));
}
bootstrap();
