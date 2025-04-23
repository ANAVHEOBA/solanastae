import axios from 'axios';
import { environment } from '../config/environment';
import * as http from 'http';
import * as https from 'https';
import * as dns from 'dns';
import WebSocket from 'ws';
import { EventEmitter } from 'events';
import { ClusterNode } from '../modules/network/network.schema';
import { Transaction } from '../modules/validator/validator.schema';

interface VoteAccountParams {
    votePubkey?: string;
    keepUnstakedDelinquents?: boolean;
    delinquentSlotDistance?: number;
}

interface EpochInfo {
    absoluteSlot: number;
    blockHeight: number;
    epoch: number;
    slotIndex: number;
    slotsInEpoch: number;
    transactionCount: number;
}

interface EpochInfoParams {
    commitment?: 'processed' | 'confirmed' | 'finalized';
    minContextSlot?: number;
}

interface EpochCredit {
    epoch: number;
    credits: number;
    previousCredits: number;
}

interface VoteAccount {
    votePubkey: string;
    nodePubkey: string;
    activatedStake: number;
    epochVoteAccount: boolean;
    commission: number;
    lastVote: number;
    epochCredits: EpochCredit[];
    rootSlot: number;
}

interface VoteAccountsResponse {
    current: VoteAccount[];
    delinquent: VoteAccount[];
}

interface RPCResponse<T> {
    jsonrpc: string;
    id: number;
    result: T;
    error?: {
        code: number;
        message: string;
    };
}

interface InflationRate {
    total: number;
    validator: number;
    foundation: number;
    epoch: number;
}

interface InflationReward {
    epoch: number;
    effectiveSlot: number;
    amount: number;
    postBalance: number;
    commission?: number;
}

interface AccountInfo {
    data: string | null;
    executable: boolean;
    lamports: number;
    owner: string;
    rentEpoch: number;
}

interface AccountInfoParams {
    encoding?: 'base58' | 'base64' | 'jsonParsed';
    commitment?: 'processed' | 'confirmed' | 'finalized';
    dataSlice?: {
        offset: number;
        length: number;
    };
    minContextSlot?: number;
}

interface ProgramAccount {
    pubkey: string;
    account: {
        lamports: number;
        owner: string;
        data: [string, string];
        executable: boolean;
        rentEpoch: number;
        space: number;
    };
}

interface ProgramAccountsParams {
    encoding?: 'base58' | 'base64' | 'jsonParsed';
    commitment?: 'processed' | 'confirmed' | 'finalized';
    dataSlice?: {
        offset: number;
        length: number;
    };
    filters?: Array<{
        memcmp?: {
            offset: number;
            bytes: string;
        };
        dataSize?: number;
    }>;
    minContextSlot?: number;
}

interface BalanceResponse {
    context: {
        slot: number;
    };
    value: number;
}

interface TokenAccountBalance {
    context: {
        slot: number;
    };
    value: {
        amount: string;
        decimals: number;
        uiAmount: number;
        uiAmountString: string;
    };
}

interface AccountSubscribeParams {
    encoding?: 'base58' | 'base64' | 'base64+zstd' | 'jsonParsed';
    commitment?: 'processed' | 'confirmed' | 'finalized';
}

interface AccountNotification {
    context: {
        slot: number;
    };
    value: {
        data: [string, string] | {
            program: string;
            parsed: any;
        };
        executable: boolean;
        lamports: number;
        owner: string;
        rentEpoch: number;
        space: number;
    };
}

interface VoteNotification {
    hash: string;
    slots: number[];
    timestamp: number | null;
    signature: string;
    votePubkey: string;
}

interface BlockProductionParams {
    commitment?: 'processed' | 'confirmed' | 'finalized';
    minContextSlot?: number;
}

interface BlockProductionResponse {
    context: {
        slot: number;
    };
    value: {
        byIdentity: {
            [key: string]: [number, number]; // [blocks, slots]
        };
        range: {
            firstSlot: number;
            lastSlot: number;
        };
    };
}

interface SupplyParams {
    commitment?: 'processed' | 'confirmed' | 'finalized';
    minContextSlot?: number;
}

interface RPCSupplyResponse {
    context: {
        slot: number;
    };
    value: {
        total: number;
        circulating: number;
        nonCirculating: number;
        nonCirculatingAccounts?: string[];
    };
}

interface RPCVersionResponse {
    version: string;
    feature_set: number;
}

interface StakeMinimumDelegationResponse {
    jsonrpc: string;
    id: number;
    result: {
        context: {
            slot: number;
        };
        value: number;
    };
    error?: {
        code: number;
        message: string;
    };
}

interface LargestAccount {
    lamports: number;
    address: string;
}

interface LargestAccountsResponse {
    jsonrpc: string;
    id: number;
    result: {
        context: {
            slot: number;
        };
        value: LargestAccount[];
    };
    error?: {
        code: number;
        message: string;
    };
}

interface LeaderScheduleResponse {
    jsonrpc: string;
    id: number;
    result: {
        [key: string]: number[];
    } | null;
    error?: {
        code: number;
        message: string;
    };
}

interface SlotLeadersResponse {
    jsonrpc: string;
    id: number;
    result: string[];
    error?: {
        code: number;
        message: string;
    };
}

export interface SignatureStatus {
    slot: number;
    confirmations: number | null;
    err: any | null;
    status: {
        Ok: null;
    } | {
        Err: any;
    } | null;
}

interface SignatureStatusesResponse {
    jsonrpc: string;
    id: number;
    result: {
        context: {
            slot: number;
        };
        value: (SignatureStatus | null)[];
    };
    error?: {
        code: number;
        message: string;
    };
}

interface TransactionResponse {
    jsonrpc: string;
    id: number;
    result: Transaction | null;
    error?: {
        code: number;
        message: string;
    };
}

interface PrioritizationFee {
    account: string;
    fee: number;
    slot: number;
}

interface PrioritizationFeesResponse {
    jsonrpc: string;
    id: number;
    result: PrioritizationFee[];
    error?: {
        code: number;
        message: string;
    };
}

interface SlotResponse {
    jsonrpc: string;
    id: number;
    result: number;
    error?: {
        code: number;
        message: string;
    };
}

interface BlockTimeResponse {
    jsonrpc: string;
    id: number;
    result: number | null;
    error?: {
        code: number;
        message: string;
    };
}

export interface TokenAccount {
    pubkey: string;
    account: {
        lamports: number;
        owner: string;
        data: {
            program: string;
            parsed: {
                info: {
                    isNative: boolean;
                    mint: string;
                    owner: string;
                    state: string;
                    tokenAmount: {
                        amount: string;
                        decimals: number;
                        uiAmount: number;
                        uiAmountString: string;
                    };
                };
            };
            space: number;
        };
        executable: boolean;
        rentEpoch: number;
        space: number;
    };
}

export interface TokenAccountsResponse {
    context: {
        apiVersion: string;
        slot: number;
    };
    value: TokenAccount[];
}

