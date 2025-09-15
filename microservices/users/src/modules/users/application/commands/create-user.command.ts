import { Command } from 'src/shared/application/command';

import { UserId } from '../../domain/entities/user.entity';

export interface CreateUserResult {
  id: UserId;
}

export class CreateUserCommand extends Command<CreateUserResult> {
  constructor(public readonly name: string) {
    super();
  }
}
