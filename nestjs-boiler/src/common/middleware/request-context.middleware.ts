import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { RequestContext } from '../context/request-context.js';

@Injectable()
export class RequestContextMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const requestId = (req.headers['x-request-id'] as string) || uuidv4();

    res.setHeader('x-request-id', requestId);

    RequestContext.run(
      {
        requestId,
        user: (req as any).user,
        ip: req.ip,
        method: req.method,
        url: req.originalUrl,
      },
      () => next(),
    );
  }
}
