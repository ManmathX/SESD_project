import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
    userId?: string;
    role?: string;
}

export class AuthMiddleware {
    public static verify(req: AuthRequest, res: Response, next: NextFunction): void {
        const authHeader = req.headers.authorization;
        if (!authHeader?.startsWith('Bearer ')) {
            res.status(401).json({ error: "No token provided" });
            return;
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            res.status(401).json({ error: "No token provided" });
            return;
        }

        try {
            const decoded = jwt.verify(token, process.env['JWT_SECRET'] || 'fallback_secret') as { userId: string, role?: string };
            req.userId = decoded.userId;
            req.role = decoded.role;
            next();
        } catch {
            res.status(401).json({ error: "Invalid token" });
        }
    }

    public static requireAdmin(req: AuthRequest, res: Response, next: NextFunction): void {
        AuthMiddleware.verify(req, res, () => {
            if (req.role !== 'admin') {
                res.status(403).json({ error: "Forbidden: Admin access required" });
                return;
            }
            next();
        });
    }
}
