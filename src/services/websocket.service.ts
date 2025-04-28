import { Server } from 'socket.io';
import { SolscanModel } from '../modules/solscan/solscan.model';
import { WhaleMonitorModel } from '../modules/whale-monitor/whale-monitor.model';
import { CacheService } from './cache.service';

interface AccountChanges {
    hasChanges: boolean;
    balanceChanges: Array<{
        oldBalance: number;
        newBalance: number;
    }>;
    newTransactions: any[];
    portfolioChanges: Array<{
        oldPortfolio: any;
        newPortfolio: any;
    }>;
    tokenAccountChanges: Array<{
        oldTokenAccounts: any;
        newTokenAccounts: any;
    }>;
    stakeAccountChanges: Array<{
        oldStakeAccounts: any;
        newStakeAccounts: any;
    }>;
    newTransfers: any[];
    newDefiActivities: any[];
}

export class WebSocketService {
    private io: Server;
    private monitoringInterval: NodeJS.Timeout | null = null;
    private seenTransactions: Set<string> = new Set();
    private monitoredAccounts: Set<string> = new Set();
    private monitoringIntervals: Map<string, NodeJS.Timeout> = new Map();
    private accountDataCache: Map<string, any> = new Map();
    private cacheService: CacheService;
    private readonly DEX_PROGRAMS = [
        '675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8', // Raydium
        'whirLbMiicVdio4qvUfM5KAg6Ct8VwpYzGff3uctyCc', // Whirlpool
        'CAMMCzo5YL8w4VFF8KVHrK22GGUsp5VTaW7grrKgrWqK'  // AMM V3
    ];
    private readonly LARGE_TRANSACTION_THRESHOLD = 50000; // $50,000 threshold

    // Add large transaction thresholds
    private readonly LARGE_TRANSACTION_THRESHOLDS = {
        SOL: 1000, // 1000 SOL
        USDC: 100000, // 100,000 USDC
        USDT: 100000, // 100,000 USDT
        fee: 50000, // 50,000 lamports fee
        BNB: 1000, // 1000 BNB
        ETH: 1000, // 1000 ETH
        BTC: 1000, // 1000 BTC
        USDT_USDC: 100000, // 100,000 USDT or USDC
        BNB_USDT: 100000, // 100,000 BNB or USDT
        BNB_USDC: 100000, // 100,000 BNB or USDC
        ETH_USDT: 100000, // 100,000 ETH or USDT
        ETH_USDC: 100000, // 100,000 ETH or USDC
        BTC_USDT: 100000, // 100,000 BTC or USDT
        BTC_USDC: 100000, // 100,000 BTC or USDC
        fee_BNB: 50000, // 50,000 lamports fee for BNB
        fee_ETH: 50000, // 50,000 lamports fee for ETH
        fee_BTC: 50000, // 50,000 lamports fee for BTC
        fee_USDT_USDC: 50000, // 50,000 lamports fee for USDT or USDC
        fee_BNB_USDT: 50000, // 50,000 lamports fee for BNB or USDT
        fee_BNB_USDC: 50000, // 50,000 lamports fee for BNB or USDC
        fee_ETH_USDT: 50000, // 50,000 lamports fee for ETH or USDT
        fee_ETH_USDC: 50000, // 50,000 lamports fee for ETH or USDC
        fee_BTC_USDT: 50000, // 50,000 lamports fee for BTC or USDT
        fee_BTC_USDC: 50000, // 50,000 lamports fee for BTC or USDC
    };

    constructor(io: Server) {
        this.io = io;
        this.cacheService = new CacheService();
        this.setupChannels();
    }

