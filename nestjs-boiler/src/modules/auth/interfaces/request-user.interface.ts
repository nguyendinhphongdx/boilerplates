import { Role } from '../../../common/enums/role.enum.js';

export interface RequestUser {
  id: string;
  email: string;
  role: Role;
}
