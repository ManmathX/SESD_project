import { IRepository } from '../shared/interfaces/IRepository';
import { OrderModel, IOrder } from './OrderModel';

export class OrderRepository implements IRepository<IOrder> {
    public async create(data: Partial<IOrder>): Promise<IOrder> {
        const order = new OrderModel(data);
        return order.save();
    }

    public async findById(id: string): Promise<IOrder | null> {
        return OrderModel.findById(id);
    }

    public async findAll(): Promise<IOrder[]> {
        return OrderModel.find().sort({ createdAt: -1 });
    }

    public async update(id: string, data: Partial<IOrder>): Promise<IOrder | null> {
        return OrderModel.findByIdAndUpdate(id, data, { new: true });
    }

    public async delete(id: string): Promise<boolean> {
        const result = await OrderModel.findByIdAndDelete(id);
        return result !== null;
    }

    public async findByUserId(userId: string): Promise<IOrder[]> {
        return OrderModel.find({ userId }).sort({ createdAt: -1 });
    }
}
