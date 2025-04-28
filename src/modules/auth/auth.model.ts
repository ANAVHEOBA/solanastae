import { User, RegisterInput, LoginInput } from './auth.schema';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export class AuthModel {
    private static users: User[] = [];
    private static readonly JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
    private static readonly SALT_ROUNDS = 10;
    private static readonly JWT_EXPIRES_IN = '24h';

    static async register(input: RegisterInput): Promise<User> {
        const existingUser = this.users.find(user => user.email === input.email);
        if (existingUser) {
            throw new Error('User already exists');
        }

        const hashedPassword = await bcrypt.hash(input.password, this.SALT_ROUNDS);
        const user: User = {
            id: Math.random().toString(36).substring(7),
            email: input.email,
            password: hashedPassword,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        this.users.push(user);
        return user;
    }

    static async login(input: LoginInput): Promise<string> {
        const user = this.users.find(user => user.email === input.email);
        if (!user) {
            throw new Error('Invalid credentials');
        }

        const isValidPassword = await bcrypt.compare(input.password, user.password);
        if (!isValidPassword) {
            throw new Error('Invalid credentials');
        }

        return jwt.sign(
            { 
                userId: user.id,
                email: user.email,
                type: 'user'
            }, 
            this.JWT_SECRET, 
            { expiresIn: this.JWT_EXPIRES_IN }
        );
    }

    static async validateToken(token: string): Promise<string> {
        try {
            const decoded = jwt.verify(token, this.JWT_SECRET) as { 
                userId: string;
                email: string;
                type: string;
                exp: number;
            };

            if (decoded.type !== 'user') {
                throw new Error('Invalid token type');
            }

            if (decoded.exp && decoded.exp < Math.floor(Date.now() / 1000)) {
                throw new Error('Token has expired');
            }

            return decoded.userId;
        } catch (error) {
            if (error instanceof jwt.TokenExpiredError) {
                throw new Error('Token has expired');
            }
            throw new Error('Invalid token');
        }
    }
} 