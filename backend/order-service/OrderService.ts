// backend/order-service/OrderService.ts
import { EventBus, DomainEvent } from '../shared/EventBus';

export enum OrderStatus {
    PENDING = "PENDING",
    COMPLETED = "COMPLETED",
    FAILED = "FAILED"
}

export class Order {
    constructor(
        public readonly id: string,
        public readonly customerId: string,
        public readonly productIds: string[],
        public status: OrderStatus = OrderStatus.PENDING
    ) {}

    public complete(): void {
        this.status = OrderStatus.COMPLETED;
    }

    public fail(): void {
        this.status = OrderStatus.FAILED;
    }
}

export class OrderRepository {
    private orders: Map<string, Order> = new Map();

    public save(order: Order): void {
        this.orders.set(order.id, order);
        console.log(`[OrderService] Order ${order.id} status updated to ${order.status}`);
    }

    public getById(id: string): Order | undefined {
        return this.orders.get(id);
    }
}

export class OrderService {
    constructor(
        private orderRepo: OrderRepository,
        private eventBus: EventBus
    ) {}

    public async placeOrder(customerId: string, productIds: string[]): Promise<string> {
        const orderId = `order_${Date.now()}`;
        const order = new Order(orderId, customerId, productIds);
        
        this.orderRepo.save(order);

        // Emit an event that saga / other services might listen to 
        // Emulates "Choreography" format of Saga Pattern
        await this.eventBus.publish({
            eventName: "OrderPlacedEvent",
            occurredOn: new Date(),
            payload: { orderId, customerId, productIds }
        });

        return orderId;
    }
}

// Order Saga / Event Consumer
// This consumes domain events and triggers business processes
export class OrderSaga {
    constructor(
        private eventBus: EventBus,
        private orderRepo: OrderRepository
    ) {
        this.eventBus.subscribe("OrderPlacedEvent", this.onOrderPlaced.bind(this));
    }

    private async onOrderPlaced(event: DomainEvent): Promise<void> {
        console.log("[Saga] Processing OrderPlacedEvent...");
        const { orderId } = event.payload;

        const order = this.orderRepo.getById(orderId);
        if (!order) return;

        // Simulate async work like payment processing
        console.log(`[Saga] Validating payment for order ${orderId}...`);
        
        setTimeout(async () => {
             // In a real system we'd listen for PaymentCompletedEvent. 
             // Here we simulate success.
             order.complete();
             this.orderRepo.save(order);

             await this.eventBus.publish({
                 eventName: "OrderCompletedEvent",
                 occurredOn: new Date(),
                 payload: { orderId }
             });
        }, 1000);
    }
}
