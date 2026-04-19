import { IRepository } from '../shared/interfaces/IRepository';
import { ProductModel, IProduct } from './ProductModel';

export class ProductRepository implements IRepository<IProduct> {
    public async create(data: Partial<IProduct>): Promise<IProduct> {
        const product = new ProductModel(data);
        return product.save();
    }

    public async findById(id: string): Promise<IProduct | null> {
        return ProductModel.findById(id);
    }

    public async findAll(): Promise<IProduct[]> {
        return ProductModel.find().sort({ createdAt: -1 });
    }

    public async update(id: string, data: Partial<IProduct>): Promise<IProduct | null> {
        return ProductModel.findByIdAndUpdate(id, data, { new: true });
    }

    public async delete(id: string): Promise<boolean> {
        const result = await ProductModel.findByIdAndDelete(id);
        return result !== null;
    }

    public async findByCategory(category: string): Promise<IProduct[]> {
        return ProductModel.find({ category });
    }
}
