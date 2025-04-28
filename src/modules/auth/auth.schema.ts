import { z } from 'zod';

export interface User {
    id: string;
    email: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
}

export const registerSchema = z.object({
    email: z.string()
        .email('Invalid email format')
        .min(5, 'Email must be at least 5 characters')
        .max(100, 'Email must be at most 100 characters'),
    password: z.string()
        .min(8, 'Password must be at least 8 characters')
        .max(100, 'Password must be at most 100 characters')
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
            'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
        )
});

export const loginSchema = z.object({
    email: z.string()
        .email('Invalid email format'),
    password: z.string()
        .min(1, 'Password is required')
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>; 