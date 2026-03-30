import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UserRepository } from '../repositories/user.repository.js';
import { CreateUserDto, UpdateUserDto } from '../dto/index.js';
import { PaginationDto, PaginatedResultDto } from '../../../common/dto/pagination.dto.js';
import { User } from '../entities/user.entity.js';
import {
  UserEvent,
  UserCreatedEvent,
  UserUpdatedEvent,
  UserDeletedEvent,
} from '../events/user.events.js';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existing = await this.userRepository.findByEmail(createUserDto.email);
    if (existing) {
      throw new ConflictException('User with this email already exists');
    }
    const user = await this.userRepository.create(createUserDto);
    this.eventEmitter.emit(
      UserEvent.CREATED,
      new UserCreatedEvent(user.id, user.email),
    );
    return user;
  }

  async findAll(paginationDto: PaginationDto): Promise<PaginatedResultDto<User>> {
    const page = paginationDto.page ?? 1;
    const limit = paginationDto.limit ?? 10;
    const { data, total } = await this.userRepository.findAll(page, limit);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    await this.findOne(id);
    const updated = await this.userRepository.update(id, updateUserDto);
    if (!updated) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }
    this.eventEmitter.emit(
      UserEvent.UPDATED,
      new UserUpdatedEvent(id, Object.keys(updateUserDto)),
    );
    return updated;
  }

  async remove(id: string): Promise<void> {
    const deleted = await this.userRepository.delete(id);
    if (!deleted) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }
    this.eventEmitter.emit(UserEvent.DELETED, new UserDeletedEvent(id));
  }
}