    private setupChannels() {
        // Watchlist Activity Channel
        this.io.of('/watchlist-activity').on('connection', (socket) => {
            console.log('Client connected to watchlist activity channel');
            
            socket.on('disconnect', () => {
                console.log('Client disconnected from watchlist activity channel');
            });
        });

        // DEX Activity Channel
        this.io.of('/dex-activity').on('connection', (socket) => {
            console.log('Client connected to DEX activity channel');
            
            socket.on('disconnect', () => {
                console.log('Client disconnected from DEX activity channel');
            });
        });

        // Transaction Monitoring Channel
        this.io.of('/transactions').on('connection', (socket) => {
            console.log('Client connected to transactions channel');
            
            socket.on('disconnect', () => {
                console.log('Client disconnected from transactions channel');
            });
        });

        // Transaction Details Channel
        this.io.of('/transaction-details').on('connection', (socket) => {
            console.log('Client connected to transaction details channel');
            
            socket.on('get-transaction', async (txHash: string) => {
                try {
                    const details = await SolscanModel.getTransactionDetail(txHash);
                    socket.emit('transaction-details', details);
                } catch (error) {
                    socket.emit('error', { message: 'Failed to fetch transaction details' });
                }
            });
            
            socket.on('disconnect', () => {
                console.log('Client disconnected from transaction details channel');
            });
        });

        // Account Monitoring Channel
        this.io.of('/whale-monitor/account').on('connection', (socket) => {
            console.log('Client connected to account monitoring channel');
            
            socket.on('subscribe', async (address: string) => {
                try {
                    // Join the room for this address
                    socket.join(`account:${address}`);
                    
                    // Get initial data
                    const accountData = await this.getAccountData(address);
                    
                    // Send initial data
                    socket.emit('account-data', accountData);
                    
                    // Start monitoring the account
                    this.startAccountMonitoring(address);
                } catch (error) {
                    socket.emit('error', { message: 'Failed to subscribe to account' });
                }
            });
            
            socket.on('unsubscribe', (address: string) => {
                socket.leave(`account:${address}`);
            });
            
            socket.on('disconnect', () => {
                console.log('Client disconnected from account monitoring channel');
            });
        });
    }

    private isDexTransaction(tx: any): boolean {
        return tx.program_ids.some((pid: string) => this.DEX_PROGRAMS.includes(pid));
    }

    private isLargeTransaction(tx: any): boolean {
        // Check fee threshold
        if (tx.fee > this.LARGE_TRANSACTION_THRESHOLDS.fee) {
            return true;
        }

        // Check token transfers
        if (tx.token_bal_change && tx.token_bal_change.length > 0) {
            for (const change of tx.token_bal_change) {
                const amount = Math.abs(change.amount);
                const token = change.token;
                
                // Check against thresholds for known tokens
                if (token === 'USDC' && amount >= this.LARGE_TRANSACTION_THRESHOLDS.USDC) {
                    return true;
                }
                if (token === 'USDT' && amount >= this.LARGE_TRANSACTION_THRESHOLDS.USDT) {
                    return true;
                }
            }
        }

        // Check SOL balance changes
        if (tx.sol_bal_change && tx.sol_bal_change.length > 0) {
            for (const change of tx.sol_bal_change) {
                const amount = Math.abs(change.amount);
                if (amount >= this.LARGE_TRANSACTION_THRESHOLDS.SOL) {
                    return true;
                }
            }
        }

        return false;
    }

    private classifyTransaction(tx: any): string {
        if (this.isDexTransaction(tx)) {
            return 'dex_swap';
        }
        
        if (tx.token_bal_change && tx.token_bal_change.length > 0) {
            return 'token_transfer';
        }
        
        if (tx.sol_bal_change && tx.sol_bal_change.length > 0) {
            return 'sol_transfer';
        }
        
        if (tx.program_ids.includes('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA')) {
            return 'token_operation';
        }
        
        return 'other';
    }

    private getTransactionDetails(tx: any) {
        const type = this.classifyTransaction(tx);
        const isLarge = this.isLargeTransaction(tx);
        
        return {
            tx_hash: tx.tx_hash,
            fee: tx.fee,
            signer: tx.signer?.[0] || 'Unknown',
            slot: tx.slot,
            status: tx.status,
            block_time: tx.block_time,
            time: tx.time,
            program_ids: tx.program_ids,
            parsed_instructions: tx.parsed_instructions || [],
            compute_units_consumed: tx.compute_units_consumed,
            priority_fee: tx.priority_fee,
            recent_block_hash: tx.recent_block_hash,
            log_messages: tx.log_message || [],
            account_keys: tx.account_keys || [],
            sol_bal_change: tx.sol_bal_change || [],
            token_bal_change: tx.token_bal_change || [],
            tokens_involved: tx.tokens_involved || [],
            type,
            is_large: isLarge,
            timestamp: new Date().toISOString()
        };
    }

