import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class RabbitMqEventPublisher {
  constructor(
    @Inject('RABBITMQ_PUBLISHER') private readonly _clientProxy: ClientProxy,
  ) {}

  async publishEvent(routingKey: string, message: any): Promise<void> {
    // Publish with routing key - the exchange configuration is handled by the consumer
    await this._clientProxy.emit(routingKey, message).toPromise();
  }
}
