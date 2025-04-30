import { SolscanModel } from '../modules/solscan/solscan.model';
import { WebSocketService } from './websocket.service';
import { WhaleMonitorModel } from '../modules/whale-monitor/whale-monitor.model';

export class TransactionMonitorService {
    private static monitoredAccounts: Map<string, {
        lastTransactions: any[],
        lastPollTime: Date,
        interval: NodeJS.Timeout | null
    }> = new Map();

    static async initializeMonitoring(address: string) {
        try {
            console.log(`Initializing monitoring for address: ${address}`);
            // Get initial transactions
            const initialTransactions = await SolscanModel.getAccountTransactions(address, 10);
            
            if (initialTransactions.success && initialTransactions.data.length > 0) {
                this.monitoredAccounts.set(address, {
                    lastTransactions: initialTransactions.data,
                    lastPollTime: new Date(),
                    interval: null
                });
                
                // Store initial transactions in database
                for (const tx of initialTransactions.data) {
                    await this.storeTransaction(address, tx);
                }
                
                // Emit initial state
                WebSocketService.emitToChannel(
                    address,
                    'initial-state',
                    { transactions: initialTransactions.data }
                );
            } else {
                console.log(`No initial transactions found for ${address}`);
            }
        } catch (error) {
            console.error(`Error initializing monitoring for ${address}:`, error);
            throw error;
        }
    }

    private static async storeTransaction(address: string, transaction: any) {
        try {
            // Determine transaction type from parsed instructions
            const transactionType = this.determineTransactionType(transaction.parsed_instructions);
            const usdValue = this.calculateUsdValue(transaction);
            
            // Create whale activity record
            const activity = await WhaleMonitorModel.addWhaleActivity({
                address,
                transactionHash: transaction.tx_hash,
                amount: transaction.fee,
                timestamp: new Date(transaction.time),
                type: transactionType,
                status: transaction.status.toLowerCase(),
                fromAddress: transaction.signer[0],
                tokenSymbol: this.getTokenSymbol(transaction),
                usdValue
            });

            console.log(`Stored transaction ${transaction.tx_hash} in database`);
            return activity;
        } catch (error) {
            console.error(`Error storing transaction ${transaction.tx_hash}:`, error);
            throw error;
        }
    }

    private static determineTransactionType(instructions: any[]): 'transfer' | 'swap' | 'stake' | 'unstake' {
        if (!instructions || instructions.length === 0) return 'transfer';
        
        const firstInstruction = instructions[0];
        if (firstInstruction.type === 'sell' || firstInstruction.type === 'buy') {
            return 'swap';
        }
        if (firstInstruction.type === 'stake') {
            return 'stake';
        }
        if (firstInstruction.type === 'unstake') {
            return 'unstake';
        }
        return 'transfer';
    }

    private static getTokenSymbol(transaction: any): string | undefined {
        // Extract token symbol from transaction data
        // This is a simplified version - you might need to enhance this based on your data structure
        if (transaction.parsed_instructions && transaction.parsed_instructions.length > 0) {
            const instruction = transaction.parsed_instructions[0];
            if (instruction.program === 'pump_amm') {
                return 'PUMP'; // Example token symbol
            }
        }
        return undefined;
    }

    private static calculateUsdValue(transaction: any): number | undefined {
        try {
            if (transaction.fee) {
                // Enhanced USD value calculation
                const solValue = transaction.fee / 1e9; // Convert lamports to SOL
                const estimatedSolPrice = 100; // This should be fetched from a price feed
                return solValue * estimatedSolPrice;
            }
            return undefined;
        } catch (error) {
            console.error('Error calculating USD value:', error);
            return undefined;
        }
    }

    static async pollTransactions(address: string) {
        try {
            const accountState = this.monitoredAccounts.get(address);
            if (!accountState) {
                console.log(`No account state found for ${address}`);
                return;
            }

            console.log(`Polling transactions for ${address}`);
            // Get latest transactions
            const latestTransactions = await SolscanModel.getAccountTransactions(address, 10);
            
            if (!latestTransactions.success) {
                console.log(`Failed to fetch transactions for ${address}`);
                return;
            }

            // Find new transactions by comparing tx_hash
            const newTransactions = latestTransactions.data.filter(newTx => 
                !accountState.lastTransactions.some(oldTx => oldTx.tx_hash === newTx.tx_hash)
            );

            if (newTransactions.length > 0) {
                console.log(`Found ${newTransactions.length} new transactions for ${address}`);
                
                // Store new transactions in database
                for (const tx of newTransactions) {
                    await this.storeTransaction(address, tx);
                }

                // Get DeFi activities only for new transactions
                const defiActivities = await SolscanModel.getDefiActivities(address, {
                    from_time: newTransactions[newTransactions.length - 1].block_time
                });

                // Update stored transactions
                this.monitoredAccounts.set(address, {
                    ...accountState,
                    lastTransactions: latestTransactions.data,
                    lastPollTime: new Date()
                });

                // Emit notification with complete details
                WebSocketService.emitToChannel(
                    address,
                    'new-transactions',
                    {
                        transactions: newTransactions,
                        defiActivities: defiActivities.success ? defiActivities.data : []
                    }
                );
            } else {
                console.log(`No new transactions found for ${address}`);
            }
        } catch (error) {
            console.error(`Error polling transactions for ${address}:`, error);
        }
    }

    static startMonitoring(address: string) {
        // Initialize monitoring
        this.initializeMonitoring(address).catch(error => {
            console.error(`Failed to initialize monitoring for ${address}:`, error);
        });

        // Start polling interval
        const interval = setInterval(async () => {
            await this.pollTransactions(address);
        }, 30000); // 30 seconds

        // Store the interval
        const accountState = this.monitoredAccounts.get(address);
        if (accountState) {
            this.monitoredAccounts.set(address, {
                ...accountState,
                interval
            });
        }

        return interval;
    }

    static stopMonitoring(address: string) {
        console.log(`Stopping monitoring for ${address}`);
        const accountState = this.monitoredAccounts.get(address);
        if (accountState && accountState.interval) {
            clearInterval(accountState.interval);
        }
        this.monitoredAccounts.delete(address);
    }
}