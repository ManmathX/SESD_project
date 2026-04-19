import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import DatabaseConnection from './shared/Database';
import { createAuthRoutes } from './auth-service/AuthRoutes';
import { createProductRoutes } from './catalog-service/ProductRoutes';
import { createOrderRoutes } from './order-service/OrderRoutes';
import { EventBus } from './shared/EventBus';

class Application {
    private app = express();
    private port = process.env['PORT'] || 5000;

    constructor() {
        this.configureMiddleware();
        this.configureRoutes();
        this.configureEventHandlers();
    }

    private configureMiddleware(): void {
        this.app.use(cors());
        this.app.use(express.json());
    }

    private configureRoutes(): void {
        this.app.use('/api/auth', createAuthRoutes());
        this.app.use('/api/products', createProductRoutes());
        this.app.use('/api/orders', createOrderRoutes());

        this.app.get('/api/health', (_req, res) => {
            res.json({ status: 'ok', timestamp: new Date().toISOString() });
        });
    }

    private configureEventHandlers(): void {
        const eventBus = EventBus.getInstance();

        eventBus.subscribe("ProductCreatedEvent", (event) => {
            console.log(`[Event] Product created: ${event.payload['name']}`);
        });

        eventBus.subscribe("OrderPlacedEvent", (event) => {
            console.log(`[Event] Order placed: ${event.payload['orderId']} — Total: $${event.payload['totalAmount']}`);
        });

        eventBus.subscribe("OrderCompletedEvent", (event) => {
            console.log(`[Event] Order completed: ${event.payload['orderId']}`);
        });
    }

    public async start(): Promise<void> {
        const mongoUri = process.env['MONGODB_URI'];
        if (!mongoUri) throw new Error("MONGODB_URI is not defined");

        await DatabaseConnection.connect(mongoUri);

        this.app.listen(this.port, () => {
            console.log(`Server running on port ${this.port}`);
        });
    }
}

const application = new Application();
application.start().catch(console.error);
