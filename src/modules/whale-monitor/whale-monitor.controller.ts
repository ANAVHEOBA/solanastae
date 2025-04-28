import { Response } from 'express';
import { AuthenticatedRequest } from '../../types/request.types';
import { WhaleMonitorCrud } from './whale-monitor.crud';
import { WatchlistItemInput, AlertConfigInput } from './whale-monitor.schema';
import { responseHelper } from '../../utils/response.helper';

export class WhaleMonitorController {
    private whaleMonitorCrud: WhaleMonitorCrud;

    constructor() {
        this.whaleMonitorCrud = new WhaleMonitorCrud();
    }

    // Watchlist Methods
    createWatchlistItem = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        try {
            const userId = req.user.id;
            const input: WatchlistItemInput = req.body;
            const item = await this.whaleMonitorCrud.createWatchlistItem(userId, input);
            responseHelper.success(res, { item });
        } catch (error) {
            responseHelper.error(res, error);
        }
    }

    getWatchlist = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        try {
            const userId = req.user.id;
            const items = await this.whaleMonitorCrud.getWatchlist(userId);
            responseHelper.success(res, { items });
        } catch (error) {
            responseHelper.error(res, error);
        }
    }

    updateWatchlistItem = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        try {
            const userId = req.user.id;
            const { itemId } = req.params;
            const input: Partial<WatchlistItemInput> = req.body;
            const item = await this.whaleMonitorCrud.updateWatchlistItem(userId, itemId, input);
            responseHelper.success(res, { item });
        } catch (error) {
            responseHelper.error(res, error);
        }
    }

    deleteWatchlistItem = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        try {
            const userId = req.user.id;
            const { itemId } = req.params;
            await this.whaleMonitorCrud.deleteWatchlistItem(userId, itemId);
            responseHelper.success(res, { message: 'Watchlist item deleted successfully' });
        } catch (error) {
            responseHelper.error(res, error);
        }
    }

    // Alert Config Methods
    setAlertConfig = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        try {
            const userId = req.user.id;
            const input: AlertConfigInput = req.body;
            const config = await this.whaleMonitorCrud.setAlertConfig(userId, input);
            responseHelper.success(res, { config });
        } catch (error) {
            responseHelper.error(res, error);
        }
    }

    getAlertConfig = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        try {
            const userId = req.user.id;
            const config = await this.whaleMonitorCrud.getAlertConfig(userId);
            responseHelper.success(res, { config });
        } catch (error) {
            responseHelper.error(res, error);
        }
    }

    // Activity Methods
    getWhaleActivity = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        try {
            const userId = req.user.id;
            const limit = parseInt(req.query.limit as string) || 10;
            const activities = await this.whaleMonitorCrud.getWhaleActivity(userId, limit);
            responseHelper.success(res, { activities });
        } catch (error) {
            responseHelper.error(res, error);
        }
    }
}