import { OutboxMessage } from '../../../../shared/application/boundaries/outbox.publisher';

export type UserCreatedEventPayload = {
  userId: string;
  name: string;
};

export class UserCreatedEvent extends OutboxMessage<UserCreatedEventPayload> {
  constructor(
    public userId: string,
    public name: string,
  ) {
    super(userId, 'user_created', { userId, name });
  }
}
