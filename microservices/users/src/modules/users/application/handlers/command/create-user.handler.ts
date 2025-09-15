import { User } from 'src/modules/users/domain/entities/user.entity';
import { UserRepository } from 'src/modules/users/domain/repositories/user.repository';
import { CommandHandlerInjectable } from 'src/shared/application/decorators/command-handler';
import { CommandHandler } from 'src/shared/application/handlers/command-handler';

import { OutboxPublisher } from '../../../../../shared/application/boundaries/outbox.publisher';
import { CreateUserCommand, CreateUserResult } from '../../commands/create-user.command';
import { UserCreatedEvent } from '../../events/user-created.event';

@CommandHandlerInjectable(CreateUserCommand)
export class CreateUserCommandHandler extends CommandHandler<CreateUserCommand> {
  constructor(
    private readonly _userRepository: UserRepository,
    private readonly _outboxPublisher: OutboxPublisher,
  ) {
    super();
  }

  async implementation(command: CreateUserCommand): Promise<CreateUserResult> {
    const user = new User(command.name);
    const id = await this._userRepository.save(user);
    await this._outboxPublisher.publish(new UserCreatedEvent(id, command.name));
    return { id };
  }
}
