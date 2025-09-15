import { Command } from '../command';

export abstract class CommandBus {
  abstract execute<TResult>(command: Command<TResult>): Promise<TResult>;
}
