import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
    name: string;
    price: number;
    description: string;
    image: string;
    stock: number;
    category: string;
    createdAt: Date;
}

const ProductSchema = new Schema<IProduct>({
    name: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    description: { type: String, required: true },
    image: { type: String, default: '' },
    stock: { type: Number, required: true, default: 0 },
    category: { type: String, default: 'general' },
    createdAt: { type: Date, default: Date.now }
});

export const ProductModel = mongoose.model<IProduct>('Product', ProductSchema);
