import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter<HttpException> {
  catch(exception: HttpException, host: ArgumentsHost) {
    const http = host.switchToHttp();
    const response = http.getResponse<Response>();

    const status = exception.getStatus();
    const errorResponse = exception.getResponse();

    response.status(status).json({
      ...(typeof errorResponse === 'object'
        ? errorResponse
        : { statusCode: status, message: errorResponse }),
      timestamp: new Date(),
    });
  }
}