    private async monitorWatchlistAddresses() {
        try {
            // Get all watchlist items
            const watchlistItems = await WhaleMonitorModel.getWatchlist('*'); // Get all users' watchlists
            
            for (const item of watchlistItems) {
                // 1. Get regular transactions
                const transactions = await SolscanModel.getAccountTransactions(item.address, 10);
                
                // 2. Get DeFi activities
                const defiActivities = await SolscanModel.getDefiActivities(item.address, {});
                
                // 3. Get token transfers
                const tokenTransfers = await SolscanModel.getTokenTransfer(item.address, {});
                
                // 4. Get token DeFi activities
                const tokenDefiActivities = await SolscanModel.getTokenDefiActivities(item.address, {});
                
                // Process new transactions
                const newTransactions = transactions.data.filter(tx => !this.seenTransactions.has(tx.tx_hash));
                const newDefiActivities = defiActivities.data.filter(activity => !this.seenTransactions.has(activity.trans_id));
                const newTokenTransfers = tokenTransfers.data.filter(transfer => !this.seenTransactions.has(transfer.trans_id));
                const newTokenDefiActivities = tokenDefiActivities.data.filter(activity => !this.seenTransactions.has(activity.trans_id));
                
                // Combine all new activities
                const allNewActivities = [
                    ...newTransactions,
                    ...newDefiActivities,
                    ...newTokenTransfers,
                    ...newTokenDefiActivities
                ];
                
                if (allNewActivities.length > 0) {
                    // Add to seen transactions
                    allNewActivities.forEach(tx => {
                        const hash = 'tx_hash' in tx ? tx.tx_hash : tx.trans_id;
                        this.seenTransactions.add(hash);
                    });
                    
                    // Create whale activities
                    for (const tx of allNewActivities) {
                        const activity = {
                            address: item.address,
                            transactionHash: 'tx_hash' in tx ? tx.tx_hash : tx.trans_id,
                            amount: 'fee' in tx ? tx.fee : 0,
                            timestamp: new Date(Number('block_time' in tx ? tx.block_time : 0) * 1000),
                            type: this.isDexTransaction(tx) ? 'swap' as const : 'transfer' as const,
                            status: ('status' in tx && tx.status === 'Success') ? 'success' as const : 'failed' as const,
                            details: {
                                isDefi: newDefiActivities.some(a => a.trans_id === ('tx_hash' in tx ? tx.tx_hash : tx.trans_id)),
                                isTokenTransfer: newTokenTransfers.some(t => t.trans_id === ('tx_hash' in tx ? tx.tx_hash : tx.trans_id)),
                                isTokenDefi: newTokenDefiActivities.some(a => a.trans_id === ('tx_hash' in tx ? tx.tx_hash : tx.trans_id))
                            }
                        };
                        
                        await WhaleMonitorModel.addWhaleActivity(activity);
                        
                        // Emit notification to the user's channel
                        this.io.of('/watchlist-activity').emit(`user:${item.userId}`, {
                            type: 'new_activity',
                            data: {
                                watchlistItem: item,
                                transaction: this.getTransactionDetails(tx),
                                activityType: activity.details
                            }
                        });
                    }
                }
            }
        } catch (error) {
            console.error('Error monitoring watchlist addresses:', error);
        }
    }

    private async monitorTokenLeaderboards() {
        try {
            // Get top tokens by market cap
            const topTokens = await SolscanModel.getTokenList({
                sort_by: 'market_cap',
                sort_order: 'desc',
                page_size: 10
            });
            
            for (const token of topTokens.data) {
                // Get recent large transactions for this token
                const transactions = await SolscanModel.getTokenTransfer(token.address, {
                    sort_by: 'block_time',
                    sort_order: 'desc',
                    page_size: 10
                });

                // Process new transactions
                const newTransactions = transactions.data.filter(tx => !this.seenTransactions.has(tx.trans_id));
                
                if (newTransactions.length > 0) {
                    // Add to seen transactions
                    newTransactions.forEach(tx => this.seenTransactions.add(tx.trans_id));

                    // Emit large transactions
                    const largeTransactions = newTransactions
                        .filter(tx => {
                            const amount = Math.abs(tx.amount);
                            // Use USDC threshold as default for unknown tokens
                            return amount >= (this.LARGE_TRANSACTION_THRESHOLDS[token.symbol as keyof typeof this.LARGE_TRANSACTION_THRESHOLDS] || 
                                           this.LARGE_TRANSACTION_THRESHOLDS.USDC);
                        })
                        .map(tx => ({
                            ...this.getTransactionDetails(tx),
                            token: {
                                symbol: token.symbol,
                                name: token.name,
                                address: token.address
                            }
                        }));

                    if (largeTransactions.length > 0) {
                        this.io.of('/token-leaderboard').emit('large-token-transactions', {
                            token,
                            transactions: largeTransactions
                        });
                    }
                }
            }
        } catch (error) {
            console.error('Error monitoring token leaderboards:', error);
        }
    }