interface TokenSupplyResponse {
    context: {
        slot: number;
    };
    value: {
        amount: string;
        decimals: number;
        uiAmount: number;
        uiAmountString: string;
    };
}

interface MultipleAccountsResponse {
    context: {
        apiVersion: string;
        slot: number;
    };
    value: (AccountInfo | null)[];
}

interface SignatureSubscribeParams {
    commitment?: 'processed' | 'confirmed' | 'finalized';
    enableReceivedNotification?: boolean;
}

class RPCService extends EventEmitter {
    private readonly rpcUrl: string;
    private readonly apiKey: string;
    private readonly maxRetries = 3;
    private readonly timeout = 30000; // 30 seconds
    private readonly httpsAgent: https.Agent;
    private ws: WebSocket | null = null;
    private subscriptions: Map<number, { type: 'account' | 'vote' | 'slot' | 'signature', pubkey?: string, signature?: string }> = new Map();
    private nextSubscriptionId = 1;
    private reconnectAttempts = 0;

    constructor() {
        super();
        // Force IPv4 DNS resolution
        dns.setDefaultResultOrder('ipv4first');
        
        // Remove any existing api-key parameter to avoid duplication
        const baseUrl = environment.solana.rpcUrl.split('?')[0];
        this.rpcUrl = baseUrl;
        this.apiKey = environment.solana.heliusApiKey;
        
        // Configure HTTPS agent with keepAlive and other optimizations
        this.httpsAgent = new https.Agent({
            keepAlive: true,
            keepAliveMsecs: 1000,
            timeout: this.timeout,
            family: 4, // Force IPv4
            maxSockets: 100
        });

        // Initialize WebSocket connection
        this.initializeWebSocket().catch(error => {
            console.error('[RPC] Failed to initialize WebSocket:', error);
        });

        console.log('[RPC] Service initialized with URL:', this.rpcUrl);
    }

    private async initializeWebSocket() {
        try {
            const wsUrl = this.rpcUrl
                .replace('https://', 'wss://')
                .replace('http://', 'ws://');
            const fullWsUrl = `${wsUrl}/?api-key=${this.apiKey}`;
            
            console.log('[RPC] Initializing WebSocket connection...');
            
            // Resolve the hostname first
            const hostname = new URL(wsUrl).hostname;
            const addresses = await new Promise<string[]>((resolve, reject) => {
                dns.resolve4(hostname, (err, addresses) => {
                    if (err) reject(err);
                    else resolve(addresses);
                });
            });
            
            console.log(`[RPC] Resolved WebSocket host to IPv4 addresses:`, addresses);

            this.ws = new WebSocket(fullWsUrl, {
                handshakeTimeout: this.timeout,
                headers: {
                    'Origin': 'https://mainnet.helius-rpc.com'
                },
                agent: this.httpsAgent,
                followRedirects: true
            });

            this.ws.on('open', () => {
                console.log('[RPC] WebSocket connection established');
                this.emit('ws_connected');
            });

            this.ws.on('message', (data: string) => {
                try {
                    const message = JSON.parse(data);
                    console.log('[RPC] WebSocket message received:', message);
                    
                    if (message.method === 'accountNotification') {
                        const { subscription, result } = message.params;
                        const sub = this.subscriptions.get(subscription);
                        if (sub?.type === 'account' && sub.pubkey) {
                            this.emit(`account:${sub.pubkey}`, result);
                        }
                    } else if (message.method === 'voteNotification') {
                        const { subscription, result } = message.params;
                        const sub = this.subscriptions.get(subscription);
                        if (sub?.type === 'vote') {
                            this.emit('vote', result);
                        }
                    } else if (message.method === 'slotNotification') {
                        const { subscription, result } = message.params;
                        const sub = this.subscriptions.get(subscription);
                        if (sub?.type === 'slot') {
                            this.emit('slot', result);
                        }
                    }
                } catch (error) {
                    console.error('[RPC] Error processing WebSocket message:', error);
                }
            });

            this.ws.on('close', (code: number, reason: Buffer) => {
                console.log('[RPC] WebSocket connection closed:', {
                    code,
                    reason: reason.toString(),
                    readyState: this.ws?.readyState
                });
                this.emit('ws_disconnected');

                // Only attempt to reconnect if we haven't been intentionally closed
                if (code !== 1000) {
                    const delay = Math.min(5000 * Math.pow(2, this.reconnectAttempts), 30000);
                    console.log(`[RPC] Attempting to reconnect in ${delay}ms... (attempt ${this.reconnectAttempts + 1})`);
                    setTimeout(() => {
                        this.reconnectAttempts++;
                        this.initializeWebSocket().catch(error => {
                            console.error('[RPC] Reconnection attempt failed:', error);
                        });
                    }, delay);
                }
            });

            this.ws.on('error', (error) => {
                console.error('[RPC] WebSocket error:', {
                    message: error instanceof Error ? error.message : 'Unknown error',
                    stack: error instanceof Error ? error.stack : undefined,
                    code: (error as any)?.code,
                    type: error instanceof Error ? error.constructor.name : typeof error
                });
                this.emit('ws_error', error);
            });

            this.ws.on('ping', () => {
                console.log('[RPC] Received ping from server');
                if (this.ws?.readyState === WebSocket.OPEN) {
                    this.ws.pong();
                }
            });

            this.ws.on('pong', () => {
                console.log('[RPC] Received pong from server');
            });

        } catch (error) {
            console.error('[RPC] Error initializing WebSocket:', error);
            throw error;
        }
    }

    async subscribeToAccount(pubkey: string, params?: AccountSubscribeParams): Promise<number> {
        if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
            throw new Error('WebSocket connection not ready');
        }

        const subscriptionId = this.nextSubscriptionId++;
        const request = {
            jsonrpc: '2.0',
            id: subscriptionId,
            method: 'accountSubscribe',
            params: [
                pubkey,
                params || { encoding: 'jsonParsed', commitment: 'finalized' }
            ]
        };

