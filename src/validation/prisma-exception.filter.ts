import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';
import { PrismaClientKnownRequestError } from 'generated/prisma/runtime/library';

@Catch(PrismaClientKnownRequestError)
export class PrismaExceptionFilter
  implements ExceptionFilter<PrismaClientKnownRequestError>
{
  catch(exception: PrismaClientKnownRequestError, host: ArgumentsHost) {
    const http = host.switchToHttp();
    const response = http.getResponse<Response>();

    let status = 500;
    let message = 'Internal server error';

    // Handle specific Prisma error codes
    switch (exception.code) {
      case 'P2002':
        // Unique constraint violation
        status = 409;
        message = `Duplicate entry for ${
          Array.isArray(exception.meta?.target)
            ? (exception.meta.target as string[]).join(', ')
            : 'field'
        }`;
        break;
      case 'P2025':
        // Record not found
        status = 404;
        message = 'Record not found';
        break;
      case 'P2003':
        // Foreign key constraint violation
        status = 400;
        message = 'Invalid reference to related record';
        break;
      case 'P2014':
        // Required relation violation
        status = 400;
        message = 'Required relation is missing';
        break;
      default:
        message = exception.message;
    }

    response.status(status).json({
      statusCode: status,
      message,
      error: 'Database Error',
      code: exception.code,
      meta: exception.meta,
    });
  }
}
