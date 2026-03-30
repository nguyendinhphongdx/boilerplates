export enum UserEvent {
  CREATED = 'user.created',
  UPDATED = 'user.updated',
  DELETED = 'user.deleted',
}

export class UserCreatedEvent {
  constructor(
    public readonly userId: string,
    public readonly email: string,
  ) {}
}

export class UserUpdatedEvent {
  constructor(
    public readonly userId: string,
    public readonly updatedFields: string[],
  ) {}
}

export class UserDeletedEvent {
  constructor(public readonly userId: string) {}
}
