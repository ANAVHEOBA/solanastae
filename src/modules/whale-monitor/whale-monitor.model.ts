import { WatchlistItem, WatchlistItemInput, AlertConfig, AlertConfigInput, WhaleActivity, WatchlistItemType } from './whale-monitor.schema';
import { v4 as uuidv4 } from 'uuid';
import { SolscanModel } from '../solscan/solscan.model';

export class WhaleMonitorModel {
    private static watchlistItems: WatchlistItem[] = [];
    private static alertConfigs: AlertConfig[] = [];
    private static whaleActivities: WhaleActivity[] = [];

    // Watchlist Methods
    static async createWatchlistItem(userId: string, input: WatchlistItemInput): Promise<WatchlistItem> {
        const existingItem = this.watchlistItems.find(
            item => item.userId === userId && item.address === input.address
        );

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

        const item: WatchlistItem = {
            id: uuidv4(),
            userId,
            ...input,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        this.watchlistItems.push(item);
        return item;
    }

    static async getWatchlist(userId: string): Promise<WatchlistItem[]> {
        return this.watchlistItems.filter(item => item.userId === userId);
    }

    static async updateWatchlistItem(userId: string, itemId: string, input: Partial<WatchlistItemInput>): Promise<WatchlistItem> {
        const index = this.watchlistItems.findIndex(item => item.id === itemId && item.userId === userId);
        
        if (index === -1) {
            throw new Error('Watchlist item not found');
        }

        // If updating token metadata
        if (input.type === WatchlistItemType.TOKEN && input.address) {
            const tokenMetadata = await SolscanModel.getTokenMetadataMulti([input.address]);
            if (tokenMetadata.success && tokenMetadata.data.length > 0) {
                const token = tokenMetadata.data[0];
                input.tokenSymbol = token.symbol;
                input.tokenName = token.name;
                input.tokenDecimals = token.decimals;
            }
        }

        this.watchlistItems[index] = {
            ...this.watchlistItems[index],
            ...input,
            updatedAt: new Date()
        };

        return this.watchlistItems[index];
    }

    static async deleteWatchlistItem(userId: string, itemId: string): Promise<void> {
        const index = this.watchlistItems.findIndex(item => item.id === itemId && item.userId === userId);
        
        if (index === -1) {
            throw new Error('Watchlist item not found');
        }

        this.watchlistItems.splice(index, 1);
    }

    // Alert Config Methods
    static async setAlertConfig(userId: string, input: AlertConfigInput): Promise<AlertConfig> {
        const existingConfig = this.alertConfigs.find(config => config.userId === userId);

        if (existingConfig) {
            existingConfig.threshold = input.threshold;
            existingConfig.notificationType = input.notificationType;
            existingConfig.channels = input.channels;
            existingConfig.isActive = input.isActive;
            existingConfig.monitorTransfers = input.monitorTransfers;
            existingConfig.monitorSwaps = input.monitorSwaps;
            existingConfig.monitorPrice = input.monitorPrice;
            existingConfig.updatedAt = new Date();
            return existingConfig;
        }

        const config: AlertConfig = {
            id: uuidv4(),
            userId,
            ...input,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        this.alertConfigs.push(config);
        return config;
    }

    static async getAlertConfig(userId: string): Promise<AlertConfig | null> {
        return this.alertConfigs.find(config => config.userId === userId) || null;
    }

    // Activity Methods
    static async getWhaleActivity(userId: string, limit: number = 10): Promise<WhaleActivity[]> {
        const userWatchlist = this.watchlistItems.filter(item => item.userId === userId);
        const watchlistAddresses = userWatchlist.map(item => item.address);

        return this.whaleActivities
            .filter(activity => watchlistAddresses.includes(activity.address))
            .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
            .slice(0, limit);
    }

    static async addWhaleActivity(activity: Omit<WhaleActivity, 'id'>): Promise<WhaleActivity> {
        const newActivity: WhaleActivity = {
            id: uuidv4(),
            ...activity
        };

        this.whaleActivities.push(newActivity);
        return newActivity;
    }
} 