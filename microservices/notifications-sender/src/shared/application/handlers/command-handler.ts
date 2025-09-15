import { TransactionHost } from '@nestjs-cls/transactional';
import { Inject } from '@nestjs/common';

import { Command } from '../command';

export abstract class CommandHandler<TCommand extends Command<TResult>, TResult = unknown> {
  @Inject(TransactionHost) private readonly _transactionHost: TransactionHost;
  constructor() {}

  execute(command: TCommand): Promise<TResult> {
    return this._transactionHost.withTransaction(() => {
      return this.implementation(command);
    });
  }

  abstract implementation(command: TCommand): Promise<TResult>;
}
