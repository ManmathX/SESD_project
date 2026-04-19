import { ProductRepository } from './ProductRepository';
import { IProduct } from './ProductModel';
import { IEventBus } from '../shared/interfaces/IEventBus';

export class ProductService {
    constructor(
        private productRepo: ProductRepository,
        private eventBus: IEventBus
    ) {}

    public async createProduct(data: Partial<IProduct>): Promise<IProduct> {
        if (!data.name || !data.price) throw new Error("Name and price are required");
        if (data.price <= 0) throw new Error("Price must be greater than 0");

        const product = await this.productRepo.create(data);

        await this.eventBus.publish({
            eventName: "ProductCreatedEvent",
            occurredOn: new Date(),
            payload: { productId: String(product._id), name: product.name, price: product.price }
        });

        return product;
    }

    public async getAllProducts(): Promise<IProduct[]> {
        return this.productRepo.findAll();
    }

    public async getProductById(id: string): Promise<IProduct | null> {
        return this.productRepo.findById(id);
    }

    public async updateProduct(id: string, data: Partial<IProduct>): Promise<IProduct | null> {
        const updated = await this.productRepo.update(id, data);
        if (updated) {
            await this.eventBus.publish({
                eventName: "ProductUpdatedEvent",
                occurredOn: new Date(),
                payload: { productId: id }
            });
        }
        return updated;
    }

    public async deleteProduct(id: string): Promise<boolean> {
        const result = await this.productRepo.delete(id);
        if (result) {
            await this.eventBus.publish({
                eventName: "ProductDeletedEvent",
                occurredOn: new Date(),
                payload: { productId: id }
            });
        }
        return result;
    }
}
