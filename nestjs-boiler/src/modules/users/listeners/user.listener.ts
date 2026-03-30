import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import {
  UserEvent,
  UserCreatedEvent,
  UserUpdatedEvent,
  UserDeletedEvent,
} from '../events/user.events.js';

@Injectable()
export class UserListener {
  private readonly logger = new Logger(UserListener.name);

  @OnEvent(UserEvent.CREATED)
  handleUserCreated(event: UserCreatedEvent) {
    this.logger.log(`User created: ${event.email} (${event.userId})`);
    // TODO: send welcome email, init default settings, etc.
  }

  @OnEvent(UserEvent.UPDATED)
  handleUserUpdated(event: UserUpdatedEvent) {
    this.logger.log(
      `User updated: ${event.userId} [${event.updatedFields.join(', ')}]`,
    );
    // TODO: audit log, sync external systems, etc.
  }

  @OnEvent(UserEvent.DELETED)
  handleUserDeleted(event: UserDeletedEvent) {
    this.logger.log(`User deleted: ${event.userId}`);
    // TODO: cleanup uploads, revoke tokens, etc.
  }
}
