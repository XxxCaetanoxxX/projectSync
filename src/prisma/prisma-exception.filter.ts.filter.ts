import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaClientKnownRequestError, PrismaClientUnknownRequestError } from '@prisma/client/runtime/library';
import { Prisma } from '@prisma/client';

@Catch(PrismaClientKnownRequestError, PrismaClientUnknownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  catch(exception: PrismaClientKnownRequestError | PrismaClientUnknownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    if (exception instanceof PrismaClientUnknownRequestError) {
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'UNKNOWN_PRISMA_ERROR',
        path: request.url,
      });
    }

    const { status, message } = this.mapPrismaError(exception);
    
    return response.status(status).json({
      statusCode: status,
      message,
      path: request.url,
    });
  }

  private mapPrismaError(exception: Prisma.PrismaClientKnownRequestError) {
    switch (exception.code) {
      case 'P1008':
        return { status: HttpStatus.REQUEST_TIMEOUT, message: 'Database request timeout.' };
      case 'P2002':
        return { status: HttpStatus.CONFLICT, message: 'Already existing.' };
      case 'P2003':
        return { status: HttpStatus.UNPROCESSABLE_ENTITY, message: 'Foreign key constraint failed. Invalid reference.' };
      case 'P2014':
        return { status: HttpStatus.UNPROCESSABLE_ENTITY, message: 'Invalid relation in the database.' };
      case 'P2016':
        return { status: HttpStatus.BAD_REQUEST, message: 'Invalid query: Field does not exist.' };
      case 'P2018':
        return { status: HttpStatus.UNPROCESSABLE_ENTITY, message: 'Invalid connection between tables.' };
      case 'P2025':
        return { status: HttpStatus.NOT_FOUND, message: 'Resource not found.' };
      case 'P2033':
        return { status: HttpStatus.BAD_REQUEST, message: 'Invalid number of query parameters.' };
      default:
        return { status: HttpStatus.INTERNAL_SERVER_ERROR, message: 'A database error occurred.' };
    }
  }
  
}
