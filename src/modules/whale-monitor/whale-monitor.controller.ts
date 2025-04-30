import { Response } from 'express';
import { AuthenticatedRequest } from '../../types/request.types';
import { WhaleMonitorCrud } from './whale-monitor.crud';
import { WatchlistItemInput, AlertConfigInput } from './whale-monitor.schema';
import { responseHelper } from '../../utils/response.helper';
import { SolscanModel } from '../solscan/solscan.model';
import { CacheService } from '../../services/cache.service';
import { TransactionMonitorService } from '../../services/transaction-monitor.service';

export class WhaleMonitorController {
    private whaleMonitorCrud: WhaleMonitorCrud;
    private cacheService: CacheService;

    constructor() {
        this.whaleMonitorCrud = new WhaleMonitorCrud();
        this.cacheService = new CacheService();
    }

    // Watchlist Methods
    createWatchlistItem = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        try {
            const userId = req.user.id;
            const input: WatchlistItemInput = req.body;
            
            // Create watchlist item
            const item = await this.whaleMonitorCrud.createWatchlistItem(userId, input);
            
            // Initialize transaction monitoring for the address
            await TransactionMonitorService.initializeMonitoring(input.address);
            
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

    // Account Details Method
    getAccountDetails = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        try {
            const { address } = req.params;
            const userId = req.user.id;

            // Check if address is in user's watchlist
            const watchlist = await this.whaleMonitorCrud.getWatchlist(userId);
            const isWatched = watchlist.some(item => item.address === address);

            if (!isWatched) {
                responseHelper.error(res, new Error('Address not in watchlist'), 403);
                return;
            }

            // Try to get cached data first
            const cacheKey = `account:${address}`;
            const cachedData = await this.cacheService.get(cacheKey);

            if (cachedData) {
                responseHelper.success(res, { data: cachedData, cached: true });
                return;
            }

            // Fetch fresh data from Solscan
            const [accountDetails, transactions, portfolio, tokenAccounts, stakeAccounts, transfers, defiActivities] = await Promise.all([
                SolscanModel.getAccountDetail(address),
                SolscanModel.getAccountTransactions(address, 10),
                SolscanModel.getPortfolio(address),
                SolscanModel.getTokenAccounts(address, 'token'),
                SolscanModel.getStakeAccounts(address, 10),
                SolscanModel.getTransfers(address),
                SolscanModel.getDefiActivities(address, {})
            ]);

            // Combine all data
            const accountData = {
                details: accountDetails,
                transactions: transactions.data,
                portfolio: portfolio.data,
                tokenAccounts: tokenAccounts.data,
                stakeAccounts: stakeAccounts.data,
                transfers: transfers.data,
                defiActivities: defiActivities.data,
                lastUpdated: new Date().toISOString()
            };

            // Cache the data
            await this.cacheService.set(cacheKey, accountData, 300); // Cache for 5 minutes

            responseHelper.success(res, { data: accountData, cached: false });
        } catch (error) {
            responseHelper.error(res, error);
        }
    }
}