// backend/server.ts
import { EventBus } from './shared/EventBus';
import { ProductWriteRepository, ProductCommandService } from './catalog-service/CommandModel';
import { ProductReadRepository, ProductQueryService, CatalogProjector } from './catalog-service/QueryModel';
import { OrderRepository, OrderService, OrderSaga } from './order-service/OrderService';

// This file acts as our "Composition Root" and API entry point.
// In a real framework this would be Express/NestJS, here we demonstrate the architecture.

async function bootstrap() {
    console.log("Starting E-Commerce Architecture Demo...\n");

    // 1. Initialize Event Bus
    const eventBus = EventBus.getInstance();

    // 2. Initialize Repositories (In-Memory Databases)
    const productWriteRepo = new ProductWriteRepository();
    const productReadRepo = new ProductReadRepository();
    const orderRepo = new OrderRepository();

    // 3. Initialize Services and Handlers (CQRS)
    const productCommandService = new ProductCommandService(productWriteRepo, eventBus);
    const productQueryService = new ProductQueryService(productReadRepo);
    const catalogProjector = new CatalogProjector(eventBus, productReadRepo);

    const orderService = new OrderService(orderRepo, eventBus);
    const orderSaga = new OrderSaga(eventBus, orderRepo);

    // --- Simulating API Calls ---

    console.log("\n--- [API POST /catalog/product] ---");
    // Client sends CreateProductCommand
    const newProductId = await productCommandService.handleCreateProduct({
        name: "Premium Wireless Headphones",
        price: 299.99,
        description: "Noise-cancelling over-ear headphones.",
        stock: 50
    });
    console.log("Create Product API Response:", { id: newProductId });

    // Allow time for asynchronous Projector to update the View
    await new Promise(resolve => setTimeout(resolve, 50));

    console.log("\n--- [API GET /catalog/products] ---");
    // Client requests product list from the highly-optimized Read Model
    const productsView = productQueryService.getProducts();
    console.log("Get Products API Response:", productsView);


    console.log("\n--- [API POST /orders] ---");
    // Client places an order targeting the specific product
    if (productsView.length > 0) {
        const orderId = await orderService.placeOrder("user_123", [productsView[0]?.id || ""]);
        console.log("Place Order API Response:", { orderId });
    }

    // Keep process alive for a moment to see the saga complete
    setTimeout(() => {
        console.log("\nDemo Completed.");
    }, 1500);
}

bootstrap().catch(console.error);
