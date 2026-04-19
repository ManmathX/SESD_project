import { Request, Response } from 'express';
import { OrderService } from './OrderService';
import { AuthRequest } from '../shared/AuthMiddleware';

export class OrderController {
    constructor(private orderService: OrderService) {}

    public placeOrder = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const order = await this.orderService.placeOrder(req.userId!, req.body.items);
            res.status(201).json(order);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    };

    public getMyOrders = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const orders = await this.orderService.getOrdersByUser(req.userId!);
            res.json(orders);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    };

    public getById = async (req: Request, res: Response): Promise<void> => {
        try {
            const id = req.params.id as string;
            const order = await this.orderService.getOrderById(id);
            if (!order) {
                res.status(404).json({ error: "Order not found" });
                return;
            }
            res.json(order);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    };
}
