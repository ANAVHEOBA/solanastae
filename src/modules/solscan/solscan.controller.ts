import { Request, Response } from 'express';
import { SolscanModel } from './solscan.model';
import { ActivityType, SolscanTransferRequest, DefiActivityType, DefiActivitiesRequest, TokenTransferActivityType, TokenTransferRequest, TokenDefiActivityType, TokenDefiRouter, TokenDefiActivity, TokenDefiActivitiesRequest, TokenDefiActivitiesResponse } from './solscan.schema';

export class SolscanController {
    async getAccountDetail(req: Request, res: Response): Promise<void> {
        try {
            console.log('[SolscanController] Getting account detail...');
            const { address } = req.params;

            if (!address) {
                res.status(400).json({
                    error: 'Missing address parameter'
                });
                return;
            }

            const result = await SolscanModel.getAccountDetail(address);
            
            if (!result.success) {
                res.status(404).json({
                    error: 'Account not found'
                });
                return;
            }

            console.log('[SolscanController] Successfully got account detail:', {
                address: result.data.address
            });

            res.json(result);
        } catch (error) {
            console.error('[SolscanController] Error getting account detail:', error);
            if (error instanceof Error) {
                if (error.message.includes('Invalid response format')) {
                    res.status(502).json({
                        error: 'Invalid response from Solscan API'
                    });
                } else if (error.message.includes('Unauthorized')) {
                    res.status(401).json({
                        error: 'Unauthorized access to Solscan API'
                    });
                } else if (error.message.includes('Rate limit')) {
                    res.status(429).json({
                        error: 'Rate limit exceeded. Please try again later.'
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

    async getAccountTransactions(req: Request, res: Response): Promise<void> {
        try {
            console.log('[SolscanController] Getting account transactions...');
            const { address } = req.params;
            const { limit } = req.query;

            if (!address) {
                res.status(400).json({
                    error: 'Missing address parameter'
                });
                return;
            }

            const result = await SolscanModel.getAccountTransactions(
                address,
                limit ? Number(limit) : undefined
            );
            
            if (!result.success) {
                res.status(404).json({
                    error: 'No transactions found'
                });
                return;
            }

            console.log('[SolscanController] Successfully got account transactions:', {
                count: result.data.length
            });

            res.json(result);
        } catch (error) {
            console.error('[SolscanController] Error getting account transactions:', error);
            if (error instanceof Error) {
                if (error.message.includes('Invalid response format')) {
                    res.status(502).json({
                        error: 'Invalid response from Solscan API'
                    });
                } else if (error.message.includes('Unauthorized')) {
                    res.status(401).json({
                        error: 'Unauthorized access to Solscan API'
                    });
                } else if (error.message.includes('Rate limit')) {
                    res.status(429).json({
                        error: 'Rate limit exceeded. Please try again later.'
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

    async getPortfolio(req: Request, res: Response): Promise<void> {
        try {
            console.log('[SolscanController] Getting portfolio...');
            const { address } = req.params;

            if (!address) {
                res.status(400).json({
                    error: 'Missing address parameter'
                });
                return;
            }

            const result = await SolscanModel.getPortfolio(address);
            
            if (!result.success) {
                res.status(404).json({
                    error: 'Portfolio not found'
                });
                return;
            }

            console.log('[SolscanController] Successfully got portfolio:', {
                address,
                totalValue: result.data.total_value,
                tokenCount: result.data.tokens.length
            });

            res.json(result);
        } catch (error) {
            console.error('[SolscanController] Error getting portfolio:', error);
            if (error instanceof Error) {
                if (error.message.includes('Invalid response format')) {
                    res.status(502).json({
                        error: 'Invalid response from Solscan API'
                    });
                } else if (error.message.includes('Unauthorized')) {
                    res.status(401).json({
                        error: 'Unauthorized access to Solscan API'
                    });
                } else if (error.message.includes('Rate limit')) {
                    res.status(429).json({
                        error: 'Rate limit exceeded. Please try again later.'
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

    async getTokenAccounts(req: Request, res: Response): Promise<void> {
        try {
            console.log('[SolscanController] Getting token accounts...');
            const { address } = req.params;
            const { type = 'token', page = '1', pageSize = '10', hideZero = 'true' } = req.query;
    
            if (!address) {
                res.status(400).json({
                    error: 'Missing address parameter'
                });
                return;
            }
    
            if (type !== 'token' && type !== 'nft') {
                res.status(400).json({
                    error: 'Invalid type parameter. Must be "token" or "nft"'
                });
                return;
            }
    
            const result = await SolscanModel.getTokenAccounts(
                address,
                type as 'token' | 'nft',
                parseInt(page as string),
                parseInt(pageSize as string) as 10 | 20 | 30 | 40,
                hideZero === 'true'
            );
            
            if (!result.success) {
                res.status(404).json({
                    error: 'Token accounts not found'
                });
                return;
            }
    
            console.log('[SolscanController] Successfully got token accounts:', {
                count: result.data.length
            });
    
            res.json(result);
        } catch (error) {
            console.error('[SolscanController] Error getting token accounts:', error);
            if (error instanceof Error) {
                if (error.message.includes('Invalid response format')) {
                    res.status(502).json({
                        error: 'Invalid response from Solscan API'
                    });
                } else if (error.message.includes('Unauthorized')) {
                    res.status(401).json({
                        error: 'Unauthorized access to Solscan API'
                    });
                } else if (error.message.includes('Rate limit')) {
                    res.status(429).json({
                        error: 'Rate limit exceeded. Please try again later.'
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

    async getStakeAccounts(req: Request, res: Response): Promise<void> {
        try {
            console.log('[SolscanController] Getting stake accounts...');
            const { address } = req.params;
            const { page = '1', pageSize = '10' } = req.query;
    
            if (!address) {
                res.status(400).json({
                    error: 'Missing address parameter'
                });
                return;
            }
    
            const result = await SolscanModel.getStakeAccounts(
                address,
                parseInt(page as string),
                parseInt(pageSize as string) as 10 | 20 | 30 | 40
            );
            
            if (!result.success) {
                res.status(404).json({
                    error: 'Stake accounts not found'
                });
                return;
            }
    
            console.log('[SolscanController] Successfully got stake accounts:', {
                count: result.data.length
            });
    
            res.json(result);
        } catch (error) {
            console.error('[SolscanController] Error getting stake accounts:', error);
            if (error instanceof Error) {
                if (error.message.includes('Invalid response format')) {
                    res.status(502).json({
                        error: 'Invalid response from Solscan API'
                    });
                } else if (error.message.includes('Unauthorized')) {
                    res.status(401).json({
                        error: 'Unauthorized access to Solscan API'
                    });
                } else if (error.message.includes('Rate limit')) {
                    res.status(429).json({
                        error: 'Rate limit exceeded. Please try again later.'
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

    async getTransfers(req: Request, res: Response): Promise<void> {
        try {
            console.log('[SolscanController] Getting transfers...');
            const { address } = req.params;
            const {
                activity_type,
                token_account,
                from,
                to,
                token,
                amount,
                from_time,
                to_time,
                exclude_amount_zero,
                flow,
                page = '1',
                page_size = '10',
                sort_by = 'block_time',
                sort_order = 'desc',
                value
            } = req.query;
    
            if (!address) {
                res.status(400).json({
                    error: 'Missing address parameter'
                });
                return;
            }
    
            const options: Omit<SolscanTransferRequest, 'address'> = {
                activity_type: activity_type ? 
                    (typeof activity_type === 'string' ? [activity_type] : activity_type as string[]) as ActivityType[] : 
                    undefined,
                token_account: token_account as string,
                from: from as string,
                to: to as string,
                token: token as string,
                amount: amount ? [
                    Number(Array.isArray(amount) ? amount[0] : amount),
                    Number(Array.isArray(amount) ? amount[1] : amount)
                ] : undefined,
                from_time: from_time ? Number(from_time) : undefined,
                to_time: to_time ? Number(to_time) : undefined,
                exclude_amount_zero: exclude_amount_zero === 'true',
                flow: flow as 'in' | 'out',
                page: parseInt(page as string),
                page_size: parseInt(page_size as string) as 10 | 20 | 30 | 40 | 60 | 100,
                sort_by: sort_by as 'block_time',
                sort_order: sort_order as 'asc' | 'desc',
                value: value ? [
                    Number(Array.isArray(value) ? value[0] : value),
                    Number(Array.isArray(value) ? value[1] : value)
                ] : undefined
            };
    
            const result = await SolscanModel.getTransfers(address, options);
            
            if (!result.success) {
                res.status(404).json({
                    error: 'Transfers not found'
                });
                return;
            }
    
            console.log('[SolscanController] Successfully got transfers:', {
                count: result.data.length
            });
    
            res.json(result);
        } catch (error) {
            console.error('[SolscanController] Error getting transfers:', error);
            if (error instanceof Error) {
                // Handle network-related errors
                if ('code' in error) {
                    switch (error.code) {
                        case 'ETIMEDOUT':
                            res.status(504).json({
                                error: 'Request timed out while connecting to Solscan API'
                            });
                            return;
                        case 'ENETUNREACH':
                            res.status(503).json({
                                error: 'Network is unreachable. Please check your internet connection'
                            });
                            return;
                        case 'ECONNREFUSED':
                            res.status(503).json({
                                error: 'Connection refused by Solscan API'
                            });
                            return;
                    }
                }

                if (error.message.includes('Invalid response format')) {
                    res.status(502).json({
                        error: 'Invalid response from Solscan API'
                    });
                } else if (error.message.includes('Unauthorized')) {
                    res.status(401).json({
                        error: 'Unauthorized access to Solscan API'
                    });
                } else if (error.message.includes('Rate limit')) {
                    res.status(429).json({
                        error: 'Rate limit exceeded. Please try again later.'
                    });
                } else {
                    res.status(500).json({
                        error: 'An error occurred while fetching transfers'
                    });
                }
            } else {
                res.status(500).json({
                    error: 'An unknown error occurred'
                });
            }
        }
    }

    async getDefiActivities(req: Request, res: Response): Promise<void> {
        try {
            console.log('[SolscanController] Getting DeFi activities...');
            const { address } = req.params;
            const {
                activity_type,
                from,
                platform,
                source,
                token,
                from_time,
                to_time,
                page = '1',
                page_size = '10',
                sort_by = 'block_time',
                sort_order = 'desc'
            } = req.query;

            if (!address) {
                res.status(400).json({
                    error: 'Missing address parameter'
                });
                return;
            }

            const options: Omit<DefiActivitiesRequest, 'address'> = {
                activity_type: activity_type ? 
                    (typeof activity_type === 'string' ? [activity_type] : activity_type as string[]) as DefiActivityType[] : 
                    undefined,
                from: from as string,
                platform: platform ? 
                    (typeof platform === 'string' ? [platform] : platform as string[]) : 
                    undefined,
                source: source ? 
                    (typeof source === 'string' ? [source] : source as string[]) : 
                    undefined,
                token: token as string,
                from_time: from_time ? Number(from_time) : undefined,
                to_time: to_time ? Number(to_time) : undefined,
                page: parseInt(page as string),
                page_size: parseInt(page_size as string) as 10 | 20 | 30 | 40 | 60 | 100,
                sort_by: sort_by as 'block_time',
                sort_order: sort_order as 'asc' | 'desc'
            };

            const result = await SolscanModel.getDefiActivities(address, options);
            
            if (!result.success) {
                res.status(404).json({
                    error: 'DeFi activities not found'
                });
                return;
            }

            console.log('[SolscanController] Successfully got DeFi activities:', {
                count: result.data.length
            });

            res.json(result);
        } catch (error) {
            console.error('[SolscanController] Error getting DeFi activities:', error);
            if (error instanceof Error) {
                if ('code' in error) {
                    switch (error.code) {
                        case 'ETIMEDOUT':
                            res.status(504).json({
                                error: 'Request timed out while connecting to Solscan API'
                            });
                            return;
                        case 'ENETUNREACH':
                            res.status(503).json({
                                error: 'Network is unreachable. Please check your internet connection'
                            });
                            return;
                        case 'ECONNREFUSED':
                            res.status(503).json({
                                error: 'Connection refused by Solscan API'
                            });
                            return;
                    }
                }

                if (error.message.includes('Invalid response format')) {
                    res.status(502).json({
                        error: 'Invalid response from Solscan API'
                    });
                } else if (error.message.includes('Unauthorized')) {
                    res.status(401).json({
                        error: 'Unauthorized access to Solscan API'
                    });
                } else if (error.message.includes('Rate limit')) {
                    res.status(429).json({
                        error: 'Rate limit exceeded. Please try again later.'
                    });
                } else {
                    res.status(500).json({
                        error: 'An error occurred while fetching DeFi activities'
                    });
                }
            } else {
                res.status(500).json({
                    error: 'An unknown error occurred'
                });
            }
        }
    }

    async getTokenMetadataMulti(req: Request, res: Response): Promise<void> {
        try {
            console.log('[SolscanController] Getting token metadata multi...');
            const { address } = req.query;

            if (!address) {
                res.status(400).json({
                    error: 'Missing address parameter'
                });
                return;
            }

            const addresses = Array.isArray(address) ? address : [address];

            if (addresses.length > 20) {
                res.status(400).json({
                    error: 'Maximum 20 token addresses allowed'
                });
                return;
            }

            const result = await SolscanModel.getTokenMetadataMulti(addresses as string[]);
            
            if (!result.success) {
                res.status(404).json({
                    error: 'Token metadata not found'
                });
                return;
            }

            console.log('[SolscanController] Successfully got token metadata:', {
                count: result.data.length
            });

            res.json(result);
        } catch (error) {
            console.error('[SolscanController] Error getting token metadata:', error);
            if (error instanceof Error) {
                if ('code' in error) {
                    switch (error.code) {
                        case 'ETIMEDOUT':
                            res.status(504).json({
                                error: 'Request timed out while connecting to Solscan API'
                            });
                            return;
                        case 'ENETUNREACH':
                            res.status(503).json({
                                error: 'Network is unreachable. Please check your internet connection'
                            });
                            return;
                        case 'ECONNREFUSED':
                            res.status(503).json({
                                error: 'Connection refused by Solscan API'
                            });
                            return;
                    }
                }

                if (error.message.includes('Invalid response format')) {
                    res.status(502).json({
                        error: 'Invalid response from Solscan API'
                    });
                } else if (error.message.includes('Unauthorized')) {
                    res.status(401).json({
                        error: 'Unauthorized access to Solscan API'
                    });
                } else if (error.message.includes('Rate limit')) {
                    res.status(429).json({
                        error: 'Rate limit exceeded. Please try again later.'
                    });
                } else {
                    res.status(500).json({
                        error: 'An error occurred while fetching token metadata'
                    });
                }
            } else {
                res.status(500).json({
                    error: 'An unknown error occurred'
                });
            }
        }
    }

    async getTokenPriceMulti(req: Request, res: Response): Promise<void> {
        try {
            console.log('[SolscanController] Getting token price multi...');
            const { address, from_time, to_time } = req.query;

            if (!address) {
                res.status(400).json({
                    error: 'Missing address parameter'
                });
                return;
            }

            const addresses = Array.isArray(address) ? address : [address];

            if (addresses.length > 20) {
                res.status(400).json({
                    error: 'Maximum 20 token addresses allowed'
                });
                return;
            }

            const result = await SolscanModel.getTokenPriceMulti(
                addresses as string[],
                from_time ? Number(from_time) : undefined,
                to_time ? Number(to_time) : undefined
            );
            
            if (!result.success) {
                res.status(404).json({
                    error: 'Token prices not found'
                });
                return;
            }

            console.log('[SolscanController] Successfully got token prices:', {
                count: result.data.length
            });

            res.json(result);
        } catch (error) {
            console.error('[SolscanController] Error getting token prices:', error);
            if (error instanceof Error) {
                if ('code' in error) {
                    switch (error.code) {
                        case 'ETIMEDOUT':
                            res.status(504).json({
                                error: 'Request timed out while connecting to Solscan API'
                            });
                            return;
                        case 'ENETUNREACH':
                            res.status(503).json({
                                error: 'Network is unreachable. Please check your internet connection'
                            });
                            return;
                        case 'ECONNREFUSED':
                            res.status(503).json({
                                error: 'Connection refused by Solscan API'
                            });
                            return;
                    }
                }

                if (error.message.includes('Invalid response format')) {
                    res.status(502).json({
                        error: 'Invalid response from Solscan API'
                    });
                } else if (error.message.includes('Unauthorized')) {
                    res.status(401).json({
                        error: 'Unauthorized access to Solscan API'
                    });
                } else if (error.message.includes('Rate limit')) {
                    res.status(429).json({
                        error: 'Rate limit exceeded. Please try again later.'
                    });
                } else {
                    res.status(500).json({
                        error: 'An error occurred while fetching token prices'
                    });
                }
            } else {
                res.status(500).json({
                    error: 'An unknown error occurred'
                });
            }
        }
    }

    async getTokenHolders(req: Request, res: Response): Promise<void> {
        try {
            console.log('[SolscanController] Getting token holders...');
            const { address } = req.query;
            const { 
                page = '1', 
                page_size = '10',
                from_amount,
                to_amount
            } = req.query;

            if (!address) {
                res.status(400).json({
                    error: 'Missing address parameter'
                });
                return;
            }

            const result = await SolscanModel.getTokenHolders(
                address as string,
                parseInt(page as string),
                parseInt(page_size as string) as 10 | 20 | 30 | 40,
                from_amount as string,
                to_amount as string
            );
            
            if (!result.success) {
                res.status(404).json({
                    error: 'Token holders not found'
                });
                return;
            }

            console.log('[SolscanController] Successfully got token holders:', {
                total: result.data.total,
                count: result.data.items.length
            });

            res.json(result);
        } catch (error) {
            console.error('[SolscanController] Error getting token holders:', error);
            if (error instanceof Error) {
                if ('code' in error) {
                    switch (error.code) {
                        case 'ETIMEDOUT':
                            res.status(504).json({
                                error: 'Request timed out while connecting to Solscan API'
                            });
                            return;
                        case 'ENETUNREACH':
                            res.status(503).json({
                                error: 'Network is unreachable. Please check your internet connection'
                            });
                            return;
                        case 'ECONNREFUSED':
                            res.status(503).json({
                                error: 'Connection refused by Solscan API'
                            });
                            return;
                    }
                }

                if (error.message.includes('Invalid response format')) {
                    res.status(502).json({
                        error: 'Invalid response from Solscan API'
                    });
                } else if (error.message.includes('Unauthorized')) {
                    res.status(401).json({
                        error: 'Unauthorized access to Solscan API'
                    });
                } else if (error.message.includes('Rate limit')) {
                    res.status(429).json({
                        error: 'Rate limit exceeded. Please try again later.'
                    });
                } else {
                    res.status(500).json({
                        error: 'An error occurred while fetching token holders'
                    });
                }
            } else {
                res.status(500).json({
                    error: 'An unknown error occurred'
                });
            }
        }
    }

    async getTokenTransfer(req: Request, res: Response): Promise<void> {
        try {
            console.log('[SolscanController] Getting token transfers...');
            const { address } = req.query;
            const {
                activity_type,
                from,
                to,
                amount,
                block_time,
                exclude_amount_zero,
                page = '1',
                page_size = '10',
                sort_by = 'block_time',
                sort_order = 'desc',
                value
            } = req.query;

            if (!address) {
                res.status(400).json({
                    error: 'Missing address parameter'
                });
                return;
            }

            const options: Omit<TokenTransferRequest, 'address'> = {
                activity_type: activity_type ? 
                    (typeof activity_type === 'string' ? [activity_type] : activity_type as string[]) as TokenTransferActivityType[] : 
                    undefined,
                from: from as string,
                to: to as string,
                amount: amount ? [
                    Number(Array.isArray(amount) ? amount[0] : amount),
                    Number(Array.isArray(amount) ? amount[1] : amount)
                ] : undefined,
                block_time: block_time ? [
                    Number(Array.isArray(block_time) ? block_time[0] : block_time),
                    Number(Array.isArray(block_time) ? block_time[1] : block_time)
                ] : undefined,
                exclude_amount_zero: exclude_amount_zero === 'true',
                page: parseInt(page as string),
                page_size: parseInt(page_size as string) as 10 | 20 | 30 | 40 | 60 | 100,
                sort_by: sort_by as 'block_time',
                sort_order: sort_order as 'asc' | 'desc',
                value: value ? [
                    Number(Array.isArray(value) ? value[0] : value),
                    Number(Array.isArray(value) ? value[1] : value)
                ] : undefined
            };

            const result = await SolscanModel.getTokenTransfer(address as string, options);
            
            if (!result.success) {
                res.status(404).json({
                    error: 'Token transfers not found'
                });
                return;
            }

            console.log('[SolscanController] Successfully got token transfers:', {
                count: result.data.length
            });

            res.json(result);
        } catch (error) {
            console.error('[SolscanController] Error getting token transfers:', error);
            if (error instanceof Error) {
                if ('code' in error) {
                    switch (error.code) {
                        case 'ETIMEDOUT':
                            res.status(504).json({
                                error: 'Request timed out while connecting to Solscan API'
                            });
                            return;
                        case 'ENETUNREACH':
                            res.status(503).json({
                                error: 'Network is unreachable. Please check your internet connection'
                            });
                            return;
                        case 'ECONNREFUSED':
                            res.status(503).json({
                                error: 'Connection refused by Solscan API'
                            });
                            return;
                    }
                }

                if (error.message.includes('Invalid response format')) {
                    res.status(502).json({
                        error: 'Invalid response from Solscan API'
                    });
                } else if (error.message.includes('Unauthorized')) {
                    res.status(401).json({
                        error: 'Unauthorized access to Solscan API'
                    });
                } else if (error.message.includes('Rate limit')) {
                    res.status(429).json({
                        error: 'Rate limit exceeded. Please try again later.'
                    });
                } else {
                    res.status(500).json({
                        error: 'An error occurred while fetching token transfers'
                    });
                }
            } else {
                res.status(500).json({
                    error: 'An unknown error occurred'
                });
            }
        }
    }

    async getTokenDefiActivities(req: Request, res: Response): Promise<void> {
        try {
            console.log('[SolscanController] Getting token DeFi activities...');
            const { address } = req.query;
            const {
                from,
                platform,
                source,
                activity_type,
                token,
                from_time,
                to_time,
                page = '1',
                page_size = '10',
                sort_by = 'block_time',
                sort_order = 'desc'
            } = req.query;

            if (!address) {
                res.status(400).json({
                    error: 'Missing address parameter'
                });
                return;
            }

            const options: Omit<TokenDefiActivitiesRequest, 'address'> = {
                from: from as string,
                platform: platform ? 
                    (typeof platform === 'string' ? [platform] : platform as string[]) : 
                    undefined,
                source: source ? 
                    (typeof source === 'string' ? [source] : source as string[]) : 
                    undefined,
                activity_type: activity_type ? 
                    (typeof activity_type === 'string' ? [activity_type] : activity_type as string[]) as TokenDefiActivityType[] : 
                    undefined,
                token: token as string,
                from_time: from_time ? Number(from_time) : undefined,
                to_time: to_time ? Number(to_time) : undefined,
                page: parseInt(page as string),
                page_size: parseInt(page_size as string) as 10 | 20 | 30 | 40 | 60 | 100,
                sort_by: sort_by as 'block_time',
                sort_order: sort_order as 'asc' | 'desc'
            };

            const result = await SolscanModel.getTokenDefiActivities(address as string, options);
            
            if (!result.success) {
                res.status(404).json({
                    error: 'Token DeFi activities not found'
                });
                return;
            }

            console.log('[SolscanController] Successfully got token DeFi activities:', {
                count: result.data.length
            });

            res.json(result);
        } catch (error) {
            console.error('[SolscanController] Error getting token DeFi activities:', error);
            if (error instanceof Error) {
                if ('code' in error) {
                    switch (error.code) {
                        case 'ETIMEDOUT':
                            res.status(504).json({
                                error: 'Request timed out while connecting to Solscan API'
                            });
                            return;
                        case 'ENETUNREACH':
                            res.status(503).json({
                                error: 'Network is unreachable. Please check your internet connection'
                            });
                            return;
                        case 'ECONNREFUSED':
                            res.status(503).json({
                                error: 'Connection refused by Solscan API'
                            });
                            return;
                    }
                }

                if (error.message.includes('Invalid response format')) {
                    res.status(502).json({
                        error: 'Invalid response from Solscan API'
                    });
                } else if (error.message.includes('Unauthorized')) {
                    res.status(401).json({
                        error: 'Unauthorized access to Solscan API'
                    });
                } else if (error.message.includes('Rate limit')) {
                    res.status(429).json({
                        error: 'Rate limit exceeded. Please try again later.'
                    });
                } else {
                    res.status(500).json({
                        error: 'An error occurred while fetching token DeFi activities'
                    });
                }
            } else {
                res.status(500).json({
                    error: 'An unknown error occurred'
                });
            }
        }
    }






async getLastTransactions(req: Request, res: Response): Promise<void> {
    try {
        console.log('[SolscanController] Getting last transactions...');
        const { limit = '10', filter = 'exceptVote' } = req.query;

        // Validate limit
        const validLimits = [10, 20, 30, 40, 60, 100];
        const parsedLimit = parseInt(limit as string);
        if (!validLimits.includes(parsedLimit)) {
            res.status(400).json({
                error: 'Invalid limit parameter. Must be one of: 10, 20, 30, 40, 60, 100'
            });
            return;
        }

        // Validate filter
        if (filter !== 'exceptVote' && filter !== 'all') {
            res.status(400).json({
                error: 'Invalid filter parameter. Must be "exceptVote" or "all"'
            });
            return;
        }

        const result = await SolscanModel.getLastTransactions(
            parsedLimit as 10 | 20 | 30 | 40 | 60 | 100,
            filter as 'exceptVote' | 'all'
        );
        
        if (!result.success) {
            res.status(404).json({
                error: 'No transactions found'
            });
            return;
        }

        console.log('[SolscanController] Successfully got last transactions:', {
            count: result.data.length
        });

        res.json(result);
    } catch (error) {
        console.error('[SolscanController] Error getting last transactions:', error);
        if (error instanceof Error) {
            if ('code' in error) {
                switch (error.code) {
                    case 'ETIMEDOUT':
                        res.status(504).json({
                            error: 'Request timed out while connecting to Solscan API'
                        });
                        return;
                    case 'ENETUNREACH':
                        res.status(503).json({
                            error: 'Network is unreachable. Please check your internet connection'
                        });
                        return;
                    case 'ECONNREFUSED':
                        res.status(503).json({
                            error: 'Connection refused by Solscan API'
                        });
                        return;
                }
            }

            if (error.message.includes('Invalid response format')) {
                res.status(502).json({
                    error: 'Invalid response from Solscan API'
                });
            } else if (error.message.includes('Unauthorized')) {
                res.status(401).json({
                    error: 'Unauthorized access to Solscan API'
                });
            } else if (error.message.includes('Rate limit')) {
                res.status(429).json({
                    error: 'Rate limit exceeded. Please try again later.'
                });
            } else {
                res.status(500).json({
                    error: 'An error occurred while fetching last transactions'
                });
            }
        } else {
            res.status(500).json({
                error: 'An unknown error occurred'
            });
        }
    }
}




async getTransactionDetail(req: Request, res: Response): Promise<void> {
    try {
        console.log('[SolscanController] Getting transaction detail...');
        const { tx } = req.query;

        if (!tx || typeof tx !== 'string') {
            res.status(400).json({
                error: 'Missing or invalid tx parameter'
            });
            return;
        }

        const result = await SolscanModel.getTransactionDetail(tx);
        
        if (!result.success) {
            res.status(404).json({
                error: 'Transaction not found'
            });
            return;
        }

        console.log('[SolscanController] Successfully got transaction detail:', {
            tx_hash: result.data.tx_hash,
            status: result.data.tx_status
        });

        res.json(result);
    } catch (error) {
        console.error('[SolscanController] Error getting transaction detail:', error);
        if (error instanceof Error) {
            if ('code' in error) {
                switch (error.code) {
                    case 'ETIMEDOUT':
                        res.status(504).json({
                            error: 'Request timed out while connecting to Solscan API'
                        });
                        return;
                    case 'ENETUNREACH':
                        res.status(503).json({
                            error: 'Network is unreachable. Please check your internet connection'
                        });
                        return;
                    case 'ECONNREFUSED':
                        res.status(503).json({
                            error: 'Connection refused by Solscan API'
                        });
                        return;
                }
            }

            if (error.message.includes('Invalid response format')) {
                res.status(502).json({
                    error: 'Invalid response from Solscan API'
                });
            } else if (error.message.includes('Unauthorized')) {
                res.status(401).json({
                    error: 'Unauthorized access to Solscan API'
                });
            } else if (error.message.includes('Rate limit')) {
                res.status(429).json({
                    error: 'Rate limit exceeded. Please try again later.'
                });
            } else {
                res.status(500).json({
                    error: 'An error occurred while fetching transaction detail'
                });
            }
        } else {
            res.status(500).json({
                error: 'An unknown error occurred'
            });
        }
    }
}


async getTransactionActions(req: Request, res: Response): Promise<void> {
    try {
        console.log('[SolscanController] Getting transaction actions...');
        const { tx } = req.query;

        if (!tx || typeof tx !== 'string') {
            res.status(400).json({
                error: 'Missing or invalid tx parameter'
            });
            return;
        }

        const result = await SolscanModel.getTransactionActions(tx);
        
        if (!result.success) {
            res.status(404).json({
                error: 'Transaction actions not found'
            });
            return;
        }

        console.log('[SolscanController] Successfully got transaction actions:', {
            tx_hash: result.data.tx_hash,
            activities_count: result.data.activities.length,
            transfers_count: result.data.transfers.length
        });

        res.json(result);
    } catch (error) {
        console.error('[SolscanController] Error getting transaction actions:', error);
        if (error instanceof Error) {
            if ('code' in error) {
                switch (error.code) {
                    case 'ETIMEDOUT':
                        res.status(504).json({
                            error: 'Request timed out while connecting to Solscan API'
                        });
                        return;
                    case 'ENETUNREACH':
                        res.status(503).json({
                            error: 'Network is unreachable. Please check your internet connection'
                        });
                        return;
                    case 'ECONNREFUSED':
                        res.status(503).json({
                            error: 'Connection refused by Solscan API'
                        });
                        return;
                }
            }

            if (error.message.includes('Invalid response format')) {
                res.status(502).json({
                    error: 'Invalid response from Solscan API'
                });
            } else if (error.message.includes('Unauthorized')) {
                res.status(401).json({
                    error: 'Unauthorized access to Solscan API'
                });
            } else if (error.message.includes('Rate limit')) {
                res.status(429).json({
                    error: 'Rate limit exceeded. Please try again later.'
                });
            } else {
                res.status(500).json({
                    error: 'An error occurred while fetching transaction actions'
                });
            }
        } else {
            res.status(500).json({
                error: 'An unknown error occurred'
            });
        }
    }
}





async getLastBlocks(req: Request, res: Response): Promise<void> {
    try {
        console.log('[SolscanController] Getting last blocks...');
        const { limit = '10' } = req.query;

        // Validate limit
        const validLimits = [10, 20, 30, 40, 60, 100];
        const parsedLimit = parseInt(limit as string);
        if (!validLimits.includes(parsedLimit)) {
            res.status(400).json({
                error: 'Invalid limit parameter. Must be one of: 10, 20, 30, 40, 60, 100'
            });
            return;
        }

        const result = await SolscanModel.getLastBlocks(
            parsedLimit as 10 | 20 | 30 | 40 | 60 | 100
        );
        
        if (!result.success) {
            res.status(404).json({
                error: 'No blocks found'
            });
            return;
        }

        console.log('[SolscanController] Successfully got last blocks:', {
            count: result.data.length
        });

        res.json(result);
    } catch (error) {
        console.error('[SolscanController] Error getting last blocks:', error);
        if (error instanceof Error) {
            if ('code' in error) {
                switch (error.code) {
                    case 'ETIMEDOUT':
                        res.status(504).json({
                            error: 'Request timed out while connecting to Solscan API'
                        });
                        return;
                    case 'ENETUNREACH':
                        res.status(503).json({
                            error: 'Network is unreachable. Please check your internet connection'
                        });
                        return;
                    case 'ECONNREFUSED':
                        res.status(503).json({
                            error: 'Connection refused by Solscan API'
                        });
                        return;
                }
            }

            if (error.message.includes('Invalid response format')) {
                res.status(502).json({
                    error: 'Invalid response from Solscan API'
                });
            } else if (error.message.includes('Unauthorized')) {
                res.status(401).json({
                    error: 'Unauthorized access to Solscan API'
                });
            } else if (error.message.includes('Rate limit')) {
                res.status(429).json({
                    error: 'Rate limit exceeded. Please try again later.'
                });
            } else {
                res.status(500).json({
                    error: 'An error occurred while fetching last blocks'
                });
            }
        } else {
            res.status(500).json({
                error: 'An unknown error occurred'
            });
        }
    }
}







async getBlockTransactions(req: Request, res: Response): Promise<void> {
    try {
        console.log('[SolscanController] Getting block transactions...');
        const { block, page = '1', page_size = '10', exclude_vote, program } = req.query;

        if (!block) {
            res.status(400).json({
                error: 'Missing block parameter'
            });
            return;
        }

        const parsedBlock = parseInt(block as string);
        if (isNaN(parsedBlock)) {
            res.status(400).json({
                error: 'Invalid block parameter. Must be a number'
            });
            return;
        }

        // Validate page_size
        const validPageSizes = [10, 20, 30, 40, 60, 100];
        const parsedPageSize = parseInt(page_size as string);
        if (!validPageSizes.includes(parsedPageSize)) {
            res.status(400).json({
                error: 'Invalid page_size parameter. Must be one of: 10, 20, 30, 40, 60, 100'
            });
            return;
        }

        const result = await SolscanModel.getBlockTransactions(
            parsedBlock,
            parseInt(page as string),
            parsedPageSize as 10 | 20 | 30 | 40 | 60 | 100,
            exclude_vote === 'true',
            program as string
        );
        
        if (!result.success) {
            res.status(404).json({
                error: 'Block transactions not found'
            });
            return;
        }

        console.log('[SolscanController] Successfully got block transactions:', {
            total: result.data.total,
            count: result.data.transactions.length
        });

        res.json(result);
    } catch (error) {
        console.error('[SolscanController] Error getting block transactions:', error);
        if (error instanceof Error) {
            if ('code' in error) {
                switch (error.code) {
                    case 'ETIMEDOUT':
                        res.status(504).json({
                            error: 'Request timed out while connecting to Solscan API'
                        });
                        return;
                    case 'ENETUNREACH':
                        res.status(503).json({
                            error: 'Network is unreachable. Please check your internet connection'
                        });
                        return;
                    case 'ECONNREFUSED':
                        res.status(503).json({
                            error: 'Connection refused by Solscan API'
                        });
                        return;
                }
            }

            if (error.message.includes('Invalid response format')) {
                res.status(502).json({
                    error: 'Invalid response from Solscan API'
                });
            } else if (error.message.includes('Unauthorized')) {
                res.status(401).json({
                    error: 'Unauthorized access to Solscan API'
                });
            } else if (error.message.includes('Rate limit')) {
                res.status(429).json({
                    error: 'Rate limit exceeded. Please try again later.'
                });
            } else {
                res.status(500).json({
                    error: 'An error occurred while fetching block transactions'
                });
            }
        } else {
            res.status(500).json({
                error: 'An unknown error occurred'
            });
        }
    }
}

async getBlockDetail(req: Request, res: Response): Promise<void> {
    try {
        console.log('[SolscanController] Getting block detail...');
        const { block } = req.query;

        if (!block) {
            res.status(400).json({
                error: 'Missing block parameter'
            });
            return;
        }

        const parsedBlock = parseInt(block as string);
        if (isNaN(parsedBlock)) {
            res.status(400).json({
                error: 'Invalid block parameter. Must be a number'
            });
            return;
        }

        const result = await SolscanModel.getBlockDetail(parsedBlock);
        
        if (!result.success) {
            res.status(404).json({
                error: 'Block not found'
            });
            return;
        }

        console.log('[SolscanController] Successfully got block detail:', {
            slot: result.data.slot,
            blockhash: result.data.blockhash
        });

        res.json(result);
    } catch (error) {
        console.error('[SolscanController] Error getting block detail:', error);
        if (error instanceof Error) {
            if ('code' in error) {
                switch (error.code) {
                    case 'ETIMEDOUT':
                        res.status(504).json({
                            error: 'Request timed out while connecting to Solscan API'
                        });
                        return;
                    case 'ENETUNREACH':
                        res.status(503).json({
                            error: 'Network is unreachable. Please check your internet connection'
                        });
                        return;
                    case 'ECONNREFUSED':
                        res.status(503).json({
                            error: 'Connection refused by Solscan API'
                        });
                        return;
                }
            }

            if (error.message.includes('Invalid response format')) {
                res.status(502).json({
                    error: 'Invalid response from Solscan API'
                });
            } else if (error.message.includes('Unauthorized')) {
                res.status(401).json({
                    error: 'Unauthorized access to Solscan API'
                });
            } else if (error.message.includes('Rate limit')) {
                res.status(429).json({
                    error: 'Rate limit exceeded. Please try again later.'
                });
            } else {
                res.status(500).json({
                    error: 'An error occurred while fetching block detail'
                });
            }
        } else {
            res.status(500).json({
                error: 'An unknown error occurred'
            });
        }
    }
}


async getMarketList(req: Request, res: Response): Promise<void> {
    try {
        console.log('[SolscanController] Getting market list...');
        const { 
            page = '1',
            page_size = '10',
            program,
            token_address,
            sort_by = 'created_time',
            sort_order = 'desc'
        } = req.query;

        // Validate page_size
        const validPageSizes = [10, 20, 30, 40, 60, 100];
        const parsedPageSize = parseInt(page_size as string);
        if (!validPageSizes.includes(parsedPageSize)) {
            res.status(400).json({
                error: 'Invalid page_size parameter. Must be one of: 10, 20, 30, 40, 60, 100'
            });
            return;
        }

        // Validate sort_by
        const validSortBy = ['created_time', 'volumes_24h', 'trades_24h'];
        if (sort_by && !validSortBy.includes(sort_by as string)) {
            res.status(400).json({
                error: 'Invalid sort_by parameter. Must be one of: created_time, volumes_24h, trades_24h'
            });
            return;
        }

        // Validate sort_order
        if (sort_order && !['asc', 'desc'].includes(sort_order as string)) {
            res.status(400).json({
                error: 'Invalid sort_order parameter. Must be "asc" or "desc"'
            });
            return;
        }

        const result = await SolscanModel.getMarketList(
            parseInt(page as string),
            parsedPageSize as 10 | 20 | 30 | 40 | 60 | 100,
            program as string,
            token_address as string,
            sort_by as 'created_time' | 'volumes_24h' | 'trades_24h',
            sort_order as 'asc' | 'desc'
        );
        
        if (!result.success) {
            res.status(404).json({
                error: 'Market list not found'
            });
            return;
        }

        console.log('[SolscanController] Successfully got market list:', {
            count: result.data.length
        });

        res.json(result);
    } catch (error) {
        console.error('[SolscanController] Error getting market list:', error);
        if (error instanceof Error) {
            if ('code' in error) {
                switch (error.code) {
                    case 'ETIMEDOUT':
                        res.status(504).json({
                            error: 'Request timed out while connecting to Solscan API'
                        });
                        return;
                    case 'ENETUNREACH':
                        res.status(503).json({
                            error: 'Network is unreachable. Please check your internet connection'
                        });
                        return;
                    case 'ECONNREFUSED':
                        res.status(503).json({
                            error: 'Connection refused by Solscan API'
                        });
                        return;
                }
            }

            if (error.message.includes('Invalid response format')) {
                res.status(502).json({
                    error: 'Invalid response from Solscan API'
                });
            } else if (error.message.includes('Unauthorized')) {
                res.status(401).json({
                    error: 'Unauthorized access to Solscan API'
                });
            } else if (error.message.includes('Rate limit')) {
                res.status(429).json({
                    error: 'Rate limit exceeded. Please try again later.'
                });
            } else {
                res.status(500).json({
                    error: 'An error occurred while fetching market list'
                });
            }
        } else {
            res.status(500).json({
                error: 'An unknown error occurred'
            });
        }
    }
}



async getMarketInfo(req: Request, res: Response): Promise<void> {
    try {
        console.log('[SolscanController] Getting market info...');
        const { address } = req.query;

        if (!address || typeof address !== 'string') {
            res.status(400).json({
                error: 'Missing or invalid address parameter'
            });
            return;
        }

        const result = await SolscanModel.getMarketInfo(address);
        
        if (!result.success) {
            res.status(404).json({
                error: 'Market info not found'
            });
            return;
        }

        console.log('[SolscanController] Successfully got market info:', {
            pool_address: result.data.pool_address,
            program_id: result.data.program_id
        });

        res.json(result);
    } catch (error) {
        console.error('[SolscanController] Error getting market info:', error);
        if (error instanceof Error) {
            if ('code' in error) {
                switch (error.code) {
                    case 'ETIMEDOUT':
                        res.status(504).json({
                            error: 'Request timed out while connecting to Solscan API'
                        });
                        return;
                    case 'ENETUNREACH':
                        res.status(503).json({
                            error: 'Network is unreachable'
                        });
                        return;
                    case 'ECONNREFUSED':
                        res.status(503).json({
                            error: 'Connection refused by Solscan API'
                        });
                        return;
                }
            }

            if (error.message.includes('Invalid response format')) {
                res.status(502).json({
                    error: 'Invalid response from Solscan API'
                });
            } else if (error.message.includes('Unauthorized')) {
                res.status(401).json({
                    error: 'Unauthorized access to Solscan API'
                });
            } else if (error.message.includes('Rate limit')) {
                res.status(429).json({
                    error: 'Rate limit exceeded'
                });
            } else {
                res.status(500).json({
                    error: 'An error occurred while fetching market info'
                });
            }
        } else {
            res.status(500).json({
                error: 'An unknown error occurred'
            });
        }
    }
}

async getMarketVolume(req: Request, res: Response): Promise<void> {
    try {
        console.log('[SolscanController] Getting market volume...');
        const { address, time } = req.query;

        if (!address || typeof address !== 'string') {
            res.status(400).json({
                error: 'Missing or invalid address parameter'
            });
            return;
        }

        let timeRange: [string, string] | undefined;
        if (Array.isArray(time) && time.length === 2) {
            const [start, end] = time;
            if (typeof start === 'string' && typeof end === 'string') {
                timeRange = [start, end];
            }
        }

        const result = await SolscanModel.getMarketVolume(address, timeRange);
        
        if (!result.success) {
            res.status(404).json({
                error: 'Market volume not found'
            });
            return;
        }

        console.log('[SolscanController] Successfully got market volume:', {
            pool_address: result.data.pool_address,
            volume_24h: result.data.total_volume_24h
        });

        res.json(result);
    } catch (error) {
        console.error('[SolscanController] Error getting market volume:', error);
        if (error instanceof Error) {
            if ('code' in error) {
                switch (error.code) {
                    case 'ETIMEDOUT':
                        res.status(504).json({
                            error: 'Request timed out while connecting to Solscan API'
                        });
                        return;
                    case 'ENETUNREACH':
                        res.status(503).json({
                            error: 'Network is unreachable'
                        });
                        return;
                    case 'ECONNREFUSED':
                        res.status(503).json({
                            error: 'Connection refused by Solscan API'
                        });
                        return;
                }
            }

            if (error.message.includes('Invalid response format')) {
                res.status(502).json({
                    error: 'Invalid response from Solscan API'
                });
            } else if (error.message.includes('Unauthorized')) {
                res.status(401).json({
                    error: 'Unauthorized access to Solscan API'
                });
            } else if (error.message.includes('Rate limit')) {
                res.status(429).json({
                    error: 'Rate limit exceeded'
                });
            } else {
                res.status(500).json({
                    error: 'An error occurred while fetching market volume'
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