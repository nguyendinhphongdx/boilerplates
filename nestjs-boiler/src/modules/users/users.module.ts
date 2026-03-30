import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity.js';
import { UserRepository } from './repositories/user.repository.js';
import { UserService } from './services/user.service.js';
import { UserController } from './controllers/user.controller.js';
import { UserListener } from './listeners/user.listener.js';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [UserService, UserRepository, UserListener],
  exports: [UserService, UserRepository],
})
export class UsersModule {}
