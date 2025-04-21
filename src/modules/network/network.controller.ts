import { Request, Response } from 'express';
import { NetworkModel } from './network.model';
import { EpochInfoParams, InflationRewardParams, AccountSubscribeParams, BlockProductionParams, SupplyParams } from './network.schema';

export class NetworkController {
    async getEpochInfo(req: Request, res: Response) {
        try {
            const params: EpochInfoParams = {
                commitment: (req.query.commitment as EpochInfoParams['commitment']) || 'finalized',
                minContextSlot: req.query.minContextSlot ? Number(req.query.minContextSlot) : undefined
            };

            const epochInfo = await NetworkModel.getEpochInfo(params);

            res.json({
                jsonrpc: "2.0",
                id: "1",
                result: epochInfo
            });
        } catch (error) {
            res.status(500).json({
                jsonrpc: "2.0",
                id: "1",
                error: {
                    code: 500,
                    message: 'Failed to fetch epoch information'
                }
            });
        }
    }

    async getInflationRate(req: Request, res: Response) {
        try {
            const inflationRate = await NetworkModel.getInflationRate();
            
            res.json({
                jsonrpc: "2.0",
                id: "1",
                result: inflationRate
            });
        } catch (error) {
            res.status(500).json({
                jsonrpc: "2.0",
                id: "1",
                error: {
                    code: 500,
                    message: 'Failed to fetch inflation rate'
                }
            });
        }
    }

