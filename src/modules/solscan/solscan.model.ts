import { solscanService } from './solscan.service';
import { SolscanAccountDetailResponse, SolscanAccountTransactionsResponse, SolscanPortfolioResponse, SolscanTokenAccountsResponse, 
    SolscanStakeAccountsResponse,
    SolscanTransferRequest,
    SolscanTransferResponse,
    DefiActivitiesRequest,
    DefiActivitiesResponse,
    TokenMetadataMultiResponse,
    TokenPriceMultiResponse,
    TokenHoldersResponse,
    TokenTransferRequest,
    TokenTransferResponse,
    TokenDefiActivitiesRequest,
    TokenDefiActivitiesResponse,
    LastTransactionsRequest,
    LastTransactionsResponse,
    TransactionDetailResponse,
    BlockTransactionsResponse,
    LastBlocksResponse,
    BlockDetailResponse,
    TransactionActionsResponse,
    MarketListResponse,
    MarketInfoResponse,
    MarketVolumeResponse

  } from './solscan.schema';

export class SolscanModel {
    static async getAccountDetail(address: string): Promise<SolscanAccountDetailResponse> {
        try {
            console.log('[SolscanModel] Getting account detail...', { address });
            
            const result = await solscanService.getAccountDetail(address);
            
            console.log('[SolscanModel] Successfully got account detail:', {
                address: result.data.address
            });

            return result;
        } catch (error) {
            console.error('[SolscanModel] Error getting account detail:', error);
            throw error;
        }
    }

    static async getAccountTransactions(address: string, limit?: number): Promise<SolscanAccountTransactionsResponse> {
        try {
            console.log('[SolscanModel] Getting account transactions...', { address, limit });
            
            const result = await solscanService.getAccountTransactions({ address, limit });
            
            console.log('[SolscanModel] Successfully got account transactions:', {
                count: result.data.length
            });

            return result;
        } catch (error) {
            console.error('[SolscanModel] Error getting account transactions:', error);
            throw error;
        }
    }

    static async getPortfolio(address: string): Promise<SolscanPortfolioResponse> {
        try {
            console.log('[SolscanModel] Getting portfolio...', { address });
            
            const result = await solscanService.getPortfolio(address);
            
            console.log('[SolscanModel] Successfully got portfolio:', {
                address,
                totalValue: result.data.total_value,
                tokenCount: result.data.tokens.length
            });

            return result;
        } catch (error) {
            console.error('[SolscanModel] Error getting portfolio:', error);
            throw error;
        }
    }


    static async getTokenAccounts(
        address: string,
        type: 'token' | 'nft',
        page: number = 1,
        pageSize: 10 | 20 | 30 | 40 = 10,
        hideZero: boolean = true
    ): Promise<SolscanTokenAccountsResponse> {
        try {
            console.log('[SolscanModel] Getting token accounts...', { 
                address, type, page, pageSize, hideZero 
            });
            
            const result = await solscanService.getTokenAccounts({
                address,
                type,
                page,
                page_size: pageSize,
                hide_zero: hideZero
            });
            
            console.log('[SolscanModel] Successfully got token accounts:', {
                count: result.data.length
            });
    
            return result;
        } catch (error) {
            console.error('[SolscanModel] Error getting token accounts:', error);
            throw error;
        }
    }




    static async getStakeAccounts(
        address: string,
        page: number = 1,
        pageSize: 10 | 20 | 30 | 40 = 10
    ): Promise<SolscanStakeAccountsResponse> {
        try {
            console.log('[SolscanModel] Getting stake accounts...', { 
                address, page, pageSize 
            });
            
            const result = await solscanService.getStakeAccounts({
                address,
                page,
                page_size: pageSize
            });
            
            console.log('[SolscanModel] Successfully got stake accounts:', {
                count: result.data.length
            });
    
            return result;
        } catch (error) {
            console.error('[SolscanModel] Error getting stake accounts:', error);
            throw error;
        }
    }



    static async getTransfers(
        address: string,
        options: Omit<SolscanTransferRequest, 'address'> = {}
    ): Promise<SolscanTransferResponse> {
        try {
            console.log('[SolscanModel] Getting transfers...', { 
                address,
                ...options
            });
            
            const result = await solscanService.getTransfers({
                address,
                ...options
            });
            
            console.log('[SolscanModel] Successfully got transfers:', {
                count: result.data.length
            });
    
            return result;
        } catch (error) {
            console.error('[SolscanModel] Error getting transfers:', error);
            throw error;
        }
    }

