// backend/shared/EventBus.ts

export interface DomainEvent {
    eventName: string;
    occurredOn: Date;
    [key: string]: any;
}

type EventHandler = (event: DomainEvent) => void | Promise<void>;

export class EventBus {
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
        console.log(`[EventBus] Subscribed to ${eventName}`);
    }

    public async publish(event: DomainEvent): Promise<void> {
        console.log(`[EventBus] Publishing ${event.eventName}`, event);
        const handlers = this.handlers.get(event.eventName);
        if (handlers) {
            for (const handler of handlers) {
                try {
                    await handler(event);
                } catch (error) {
                    console.error(`[EventBus] Error handling event ${event.eventName}:`, error);
                }
            }
        } else {
             console.log(`[EventBus] No handlers for ${event.eventName}`);
        }
    }
}
