import { User, RegisterInput, LoginInput } from './auth.schema';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

// Define User Schema
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Create User Model
const UserModel = mongoose.model<User>('User', userSchema);

export class AuthModel {
    private static readonly JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
    private static readonly SALT_ROUNDS = 10;
    private static readonly JWT_EXPIRES_IN = '24h';

    static async register(input: RegisterInput): Promise<User> {
        // Check if user exists
        const existingUser = await UserModel.findOne({ email: input.email });
        if (existingUser) {
            throw new Error('User already exists');
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(input.password, this.SALT_ROUNDS);

        // Create new user
        const user = new UserModel({
            email: input.email,
            password: hashedPassword
        });

        // Save to database
        await user.save();

        return {
            id: user._id.toString(),
            email: user.email,
            password: user.password,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        };
    }

    static async login(input: LoginInput): Promise<string> {
        // Find user by email
        const user = await UserModel.findOne({ email: input.email });
        if (!user) {
            throw new Error('Invalid credentials');
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(input.password, user.password);
        if (!isValidPassword) {
            throw new Error('Invalid credentials');
        }

        // Generate JWT token
        return jwt.sign(
            { 
                userId: user._id.toString(),
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

            // Verify user still exists in database
            const user = await UserModel.findById(decoded.userId);
            if (!user) {
                throw new Error('User not found');
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