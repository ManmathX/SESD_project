// backend/catalog-service/QueryModel.ts
import { EventBus, DomainEvent } from '../shared/EventBus';

export interface ProductReadDto {
    id: string;
    displayName: string;
    priceFormatted: string;
    isAvailable: boolean;
}

// In-Memory Read Database (Materialized View)
// Optimized for fast retrieval, pre-computed data
export class ProductReadRepository {
    private productsView: Map<string, ProductReadDto> = new Map();

    public saveOrUpdate(dto: ProductReadDto): void {
        this.productsView.set(dto.id, dto);
        console.log(`[ReadDB] Projected update for product ${dto.id}`);
    }

    public getAll(): ProductReadDto[] {
        return Array.from(this.productsView.values());
    }

    public getById(id: string): ProductReadDto | undefined {
        return this.productsView.get(id);
    }
}

// Query Handler / Controller
export class ProductQueryService {
    constructor(private readRepo: ProductReadRepository) {}

    public getProducts(): ProductReadDto[] {
        return this.readRepo.getAll();
    }
}

// Event Consumer (Projector) - Listens to events and updates read model
export class CatalogProjector {
    constructor(
        private eventBus: EventBus,
        private readRepo: ProductReadRepository
    ) {
        this.eventBus.subscribe("ProductCreatedEvent", this.onProductCreated.bind(this));
    }

    private onProductCreated(event: DomainEvent): void {
        const { payload } = event;
        // Transform Domain Data into Read-Optimized DTO
        const readDto: ProductReadDto = {
            id: payload.id,
            displayName: `${payload.name}`,
            priceFormatted: `$${payload.price.toFixed(2)}`,
            isAvailable: payload.stock > 0
        };
        
        this.readRepo.saveOrUpdate(readDto);
    }
}
