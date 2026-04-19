import { OrderRepository } from './OrderRepository';
import { IOrder, IOrderItem, OrderStatus } from './OrderModel';
import { IEventBus } from '../shared/interfaces/IEventBus';

export class OrderService {
    constructor(
        private orderRepo: OrderRepository,
        private eventBus: IEventBus
    ) {}

    public async placeOrder(userId: string, items: IOrderItem[]): Promise<IOrder> {
        if (!items.length) throw new Error("Order must contain at least one item");

        const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

        const order = await this.orderRepo.create({
            userId,
            items,
            totalAmount,
            status: OrderStatus.PENDING
        });

        await this.eventBus.publish({
            eventName: "OrderPlacedEvent",
            occurredOn: new Date(),
            payload: { orderId: String(order._id), userId, totalAmount }
        });

        return order;
    }

    public async getOrdersByUser(userId: string): Promise<IOrder[]> {
        return this.orderRepo.findByUserId(userId);
    }

    public async getOrderById(id: string): Promise<IOrder | null> {
        return this.orderRepo.findById(id);
    }

    public async completeOrder(id: string): Promise<IOrder | null> {
        const order = await this.orderRepo.update(id, { status: OrderStatus.COMPLETED });
        if (order) {
            await this.eventBus.publish({
                eventName: "OrderCompletedEvent",
                occurredOn: new Date(),
                payload: { orderId: id }
            });
        }
        return order;
    }
}
