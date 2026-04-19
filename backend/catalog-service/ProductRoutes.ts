import { Router } from 'express';
import { ProductController } from './ProductController';
import { ProductService } from './ProductService';
import { ProductRepository } from './ProductRepository';
import { EventBus } from '../shared/EventBus';
import { AuthMiddleware } from '../shared/AuthMiddleware';

export function createProductRoutes(): Router {
    const router = Router();
    const productRepo = new ProductRepository();
    const eventBus = EventBus.getInstance();
    const productService = new ProductService(productRepo, eventBus);
    const productController = new ProductController(productService);

    router.get('/', productController.getAll);
    router.get('/:id', productController.getById);
    router.post('/', AuthMiddleware.verify, productController.create);
    router.put('/:id', AuthMiddleware.verify, productController.update);
    router.delete('/:id', AuthMiddleware.verify, productController.remove);

    return router;
}
