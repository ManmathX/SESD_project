import { AuthService } from '../AuthService';
import { UserRepository } from '../UserRepository';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Mock dependencies
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

describe('AuthService', () => {
    let authService: AuthService;
    let mockUserRepo: jest.Mocked<any>;

    beforeEach(() => {
        // Clear environment and mocks
        process.env.JWT_SECRET = 'test_secret';
        jest.clearAllMocks();

        // Create a mocked UserRepository object
        mockUserRepo = {
            findByEmail: jest.fn(),
            create: jest.fn(),
        } as unknown as UserRepository;

        authService = new AuthService(mockUserRepo as UserRepository);
    });

    describe('register', () => {
        it('should successfully register a new user', async () => {
            const mockUser = {
                _id: 'db_mocked_id_123',
                name: 'Test Name',
                email: 'test@example.com',
                password: 'hashed_password',
                role: 'user'
            };

            // Setup mocks
            mockUserRepo.findByEmail.mockResolvedValue(null); // User doesn't exist yet
            (bcrypt.hash as jest.Mock).mockResolvedValue('hashed_password');
            mockUserRepo.create.mockResolvedValue(mockUser);
            (jwt.sign as jest.Mock).mockReturnValue('mocked_jwt_token');

            // Execution
            const response = await authService.register('Test Name', 'test@example.com', 'mypassword123');

            // Assertions
            expect(mockUserRepo.findByEmail).toHaveBeenCalledWith('test@example.com');
            expect(bcrypt.hash).toHaveBeenCalledWith('mypassword123', 12);
            expect(mockUserRepo.create).toHaveBeenCalledWith({
                name: 'Test Name',
                email: 'test@example.com',
                password: 'hashed_password'
            });
            expect(jwt.sign).toHaveBeenCalledWith(
                { userId: 'db_mocked_id_123', role: 'user' },
                'test_secret',
                { expiresIn: '7d' }
            );

            expect(response).toEqual({
                user: {
                    id: 'db_mocked_id_123',
                    name: 'Test Name',
                    email: 'test@example.com',
                    role: 'user'
                },
                token: 'mocked_jwt_token'
            });
        });

        it('should throw an error if email is already registered', async () => {
            mockUserRepo.findByEmail.mockResolvedValue({ _id: '1', email: 'test@example.com' });

            await expect(authService.register('Test Name', 'test@example.com', 'pwd')).rejects.toThrow("Email already registered");
            
            expect(bcrypt.hash).not.toHaveBeenCalled();
            expect(mockUserRepo.create).not.toHaveBeenCalled();
        });
    });

    describe('login', () => {
        it('should successfully login and return a token', async () => {
            const mockUser = {
                _id: '123',
                name: 'John',
                email: 'john@example.com',
                password: 'hashed-pwd',
                role: 'admin'
            };

            mockUserRepo.findByEmail.mockResolvedValue(mockUser);
            (bcrypt.compare as jest.Mock).mockResolvedValue(true);
            (jwt.sign as jest.Mock).mockReturnValue('admin_token');

            const response = await authService.login('john@example.com', 'correct-password');

            expect(mockUserRepo.findByEmail).toHaveBeenCalledWith('john@example.com');
            expect(bcrypt.compare).toHaveBeenCalledWith('correct-password', 'hashed-pwd');
            
            expect(response).toEqual({
                user: { id: '123', name: 'John', email: 'john@example.com', role: 'admin' },
                token: 'admin_token'
            });
        });

        it('should throw an error for non-existent email', async () => {
            mockUserRepo.findByEmail.mockResolvedValue(null);

            await expect(authService.login('nobody@example.com', 'pwd')).rejects.toThrow("Invalid credentials");
        });

        it('should throw an error for wrong password', async () => {
            const mockUser = { email: 'john@example.com', password: 'hashed-pwd' };
            mockUserRepo.findByEmail.mockResolvedValue(mockUser);
            (bcrypt.compare as jest.Mock).mockResolvedValue(false);

            await expect(authService.login('john@example.com', 'wrong-pwd')).rejects.toThrow("Invalid credentials");
        });
    });
});
