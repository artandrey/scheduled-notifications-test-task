import { Injectable } from '@nestjs/common';
import { CommandBus as CqrsCommandBus } from '@nestjs/cqrs';

import { CommandBus } from 'src/shared/application/boundaries/command-bus';
import { Command } from 'src/shared/application/command';

@Injectable()
export class NestCqrsCommandBus extends CommandBus {
  constructor(private readonly _commandBus: CqrsCommandBus) {
    super();
  }

  execute<TResult>(command: Command<TResult>): Promise<TResult> {
    return this._commandBus.execute(command);
  }
}
