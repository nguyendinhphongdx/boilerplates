import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity.js';
import { Role } from '../../../common/enums/role.enum.js';

@Entity('users')
export class User extends BaseEntity {
  @Column({ unique: true })
  email: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ select: false })
  password: string;

  @Column({ type: 'varchar', default: Role.USER })
  role: Role = Role.USER;

  @Column({ default: true })
  isActive: boolean;
}
