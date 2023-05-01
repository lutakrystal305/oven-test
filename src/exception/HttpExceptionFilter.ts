import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const status = exception.getStatus();
    const originalRes = exception.getResponse();

    const newRes = {
      statusCode: status,
      message: originalRes['message'],
      error: originalRes['error'],
      timestamp: new Date().toISOString(),
    };

    Object.assign(originalRes, newRes);
    response.status(status).json(originalRes);
  }
}
