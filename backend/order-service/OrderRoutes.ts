import { Router } from 'express';
import { OrderController } from './OrderController';
import { OrderService } from './OrderService';
import { OrderRepository } from './OrderRepository';
import { EventBus } from '../shared/EventBus';
import { AuthMiddleware } from '../shared/AuthMiddleware';

export function createOrderRoutes(): Router {
    const router = Router();
    const orderRepo = new OrderRepository();
    const eventBus = EventBus.getInstance();
    const orderService = new OrderService(orderRepo, eventBus);
    const orderController = new OrderController(orderService);

    router.post('/', AuthMiddleware.verify, orderController.placeOrder);
    router.get('/my-orders', AuthMiddleware.verify, orderController.getMyOrders);
    router.get('/:id', AuthMiddleware.verify, orderController.getById);

    return router;
}