        return new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
                reject(new Error('Subscription request timed out'));
            }, this.timeout);

            const messageHandler = (data: string) => {
                try {
                    const response = JSON.parse(data);
                    if (response.id === subscriptionId) {
                        clearTimeout(timeout);
                        this.ws!.removeListener('message', messageHandler);

                        if (response.error) {
                            reject(new Error(response.error.message));
                            return;
                        }

                        this.subscriptions.set(response.result, { type: 'account', pubkey });
                        resolve(response.result);
                    }
                } catch (error) {
                    console.error('[RPC] Error processing subscription response:', error);
                }
            };

            this.ws!.on('message', messageHandler);
            this.ws!.send(JSON.stringify(request));
        });
    }

    async unsubscribeFromAccount(subscriptionId: number): Promise<boolean> {
        if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
            throw new Error('WebSocket connection not ready');
        }

        const subscription = this.subscriptions.get(subscriptionId);
        if (!subscription || subscription.type !== 'account') {
            throw new Error('Invalid account subscription ID');
        }

        const request = {
            jsonrpc: '2.0',
            id: this.nextSubscriptionId++,
            method: 'accountUnsubscribe',
            params: [subscriptionId]
        };

        return new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
                reject(new Error('Unsubscribe request timed out'));
            }, this.timeout);

            const messageHandler = (data: string) => {
                try {
                    const response = JSON.parse(data);
                    if (response.id === request.id) {
                        clearTimeout(timeout);
                        this.ws!.removeListener('message', messageHandler);

                        if (response.error) {
                            reject(new Error(response.error.message));
                            return;
                        }

                        this.subscriptions.delete(subscriptionId);
                        resolve(response.result);
                    }
                } catch (error) {
                    console.error('[RPC] Error processing unsubscribe response:', error);
                }
            };

            this.ws!.on('message', messageHandler);
            this.ws!.send(JSON.stringify(request));
        });
    }

    async subscribeToVotes(): Promise<number> {
        if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
            throw new Error('WebSocket connection not ready');
        }

        const subscriptionId = this.nextSubscriptionId++;
        const request = {
            jsonrpc: '2.0',
            id: subscriptionId,
            method: 'voteSubscribe',
            params: []
        };

        return new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
                reject(new Error('Vote subscription request timed out'));
            }, this.timeout);

            const messageHandler = (data: string) => {
                try {
                    const response = JSON.parse(data);
                    if (response.id === subscriptionId) {
                        clearTimeout(timeout);
                        this.ws!.removeListener('message', messageHandler);

                        if (response.error) {
                            if (response.error.message?.includes('Method not found')) {
                                reject(new Error('Vote subscription is not supported by this RPC endpoint'));
                            } else {
                                reject(new Error(response.error.message));
                            }
                            return;
                        }

                        this.subscriptions.set(response.result, { type: 'vote' });
                        resolve(response.result);
                    }
                } catch (error) {
                    console.error('[RPC] Error processing vote subscription response:', error);
                }
            };

            this.ws!.on('message', messageHandler);
            this.ws!.send(JSON.stringify(request));
        });
    }

    async unsubscribeFromVotes(subscriptionId: number): Promise<boolean> {
        if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
            throw new Error('WebSocket connection not ready');
        }

        const subscription = this.subscriptions.get(subscriptionId);
        if (!subscription || subscription.type !== 'vote') {
            throw new Error('Invalid vote subscription ID');
        }

        const request = {
            jsonrpc: '2.0',
            id: this.nextSubscriptionId++,
            method: 'voteUnsubscribe',
            params: [subscriptionId]
        };

        return new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
                reject(new Error('Vote unsubscribe request timed out'));
            }, this.timeout);

            const messageHandler = (data: string) => {
                try {
                    const response = JSON.parse(data);
                    if (response.id === request.id) {
                        clearTimeout(timeout);
                        this.ws!.removeListener('message', messageHandler);

                        if (response.error) {
                            reject(new Error(response.error.message));
                            return;
                        }

                        this.subscriptions.delete(subscriptionId);
                        resolve(response.result);
                    }
                } catch (error) {
                    console.error('[RPC] Error processing vote unsubscribe response:', error);
                }
            };

            this.ws!.on('message', messageHandler);
            this.ws!.send(JSON.stringify(request));
        });
    }

    async subscribeToSlots(): Promise<number> {
        if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
            throw new Error('WebSocket connection is not open');
        }

        const subscriptionId = this.nextSubscriptionId++;
        const request = {
            jsonrpc: '2.0',
            id: subscriptionId,
            method: 'slotSubscribe'
        };

        return new Promise((resolve, reject) => {
            const messageHandler = (data: string) => {
                try {
                    const response = JSON.parse(data);
                    if (response.id === subscriptionId) {
                        if (response.error) {
                            reject(new Error(response.error.message));
                        } else {
                            this.subscriptions.set(response.result, { type: 'slot' });
                            resolve(response.result);
                        }
                        this.ws?.removeListener('message', messageHandler);
                    }
                } catch (error) {
                    console.error('[RPC] Error processing slot subscription response:', error);
                }
            };

            this.ws?.on('message', messageHandler);
            this.ws?.send(JSON.stringify(request));
        });
    }

    async unsubscribeFromSlots(subscriptionId: number): Promise<boolean> {
        if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
            throw new Error('WebSocket connection is not open');
        }

        const request = {
            jsonrpc: '2.0',
            id: this.nextSubscriptionId++,
            method: 'slotUnsubscribe',
            params: [subscriptionId]
        };

        return new Promise((resolve, reject) => {
            const messageHandler = (data: string) => {
                try {
                    const response = JSON.parse(data);
                    if (response.id === request.id) {
                        if (response.error) {
                            reject(new Error(response.error.message));
                        } else {
                            this.subscriptions.delete(subscriptionId);
                            resolve(response.result);
                        }
                        this.ws?.removeListener('message', messageHandler);
                    }
                } catch (error) {
                    console.error('[RPC] Error processing slot unsubscribe response:', error);
                }
            };

            this.ws?.on('message', messageHandler);
            this.ws?.send(JSON.stringify(request));
        });
    }

    private async retryRequest<T>(
        requestFn: () => Promise<T>,
        retryCount = 0,
        maxRetries = 3,
        baseDelay = 1000
    ): Promise<T> {
        try {
            return await requestFn();
        } catch (error) {
            if (retryCount >= maxRetries) {
                throw error;
            }

            const delay = Math.min(baseDelay * Math.pow(2, retryCount), 10000);
            console.log(`[RPC] Request failed, retrying in ${delay}ms (attempt ${retryCount + 1}/${maxRetries})`);
            await new Promise(resolve => setTimeout(resolve, delay));
            return this.retryRequest(requestFn, retryCount + 1, maxRetries, baseDelay);
        }
    }

    private getFullUrl(): string {
        return `${this.rpcUrl}/?api-key=${this.apiKey}`;
    }

    async getVoteAccounts(params?: VoteAccountParams): Promise<VoteAccountsResponse> {
        try {
            const response = await axios.post<RPCResponse<VoteAccountsResponse>>(
                this.getFullUrl(),
                {
                    jsonrpc: '2.0',
                    id: 1,
                    method: 'getVoteAccounts',
                    params: params ? [params] : []
                },
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.data.error) {
                throw new Error(response.data.error.message);
            }

            return response.data.result;
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(`RPC request failed: ${error.message}`);
            }
            throw new Error('An unknown error occurred');
        }
    }

    async getEpochInfo(params?: EpochInfoParams): Promise<EpochInfo> {
        try {
            const response = await axios.post<RPCResponse<EpochInfo>>(
                this.getFullUrl(),
                {
                    jsonrpc: '2.0',
                    id: 1,
                    method: 'getEpochInfo',
                    params: params ? [params] : []
                },
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.data.error) {
                throw new Error(response.data.error.message);
            }

            return response.data.result;
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(`RPC request failed: ${error.message}`);
            }
            throw new Error('An unknown error occurred');
        }
    }

    async getInflationRate(): Promise<InflationRate> {
        try {
            const response = await axios.post<RPCResponse<InflationRate>>(this.getFullUrl(), {
                jsonrpc: '2.0',
                id: 1,
                method: 'getInflationRate'
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.data.error) {
                throw new Error(response.data.error.message);
            }

            return response.data.result;
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(`RPC request failed: ${error.message}`);
            }
            throw new Error('An unknown error occurred');
        }
    }

    async getInflationReward(addresses: string[], params?: { commitment?: string; epoch?: number }): Promise<(InflationReward | null)[]> {
        try {
            const response = await axios.post<RPCResponse<(InflationReward | null)[]>>(this.getFullUrl(), {
                jsonrpc: '2.0',
                id: 1,
                method: 'getInflationReward',
                params: [
                    addresses,
                    {
                        commitment: params?.commitment || 'finalized',
                        epoch: params?.epoch
                    }
                ]
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.data.error) {
                throw new Error(response.data.error.message);
            }

            return response.data.result;
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(`RPC request failed: ${error.message}`);
            }
            throw new Error('An unknown error occurred');
        }
    }

    async getAccountInfo(pubkey: string, params?: AccountInfoParams): Promise<AccountInfo> {
        try {
            const response = await axios.post<RPCResponse<AccountInfo>>(this.getFullUrl(), {
                jsonrpc: '2.0',
                id: 1,
                method: 'getAccountInfo',
                params: [
                    pubkey,
                    {
                        encoding: params?.encoding || 'base58',
                        commitment: params?.commitment || 'finalized',
                        dataSlice: params?.dataSlice,
                        minContextSlot: params?.minContextSlot
                    }
                ]
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.data.error) {
                throw new Error(response.data.error.message);
            }

            return response.data.result;
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(`RPC request failed: ${error.message}`);
            }
            throw new Error('An unknown error occurred');
        }
    }

    async getProgramAccounts(programId: string, params?: ProgramAccountsParams): Promise<ProgramAccount[]> {
        const requestBody = {
            jsonrpc: '2.0',
            id: '1',
            method: 'getProgramAccounts',
            params: [
                programId,
                params ? {
                    encoding: params.encoding || 'base58',
                    commitment: params.commitment || 'finalized',
                    dataSlice: params.dataSlice,
                    filters: params.filters,
                    minContextSlot: params.minContextSlot
                } : {}
            ]
        };

        console.log('[RPC] Getting program accounts for:', programId);
        console.log('[RPC] With params:', JSON.stringify(params));
        console.log('[RPC] Request body:', JSON.stringify(requestBody));

        try {
            const response = await this.retryRequest(async () => {
                const result = await axios.post<RPCResponse<ProgramAccount[]>>(
                    this.getFullUrl(),
                    requestBody,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': '*/*',
                            'Connection': 'keep-alive'
                        },
                        timeout: this.timeout
                    }
                );
                return result;
            });

            console.log('[RPC] Response received:', JSON.stringify(response.data));

            if (response.data.error) {
                console.error('[RPC] RPC Error:', response.data.error);
                throw new Error(response.data.error.message);
            }

            return response.data.result || [];
        } catch (error) {
            console.error('[RPC] Error in getProgramAccounts:', {
                error: error instanceof Error ? error.message : 'Unknown error',
                code: (error as any)?.code,
                type: error instanceof Error ? error.constructor.name : typeof error
            });
            
            if (error && typeof error === 'object' && 'isAxiosError' in error) {
                const axiosError = error as any;
                const errorDetails = {
                    status: axiosError.response?.status,
                    statusText: axiosError.response?.statusText,
                    data: axiosError.response?.data,
                    code: axiosError.code,
                    message: axiosError.message,
                    host: axiosError.request?.host,
                    protocol: axiosError.request?.protocol
                };
                console.error('[RPC] Axios error details:', errorDetails);
                
                // Provide more specific error messages
                if (errorDetails.code === 'ETIMEDOUT') {
                    throw new Error('RPC request timed out. The server is taking too long to respond.');
                } else if (errorDetails.code === 'ECONNREFUSED') {
                    throw new Error('RPC connection refused. The server is not accepting connections.');
                } else if (errorDetails.status === 429) {
                    throw new Error('RPC rate limit exceeded. Please try again later.');
                } else {
                    throw new Error(`RPC request failed: ${errorDetails.message || 'Network error'}`);
                }
            }

            if (error instanceof Error) {
                throw new Error(`RPC request failed: ${error.message}`);
            }

            throw new Error('An unknown error occurred in getProgramAccounts');
        }
    }

    async getBalance(pubkey: string, params?: { commitment?: 'processed' | 'confirmed' | 'finalized' }): Promise<BalanceResponse> {
        try {
            const response = await this.retryRequest(async () => {
                const result = await axios.post<RPCResponse<BalanceResponse>>(
                    this.getFullUrl(),
                    {
                        jsonrpc: '2.0',
                        id: '1',
                        method: 'getBalance',
                        params: [
                            pubkey,
                            params ? { commitment: params.commitment || 'finalized' } : { commitment: 'finalized' }
                        ]
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': '*/*',
                            'Connection': 'keep-alive'
                        },
                        timeout: this.timeout
                    }
                );
                return result;
            });

            if (response.data.error) {
                throw new Error(response.data.error.message);
            }

            return response.data.result;
        } catch (error) {
            console.error('[RPC] Error in getBalance:', {
                error: error instanceof Error ? error.message : 'Unknown error',
                code: (error as any)?.code,
                type: error instanceof Error ? error.constructor.name : typeof error
            });
            
            if (error instanceof Error) {
                throw new Error(`RPC request failed: ${error.message}`);
            }
            throw new Error('An unknown error occurred in getBalance');
        }
    }

    async getTokenAccountBalance(pubkey: string, params?: { commitment?: 'processed' | 'confirmed' | 'finalized' }): Promise<TokenAccountBalance> {
        try {
            const response = await this.retryRequest(async () => {
                const result = await axios.post<RPCResponse<TokenAccountBalance>>(
                    this.getFullUrl(),
                    {
                        jsonrpc: '2.0',
                        id: '1',
                        method: 'getTokenAccountBalance',
                        params: [pubkey]
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': '*/*',
                            'Connection': 'keep-alive'
                        },
                        timeout: this.timeout
                    }
                );
                return result;
            });

            console.log('[RPC] getTokenAccountBalance response:', JSON.stringify(response.data));

            if (response.data.error) {
                throw new Error(response.data.error.message);
            }

            return response.data.result;
        } catch (error) {
            console.error('[RPC] Error in getTokenAccountBalance:', {
                error: error instanceof Error ? error.message : 'Unknown error',
                code: (error as any)?.code,
                type: error instanceof Error ? error.constructor.name : typeof error
            });
            
            if (error instanceof Error) {
                throw new Error(`RPC request failed: ${error.message}`);
            }
            throw new Error('An unknown error occurred in getTokenAccountBalance');
        }
    }

    async getRecentPerformanceSamples(limit?: number): Promise<any[]> {
        try {
            console.log('[RPC] Getting recent performance samples', { limit });
            
            const response = await this.retryRequest(async () => {
                const url = this.getFullUrl();
                const result = await axios.post<RPCResponse<any[]>>(
                    url,
                    {
                        jsonrpc: '2.0',
                        id: 1,
                        method: 'getRecentPerformanceSamples',
                        params: limit ? [limit] : []
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        timeout: this.timeout,
                        httpsAgent: this.httpsAgent
                    } as any
                );
                return result.data;
            });

            if ('error' in response && response.error) {
                throw new Error(response.error.message);
            }

            return 'result' in response ? response.result : [];
        } catch (error) {
            console.error('[RPC] Error getting recent performance samples:', error);
            throw error;
        }
    }

    async getBlockProduction(params?: BlockProductionParams): Promise<RPCResponse<BlockProductionResponse>> {
        try {
            console.log('[RPC] Getting block production', { params });
            
            const response = await this.retryRequest(async () => {
                const result = await axios.post<RPCResponse<BlockProductionResponse>>(
                    this.getFullUrl(),
                    {
                        jsonrpc: '2.0',
                        id: 1,
                        method: 'getBlockProduction',
                        params: params ? [params] : []
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': '*/*',
                            'Connection': 'keep-alive'
                        },
                        timeout: 60000, // Increase timeout to 60 seconds for this heavy operation
                        httpsAgent: this.httpsAgent
                    } as any
                );

                if (!result.data) {
                    throw new Error('No data received from RPC node');
                }

                return result;
            });

            if (response.data.error) {
                throw new Error(response.data.error.message || 'RPC Error');
            }

            return response.data;
        } catch (error) {
            console.error('[RPC] Error getting block production:', {
                error: error instanceof Error ? error.message : 'Unknown error',
                code: (error as any)?.code,
                type: error instanceof Error ? error.constructor.name : typeof error
            });
            
            if (error instanceof Error) {
                if (error.message.includes('ETIMEDOUT')) {
                    throw new Error('Request timed out. The RPC node is taking too long to respond. Please try again later.');
                } else if (error.message.includes('ECONNREFUSED')) {
                    throw new Error('Connection refused. The RPC node is not accepting connections.');
                } else {
                    throw new Error(`RPC request failed: ${error.message}`);
                }
            }
            
            throw new Error('An unexpected error occurred while fetching block production data');
        }
    }

    async getClusterNodes(): Promise<RPCResponse<ClusterNode[]>> {
        try {
            console.log('[RPC] Getting cluster nodes');
            
            const response = await this.retryRequest(async () => {
                const result = await axios.post<RPCResponse<ClusterNode[]>>(
                    this.getFullUrl(),
                    {
                        jsonrpc: '2.0',
                        id: 1,
                        method: 'getClusterNodes'
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': '*/*',
                            'Connection': 'keep-alive'
                        },
                        timeout: 30000,
                        httpsAgent: this.httpsAgent
                    } as any
                );

                if (!result.data) {
                    throw new Error('No data received from RPC node');
                }

                return result;
            });

            if (response.data.error) {
                throw new Error(response.data.error.message || 'RPC Error');
            }

            return response.data;
        } catch (error) {
            console.error('[RPC] Error getting cluster nodes:', {
                error: error instanceof Error ? error.message : 'Unknown error',
                code: (error as any)?.code,
                type: error instanceof Error ? error.constructor.name : typeof error
            });
            
            if (error instanceof Error) {
                if (error.message.includes('ETIMEDOUT')) {
                    throw new Error('Request timed out. The RPC node is taking too long to respond. Please try again later.');
                } else if (error.message.includes('ECONNREFUSED')) {
                    throw new Error('Connection refused. The RPC node is not accepting connections.');
                } else {
                    throw new Error(`RPC request failed: ${error.message}`);
                }
            }
            
            throw new Error('An unexpected error occurred while fetching cluster nodes');
        }
    }

    private getAxiosConfig() {
        return {
            headers: {
                'Content-Type': 'application/json',
                'Accept': '*/*',
                'Connection': 'keep-alive'
            },
            timeout: this.timeout,
            httpsAgent: this.httpsAgent
        } as const;
    }

    async getSupply(params?: SupplyParams): Promise<RPCResponse<RPCSupplyResponse>> {
        try {
            console.log('[RPC] Getting supply information');
            
            const response = await this.retryRequest(async () => {
                const result = await axios.post<RPCResponse<RPCSupplyResponse>>(
                    this.getFullUrl(),
                    {
                        jsonrpc: '2.0',
                        id: 1,
                        method: 'getSupply',
                        params: params ? [params] : []
                    },
                    this.getAxiosConfig()
                );
                return result;
            });

            if (response.data.error) {
                throw new Error(response.data.error.message || 'RPC Error');
            }

            return response.data;
        } catch (error) {
            console.error('[RPC] Error getting supply:', {
                error: error instanceof Error ? error.message : 'Unknown error',
                code: (error as any)?.code,
                type: error instanceof Error ? error.constructor.name : typeof error
            });
            throw error;
        }
    }

    async getVersion(): Promise<RPCResponse<RPCVersionResponse>> {
        try {
            console.log('[RPC] Getting version information');
            
            const response = await this.retryRequest(async () => {
                const result = await axios.post<RPCResponse<RPCVersionResponse>>(
                    this.getFullUrl(),
                    {
                        jsonrpc: '2.0',
                        id: 1,
                        method: 'getVersion'
                    },
                    this.getAxiosConfig()
                );
                return result;
            });

            if (response.data.error) {
                throw new Error(response.data.error.message || 'RPC Error');
            }

            return response.data;
        } catch (error) {
            console.error('[RPC] Error getting version:', {
                error: error instanceof Error ? error.message : 'Unknown error',
                code: (error as any)?.code,
                type: error instanceof Error ? error.constructor.name : typeof error
            });
            throw error;
        }
    }

    async getHealth(): Promise<RPCResponse<string>> {
        try {
            console.log('[RPC] Getting health status');
            
            const response = await this.retryRequest(async () => {
                const result = await axios.post<RPCResponse<string>>(
                    this.getFullUrl(),
                    {
                        jsonrpc: '2.0',
                        id: 1,
                        method: 'getHealth'
                    },
                    this.getAxiosConfig()
                );
                return result;
            });

            if (response.data.error) {
                throw new Error(response.data.error.message || 'RPC Error');
            }

            return response.data;
        } catch (error) {
            console.error('[RPC] Error getting health status:', {
                error: error instanceof Error ? error.message : 'Unknown error',
                code: (error as any)?.code,
                type: error instanceof Error ? error.constructor.name : typeof error
            });
            throw error;
        }
    }

    async getStakeMinimumDelegation(): Promise<number> {
        try {
            console.log('[RPC] Getting stake minimum delegation...');
            const response = await axios.post<StakeMinimumDelegationResponse>(
                this.getFullUrl(),
                {
                    jsonrpc: '2.0',
                    id: 1,
                    method: 'getStakeMinimumDelegation',
                    params: [{
                        commitment: 'finalized'
                    }]
                },
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.data.error) {
                throw new Error(response.data.error.message);
            }

            console.log('[RPC] Successfully got stake minimum delegation:', response.data.result.value);
            return response.data.result.value;
        } catch (error) {
            console.error('[RPC] Error getting stake minimum delegation:', error);
            throw error;
        }
    }

    async getLargestAccounts(params?: { commitment?: string; filter?: string }): Promise<LargestAccount[]> {
        try {
            console.log('[RPC] Getting largest accounts...');
            throw new Error('getLargestAccounts is not supported by this RPC endpoint. Please contact Helius support for access to this method.');
        } catch (error) {
            console.error('[RPC] Error getting largest accounts:', error);
            throw error;
        }
    }

    async getLeaderSchedule(epoch?: number): Promise<{ [key: string]: number[] } | null> {
        return this.retryRequest(async () => {
            try {
                console.log('[RPC] Getting leader schedule...', { epoch });
                const response = await axios.post<LeaderScheduleResponse>(
                    this.getFullUrl(),
                    {
                        jsonrpc: '2.0',
                        id: 1,
                        method: 'getLeaderSchedule',
                        params: [epoch]
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        timeout: 10000 // 10 second timeout
                    }
                );

                if (response.data.error) {
                    throw new Error(response.data.error.message);
                }

                console.log('[RPC] Successfully got leader schedule:', response.data.result);
                return response.data.result;
            } catch (error) {
                console.error('[RPC] Error getting leader schedule:', error);
                throw error;
            }
        });
    }

    async getSlotLeaders(startSlot: number, limit: number): Promise<string[]> {
        try {
            console.log('[RPCService] Getting slot leaders...', { startSlot, limit });
            
            // Get current slot first with retry
            const currentSlotResponse = await this.retryRequest(async () => {
                try {
                    const result = await axios.post<{ jsonrpc: string; id: number; result: number }>(
                        this.getFullUrl(),
                        {
                            jsonrpc: '2.0',
                            id: 1,
                            method: 'getSlot',
                            params: [{ commitment: 'finalized' }]
                        },
                        {
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            timeout: 10000 // 10 second timeout
                        }
                    );
                    return result.data;
                } catch (error) {
                    if (error && typeof error === 'object' && 'isAxiosError' in error) {
                        const axiosError = error as any;
                        console.error('[RPCService] Network error getting current slot:', {
                            code: axiosError.code,
                            message: axiosError.message,
                            response: axiosError.response?.data,
                            status: axiosError.response?.status
                        });
                    }
                    throw error;
                }
            });

            const currentSlot = currentSlotResponse.result;
            console.log('[RPCService] Current slot:', currentSlot);
            
            // Calculate valid slot range
            const maxSlotsInPast = 432000; // Roughly one epoch
            const validStartSlot = Math.max(currentSlot - maxSlotsInPast, 0);
            
            // If no start slot provided, use the valid range
            const actualStartSlot = startSlot || validStartSlot;
            
            // Validate slot range
            if (actualStartSlot >= currentSlot) {
                throw new Error(`Invalid slot range: start slot ${actualStartSlot} must be less than current slot ${currentSlot}`);
            }
            
            if (currentSlot - actualStartSlot > maxSlotsInPast) {
                throw new Error(`Invalid slot range: requested slots are too far in the past. Maximum allowed is ${maxSlotsInPast} slots. Valid range is ${validStartSlot} to ${currentSlot - 1}`);
            }

            // Get slot leaders with retry
            const slotLeadersResponse = await this.retryRequest(async () => {
                try {
                    const result = await axios.post<SlotLeadersResponse>(
                        this.getFullUrl(),
                        {
                            jsonrpc: '2.0',
                            id: 1,
                            method: 'getSlotLeaders',
                            params: [actualStartSlot, limit]
                        },
                        {
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            timeout: 10000 // 10 second timeout
                        }
                    );
                    return result.data;
                } catch (error) {
                    if (error && typeof error === 'object' && 'isAxiosError' in error) {
                        const axiosError = error as any;
                        console.error('[RPCService] Network error getting slot leaders:', {
                            code: axiosError.code,
                            message: axiosError.message,
                            response: axiosError.response?.data,
                            status: axiosError.response?.status
                        });
                    }
                    throw error;
                }
            });

            if (slotLeadersResponse.error) {
                throw new Error(`RPC Error: ${slotLeadersResponse.error.message}`);
            }

            console.log('[RPCService] Successfully got slot leaders:', slotLeadersResponse.result);
            return slotLeadersResponse.result;
        } catch (error: unknown) {
            console.error('[RPCService] Error getting slot leaders:', error);
            if (error instanceof Error) {
                if (error.message.includes('ETIMEDOUT')) {
                    throw new Error('Request timed out. The RPC node is taking too long to respond. Please try again later.');
                } else if (error.message.includes('ENETUNREACH')) {
                    throw new Error('Network error. Unable to reach the RPC node. Please check your internet connection.');
                }
            }
            throw error;
        }
    }

    async getSignatureStatuses(signatures: string[], searchTransactionHistory = true): Promise<(SignatureStatus | null)[]> {
        const maxRetries = 3;
        const baseDelay = 1000; // 1 second

        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                console.log('[RPCService] Getting signature statuses...', { signatures, searchTransactionHistory, attempt });
                const response = await this.retryRequest(async () => {
                    try {
                        const result = await axios.post<SignatureStatusesResponse>(
                            this.getFullUrl(),
                            {
                                jsonrpc: '2.0',
                                id: 1,
                                method: 'getSignatureStatuses',
                                params: [
                                    signatures,
                                    {
                                        searchTransactionHistory
                                    }
                                ]
                            },
                            {
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                timeout: 10000 // 10 second timeout
                            }
                        );
                        return result.data;
                    } catch (error) {
                        if (error && typeof error === 'object' && 'isAxiosError' in error) {
                            const axiosError = error as any;
                            console.error('[RPCService] Network error getting signature statuses:', {
                                code: axiosError.code,
                                message: axiosError.message,
                                response: axiosError.response?.data,
                                status: axiosError.response?.status
                            });
                        }
                        throw error;
                    }
                });

                if (response.error) {
                    throw new Error(`RPC Error: ${response.error.message}`);
                }

                console.log('[RPCService] Successfully got signature statuses:', response.result);
                return response.result.value;
            } catch (error: unknown) {
                console.error(`[RPCService] Error getting signature statuses (attempt ${attempt}/${maxRetries}):`, error);
                
                if (attempt === maxRetries) {
                    if (error instanceof Error) {
                        if (error.message.includes('ETIMEDOUT')) {
                            throw new Error('Request timed out. The RPC node is taking too long to respond. Please try again later.');
                        } else if (error.message.includes('ENETUNREACH')) {
                            throw new Error('Network error. Unable to reach the RPC node. Please check your internet connection.');
                        }
                    }
                    throw error;
                }

                // Calculate exponential backoff delay
                const delay = baseDelay * Math.pow(2, attempt - 1);
                console.log(`[RPCService] Retrying in ${delay}ms...`);
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }

        throw new Error('Failed to get signature statuses after all retry attempts');
    }

    async getTransaction(signature: string, encoding: 'json' | 'base58' | 'base64' = 'json'): Promise<Transaction | null> {
        const maxRetries = 3;
        const baseDelay = 1000; // 1 second

        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                console.log('[RPCService] Getting transaction...', { signature, encoding, attempt });
                const response = await this.retryRequest(async () => {
                    try {
                        const result = await axios.post<TransactionResponse>(
                            this.getFullUrl(),
                            {
                                jsonrpc: '2.0',
                                id: 1,
                                method: 'getTransaction',
                                params: [signature, encoding]
                            },
                            {
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                timeout: 10000 // 10 second timeout
                            }
                        );

                        console.log('[RPCService] Raw RPC response:', {
                            jsonrpc: result.data.jsonrpc,
                            id: result.data.id,
                            hasError: !!result.data.error,
                            hasResult: !!result.data.result,
                            resultSlot: result.data.result?.slot
                        });

                        if (result.data.error) {
                            console.error('[RPCService] RPC error response:', result.data.error);
                            throw new Error(`RPC Error: ${result.data.error.message}`);
                        }

                        return result.data;
                    } catch (error) {
                        if (error && typeof error === 'object' && 'isAxiosError' in error) {
                            const axiosError = error as any;
                            console.error('[RPCService] Network error getting transaction:', {
                                code: axiosError.code,
                                message: axiosError.message,
                                response: axiosError.response?.data,
                                status: axiosError.response?.status
                            });
                        }
                        throw error;
                    }
                });

                if (response.error) {
                    throw new Error(`RPC Error: ${response.error.message}`);
                }

                if (!response.result) {
                    console.log('[RPCService] Transaction not found:', { signature });
                    return null;
                }

                console.log('[RPCService] Successfully got transaction:', {
                    slot: response.result.slot,
                    signature,
                    hasTransaction: !!response.result.transaction,
                    hasMeta: !!response.result.meta
                });

                return response.result;
            } catch (error: unknown) {
                console.error(`[RPCService] Error getting transaction (attempt ${attempt}/${maxRetries}):`, error);
                
                if (attempt === maxRetries) {
                    if (error instanceof Error) {
                        if (error.message.includes('ETIMEDOUT')) {
                            throw new Error('Request timed out. The RPC node is taking too long to respond. Please try again later.');
                        } else if (error.message.includes('ENETUNREACH')) {
                            throw new Error('Network error. Unable to reach the RPC node. Please check your internet connection.');
                        }
                    }
                    throw error;
                }

                // Calculate exponential backoff delay
                const delay = baseDelay * Math.pow(2, attempt - 1);
                console.log(`[RPCService] Retrying in ${delay}ms...`);
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }

        throw new Error('Failed to get transaction after all retry attempts');
    }

    async getRecentPrioritizationFees(accounts?: string[]): Promise<PrioritizationFee[]> {
        try {
            console.log('[RPCService] Getting recent prioritization fees...', { accounts });
            
            const response = await this.retryRequest(async () => {
                const result = await axios.post<PrioritizationFeesResponse>(
                    this.getFullUrl(),
                    {
                        jsonrpc: '2.0',
                        id: 1,
                        method: 'getRecentPrioritizationFees',
                        params: accounts ? [accounts] : []
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        timeout: this.timeout
                    }
                );

                if (result.data.error) {
                    throw new Error(`RPC Error: ${result.data.error.message}`);
                }

                return result.data;
            });

            console.log('[RPCService] Successfully got prioritization fees:', response.result);
            return response.result;
        } catch (error) {
            console.error('[RPCService] Error getting prioritization fees:', {
                error: error instanceof Error ? error.message : 'Unknown error',
                code: (error as any)?.code,
                type: error instanceof Error ? error.constructor.name : typeof error
            });
            
            if (error instanceof Error) {
                if (error.message.includes('ETIMEDOUT')) {
                    throw new Error('Request timed out. The RPC node is taking too long to respond. Please try again later.');
                } else if (error.message.includes('ENETUNREACH')) {
                    throw new Error('Network error. Unable to reach the RPC node. Please check your internet connection.');
                }
            }
            throw error;
        }
    }

    async getSlot(commitment: 'processed' | 'confirmed' | 'finalized' = 'finalized'): Promise<number> {
        try {
            console.log('[RPCService] Getting current slot...', { commitment });
            const response = await this.retryRequest(async () => {
                try {
                    const result = await axios.post<SlotResponse>(
                        this.getFullUrl(),
                        {
                            jsonrpc: '2.0',
                            id: 1,
                            method: 'getSlot',
                            params: [{ commitment }]
                        },
                        {
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            timeout: 10000
                        }
                    );

                    if (result.data.error) {
                        throw new Error(`RPC Error: ${result.data.error.message}`);
                    }

                    return result.data;
                } catch (error) {
                    if (error && typeof error === 'object' && 'isAxiosError' in error) {
                        const axiosError = error as any;
                        console.error('[RPCService] Network error getting slot:', {
                            code: axiosError.code,
                            message: axiosError.message,
                            response: axiosError.response?.data,
                            status: axiosError.response?.status
                        });
                    }
                    throw error;
                }
            });

            console.log('[RPCService] Successfully got slot:', response.result);
            return response.result;
        } catch (error) {
            console.error('[RPCService] Error getting slot:', error);
            throw error;
        }
    }

    async getBlockTime(slot: number): Promise<number | null> {
        try {
            console.log('[RPCService] Getting block time...', { slot });
            const response = await this.retryRequest(async () => {
                try {
                    const result = await axios.post<BlockTimeResponse>(
                        this.getFullUrl(),
                        {
                            jsonrpc: '2.0',
                            id: 1,
                            method: 'getBlockTime',
                            params: [slot]
                        },
                        {
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            timeout: 10000
                        }
                    );

                    if (result.data.error) {
                        throw new Error(`RPC Error: ${result.data.error.message}`);
                    }

                    return result.data;
                } catch (error) {
                    if (error && typeof error === 'object' && 'isAxiosError' in error) {
                        const axiosError = error as any;
                        console.error('[RPCService] Network error getting block time:', {
                            code: axiosError.code,
                            message: axiosError.message,
                            response: axiosError.response?.data,
                            status: axiosError.response?.status
                        });
                    }
                    throw error;
                }
            });

            console.log('[RPCService] Successfully got block time:', response.result);
            return response.result;
        } catch (error) {
            console.error('[RPCService] Error getting block time:', error);
            throw error;
        }
    }

    async getTokenAccountsByOwner(
        owner: string,
        programId: string = 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
        encoding: 'jsonParsed' | 'base58' | 'base64' = 'jsonParsed'
    ): Promise<TokenAccountsResponse> {
        try {
            console.log('[RPCService] Getting token accounts by owner...', { owner, programId, encoding });
            
            const response = await this.retryRequest(async () => {
                const result = await axios.post<RPCResponse<TokenAccountsResponse>>(
                    this.getFullUrl(),
                    {
                        jsonrpc: '2.0',
                        id: 1,
                        method: 'getTokenAccountsByOwner',
                        params: [
                            owner,
                            {
                                programId: programId
                            },
                            {
                                encoding: encoding
                            }
                        ]
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        timeout: this.timeout
                    }
                );

                console.log('[RPCService] Raw RPC response:', JSON.stringify(result.data, null, 2));

                if (result.data.error) {
                    throw new Error(`RPC Error: ${result.data.error.message}`);
                }

                if (!result.data.result) {
                    console.warn('[RPCService] No result in RPC response');
                    return {
                        context: {
                            apiVersion: 'unknown',
                            slot: 0
                        },
                        value: []
                    };
                }

                return result.data.result;
            });

            console.log('[RPCService] Successfully got token accounts:', {
                count: response.value.length,
                slot: response.context.slot,
                accounts: response.value.map(acc => ({
                    pubkey: acc.pubkey,
                    mint: acc.account.data.parsed.info.mint,
                    amount: acc.account.data.parsed.info.tokenAmount.uiAmountString
                }))
            });
            return response;
        } catch (error) {
            console.error('[RPCService] Error getting token accounts:', {
                error: error instanceof Error ? error.message : 'Unknown error',
                code: (error as any)?.code,
                type: error instanceof Error ? error.constructor.name : typeof error,
                stack: error instanceof Error ? error.stack : undefined
            });
            
            if (error instanceof Error) {
                if (error.message.includes('ETIMEDOUT')) {
                    throw new Error('Request timed out. The RPC node is taking too long to respond. Please try again later.');
                } else if (error.message.includes('ENETUNREACH')) {
                    throw new Error('Network error. Unable to reach the RPC node. Please check your internet connection.');
                }
            }
            throw error;
        }
    }

    async getTokenSupply(mint: string): Promise<TokenSupplyResponse> {
        try {
            console.log('[RPCService] Getting token supply...', { mint });
            
            const response = await this.retryRequest(async () => {
                const result = await axios.post<RPCResponse<TokenSupplyResponse>>(
                    this.getFullUrl(),
                    {
                        jsonrpc: '2.0',
                        id: 1,
                        method: 'getTokenSupply',
                        params: [mint]
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        timeout: this.timeout
                    }
                );

                if (result.data.error) {
                    throw new Error(`RPC Error: ${result.data.error.message}`);
                }

                return result.data.result;
            });

            console.log('[RPCService] Successfully got token supply:', {
                amount: response.value.amount,
                decimals: response.value.decimals,
                uiAmount: response.value.uiAmount,
                slot: response.context.slot
            });
            return response;
        } catch (error) {
            console.error('[RPCService] Error getting token supply:', {
                error: error instanceof Error ? error.message : 'Unknown error',
                code: (error as any)?.code,
                type: error instanceof Error ? error.constructor.name : typeof error
            });
            
            if (error instanceof Error) {
                if (error.message.includes('ETIMEDOUT')) {
                    throw new Error('Request timed out. The RPC node is taking too long to respond. Please try again later.');
                } else if (error.message.includes('ENETUNREACH')) {
                    throw new Error('Network error. Unable to reach the RPC node. Please check your internet connection.');
                }
            }
            throw error;
        }
    }

    async getMultipleAccounts(pubkeys: string[]): Promise<MultipleAccountsResponse> {
        try {
            console.log('[RPCService] Getting multiple accounts...', { pubkeys });
            
            const response = await this.retryRequest(async () => {
                const result = await axios.post<RPCResponse<MultipleAccountsResponse>>(
                    this.getFullUrl(),
                    {
                        jsonrpc: '2.0',
                        id: 1,
                        method: 'getMultipleAccounts',
                        params: [pubkeys]
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': '*/*',
                            'Connection': 'keep-alive'
                        },
                        timeout: this.timeout
                    }
                );

                if (result.data.error) {
                    console.error('[RPCService] RPC Error:', result.data.error);
                    throw new Error(`RPC Error: ${result.data.error.message}`);
                }

                return result.data.result;
            });

            console.log('[RPCService] Successfully got multiple accounts:', {
                count: response.value.length,
                nonNull: response.value.filter(acc => acc !== null).length,
                slot: response.context.slot
            });
            return response;
        } catch (error) {
            console.error('[RPCService] Error getting multiple accounts:', {
                error: error instanceof Error ? error.message : 'Unknown error',
                code: (error as any)?.code,
                type: error instanceof Error ? error.constructor.name : typeof error,
                stack: error instanceof Error ? error.stack : undefined
            });
            
            if (error instanceof Error) {
                if (error.message.includes('ETIMEDOUT')) {
                    throw new Error('Request timed out. The RPC node is taking too long to respond. Please try again later.');
                } else if (error.message.includes('ENETUNREACH')) {
                    throw new Error('Network error. Unable to reach the RPC node. Please check your internet connection.');
                }
            }
            throw error;
        }
    }

    async subscribeToSignature(signature: string, params?: SignatureSubscribeParams): Promise<number> {
        if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
            throw new Error('WebSocket connection not ready');
        }

        const subscriptionId = this.nextSubscriptionId++;
        const request = {
            jsonrpc: '2.0',
            id: subscriptionId,
            method: 'signatureSubscribe',
            params: [
                signature,
                {
                    commitment: params?.commitment || 'finalized',
                    enableReceivedNotification: params?.enableReceivedNotification || false
                }
            ]
        };

        return new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
                reject(new Error('Subscription request timed out'));
            }, this.timeout);

            const messageHandler = (data: string) => {
                try {
                    const response = JSON.parse(data);
                    if (response.id === subscriptionId) {
                        clearTimeout(timeout);
                        this.ws!.removeListener('message', messageHandler);

                        if (response.error) {
                            reject(new Error(response.error.message));
                            return;
                        }

                        this.subscriptions.set(response.result, { type: 'signature', signature });
                        resolve(response.result);
                    }
                } catch (error) {
                    console.error('[RPC] Error processing subscription response:', error);
                }
            };

            this.ws!.on('message', messageHandler);
            this.ws!.send(JSON.stringify(request));
        });
    }
}

export const rpcService = new RPCService();
