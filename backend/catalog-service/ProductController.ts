import { Request, Response } from 'express';
import { ProductService } from './ProductService';

export class ProductController {
    constructor(private productService: ProductService) {}

    public create = async (req: Request, res: Response): Promise<void> => {
        try {
            const product = await this.productService.createProduct(req.body);
            res.status(201).json(product);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    };

    public getAll = async (_req: Request, res: Response): Promise<void> => {
        try {
            const products = await this.productService.getAllProducts();
            res.json(products);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    };

    public getById = async (req: Request, res: Response): Promise<void> => {
        try {
            const id = req.params.id as string;
            const product = await this.productService.getProductById(id);
            if (!product) {
                res.status(404).json({ error: "Product not found" });
                return;
            }
            res.json(product);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    };

    public update = async (req: Request, res: Response): Promise<void> => {
        try {
            const id = req.params.id as string;
            const product = await this.productService.updateProduct(id, req.body);
            if (!product) {
                res.status(404).json({ error: "Product not found" });
                return;
            }
            res.json(product);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    };

    public remove = async (req: Request, res: Response): Promise<void> => {
        try {
            const id = req.params.id as string;
            const deleted = await this.productService.deleteProduct(id);
            if (!deleted) {
                res.status(404).json({ error: "Product not found" });
                return;
            }
            res.json({ message: "Product deleted" });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    };
}
