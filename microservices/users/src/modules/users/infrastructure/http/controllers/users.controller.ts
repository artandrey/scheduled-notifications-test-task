import { Body, Controller, Post } from '@nestjs/common';

import { CreateUserCommand } from 'src/modules/users/application/commands/create-user.command';
import { CreateUserPayloadDto } from 'src/modules/users/application/dto/create-user-payload.dto';
import { CommandBus } from 'src/shared/application/boundaries/command-bus';

@Controller('users')
export class UsersController {
  constructor(private readonly _commandBus: CommandBus) {}

  @Post()
  async createUser(@Body() body: CreateUserPayloadDto) {
    const { id } = await this._commandBus.execute(new CreateUserCommand(body.name));
    return { id };
  }
}
