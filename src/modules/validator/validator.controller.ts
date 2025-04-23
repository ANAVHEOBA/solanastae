import { Request, Response } from 'express';
import { ValidatorModel } from './validator.model';
import { 
    ValidatorStats, 
    ValidatorPerformance,
    ValidatorFilters,
    Transaction,
    TransactionResponse,
    TransactionPagination,
    TransactionResult,
    PrioritizationFee,
    PrioritizationFeesResponse,
    SlotResponse,
    BlockTimeResponse,
    TokenAccountsResponse,
    TokenSupplyResponse,
    MultipleAccountsResponse,
    SignatureSubscribeParams
} from './validator.schema';

export class ValidatorController {
    async getValidatorStats(req: Request, res: Response) {
        try {
            const stats = await ValidatorModel.getValidatorStats();
            res.json({
                jsonrpc: "2.0",
                id: "1",
                result: stats
            });
        } catch (error) {
            res.status(500).json({
                jsonrpc: "2.0",
                id: "1",
                error: {
                    code: 500,
                    message: 'Failed to fetch validator statistics'
                }
            });
        }
    }

    async getValidators(req: Request, res: Response) {
        try {
            // Parse pagination parameters
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 20;

            const filters: ValidatorFilters = {
                status: req.query.status as ValidatorFilters['status'],
                minStake: req.query.minStake ? Number(req.query.minStake) : undefined,
                maxCommission: req.query.maxCommission ? Number(req.query.maxCommission) : undefined,
                votePubkey: req.query.votePubkey as string
            };

            let validators = await ValidatorModel.getAllValidators();

            // Apply filters
            validators = this.applyFilters(validators, filters);

            // Apply pagination
            const startIndex = (page - 1) * limit;
            const endIndex = page * limit;
            const paginatedValidators = validators.slice(startIndex, endIndex);

            // Format response
            res.json({
                jsonrpc: "2.0",
                id: "1",
                result: {
                    current: paginatedValidators.filter(v => v.status === 'active'),
                    delinquent: paginatedValidators.filter(v => v.status === 'delinquent'),
                    pagination: {
                        total: validators.length,
                        page,
                        limit,
                        totalPages: Math.ceil(validators.length / limit)
                    }
                }
            });
        } catch (error) {
            res.status(500).json({
                jsonrpc: "2.0",
                id: "1",
                error: {
                    code: 500,
                    message: 'Failed to fetch validators'
                }
            });
        }
    }

    private applyFilters(validators: any[], filters: ValidatorFilters) {
        return validators.filter(validator => {
            if (filters.status && filters.status !== 'all' && validator.status !== filters.status) {
                return false;
            }
            if (filters.minStake && validator.activatedStake < filters.minStake) {
                return false;
            }
            if (filters.maxCommission && validator.commission > filters.maxCommission) {
                return false;
            }
            if (filters.votePubkey && validator.votePubkey !== filters.votePubkey) {
                return false;
            }
            return true;
        });
    }

    async getStakeMinimumDelegation(req: Request, res: Response) {
        try {
            console.log('[ValidatorController] Getting stake minimum delegation...');
            const minimumDelegation = await ValidatorModel.getStakeMinimumDelegation();
            console.log('[ValidatorController] Successfully got stake minimum delegation:', minimumDelegation);
            res.json({
                jsonrpc: '2.0',
                id: 1,
                result: minimumDelegation
            });
        } catch (error) {
            console.error('[ValidatorController] Error getting stake minimum delegation:', error);
            res.status(500).json({
                jsonrpc: '2.0',
                id: 1,
                error: {
                    code: 500,
                    message: 'Failed to get stake minimum delegation'
                }
            });
        }
    }

    async getLargestAccounts(req: Request, res: Response) {
        try {
            console.log('[ValidatorController] Getting largest accounts...');
            const accounts = await ValidatorModel.getLargestAccounts({
                commitment: req.query.commitment as string,
                filter: req.query.filter as string
            });
            console.log('[ValidatorController] Successfully got largest accounts:', accounts);
            res.json({
                jsonrpc: '2.0',
                id: 1,
                result: accounts
            });
        } catch (error) {
            console.error('[ValidatorController] Error getting largest accounts:', error);
            res.status(500).json({
                jsonrpc: '2.0',
                id: 1,
                error: {
                    code: 500,
                    message: error instanceof Error ? error.message : 'Failed to get largest accounts'
                }
            });
        }
    }

