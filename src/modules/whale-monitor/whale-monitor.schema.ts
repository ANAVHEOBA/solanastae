import { z } from 'zod';

export enum WatchlistItemType {
    TOKEN = 'token',
    ACCOUNT = 'account',
    CEX = 'cex',
    PROTOCOL = 'protocol',
    OTHER = 'other'
}

export enum NotificationType {
    EMAIL = 'email',
    WEBHOOK = 'webhook',
    DISCORD = 'discord',
    TELEGRAM = 'telegram'
}

export interface WatchlistItem {
    _id?: string;
    id?: string;
    userId: string;
    address: string;
    label: string;
    type: WatchlistItemType;
    notes?: string;
    tokenSymbol?: string;
    tokenName?: string;
    tokenDecimals?: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface AlertConfig {
    _id?: string;
    id?: string;
    userId: string;
    threshold: number; // in SOL or token amount
    notificationType: NotificationType;
    channels: string[]; // email addresses, webhook URLs, etc.
    isActive: boolean;
    monitorTransfers: boolean;
    monitorSwaps: boolean;
    monitorPrice: boolean;
    largeTransferThreshold: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface WhaleActivity {
    _id?: string;
    id?: string;
    address: string;
    transactionHash: string;
    amount: number;
    tokenAddress?: string;
    timestamp: Date;
    type: 'transfer' | 'swap' | 'stake' | 'unstake';
    status: 'success' | 'failed';
    fromAddress?: string;
    toAddress?: string;
    tokenSymbol?: string;
    usdValue?: number;
}

// Validation Schemas
export const watchlistItemSchema = z.object({
    address: z.string().min(32).max(44),
    label: z.string().min(1).max(50),
    type: z.nativeEnum(WatchlistItemType),
    notes: z.string().optional(),
    tokenSymbol: z.string().optional(),
    tokenName: z.string().optional(),
    tokenDecimals: z.number().optional()
});

export const alertConfigSchema = z.object({
    threshold: z.number().min(0),
    notificationType: z.nativeEnum(NotificationType),
    channels: z.array(z.string()),
    isActive: z.boolean().default(true),
    monitorTransfers: z.boolean().default(true),
    monitorSwaps: z.boolean().default(true),
    monitorPrice: z.boolean().default(false),
    largeTransferThreshold: z.number().min(0).default(1000)
});

export type WatchlistItemInput = z.infer<typeof watchlistItemSchema>;
export type AlertConfigInput = z.infer<typeof alertConfigSchema>; 