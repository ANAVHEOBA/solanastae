import { Request, Response } from 'express';
import { SolanaFMModel } from './solanafm.model';
import { SolanaFMTransactionsRequest, OwnerTokenAccountsRequest, TokenType, TokenInfoRequest, TokenSupplyRequest, TransferRequest } from './solanafm.schema';

export class SolanaFMController {
    async getTaggedAccounts(req: Request, res: Response): Promise<void> {
        try {
            console.log('[SolanaFMController] Getting tagged accounts...');
            const { accountHashes, fields } = req.body;
            
            if (!accountHashes || !Array.isArray(accountHashes) || accountHashes.length === 0) {
                res.status(400).json({
                    error: 'Missing or invalid accountHashes parameter'
                });
                return;
            }

            const result = await SolanaFMModel.getTaggedAccounts(accountHashes, fields);
            
            console.log('[SolanaFMController] Successfully got tagged accounts:', {
                count: result.accounts.length
            });

            res.json(result);
        } catch (error) {
            console.error('[SolanaFMController] Error getting tagged accounts:', error);
            if (error instanceof Error) {
                res.status(500).json({
                    error: error.message
                });
            } else {
                res.status(500).json({
                    error: 'An unknown error occurred'
                });
            }
        }
    }

    async getAccountFees(req: Request, res: Response): Promise<void> {
        try {
            console.log('[SolanaFMController] Getting account fees...');
            const { accountHash } = req.params;
            const { from, to } = req.query;

            if (!accountHash) {
                res.status(400).json({
                    error: 'Missing accountHash parameter'
                });
                return;
            }

            if (!from || !to) {
                res.status(400).json({
                    error: 'Missing from or to date parameters'
                });
                return;
            }

            const result = await SolanaFMModel.getAccountFees(accountHash, from as string, to as string);
            
            if (!Array.isArray(result) || result.length === 0) {
                res.status(404).json({
                    error: 'No fee data found for the specified account and date range'
                });
                return;
            }

            console.log('[SolanaFMController] Successfully got account fees:', {
                count: result.length
            });

            res.json(result);
        } catch (error) {
            console.error('[SolanaFMController] Error getting account fees:', error);
            if (error instanceof Error) {
                if (error.message.includes('Invalid response format')) {
                    res.status(502).json({
                        error: 'Invalid response from SolanaFM API'
                    });
                } else if (error.message.includes('Unauthorized')) {
                    res.status(401).json({
                        error: 'Unauthorized access to SolanaFM API'
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
            console.log('[SolanaFMController] Getting account transactions...');
            const { accountHash } = req.params;
            const { 
                actions,
                utcFrom,
                utcTo,
                inflow,
                outflow,
                mint,
                mints,
                amountFrom,
                amountTo,
                program,
                programs,
                limit,
                page
            } = req.query;

            if (!accountHash) {
                res.status(400).json({
                    error: 'Missing accountHash parameter'
                });
                return;
            }

            const request: SolanaFMTransactionsRequest = {
                accountHash,
                actions: actions as string,
                utcFrom: utcFrom ? Number(utcFrom) : undefined,
                utcTo: utcTo ? Number(utcTo) : undefined,
                inflow: inflow === 'true',
                outflow: outflow === 'true',
                mint: mint as string,
                mints: mints as string,
                amountFrom: amountFrom ? Number(amountFrom) : undefined,
                amountTo: amountTo ? Number(amountTo) : undefined,
                program: program as string,
                programs: programs as string,
                limit: limit ? Number(limit) : undefined,
                page: page ? Number(page) : undefined
            };

            const result = await SolanaFMModel.getAccountTransactions(request);
            
            if (!result.result.data.length) {
                res.status(404).json({
                    error: 'No transactions found for the specified account and filters'
                });
                return;
            }

            console.log('[SolanaFMController] Successfully got account transactions:', {
                count: result.result.data.length,
                page: result.result.pagination.currentPage,
                totalPages: result.result.pagination.totalPages
            });

            res.json(result);
        } catch (error) {
            console.error('[SolanaFMController] Error getting account transactions:', error);
            if (error instanceof Error) {
                if (error.message.includes('Invalid response format')) {
                    res.status(502).json({
                        error: 'Invalid response from SolanaFM API'
                    });
                } else if (error.message.includes('Unauthorized')) {
                    res.status(401).json({
                        error: 'Unauthorized access to SolanaFM API'
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

    async getOwnerTokenAccounts(req: Request, res: Response): Promise<void> {
        try {
            console.log('[SolanaFMController] Getting owner token accounts...');
            const { accountHash } = req.params;
            const { tokenType } = req.query;

            if (!accountHash) {
                res.status(400).json({
                    error: 'Missing accountHash parameter'
                });
                return;
            }

            const request: OwnerTokenAccountsRequest = {
                accountHash,
                tokenType: tokenType as TokenType
            };

            const result = await SolanaFMModel.getOwnerTokenAccounts(request);
            
            if (!result.tokens || Object.keys(result.tokens).length === 0) {
                res.status(404).json({
                    error: 'No token accounts found for the specified account'
                });
                return;
            }

            console.log('[SolanaFMController] Successfully got owner token accounts:', {
                pubkey: result.pubkey,
                tokenCount: Object.keys(result.tokens).length
            });

            res.json(result);
        } catch (error) {
            console.error('[SolanaFMController] Error getting owner token accounts:', error);
            if (error instanceof Error) {
                if (error.message.includes('Invalid response format')) {
                    res.status(502).json({
                        error: 'Invalid response from SolanaFM API'
                    });
                } else if (error.message.includes('Unauthorized')) {
                    res.status(401).json({
                        error: 'Unauthorized access to SolanaFM API'
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

    async getTokenInfo(req: Request, res: Response): Promise<void> {
        try {
            console.log('[SolanaFMController] Getting token info...');
            const { tokenHash } = req.params;

            if (!tokenHash) {
                res.status(400).json({
                    error: 'Missing tokenHash parameter'
                });
                return;
            }

            const request: TokenInfoRequest = {
                tokenHash
            };

            const result = await SolanaFMModel.getTokenInfo(request);
            
            if (!result.result) {
                res.status(404).json({
                    error: 'Token not found'
                });
                return;
            }

            console.log('[SolanaFMController] Successfully got token info:', {
                tokenHash: result.result.tokenHash,
                tokenName: result.result.data.tokenName
            });

            res.json(result);
        } catch (error) {
            console.error('[SolanaFMController] Error getting token info:', error);
            if (error instanceof Error) {
                if (error.message.includes('Invalid response format')) {
                    res.status(502).json({
                        error: 'Invalid response from SolanaFM API'
                    });
                } else if (error.message.includes('Unauthorized')) {
                    res.status(401).json({
                        error: 'Unauthorized access to SolanaFM API'
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

    async getTokenSupply(req: Request, res: Response): Promise<void> {
        try {
            console.log('[SolanaFMController] Getting token supply...');
            const { tokenHash } = req.params;

            if (!tokenHash) {
                res.status(400).json({
                    error: 'Missing tokenHash parameter'
                });
                return;
            }

            const request: TokenSupplyRequest = {
                tokenHash
            };

            const result = await SolanaFMModel.getTokenSupply(request);
            
            console.log('[SolanaFMController] Successfully got token supply:', {
                tokenHash,
                circulatingSupply: result.circulatingSupply
            });

            res.json(result);
        } catch (error) {
            console.error('[SolanaFMController] Error getting token supply:', error);
            if (error instanceof Error) {
                if (error.message.includes('Invalid response format')) {
                    res.status(502).json({
                        error: 'Invalid response from SolanaFM API'
                    });
                } else if (error.message.includes('Unauthorized')) {
                    res.status(401).json({
                        error: 'Unauthorized access to SolanaFM API'
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

    async getActions(req: Request, res: Response): Promise<void> {
        try {
            console.log('[SolanaFMController] Getting available actions...');
            
            const result = await SolanaFMModel.getActions();
            
            console.log('[SolanaFMController] Successfully got actions:', {
                count: result.length
            });

            res.json(result);
        } catch (error) {
            console.error('[SolanaFMController] Error getting actions:', error);
            if (error instanceof Error) {
                if (error.message.includes('Invalid response format')) {
                    res.status(502).json({
                        error: 'Invalid response from SolanaFM API'
                    });
                } else if (error.message.includes('Unauthorized')) {
                    res.status(401).json({
                        error: 'Unauthorized access to SolanaFM API'
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

    async getTransfer(req: Request, res: Response): Promise<void> {
        try {
            console.log('[SolanaFMController] Getting transfer details...');
            const { hash } = req.params;

            if (!hash) {
                res.status(400).json({
                    error: 'Missing hash parameter'
                });
                return;
            }

            const request: TransferRequest = {
                hash
            };

            const result = await SolanaFMModel.getTransfer(request);
            
            if (!result.result) {
                res.status(404).json({
                    error: 'Transfer not found'
                });
                return;
            }

            console.log('[SolanaFMController] Successfully got transfer details:', {
                transactionHash: result.result.transactionHash,
                dataCount: result.result.data.length
            });

            res.json(result);
        } catch (error) {
            console.error('[SolanaFMController] Error getting transfer details:', error);
            if (error instanceof Error) {
                if (error.message.includes('Invalid response format')) {
                    res.status(502).json({
                        error: 'Invalid response from SolanaFM API'
                    });
                } else if (error.message.includes('Unauthorized')) {
                    res.status(401).json({
                        error: 'Unauthorized access to SolanaFM API'
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
} 