    async getNetworkStats(req: Request, res: Response) {
        try {
            const stats = await NetworkModel.getNetworkStats();
            
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
                    message: 'Failed to fetch network statistics'
                }
            });
        }
    }

    async getInflationReward(req: Request, res: Response) {
        try {
            // Validate addresses parameter
            const addresses = req.query.addresses as string;
            if (!addresses) {
                return res.status(400).json({
                    jsonrpc: "2.0",
                    id: "1",
                    error: {
                        code: 400,
                        message: 'addresses parameter is required'
                    }
                });
            }

            const params: InflationRewardParams = {
                addresses: addresses.split(','),
                commitment: (req.query.commitment as InflationRewardParams['commitment']) || 'finalized',
                epoch: req.query.epoch ? Number(req.query.epoch) : undefined
            };

            const rewards = await NetworkModel.getInflationReward(params);
            
            res.json({
                jsonrpc: "2.0",
                id: "1",
                result: rewards
            });
        } catch (error) {
            res.status(500).json({
                jsonrpc: "2.0",
                id: "1",
                error: {
                    code: 500,
                    message: 'Failed to fetch inflation rewards'
                }
            });
        }
    }

    async getAccountInfo(req: Request, res: Response) {
        try {
            const pubkey = req.query.pubkey as string;
            if (!pubkey) {
                return res.status(400).json({
                    jsonrpc: "2.0",
                    id: "1",
                    error: {
                        code: 400,
                        message: 'pubkey parameter is required'
                    }
                });
            }

            const params = {
                encoding: (req.query.encoding as 'base58' | 'base64' | 'jsonParsed') || 'base58',
                commitment: (req.query.commitment as 'processed' | 'confirmed' | 'finalized') || 'finalized',
                minContextSlot: req.query.minContextSlot ? Number(req.query.minContextSlot) : undefined,
                dataSlice: req.query.offset && req.query.length ? {
                    offset: Number(req.query.offset),
                    length: Number(req.query.length)
                } : undefined
            };

            const accountInfo = await NetworkModel.getAccountInfo(pubkey, params);
            
            res.json({
                jsonrpc: "2.0",
                id: "1",
                result: accountInfo
            });
        } catch (error) {
            res.status(500).json({
                jsonrpc: "2.0",
                id: "1",
                error: {
                    code: 500,
                    message: 'Failed to fetch account information'
                }
            });
        }
    }

    async getBalance(req: Request, res: Response) {
        try {
            console.log('[Controller] getBalance - Request received:', {
                query: req.query,
                headers: req.headers
            });

            const pubkey = req.query.pubkey as string;
            if (!pubkey) {
                console.log('[Controller] getBalance - Missing pubkey');
                return res.status(400).json({
                    jsonrpc: "2.0",
                    id: "1",
                    error: {
                        code: 400,
                        message: 'pubkey parameter is required'
                    }
                });
            }

            const params = {
                commitment: (req.query.commitment as 'processed' | 'confirmed' | 'finalized') || 'finalized'
            };

            console.log('[Controller] getBalance - Calling model with params:', {
                pubkey,
                params
            });

            const balance = await NetworkModel.getBalance(pubkey, params);
            
            console.log('[Controller] getBalance - Success response:', balance);

            res.json({
                jsonrpc: "2.0",
                id: "1",
                result: balance
            });
        } catch (error) {
            console.error('[Controller] getBalance - Error:', {
                error,
                message: error instanceof Error ? error.message : 'Unknown error',
                stack: error instanceof Error ? error.stack : undefined
            });

            res.status(500).json({
                jsonrpc: "2.0",
                id: "1",
                error: {
                    code: 500,
                    message: error instanceof Error ? error.message : 'Failed to fetch balance'
                }
            });
        }
    }

    async getTokenAccountBalance(req: Request, res: Response) {
        try {
            console.log('[Controller] getTokenAccountBalance - Request received:', {
                query: req.query,
                headers: req.headers
            });

            const pubkey = req.query.pubkey as string;
            if (!pubkey) {
                console.log('[Controller] getTokenAccountBalance - Missing pubkey');
                return res.status(400).json({
                    jsonrpc: "2.0",
                    id: "1",
                    error: {
                        code: 400,
                        message: 'pubkey parameter is required'
                    }
                });
            }

            const params = {
                commitment: (req.query.commitment as 'processed' | 'confirmed' | 'finalized') || 'finalized'
            };

            console.log('[Controller] getTokenAccountBalance - Calling model with params:', {
                pubkey,
                params
            });

            const balance = await NetworkModel.getTokenAccountBalance(pubkey, params);
            
            console.log('[Controller] getTokenAccountBalance - Success response:', balance);

            res.json({
                jsonrpc: "2.0",
                id: "1",
                result: balance
            });
        } catch (error) {
            console.error('[Controller] getTokenAccountBalance - Error:', {
                error,
                message: error instanceof Error ? error.message : 'Unknown error',
                stack: error instanceof Error ? error.stack : undefined
            });

            res.status(500).json({
                jsonrpc: "2.0",
                id: "1",
                error: {
                    code: 500,
                    message: error instanceof Error ? error.message : 'Failed to fetch token account balance'
                }
            });
        }
    }

    async getProgramAccounts(req: Request, res: Response) {
        try {
            console.log('[Controller] getProgramAccounts - Request received:', {
                query: req.query,
                headers: req.headers
            });

            const programId = req.query.programId as string;
            if (!programId) {
                console.log('[Controller] getProgramAccounts - Missing programId');
                return res.status(400).json({
                    jsonrpc: "2.0",
                    id: "1",
                    error: {
                        code: 400,
                        message: 'programId parameter is required'
                    }
                });
            }

            let filters;
            if (req.query.filters) {
                try {
                    filters = JSON.parse(req.query.filters as string);
                    console.log('[Controller] getProgramAccounts - Parsed filters:', filters);
                } catch (e) {
                    console.error('[Controller] getProgramAccounts - Invalid filters format:', e);
                    return res.status(400).json({
                        jsonrpc: "2.0",
                        id: "1",
                        error: {
                            code: 400,
                            message: 'Invalid filters format'
                        }
                    });
                }
            }

            const params = {
                encoding: (req.query.encoding as 'base58' | 'base64' | 'jsonParsed') || 'base58',
                commitment: (req.query.commitment as 'processed' | 'confirmed' | 'finalized') || 'finalized',
                minContextSlot: req.query.minContextSlot ? Number(req.query.minContextSlot) : undefined,
                dataSlice: req.query.offset && req.query.length ? {
                    offset: Number(req.query.offset),
                    length: Number(req.query.length)
                } : undefined,
                filters
            };

            console.log('[Controller] getProgramAccounts - Calling model with params:', {
                programId,
                params
            });

            const accounts = await NetworkModel.getProgramAccounts(programId, params);
            
            console.log('[Controller] getProgramAccounts - Success response:', {
                accountsCount: accounts.length
            });

            res.json({
                jsonrpc: "2.0",
                id: "1",
                result: accounts
            });
        } catch (error) {
            console.error('[Controller] getProgramAccounts - Error:', {
                error,
                message: error instanceof Error ? error.message : 'Unknown error',
                stack: error instanceof Error ? error.stack : undefined
            });

            res.status(500).json({
                jsonrpc: "2.0",
                id: "1",
                error: {
                    code: 500,
                    message: error instanceof Error ? error.message : 'Failed to fetch program accounts'
                }
            });
        }
    }

    async subscribeToAccount(req: Request, res: Response) {
        try {
            console.log('[Controller] subscribeToAccount - Request received:', {
                query: req.query,
                headers: req.headers
            });

            const pubkey = req.query.pubkey as string;
            if (!pubkey) {
                console.log('[Controller] subscribeToAccount - Missing pubkey');
                return res.status(400).json({
                    jsonrpc: "2.0",
                    id: "1",
                    error: {
                        code: 400,
                        message: 'pubkey parameter is required'
                    }
                });
            }

            const params: AccountSubscribeParams = {
                encoding: (req.query.encoding as AccountSubscribeParams['encoding']) || 'jsonParsed',
                commitment: (req.query.commitment as AccountSubscribeParams['commitment']) || 'finalized'
            };

            console.log('[Controller] subscribeToAccount - Calling model with params:', {
                pubkey,
                params
            });

            const subscription = await NetworkModel.subscribeToAccount(pubkey, params);
            
            console.log('[Controller] subscribeToAccount - Success response:', subscription);

            res.json({
                jsonrpc: "2.0",
                id: "1",
                result: subscription
            });
        } catch (error) {
            console.error('[Controller] subscribeToAccount - Error:', {
                error,
                message: error instanceof Error ? error.message : 'Unknown error',
                stack: error instanceof Error ? error.stack : undefined
            });

            res.status(500).json({
                jsonrpc: "2.0",
                id: "1",
                error: {
                    code: 500,
                    message: error instanceof Error ? error.message : 'Failed to subscribe to account'
                }
            });
        }
    }

    async unsubscribeFromAccount(req: Request, res: Response) {
        try {
            console.log('[Controller] unsubscribeFromAccount - Request received:', {
                query: req.query,
                headers: req.headers
            });

            const subscriptionId = req.query.subscriptionId ? Number(req.query.subscriptionId) : undefined;
            if (!subscriptionId) {
                console.log('[Controller] unsubscribeFromAccount - Missing subscriptionId');
                return res.status(400).json({
                    jsonrpc: "2.0",
                    id: "1",
                    error: {
                        code: 400,
                        message: 'subscriptionId parameter is required'
                    }
                });
            }

            console.log('[Controller] unsubscribeFromAccount - Calling model with params:', {
                subscriptionId
            });

            const success = await NetworkModel.unsubscribeFromAccount(subscriptionId);
            
            console.log('[Controller] unsubscribeFromAccount - Success response:', success);

            res.json({
                jsonrpc: "2.0",
                id: "1",
                result: success
            });
        } catch (error) {
            console.error('[Controller] unsubscribeFromAccount - Error:', {
                error,
                message: error instanceof Error ? error.message : 'Unknown error',
                stack: error instanceof Error ? error.stack : undefined
            });

            res.status(500).json({
                jsonrpc: "2.0",
                id: "1",
                error: {
                    code: 500,
                    message: error instanceof Error ? error.message : 'Failed to unsubscribe from account'
                }
            });
        }
    }

    async subscribeToVotes(req: Request, res: Response) {
        try {
            console.log('[Controller] subscribeToVotes - Request received');

            const subscription = await NetworkModel.subscribeToVotes();
            
            console.log('[Controller] subscribeToVotes - Success response:', subscription);

            res.json({
                jsonrpc: "2.0",
                id: "1",
                result: subscription
            });
        } catch (error) {
            console.error('[Controller] subscribeToVotes - Error:', {
                error,
                message: error instanceof Error ? error.message : 'Unknown error',
                stack: error instanceof Error ? error.stack : undefined
            });

            // Special handling for unsupported endpoint error
            if (error instanceof Error && error.message.includes('not supported')) {
                return res.status(400).json({
                    jsonrpc: "2.0",
                    id: "1",
                    error: {
                        code: 400,
                        message: 'Vote subscription is not supported by this RPC endpoint'
                    }
                });
            }

            res.status(500).json({
                jsonrpc: "2.0",
                id: "1",
                error: {
                    code: 500,
                    message: error instanceof Error ? error.message : 'Failed to subscribe to votes'
                }
            });
        }
    }

    async unsubscribeFromVotes(req: Request, res: Response) {
        try {
            console.log('[Controller] unsubscribeFromVotes - Request received:', {
                query: req.query,
                headers: req.headers
            });

            const subscriptionId = req.query.subscriptionId ? Number(req.query.subscriptionId) : undefined;
            if (!subscriptionId) {
                console.log('[Controller] unsubscribeFromVotes - Missing subscriptionId');
                return res.status(400).json({
                    jsonrpc: "2.0",
                    id: "1",
                    error: {
                        code: 400,
                        message: 'subscriptionId parameter is required'
                    }
                });
            }

            console.log('[Controller] unsubscribeFromVotes - Calling model with params:', {
                subscriptionId
            });

            const success = await NetworkModel.unsubscribeFromVotes(subscriptionId);
            
            console.log('[Controller] unsubscribeFromVotes - Success response:', success);

            res.json({
                jsonrpc: "2.0",
                id: "1",
                result: success
            });
        } catch (error) {
            console.error('[Controller] unsubscribeFromVotes - Error:', {
                error,
                message: error instanceof Error ? error.message : 'Unknown error',
                stack: error instanceof Error ? error.stack : undefined
            });

            res.status(500).json({
                jsonrpc: "2.0",
                id: "1",
                error: {
                    code: 500,
                    message: error instanceof Error ? error.message : 'Failed to unsubscribe from votes'
                }
            });
        }
    }

    async subscribeToSlots(req: Request, res: Response) {
        try {
            console.log('[Controller] subscribeToSlots - Request received');

            const subscription = await NetworkModel.subscribeToSlots();
            
            console.log('[Controller] subscribeToSlots - Success response:', subscription);

            res.json({
                jsonrpc: "2.0",
                id: "1",
                result: subscription.id
            });
        } catch (error) {
            console.error('[Controller] subscribeToSlots - Error:', {
                error,
                message: error instanceof Error ? error.message : 'Unknown error',
                stack: error instanceof Error ? error.stack : undefined
            });

            res.status(500).json({
                jsonrpc: "2.0",
                id: "1",
                error: {
                    code: 500,
                    message: error instanceof Error ? error.message : 'Failed to subscribe to slots'
                }
            });
        }
    }

    async unsubscribeFromSlots(req: Request, res: Response) {
        try {
            console.log('[Controller] unsubscribeFromSlots - Request received');

            const subscriptionId = parseInt(req.query.subscriptionId as string);
            if (isNaN(subscriptionId)) {
                return res.status(400).json({
                    jsonrpc: "2.0",
                    id: "1",
                    error: {
                        code: 400,
                        message: 'Invalid subscription ID'
                    }
                });
            }

            const success = await NetworkModel.unsubscribeFromSlots(subscriptionId);
            
            console.log('[Controller] unsubscribeFromSlots - Success response:', success);

            res.json({
                jsonrpc: "2.0",
                id: "1",
                result: success
            });
        } catch (error) {
            console.error('[Controller] unsubscribeFromSlots - Error:', {
                error,
                message: error instanceof Error ? error.message : 'Unknown error',
                stack: error instanceof Error ? error.stack : undefined
            });

            res.status(500).json({
                jsonrpc: "2.0",
                id: "1",
                error: {
                    code: 500,
                    message: error instanceof Error ? error.message : 'Failed to unsubscribe from slots'
                }
            });
        }
    }

    async getRecentPerformanceSamples(req: Request, res: Response) {
        try {
            console.log('[Controller] getRecentPerformanceSamples - Request received:', {
                query: req.query,
                headers: req.headers
            });

            const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
            if (limit !== undefined && (isNaN(limit) || limit <= 0)) {
                return res.status(400).json({
                    jsonrpc: "2.0",
                    id: "1",
                    error: {
                        code: 400,
                        message: 'Invalid limit parameter. Must be a positive integer.'
                    }
                });
            }

            console.log('[Controller] getRecentPerformanceSamples - Calling model with params:', { limit });

            const samples = await NetworkModel.getRecentPerformanceSamples(limit);
            
            console.log('[Controller] getRecentPerformanceSamples - Success response:', {
                samplesCount: samples.length
            });

            res.json({
                jsonrpc: "2.0",
                id: "1",
                result: samples
            });
        } catch (error) {
            console.error('[Controller] getRecentPerformanceSamples - Error:', {
                error,
                message: error instanceof Error ? error.message : 'Unknown error',
                stack: error instanceof Error ? error.stack : undefined
            });

            res.status(500).json({
                jsonrpc: "2.0",
                id: "1",
                error: {
                    code: 500,
                    message: error instanceof Error ? error.message : 'Failed to fetch performance samples'
                }
            });
        }
    }

    async getBlockProduction(req: Request, res: Response) {
        try {
            console.log('[Controller] getBlockProduction - Request received:', {
                query: req.query,
                body: req.body
            });

            const params: BlockProductionParams = {
                commitment: (req.query.commitment as 'processed' | 'confirmed' | 'finalized') || 'finalized',
                identity: req.query.identity as string,
                range: req.query.range ? JSON.parse(req.query.range as string) : undefined
            };

            console.log('[Controller] getBlockProduction - Calling model with params:', params);

            const blockProduction = await NetworkModel.getBlockProduction(params);
            
            console.log('[Controller] getBlockProduction - Success response');

            res.json({
                jsonrpc: "2.0",
                id: "1",
                result: blockProduction
            });
        } catch (error) {
            console.error('[Controller] getBlockProduction - Error:', {
                error,
                message: error instanceof Error ? error.message : 'Unknown error',
                stack: error instanceof Error ? error.stack : undefined
            });

            res.status(500).json({
                jsonrpc: "2.0",
                id: "1",
                error: {
                    code: 500,
                    message: error instanceof Error ? error.message : 'Failed to fetch block production'
                }
            });
        }
    }

    async getClusterNodes(req: Request, res: Response) {
        try {
            console.log('[Controller] getClusterNodes - Request received');

            const params = {
                page: req.query.page ? parseInt(req.query.page as string) : undefined,
                limit: req.query.limit ? parseInt(req.query.limit as string) : undefined
            };

            const nodesResponse = await NetworkModel.getClusterNodes(params);
            
            console.log('[Controller] getClusterNodes - Success response:', {
                nodesCount: nodesResponse.data.length,
                page: nodesResponse.pagination.page,
                totalPages: nodesResponse.pagination.totalPages
            });

            res.json({
                jsonrpc: "2.0",
                id: "1",
                result: nodesResponse
            });
        } catch (error) {
            console.error('[Controller] getClusterNodes - Error:', {
                error,
                message: error instanceof Error ? error.message : 'Unknown error',
                stack: error instanceof Error ? error.stack : undefined
            });

            res.status(500).json({
                jsonrpc: "2.0",
                id: "1",
                error: {
                    code: 500,
                    message: error instanceof Error ? error.message : 'Failed to fetch cluster nodes'
                }
            });
        }
    }

    async getSupply(req: Request, res: Response) {
        try {
            console.log('[Controller] getSupply - Request received');

            const params: SupplyParams = {
                commitment: (req.query.commitment as 'processed' | 'confirmed' | 'finalized') || 'finalized',
                excludeNonCirculatingAccountsList: req.query.excludeNonCirculatingAccountsList === 'true'
            };

            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 50;

            const supply = await NetworkModel.getSupply(params, { page, limit });
            
            console.log('[Controller] getSupply - Success response');

            res.json({
                jsonrpc: "2.0",
                id: "1",
                result: supply
            });
        } catch (error) {
            console.error('[Controller] getSupply - Error:', {
                error,
                message: error instanceof Error ? error.message : 'Unknown error',
                stack: error instanceof Error ? error.stack : undefined
            });

            res.status(500).json({
                jsonrpc: "2.0",
                id: "1",
                error: {
                    code: 500,
                    message: error instanceof Error ? error.message : 'Failed to fetch supply information'
                }
            });
        }
    }

    async getVersion(req: Request, res: Response) {
        try {
            console.log('[Controller] getVersion - Request received');

            const version = await NetworkModel.getVersion();
            
            console.log('[Controller] getVersion - Success response');

            res.json({
                jsonrpc: "2.0",
                id: "1",
                result: version
            });
        } catch (error) {
            console.error('[Controller] getVersion - Error:', {
                error,
                message: error instanceof Error ? error.message : 'Unknown error',
                stack: error instanceof Error ? error.stack : undefined
            });

            res.status(500).json({
                jsonrpc: "2.0",
                id: "1",
                error: {
                    code: 500,
                    message: error instanceof Error ? error.message : 'Failed to fetch version information'
                }
            });
        }
    }

    async getHealth(req: Request, res: Response) {
        try {
            console.log('[Controller] getHealth - Request received');

            const health = await NetworkModel.getHealth();
            
            console.log('[Controller] getHealth - Success response');

            res.json({
                jsonrpc: "2.0",
                id: "1",
                result: health
            });
        } catch (error) {
            console.error('[Controller] getHealth - Error:', {
                error,
                message: error instanceof Error ? error.message : 'Unknown error',
                stack: error instanceof Error ? error.stack : undefined
            });

            // Special handling for unhealthy node
            if (error instanceof Error && error.message.includes('unhealthy')) {
                return res.status(500).json({
                    jsonrpc: "2.0",
                    id: "1",
                    error: {
                        code: 500,
                        message: 'Node is unhealthy'
                    }
                });
            }

            res.status(500).json({
                jsonrpc: "2.0",
                id: "1",
                error: {
                    code: 500,
                    message: error instanceof Error ? error.message : 'Failed to fetch health status'
                }
            });
        }
    }
}