    async getLeaderSchedule(req: Request, res: Response) {
        try {
            console.log('[ValidatorController] Getting leader schedule...');
            const epoch = req.query.epoch ? parseInt(req.query.epoch as string) : undefined;
            const page = req.query.page ? parseInt(req.query.page as string) : 1;
            const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;

            if (page < 1) {
                throw new Error('Page number must be greater than 0');
            }
            if (limit < 1 || limit > 100) {
                throw new Error('Limit must be between 1 and 100');
            }

            const result = await ValidatorModel.getLeaderSchedule(epoch, page, limit);
            console.log('[ValidatorController] Successfully got leader schedule:', result.pagination);
            
            res.json({
                jsonrpc: '2.0',
                id: 1,
                result: {
                    data: result.data,
                    pagination: result.pagination
                }
            });
        } catch (error) {
            console.error('[ValidatorController] Error getting leader schedule:', error);
            
            let errorMessage = 'Failed to get leader schedule';
            let statusCode = 500;

            if (error instanceof Error) {
                if (error.message.includes('ETIMEDOUT')) {
                    errorMessage = 'Request timed out. The RPC node is taking too long to respond. Please try again later.';
                    statusCode = 504; // Gateway Timeout
                } else if (error.message.includes('ENETUNREACH')) {
                    errorMessage = 'Network error. Unable to reach the RPC node. Please check your internet connection.';
                    statusCode = 503; // Service Unavailable
                } else if (error.message.includes('Page number') || error.message.includes('Limit must be')) {
                    errorMessage = error.message;
                    statusCode = 400; // Bad Request
                } else {
                    errorMessage = error.message;
                }
            }

            res.status(statusCode).json({
                jsonrpc: '2.0',
                id: 1,
                error: {
                    code: statusCode,
                    message: errorMessage
                }
            });
        }
    }

    async getSlotLeaders(req: Request, res: Response) {
        try {
            console.log('[ValidatorController] Getting slot leaders...');
            const startSlot = parseInt(req.query.startSlot as string);
            const limit = parseInt(req.query.limit as string);

            if (isNaN(startSlot) || startSlot < 0) {
                throw new Error('Invalid start slot');
            }
            if (isNaN(limit) || limit < 1 || limit > 100) {
                throw new Error('Limit must be between 1 and 100');
            }

            const leaders = await ValidatorModel.getSlotLeaders(startSlot, limit);
            console.log('[ValidatorController] Successfully got slot leaders:', leaders);
            
            res.json({
                jsonrpc: '2.0',
                id: 1,
                result: leaders
            });
        } catch (error) {
            console.error('[ValidatorController] Error getting slot leaders:', error);
            
            let errorMessage = 'Failed to get slot leaders';
            let statusCode = 500;

            if (error instanceof Error) {
                if (error.message.includes('ETIMEDOUT')) {
                    errorMessage = 'Request timed out. The RPC node is taking too long to respond. Please try again later.';
                    statusCode = 504; // Gateway Timeout
                } else if (error.message.includes('ENETUNREACH')) {
                    errorMessage = 'Network error. Unable to reach the RPC node. Please check your internet connection.';
                    statusCode = 503; // Service Unavailable
                } else if (error.message.includes('Invalid start slot') || error.message.includes('Limit must be')) {
                    errorMessage = error.message;
                    statusCode = 400; // Bad Request
                } else {
                    errorMessage = error.message;
                }
            }

            res.status(statusCode).json({
                jsonrpc: '2.0',
                id: 1,
                error: {
                    code: statusCode,
                    message: errorMessage
                }
            });
        }
    }

    async getSignatureStatuses(req: Request, res: Response) {
        try {
            console.log('[ValidatorController] Getting signature statuses...');
            const signaturesParam = req.query.signatures as string;
            const searchTransactionHistory = req.query.searchTransactionHistory !== 'false';

            if (!signaturesParam) {
                throw new Error('Signatures parameter is required');
            }

            // Split the comma-separated string into an array
            const signatures = signaturesParam.split(',').map(sig => sig.trim());

            if (signatures.length === 0) {
                throw new Error('At least one signature is required');
            }

            const statuses = await ValidatorModel.getSignatureStatuses(signatures, searchTransactionHistory);
            console.log('[ValidatorController] Successfully got signature statuses:', statuses);
            
            res.json({
                jsonrpc: '2.0',
                id: 1,
                result: statuses
            });
        } catch (error) {
            console.error('[ValidatorController] Error getting signature statuses:', error);
            
            let errorMessage = 'Failed to get signature statuses';
            let statusCode = 500;

            if (error instanceof Error) {
                if (error.message.includes('ETIMEDOUT')) {
                    errorMessage = 'Request timed out. The RPC node is taking too long to respond. Please try again later.';
                    statusCode = 504; // Gateway Timeout
                } else if (error.message.includes('ENETUNREACH')) {
                    errorMessage = 'Network error. Unable to reach the RPC node. Please check your internet connection.';
                    statusCode = 503; // Service Unavailable
                } else if (error.message.includes('Signatures') || error.message.includes('signature')) {
                    errorMessage = error.message;
                    statusCode = 400; // Bad Request
                } else {
                    errorMessage = error.message;
                }
            }

            res.status(statusCode).json({
                jsonrpc: '2.0',
                id: 1,
                error: {
                    code: statusCode,
                    message: errorMessage
                }
            });
        }
    }

