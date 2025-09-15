import { CommandHandler as CqrsCommandHandler } from '@nestjs/cqrs';

import { Command } from '../command';

export const CommandHandlerInjectable = (command: new (...args: any[]) => Command) => CqrsCommandHandler(command);
