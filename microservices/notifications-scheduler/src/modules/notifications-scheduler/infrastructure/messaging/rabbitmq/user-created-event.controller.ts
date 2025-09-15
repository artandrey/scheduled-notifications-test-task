import { Transactional } from '@nestjs-cls/transactional';
import { Controller, Logger } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';

import { UserCreatedEventHandler } from '../../../application/event-handlers/user-created.event-handler';
import { UserCreatedEvent } from '../../../application/events/user-created.event';
import type { UserCreatedEventPayload } from '../../../application/events/user-created.event';
import { DrizzleProcessedEventRepository } from '../../persistence/drizzle/repositories/drizzle-processed-event.repository';

@Controller()
export class UserCreatedEventController {
  private readonly _logger = new Logger(UserCreatedEventController.name);

  constructor(
    private readonly _userCreatedEventHandler: UserCreatedEventHandler,
    private readonly _processedEventRepository: DrizzleProcessedEventRepository,
  ) {}

  @EventPattern('user_created')
  @Transactional()
  async handleUserCreatedEvent(@Payload() payload: UserCreatedEventPayload, @Ctx() context: RmqContext): Promise<void> {
    try {
      const isAlreadyProcessed = await this._processedEventRepository.existsByEventId(payload.eventId);

      if (isAlreadyProcessed) {
        this._logger.log(`Event ${payload.eventId} already processed for user: ${payload.userId}. Skipping.`);

        const channel = context.getChannelRef();
        const originalMessage = context.getMessage();
        channel.ack(originalMessage);
        return;
      }

      const event = UserCreatedEvent.fromPayload(payload);
      await this._userCreatedEventHandler.handle(event);

      await this._processedEventRepository.save(payload.eventId);

      const channel = context.getChannelRef();
      const originalMessage = context.getMessage();
      channel.ack(originalMessage);

      this._logger.log(`Successfully processed user_created event for user: ${payload.userId}`);
    } catch (error) {
      this._logger.error(`Failed to process user_created event: ${error.message}`, error.stack);

      const channel = context.getChannelRef();
      const originalMessage = context.getMessage();
      channel.nack(originalMessage, false, true);
    }
  }
}