    async getTransaction(req: Request, res: Response) {
        try {
            console.log('[ValidatorController] Getting transaction...');
            const signature = req.query.signature as string;
            const encoding = (req.query.encoding as 'json' | 'base58' | 'base64') || 'json';

            if (!signature) {
                throw new Error('Transaction signature is required');
            }

            const result = await ValidatorModel.getTransaction(signature, encoding);
            console.log('[ValidatorController] Successfully got transaction:', {
                slot: result.data?.slot,
                signature
            });
            
            res.json({
                jsonrpc: '2.0',
                id: 1,
                result: result
            });
        } catch (error) {
            console.error('[ValidatorController] Error getting transaction:', error);
            
            let errorMessage = 'Failed to get transaction';
            let statusCode = 500;

            if (error instanceof Error) {
                if (error.message.includes('ETIMEDOUT')) {
                    errorMessage = 'Request timed out. The RPC node is taking too long to respond. Please try again later.';
                    statusCode = 504; // Gateway Timeout
                } else if (error.message.includes('ENETUNREACH')) {
                    errorMessage = 'Network error. Unable to reach the RPC node. Please check your internet connection.';
                    statusCode = 503; // Service Unavailable
                } else if (error.message.includes('signature')) {
                    errorMessage = error.message;
                    statusCode = 400; // Bad Request
                } else {
                    errorMessage = error.message;
                }
            }

            res.status(statusCode).json({
                jsonrpc: '2.0',
                id: 1,
                error: {
                    code: statusCode,
                    message: errorMessage
                }
            });
        }
    }

    async getPrioritizationFees(req: Request, res: Response) {
        try {
            console.log('[ValidatorController] Getting prioritization fees...');
            const accounts = req.query.accounts ? (req.query.accounts as string).split(',') : undefined;
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 20;

            if (page < 1) {
                throw new Error('Page number must be greater than 0');
            }
            if (limit < 1 || limit > 100) {
                throw new Error('Limit must be between 1 and 100');
            }

            const result = await ValidatorModel.getRecentPrioritizationFees(accounts);
            console.log('[ValidatorController] Successfully got prioritization fees:', result);
            
            res.json({
                jsonrpc: '2.0',
                id: 1,
                result: {
                    data: result,
                    pagination: {
                        total: result.length,
                        page,
                        limit,
                        totalPages: Math.ceil(result.length / limit)
                    }
                }
            });
        } catch (error) {
            console.error('[ValidatorController] Error getting prioritization fees:', error);
            
            let errorMessage = 'Failed to get prioritization fees';
            let statusCode = 500;

            if (error instanceof Error) {
                if (error.message.includes('ETIMEDOUT')) {
                    errorMessage = 'Request timed out. The RPC node is taking too long to respond. Please try again later.';
                    statusCode = 504; // Gateway Timeout
                } else if (error.message.includes('ENETUNREACH')) {
                    errorMessage = 'Network error. Unable to reach the RPC node. Please check your internet connection.';
                    statusCode = 503; // Service Unavailable
                } else if (error.message.includes('Page number') || error.message.includes('Limit must be')) {
                    errorMessage = error.message;
                    statusCode = 400; // Bad Request
                } else {
                    errorMessage = error.message;
                }
            }

            res.status(statusCode).json({
                jsonrpc: '2.0',
                id: 1,
                error: {
                    code: statusCode,
                    message: errorMessage
                }
            });
        }
    }

    async getTokenAccountsByOwner(req: Request, res: Response) {
        try {
            console.log('[ValidatorController] Getting token accounts by owner...');
            const owner = req.query.owner as string;
            const programId = req.query.programId as string;
            const encoding = (req.query.encoding as 'jsonParsed' | 'base58' | 'base64') || 'jsonParsed';

            if (!owner) {
                throw new Error('Owner address is required');
            }

            const response = await ValidatorModel.getTokenAccountsByOwner(owner, programId, encoding);
            console.log('[ValidatorController] Successfully got token accounts:', {
                count: response.value.length,
                slot: response.context.slot
            });
            
            res.json({
                jsonrpc: '2.0',
                id: 1,
                result: response
            });
        } catch (error) {
            console.error('[ValidatorController] Error getting token accounts:', error);
            
            let errorMessage = 'Failed to get token accounts';
            let statusCode = 500;

            if (error instanceof Error) {
                if (error.message.includes('ETIMEDOUT')) {
                    errorMessage = 'Request timed out. The RPC node is taking too long to respond. Please try again later.';
                    statusCode = 504; // Gateway Timeout
                } else if (error.message.includes('ENETUNREACH')) {
                    errorMessage = 'Network error. Unable to reach the RPC node. Please check your internet connection.';
                    statusCode = 503; // Service Unavailable
                } else if (error.message.includes('Owner address')) {
                    errorMessage = error.message;
                    statusCode = 400; // Bad Request
                } else {
                    errorMessage = error.message;
                }
            }

            res.status(statusCode).json({
                jsonrpc: '2.0',
                id: 1,
                error: {
                    code: statusCode,
                    message: errorMessage
                }
            });
        }
    }

