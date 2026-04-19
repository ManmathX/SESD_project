import { IEventBus, DomainEvent } from './interfaces/IEventBus';

type EventHandler = (event: DomainEvent) => void | Promise<void>;

export class EventBus implements IEventBus {
    private static instance: EventBus;
    private handlers: Map<string, EventHandler[]> = new Map();

    private constructor() {}

    public static getInstance(): EventBus {
        if (!EventBus.instance) {
            EventBus.instance = new EventBus();
        }
        return EventBus.instance;
    }

    public subscribe(eventName: string, handler: EventHandler): void {
        const currentHandlers = this.handlers.get(eventName) || [];
        this.handlers.set(eventName, [...currentHandlers, handler]);
    }

    public async publish(event: DomainEvent): Promise<void> {
        const handlers = this.handlers.get(event.eventName);
        if (!handlers) return;
        for (const handler of handlers) {
            try {
                await handler(event);
            } catch (error) {
                console.error(`EventBus error on ${event.eventName}:`, error);
            }
        }
    }
}
