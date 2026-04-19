import mongoose, { Schema, Document } from 'mongoose';

export enum OrderStatus {
    PENDING = "PENDING",
    COMPLETED = "COMPLETED",
    FAILED = "FAILED"
}

export interface IOrderItem {
    productId: string;
    name: string;
    price: number;
    quantity: number;
}

export interface IOrder extends Document {
    userId: string;
    items: IOrderItem[];
    totalAmount: number;
    status: OrderStatus;
    createdAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>({
    productId: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 }
}, { _id: false });

const OrderSchema = new Schema<IOrder>({
    userId: { type: String, required: true },
    items: { type: [OrderItemSchema], required: true },
    totalAmount: { type: Number, required: true },
    status: { type: String, enum: Object.values(OrderStatus), default: OrderStatus.PENDING },
    createdAt: { type: Date, default: Date.now }
});

export const OrderModel = mongoose.model<IOrder>('Order', OrderSchema);
