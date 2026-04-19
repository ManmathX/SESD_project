import { Router } from 'express';
import { AuthController } from './AuthController';
import { AuthService } from './AuthService';
import { UserRepository } from './UserRepository';

export function createAuthRoutes(): Router {
    const router = Router();
    const userRepo = new UserRepository();
    const authService = new AuthService(userRepo);
    const authController = new AuthController(authService);

    router.post('/register', authController.register);
    router.post('/login', authController.login);

    return router;
}