    static async getDefiActivities(
        address: string,
        options: Omit<DefiActivitiesRequest, 'address'> = {}
    ): Promise<DefiActivitiesResponse> {
        try {
            console.log('[SolscanModel] Getting DeFi activities...', { 
                address,
                ...options
            });
            
            const result = await solscanService.getDefiActivities({
                address,
                ...options
            });
            
            console.log('[SolscanModel] Successfully got DeFi activities:', {
                count: result.data.length
            });

            return result;
        } catch (error) {
            console.error('[SolscanModel] Error getting DeFi activities:', error);
            throw error;
        }
    }

    static async getTokenMetadataMulti(addresses: string[]): Promise<TokenMetadataMultiResponse> {
        try {
            if (!addresses.length || addresses.length > 20) {
                throw new Error('Number of addresses must be between 1 and 20');
            }

            console.log('[SolscanModel] Getting token metadata multi...', { 
                addressCount: addresses.length 
            });
            
            const result = await solscanService.getTokenMetadataMulti({
                address: addresses
            });
            
            console.log('[SolscanModel] Successfully got token metadata:', {
                count: result.data.length
            });

            return result;
        } catch (error) {
            console.error('[SolscanModel] Error getting token metadata:', error);
            throw error;
        }
    }

    static async getTokenPriceMulti(
        addresses: string[],
        fromTime?: number,
        toTime?: number
    ): Promise<TokenPriceMultiResponse> {
        try {
            if (!addresses.length || addresses.length > 20) {
                throw new Error('Number of addresses must be between 1 and 20');
            }

            console.log('[SolscanModel] Getting token price multi...', { 
                addressCount: addresses.length,
                fromTime,
                toTime
            });
            
            const result = await solscanService.getTokenPriceMulti({
                address: addresses,
                from_time: fromTime,
                to_time: toTime
            });
            
            console.log('[SolscanModel] Successfully got token prices:', {
                count: result.data.length
            });

            return result;
        } catch (error) {
            console.error('[SolscanModel] Error getting token prices:', error);
            throw error;
        }
    }

    static async getTokenHolders(
        address: string,
        page: number = 1,
        pageSize: 10 | 20 | 30 | 40 = 10,
        fromAmount?: string,
        toAmount?: string
    ): Promise<TokenHoldersResponse> {
        try {
            console.log('[SolscanModel] Getting token holders...', { 
                address,
                page,
                pageSize,
                fromAmount,
                toAmount
            });
            
            const result = await solscanService.getTokenHolders({
                address,
                page,
                page_size: pageSize,
                from_amount: fromAmount,
                to_amount: toAmount
            });
            
            console.log('[SolscanModel] Successfully got token holders:', {
                total: result.data.total,
                count: result.data.items.length
            });

            return result;
        } catch (error) {
            console.error('[SolscanModel] Error getting token holders:', error);
            throw error;
        }
    }

    static async getTokenTransfer(
        address: string,
        options: Omit<TokenTransferRequest, 'address'> = {}
    ): Promise<TokenTransferResponse> {
        try {
            console.log('[SolscanModel] Getting token transfers...', { 
                address,
                ...options
            });
            
            const result = await solscanService.getTokenTransfer({
                address,
                ...options
            });
            
            console.log('[SolscanModel] Successfully got token transfers:', {
                count: result.data.length
            });

            return result;
        } catch (error) {
            console.error('[SolscanModel] Error getting token transfers:', error);
            throw error;
        }
    }

    static async getTokenDefiActivities(
        address: string,
        options: Omit<TokenDefiActivitiesRequest, 'address'> = {}
    ): Promise<TokenDefiActivitiesResponse> {
        try {
            console.log('[SolscanModel] Getting token DeFi activities...', { 
                address,
                ...options
            });
            
            const result = await solscanService.getTokenDefiActivities({
                address,
                ...options
            });
            
            console.log('[SolscanModel] Successfully got token DeFi activities:', {
                count: result.data.length
            });

            return result;
        } catch (error) {
            console.error('[SolscanModel] Error getting token DeFi activities:', error);
            throw error;
        }
    }

    static async getLastTransactions(
        limit: 10 | 20 | 30 | 40 | 60 | 100 = 10,
        filter: 'exceptVote' | 'all' = 'exceptVote'
    ): Promise<LastTransactionsResponse> {
        try {
            console.log('[SolscanModel] Getting last transactions...', { 
                limit,
                filter
            });
            
            const result = await solscanService.getLastTransactions({
                limit,
                filter
            });
            
            console.log('[SolscanModel] Successfully got last transactions:', {
                count: result.data.length
            });

            return result;
        } catch (error) {
            console.error('[SolscanModel] Error getting last transactions:', error);
            throw error;
        }
    }