    startMonitoring() {
        if (this.monitoringInterval) return;

        this.monitoringInterval = setInterval(async () => {
            try {
                // Monitor watchlist addresses
                await this.monitorWatchlistAddresses();
                
                // Monitor token leaderboards
                await this.monitorTokenLeaderboards();
                
                // Monitor general transactions
                const transactions = await SolscanModel.getLastTransactions(10, 'exceptVote');
                
                // Process new transactions
                const newTransactions = transactions.data.filter(tx => !this.seenTransactions.has(tx.tx_hash));
                
                // Update seen transactions set
                newTransactions.forEach(tx => this.seenTransactions.add(tx.tx_hash));

                // Monitor DEX Activity
                const dexTransactions = newTransactions
                    .filter(tx => this.isDexTransaction(tx))
                    .map(tx => this.getTransactionDetails(tx));

                // Monitor Large Transactions
                const largeTransactions = newTransactions
                    .filter(tx => this.isLargeTransaction(tx))
                    .map(tx => this.getTransactionDetails(tx));

                // Emit events if there are new transactions
                if (dexTransactions.length > 0) {
                    this.io.of('/dex-activity').emit('new-dex-activity', dexTransactions);
                }

                if (largeTransactions.length > 0) {
                    this.io.of('/transactions').emit('large-transactions', largeTransactions);
                }

                // Clean up old transactions (keep last 1000)
                if (this.seenTransactions.size > 1000) {
                    const array = Array.from(this.seenTransactions);
                    this.seenTransactions = new Set(array.slice(-1000));
                }

            } catch (error) {
                console.error('Error in monitoring:', error);
            }
        }, 1800000); // Poll every 30 minutes (1800000 milliseconds)
    }

    stopMonitoring() {
        if (this.monitoringInterval) {
            clearInterval(this.monitoringInterval);
            this.monitoringInterval = null;
        }
    }

    private async getAccountData(address: string) {
        try {
            const [accountDetails, transactions, portfolio, tokenAccounts, stakeAccounts, transfers, defiActivities] = await Promise.all([
                SolscanModel.getAccountDetail(address),
                SolscanModel.getAccountTransactions(address, 10),
                SolscanModel.getPortfolio(address),
                SolscanModel.getTokenAccounts(address, 'token'),
                SolscanModel.getStakeAccounts(address, 10),
                SolscanModel.getTransfers(address),
                SolscanModel.getDefiActivities(address, {})
            ]);

            return {
                details: accountDetails,
                transactions: transactions.data,
                portfolio: portfolio.data,
                tokenAccounts: tokenAccounts.data,
                stakeAccounts: stakeAccounts.data,
                transfers: transfers.data,
                defiActivities: defiActivities.data,
                lastUpdated: new Date().toISOString()
            };
        } catch (error) {
            console.error('Error fetching account data:', error);
            throw error;
        }
    }

    private async monitorLargeTransactions(address: string) {
        try {
            // Get recent transfers for the account
            const transfers = await SolscanModel.getTransfers(address);
            
            // Filter for large outbound transactions
            const largeTransactions = transfers.data.filter(transfer => 
                transfer.flow === 'out' && 
                transfer.value > this.LARGE_TRANSACTION_THRESHOLD &&
                !this.seenTransactions.has(transfer.trans_id)
            );

            if (largeTransactions.length > 0) {
                // Add to seen transactions
                largeTransactions.forEach(tx => this.seenTransactions.add(tx.trans_id));

                // Emit large transaction notification
                this.io.of('/whale-monitor/account')
                    .to(`account:${address}`)
                    .emit('large-transaction', {
                        type: 'large_transaction',
                        data: {
                            address,
                            transactions: largeTransactions.map(tx => ({
                                tx_hash: tx.trans_id,
                                amount: tx.value,
                                timestamp: tx.block_time,
                                from: tx.from_address,
                                to: tx.to_address,
                                token: tx.token_address
                            }))
                        }
                    });
            }
        } catch (error) {
            console.error('Error monitoring large transactions:', error);
        }
    }

