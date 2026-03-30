import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiUnauthorizedResponse, ApiForbiddenResponse } from '@nestjs/swagger';
import { Role } from '../enums/role.enum.js';
import { Roles } from './roles.decorator.js';

export function ApiAuth(...roles: Role[]) {
  const decorators: Array<ClassDecorator | MethodDecorator | PropertyDecorator> = [
    ApiBearerAuth(),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
  ];

  if (roles.length > 0) {
    decorators.push(Roles(...roles));
    decorators.push(ApiForbiddenResponse({ description: 'Forbidden - insufficient role' }));
  }

  return applyDecorators(...decorators);
}
