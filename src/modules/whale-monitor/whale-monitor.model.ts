import { WatchlistItem, WatchlistItemInput, AlertConfig, AlertConfigInput, WhaleActivity, WatchlistItemType } from './whale-monitor.schema';
import { SolscanModel } from '../solscan/solscan.model';
import mongoose from 'mongoose';

// Define MongoDB Schemas
const watchlistItemSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    label: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: Object.values(WatchlistItemType),
        required: true
    },
    notes: String,
    tokenSymbol: String,
    tokenName: String,
    tokenDecimals: Number,
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

const alertConfigSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        unique: true
    },
    threshold: {
        type: Number,
        required: true
    },
    notificationType: {
        type: String,
        enum: ['email', 'webhook', 'discord', 'telegram'],
        required: true
    },
    channels: [String],
    isActive: {
        type: Boolean,
        default: true
    },
    monitorTransfers: {
        type: Boolean,
        default: true
    },
    monitorSwaps: {
        type: Boolean,
        default: true
    },
    monitorPrice: {
        type: Boolean,
        default: false
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

const whaleActivitySchema = new mongoose.Schema({
    address: {
        type: String,
        required: true
    },
    transactionHash: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    tokenAddress: String,
    timestamp: {
        type: Date,
        default: Date.now
    },
    type: {
        type: String,
        enum: ['transfer', 'swap', 'stake', 'unstake'],
        required: true
    },
    status: {
        type: String,
        enum: ['success', 'failed'],
        required: true
    },
    fromAddress: String,
    toAddress: String,
    tokenSymbol: String,
    usdValue: Number
});

// Create Models
const WatchlistItemModel = mongoose.model<WatchlistItem>('WatchlistItem', watchlistItemSchema);
const AlertConfigModel = mongoose.model<AlertConfig>('AlertConfig', alertConfigSchema);
const WhaleActivityModel = mongoose.model<WhaleActivity>('WhaleActivity', whaleActivitySchema);

export class WhaleMonitorModel {
    // Watchlist Methods
    static async createWatchlistItem(userId: string, input: WatchlistItemInput): Promise<WatchlistItem> {
        // Check if item already exists
        const existingItem = await WatchlistItemModel.findOne({
            userId,
            address: input.address
        });

        if (existingItem) {
            throw new Error('Address already in watchlist');
        }

        // If it's a token, fetch token metadata
        if (input.type === WatchlistItemType.TOKEN) {
            const tokenMetadata = await SolscanModel.getTokenMetadataMulti([input.address]);
            if (tokenMetadata.success && tokenMetadata.data.length > 0) {
                const token = tokenMetadata.data[0];
                input.tokenSymbol = token.symbol;
                input.tokenName = token.name;
                input.tokenDecimals = token.decimals;
            }
        }

        // Create new watchlist item
        const item = new WatchlistItemModel({
            userId,
            ...input
        });

        await item.save();
        return item.toObject();
    }

    static async getWatchlist(userId: string): Promise<WatchlistItem[]> {
        return await WatchlistItemModel.find({ userId }).lean();
    }

    static async updateWatchlistItem(userId: string, itemId: string, input: Partial<WatchlistItemInput>): Promise<WatchlistItem> {
        const item = await WatchlistItemModel.findOneAndUpdate(
            { _id: itemId, userId },
            { ...input, updatedAt: new Date() },
            { new: true }
        );

        if (!item) {
            throw new Error('Watchlist item not found');
        }

        return item.toObject();
    }

    static async deleteWatchlistItem(userId: string, itemId: string): Promise<void> {
        const result = await WatchlistItemModel.deleteOne({ _id: itemId, userId });
        if (result.deletedCount === 0) {
            throw new Error('Watchlist item not found');
        }
    }

    // Alert Config Methods
    static async setAlertConfig(userId: string, input: AlertConfigInput): Promise<AlertConfig> {
        const config = await AlertConfigModel.findOneAndUpdate(
            { userId },
            { ...input, updatedAt: new Date() },
            { new: true, upsert: true }
        );

        return config.toObject();
    }

    static async getAlertConfig(userId: string): Promise<AlertConfig | null> {
        const config = await AlertConfigModel.findOne({ userId });
        return config ? config.toObject() : null;
    }

    // Activity Methods
    static async getWhaleActivity(userId: string, limit: number = 10): Promise<WhaleActivity[]> {
        const userWatchlist = await WatchlistItemModel.find({ userId });
        const watchlistAddresses = userWatchlist.map(item => item.address);

        return await WhaleActivityModel.find({ address: { $in: watchlistAddresses } })
            .sort({ timestamp: -1 })
            .limit(limit)
            .lean();
    }

    static async checkLargeTransfers(activity: WhaleActivity, threshold: number = 1000): Promise<boolean> {
        // Check if the transaction is a transfer and exceeds the threshold
        if (activity.type === 'transfer' && activity.usdValue && activity.usdValue >= threshold) {
            return true;
        }
        return false;
    }

    static async addWhaleActivity(activity: Omit<WhaleActivity, 'id'>): Promise<WhaleActivity> {
        const newActivity = new WhaleActivityModel(activity);
        await newActivity.save();

        // Check for large transfers after saving
        const isLargeTransfer = await this.checkLargeTransfers(newActivity.toObject());
        if (isLargeTransfer) {
            // Emit event through WebSocket service
            const WebSocketService = (await import('../../services/websocket.service')).WebSocketService;
            WebSocketService.emitToChannel(
                activity.address,
                'large-transfer',
                {
                    transaction: newActivity.toObject(),
                    message: `Large transfer detected: $${activity.usdValue}`
                }
            );
        }

        return newActivity.toObject();
    }
} 