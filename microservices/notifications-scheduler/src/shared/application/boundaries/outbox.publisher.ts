export class OutboxMessage<TEventData extends object = object> {
  constructor(
    public readonly id: string,
    public readonly eventType: string,
    public readonly eventData: TEventData,
    public readonly createdAt: Date = new Date(),
    public readonly processedAt: Date | null = null,
  ) {}
}

export abstract class OutboxPublisher {
  abstract publish(event: OutboxMessage): Promise<void>;
}
