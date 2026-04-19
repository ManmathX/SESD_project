import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserRepository } from './UserRepository';

interface AuthResponse {
    user: { id: string; name: string; email: string; role: string };
    token: string;
}

export class AuthService {
    constructor(private userRepo: UserRepository) {}

    public async register(name: string, email: string, password: string): Promise<AuthResponse> {
        const existing = await this.userRepo.findByEmail(email);
        if (existing) throw new Error("Email already registered");

        const hashedPassword = await bcrypt.hash(password, 12);
        const user = await this.userRepo.create({ name, email, password: hashedPassword });
        const userId = String(user._id);
        const token = this.generateToken(userId, user.role);

        return {
            user: { id: userId, name: user.name, email: user.email, role: user.role },
            token
        };
    }

    public async login(email: string, password: string): Promise<AuthResponse> {
        const user = await this.userRepo.findByEmail(email);
        if (!user) throw new Error("Invalid credentials");

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) throw new Error("Invalid credentials");

        const userId = String(user._id);
        const token = this.generateToken(userId, user.role);

        return {
            user: { id: userId, name: user.name, email: user.email, role: user.role },
            token
        };
    }

    private generateToken(userId: string, role: string): string {
        return jwt.sign({ userId, role }, process.env['JWT_SECRET'] || 'fallback_secret', { expiresIn: '7d' });
    }
}
