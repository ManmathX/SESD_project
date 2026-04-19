export interface DomainEvent {
    eventName: string;
    occurredOn: Date;
    payload: Record<string, unknown>;
}

export interface IEventBus {
    subscribe(eventName: string, handler: (event: DomainEvent) => void | Promise<void>): void;
    publish(event: DomainEvent): Promise<void>;
}
