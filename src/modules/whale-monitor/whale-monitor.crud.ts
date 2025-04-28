import { WhaleMonitorModel } from './whale-monitor.model';
import { WatchlistItemInput, AlertConfigInput } from './whale-monitor.schema';

export class WhaleMonitorCrud {
    async createWatchlistItem(userId: string, input: WatchlistItemInput) {
        return await WhaleMonitorModel.createWatchlistItem(userId, input);
    }

    async getWatchlist(userId: string) {
        return await WhaleMonitorModel.getWatchlist(userId);
    }

    async updateWatchlistItem(userId: string, itemId: string, input: Partial<WatchlistItemInput>) {
        return await WhaleMonitorModel.updateWatchlistItem(userId, itemId, input);
    }

    async deleteWatchlistItem(userId: string, itemId: string) {
        return await WhaleMonitorModel.deleteWatchlistItem(userId, itemId);
    }

    async setAlertConfig(userId: string, input: AlertConfigInput) {
        return await WhaleMonitorModel.setAlertConfig(userId, input);
    }

    async getAlertConfig(userId: string) {
        return await WhaleMonitorModel.getAlertConfig(userId);
    }

    async getWhaleActivity(userId: string, limit: number) {
        return await WhaleMonitorModel.getWhaleActivity(userId, limit);
    }
} 