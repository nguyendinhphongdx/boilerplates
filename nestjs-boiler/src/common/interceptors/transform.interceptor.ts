import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ResponseFormat } from '../helpers/response.helper.js';

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ResponseFormat<unknown>> {
    return next.handle().pipe(
      map((data: unknown) => {
        if (
          data !== null &&
          typeof data === 'object' &&
          'success' in data &&
          (data as ResponseFormat<unknown>).success === true
        ) {
          return data as ResponseFormat<unknown>;
        }
        return {
          success: true,
          data,
          timestamp: new Date().toISOString(),
        };
      }),
    );
  }
}