    async getTokenSupply(req: Request, res: Response) {
        try {
            console.log('[ValidatorController] Getting token supply...');
            const mint = req.query.mint as string;

            if (!mint) {
                throw new Error('Mint address is required');
            }

            const response = await ValidatorModel.getTokenSupply(mint);
            console.log('[ValidatorController] Successfully got token supply:', {
                amount: response.value.amount,
                decimals: response.value.decimals,
                uiAmount: response.value.uiAmount,
                slot: response.context.slot
            });
            
            res.json({
                jsonrpc: '2.0',
                id: 1,
                result: response
            });
        } catch (error) {
            console.error('[ValidatorController] Error getting token supply:', error);
            
            let errorMessage = 'Failed to get token supply';
            let statusCode = 500;

            if (error instanceof Error) {
                if (error.message.includes('ETIMEDOUT')) {
                    errorMessage = 'Request timed out. The RPC node is taking too long to respond. Please try again later.';
                    statusCode = 504; // Gateway Timeout
                } else if (error.message.includes('ENETUNREACH')) {
                    errorMessage = 'Network error. Unable to reach the RPC node. Please check your internet connection.';
                    statusCode = 503; // Service Unavailable
                } else if (error.message.includes('Mint address')) {
                    errorMessage = error.message;
                    statusCode = 400; // Bad Request
                } else {
                    errorMessage = error.message;
                }
            }

            res.status(statusCode).json({
                jsonrpc: '2.0',
                id: 1,
                error: {
                    code: statusCode,
                    message: errorMessage
                }
            });
        }
    }

    async getMultipleAccounts(req: Request, res: Response): Promise<void> {
        try {
            console.log('[ValidatorController] Getting multiple accounts...');
            const { pubkeys } = req.query;
            
            if (!pubkeys || typeof pubkeys !== 'string') {
                res.status(400).json({
                    error: 'Missing or invalid pubkeys parameter'
                });
                return;
            }

            const pubkeyList = pubkeys.split(',');
            const result = await ValidatorModel.getMultipleAccounts(pubkeyList);
            
            console.log('[ValidatorController] Successfully got multiple accounts:', {
                count: result.value.length,
                nonNull: result.value.filter(acc => acc !== null).length,
                slot: result.context.slot
            });

            res.json(result);
        } catch (error) {
            console.error('[ValidatorController] Error getting multiple accounts:', error);
            if (error instanceof Error) {
                if (error.message.includes('ETIMEDOUT')) {
                    res.status(504).json({
                        error: 'Request timed out. Please try again later.'
                    });
                } else if (error.message.includes('ENETUNREACH')) {
                    res.status(503).json({
                        error: 'Network error. Please check your internet connection.'
                    });
                } else {
                    res.status(500).json({
                        error: error.message
                    });
                }
            } else {
                res.status(500).json({
                    error: 'An unknown error occurred'
                });
            }
        }
    }

    async subscribeToSignature(req: Request, res: Response): Promise<void> {
        try {
            console.log('[ValidatorController] Subscribing to signature...');
            const { signature, commitment, enableReceivedNotification } = req.query;
            
            if (!signature || typeof signature !== 'string') {
                res.status(400).json({
                    error: 'Missing or invalid signature parameter'
                });
                return;
            }

            const params: SignatureSubscribeParams = {
                commitment: commitment as 'processed' | 'confirmed' | 'finalized' | undefined,
                enableReceivedNotification: enableReceivedNotification === 'true'
            };

            const subscriptionId = await ValidatorModel.subscribeToSignature(signature, params);
            
            console.log('[ValidatorController] Successfully subscribed to signature:', {
                signature,
                subscriptionId
            });

            res.json({
                subscriptionId,
                signature
            });
        } catch (error) {
            console.error('[ValidatorController] Error subscribing to signature:', error);
            if (error instanceof Error) {
                if (error.message.includes('WebSocket connection not ready')) {
                    res.status(503).json({
                        error: 'WebSocket connection not ready. Please try again later.'
                    });
                } else {
                    res.status(500).json({
                        error: error.message
                    });
                }
            } else {
                res.status(500).json({
                    error: 'An unknown error occurred'
                });
            }
        }
    }
}
