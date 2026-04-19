import { Request, Response } from 'express';
import { AuthService } from './AuthService';

export class AuthController {
    constructor(private authService: AuthService) {}

    public register = async (req: Request, res: Response): Promise<void> => {
        try {
            const { name, email, password } = req.body;
            const result = await this.authService.register(name, email, password);
            res.status(201).json(result);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    };

    public login = async (req: Request, res: Response): Promise<void> => {
        try {
            const { email, password } = req.body;
            const result = await this.authService.login(email, password);
            res.status(200).json(result);
        } catch (error: any) {
            res.status(401).json({ error: error.message });
        }
    };
}