    private startAccountMonitoring(address: string) {
        // Check if already monitoring this address
        if (this.monitoredAccounts.has(address)) return;

        this.monitoredAccounts.add(address);

        const interval = setInterval(async () => {
            try {
                // Monitor large transactions
                await this.monitorLargeTransactions(address);

                const newData = await this.getAccountData(address);
                const oldData = this.accountDataCache.get(address);

                // Compare and detect changes
                const changes = this.detectAccountChanges(oldData, newData);

                if (changes.hasChanges) {
                    // Update cache
                    this.accountDataCache.set(address, newData);

                    // Emit changes to all clients in the room
                    this.io.of('/whale-monitor/account')
                        .to(`account:${address}`)
                        .emit('account-update', {
                            changes,
                            data: newData
                        });
                }
            } catch (error) {
                console.error('Error monitoring account:', error);
            }
        }, 30000); // Check every 30 seconds

        this.monitoringIntervals.set(address, interval);
    }

    private detectAccountChanges(oldData: any, newData: any): AccountChanges {
        const changes: AccountChanges = {
            hasChanges: false,
            balanceChanges: [],
            newTransactions: [],
            portfolioChanges: [],
            tokenAccountChanges: [],
            stakeAccountChanges: [],
            newTransfers: [],
            newDefiActivities: []
        };

        // Check balance changes
        if (oldData?.details?.balance !== newData.details.balance) {
            changes.hasChanges = true;
            changes.balanceChanges.push({
                oldBalance: oldData?.details?.balance,
                newBalance: newData.details.balance
            });
        }

        // Check for new transactions
        const oldTxHashes = new Set(oldData?.transactions?.map((tx: any) => tx.tx_hash));
        const newTransactions = newData.transactions.filter((tx: any) => !oldTxHashes.has(tx.tx_hash));
        if (newTransactions.length > 0) {
            changes.hasChanges = true;
            changes.newTransactions = newTransactions;
        }

        // Check portfolio changes
        if (JSON.stringify(oldData?.portfolio) !== JSON.stringify(newData.portfolio)) {
            changes.hasChanges = true;
            changes.portfolioChanges.push({
                oldPortfolio: oldData?.portfolio,
                newPortfolio: newData.portfolio
            });
        }

        // Check token account changes
        if (JSON.stringify(oldData?.tokenAccounts) !== JSON.stringify(newData.tokenAccounts)) {
            changes.hasChanges = true;
            changes.tokenAccountChanges.push({
                oldTokenAccounts: oldData?.tokenAccounts,
                newTokenAccounts: newData.tokenAccounts
            });
        }

        // Check stake account changes
        if (JSON.stringify(oldData?.stakeAccounts) !== JSON.stringify(newData.stakeAccounts)) {
            changes.hasChanges = true;
            changes.stakeAccountChanges.push({
                oldStakeAccounts: oldData?.stakeAccounts,
                newStakeAccounts: newData.stakeAccounts
            });
        }

        // Check for new transfers
        const oldTransferHashes = new Set(oldData?.transfers?.map((t: any) => t.tx_hash));
        const newTransfers = newData.transfers.filter((t: any) => !oldTransferHashes.has(t.tx_hash));
        if (newTransfers.length > 0) {
            changes.hasChanges = true;
            changes.newTransfers = newTransfers;
        }

        // Check for new DeFi activities
        const oldDefiHashes = new Set(oldData?.defiActivities?.map((a: any) => a.tx_hash));
        const newDefiActivities = newData.defiActivities.filter((a: any) => !oldDefiHashes.has(a.tx_hash));
        if (newDefiActivities.length > 0) {
            changes.hasChanges = true;
            changes.newDefiActivities = newDefiActivities;
        }

        return changes;
    }

    private stopAccountMonitoring(address: string) {
        const interval = this.monitoringIntervals.get(address);
        if (interval) {
            clearInterval(interval);
            this.monitoringIntervals.delete(address);
            this.monitoredAccounts.delete(address);
            this.accountDataCache.delete(address);
        }
    }
} 