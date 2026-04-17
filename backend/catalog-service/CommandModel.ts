// backend/catalog-service/CommandModel.ts
import { EventBus } from '../shared/EventBus';

// Domain Entity
export class Product {
    constructor(
        public readonly id: string,
        public name: string,
        public price: number,
        public description: string,
        public stock: number
    ) {}
}

export interface CreateProductCommand {
    name: string;
    price: number;
    description: string;
    stock: number;
}

// In-Memory Write Database
export class ProductWriteRepository {
    private products: Map<string, Product> = new Map();

    public save(product: Product): void {
        this.products.set(product.id, product);
        console.log(`[WriteDB] Saved product ${product.id}`);
    }

    public getById(id: string): Product | undefined {
        return this.products.get(id);
    }
}

// Command Handler / Controller
export class ProductCommandService {
    constructor(
        private writeRepo: ProductWriteRepository,
        private eventBus: EventBus
    ) {}

    public async handleCreateProduct(command: CreateProductCommand): Promise<string> {
        // 1. Validate
        if (command.price <= 0) throw new Error("Price must be > 0");

        // 2. Perform business logic
        const productId = `prod_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
        const product = new Product(productId, command.name, command.price, command.description, command.stock);
        
        // 3. Update Write Model
        this.writeRepo.save(product);

        // 4. Publish Event
        await this.eventBus.publish({
            eventName: "ProductCreatedEvent",
            occurredOn: new Date(),
            payload: {
                id: product.id,
                name: product.name,
                price: product.price,
                description: product.description,
                stock: product.stock
            }
        });

        return productId;
    }
}