    static async getTransactionDetail(tx: string): Promise<TransactionDetailResponse> {
        try {
            console.log('[SolscanModel] Getting transaction detail...', { tx });
            
            const result = await solscanService.getTransactionDetail(tx);
            
            console.log('[SolscanModel] Successfully got transaction detail:', {
                tx_hash: result.data.tx_hash,
                block_time: result.data.block_time,
                status: result.data.tx_status
            });
    
            return result;
        } catch (error) {
            console.error('[SolscanModel] Error getting transaction detail:', error);
            throw error;
        }
    }




    static async getTransactionActions(tx: string): Promise<TransactionActionsResponse> {
        try {
            console.log('[SolscanModel] Getting transaction actions...', { tx });
            
            const result = await solscanService.getTransactionActions(tx);
            
            console.log('[SolscanModel] Successfully got transaction actions:', {
                tx_hash: result.data.tx_hash,
                activities_count: result.data.activities.length,
                transfers_count: result.data.transfers.length
            });
    
            return result;
        } catch (error) {
            console.error('[SolscanModel] Error getting transaction actions:', error);
            throw error;
        }
    }





    static async getLastBlocks(
        limit: 10 | 20 | 30 | 40 | 60 | 100 = 10
    ): Promise<LastBlocksResponse> {
        try {
            console.log('[SolscanModel] Getting last blocks...', { limit });
            
            const result = await solscanService.getLastBlocks({ limit });
            
            console.log('[SolscanModel] Successfully got last blocks:', {
                count: result.data.length
            });
    
            return result;
        } catch (error) {
            console.error('[SolscanModel] Error getting last blocks:', error);
            throw error;
        }
    }

    




    static async getBlockTransactions(
        block: number,
        page: number = 1,
        pageSize: 10 | 20 | 30 | 40 | 60 | 100 = 10,
        excludeVote?: boolean,
        program?: string
    ): Promise<BlockTransactionsResponse> {
        try {
            console.log('[SolscanModel] Getting block transactions...', { 
                block, page, pageSize, excludeVote, program 
            });
            
            const result = await solscanService.getBlockTransactions({
                block,
                page,
                page_size: pageSize,
                exclude_vote: excludeVote,
                program
            });
            
            console.log('[SolscanModel] Successfully got block transactions:', {
                total: result.data.total,
                count: result.data.transactions.length
            });
    
            return result;
        } catch (error) {
            console.error('[SolscanModel] Error getting block transactions:', error);
            throw error;
        }
    } 


    static async getBlockDetail(block: number): Promise<BlockDetailResponse> {
        try {
            console.log('[SolscanModel] Getting block detail...', { block });
            
            const result = await solscanService.getBlockDetail({ block });
            
            console.log('[SolscanModel] Successfully got block detail:', {
                slot: result.data.slot,
                blockhash: result.data.blockhash
            });
    
            return result;
        } catch (error) {
            console.error('[SolscanModel] Error getting block detail:', error);
            throw error;
        }
    }











    static async getMarketList(
        page: number = 1,
        pageSize: 10 | 20 | 30 | 40 | 60 | 100 = 10,
        program?: string,
        tokenAddress?: string,
        sortBy: 'created_time' | 'volumes_24h' | 'trades_24h' = 'created_time',
        sortOrder: 'asc' | 'desc' = 'desc'
    ): Promise<MarketListResponse> {
        try {
            console.log('[SolscanModel] Getting market list...', { 
                page, pageSize, program, tokenAddress, sortBy, sortOrder 
            });
            
            const result = await solscanService.getMarketList({
                page,
                page_size: pageSize,
                program,
                token_address: tokenAddress,
                sort_by: sortBy,
                sort_order: sortOrder
            });
            
            console.log('[SolscanModel] Successfully got market list:', {
                count: result.data.length
            });
    
            return result;
        } catch (error) {
            console.error('[SolscanModel] Error getting market list:', error);
            throw error;
        }
    }



    static async getMarketInfo(address: string): Promise<MarketInfoResponse> {
        try {
            console.log('[SolscanModel] Getting market info...', { address });
            
            const result = await solscanService.getMarketInfo({ address });
            
            console.log('[SolscanModel] Successfully got market info:', {
                pool_address: result.data.pool_address,
                program_id: result.data.program_id
            });
    
            return result;
        } catch (error) {
            console.error('[SolscanModel] Error getting market info:', error);
            throw error;
        }
    }
    
    static async getMarketVolume(
        address: string,
        time?: [string, string]
    ): Promise<MarketVolumeResponse> {
        try {
            console.log('[SolscanModel] Getting market volume...', { 
                address,
                time 
            });
            
            const result = await solscanService.getMarketVolume({
                address,
                time
            });
            
            console.log('[SolscanModel] Successfully got market volume:', {
                pool_address: result.data.pool_address,
                volume_24h: result.data.total_volume_24h
            });
    
            return result;
        } catch (error) {
            console.error('[SolscanModel] Error getting market volume:', error);
            throw error;
        }
    }


} 